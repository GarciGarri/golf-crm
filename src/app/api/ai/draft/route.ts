import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@supabase/supabase-js'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

function buildClubContext(info: Record<string, any>): string {
  const parts: string[] = []

  // Club identity
  if (info.general?.name) parts.push(`CLUB: ${info.general.name}`)
  if (info.general?.description) parts.push(`DESCRIPCIÓN: ${info.general.description}`)
  if (info.contact_info) {
    const c = info.contact_info
    const contact = [c.phone, c.email, c.address].filter(Boolean).join(' | ')
    if (contact) parts.push(`CONTACTO: ${contact}`)
  }

  // Prices
  if (info.prices?.length > 0) {
    const priceLines = info.prices
      .map((p: any) => `  - ${p.name}: ${p.price}${p.description ? ` (${p.description})` : ''}`)
      .join('\n')
    parts.push(`TARIFAS:\n${priceLines}`)
  }

  // Upcoming tournaments
  if (info.tournaments?.length > 0) {
    const today = new Date()
    const upcoming = info.tournaments
      .filter((t: any) => t.date && new Date(t.date) >= today)
      .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 5)
    if (upcoming.length > 0) {
      const lines = upcoming.map((t: any) => {
        const d = new Date(t.date).toLocaleDateString('es', { day: 'numeric', month: 'long' })
        return `  - ${t.name} (${d})${t.price ? ` · ${t.price}` : ''}${t.description ? ` · ${t.description}` : ''}`
      }).join('\n')
      parts.push(`PRÓXIMOS TORNEOS:\n${lines}`)
    }
  }

  // Offers
  if (info.offers?.length > 0) {
    const activeOffers = info.offers.filter((o: any) => o.active !== false)
    if (activeOffers.length > 0) {
      const lines = activeOffers.map((o: any) =>
        `  - ${o.name}: ${o.description}${o.price ? ` · ${o.price}` : ''}${o.expires ? ` (hasta ${o.expires})` : ''}`
      ).join('\n')
      parts.push(`OFERTAS ACTIVAS:\n${lines}`)
    }
  }

  // Academy
  if (info.academy?.length > 0) {
    const lines = info.academy.map((a: any) =>
      `  - ${a.name}${a.schedule ? ` · ${a.schedule}` : ''}${a.price ? ` · ${a.price}` : ''}${a.description ? ` · ${a.description}` : ''}`
    ).join('\n')
    parts.push(`ACADEMIA / CLASES:\n${lines}`)
  }

  // Weather note
  if (info.weather?.note) {
    parts.push(`PREVISIÓN METEOROLÓGICA: ${info.weather.note}`)
  }

  // Local rules
  if (info.local_rules) {
    parts.push(`REGLAS LOCALES: ${info.local_rules}`)
  }

  // Reservations info
  if (info.reservations?.info) {
    parts.push(`RESERVAS: ${info.reservations.info}`)
    if (info.reservations?.link) parts.push(`Link reservas: ${info.reservations.link}`)
  }

  // First interaction menu
  if (info.bot_menu?.options?.length > 0) {
    const opts = info.bot_menu.options.map((o: any) => `  ${o.icon || '•'} ${o.label}: ${o.response}`).join('\n')
    parts.push(`OPCIONES DEL MENÚ BOT:\n${opts}`)
  }

  return parts.join('\n\n') || 'Club de Golf — campo de 18 hoyos.'
}

export async function POST(req: NextRequest) {
  const { contact, messages, context } = await req.json()

  // Load club info
  let clubInfo: Record<string, any> = {}
  try {
    const { data } = await supabase.from('club_info').select('*')
    for (const row of data || []) {
      clubInfo[row.key] = row.value
    }
  } catch (e) {
    console.error('Failed to load club_info:', e)
  }

  const clubContext = buildClubContext(clubInfo)

  const lastMsgs = (messages || []).slice(-8).map((m: any) =>
    `${m.direction === 'in' ? (contact?.name || 'Cliente') : 'Agente'}: ${m.text}`
  ).join('\n')

  // Birthday check
  const today = new Date()
  const dob = contact?.date_of_birth ? new Date(contact.date_of_birth) : null
  const isBirthday = dob && dob.getMonth() === today.getMonth() && dob.getDate() === today.getDate()
  const birthdayNote = isBirthday
    ? `\n⚠️ HOY ES EL CUMPLEAÑOS de ${contact.name} — felicítale e incluye una oferta especial de cumpleaños.`
    : ''

  const prompt = `Eres el asistente de comunicación de un club de golf. Redacta un mensaje de Telegram para enviar a un cliente.

════════════════════════
${clubContext}
════════════════════════

PERFIL DEL CONTACTO:
- Nombre: ${contact?.name || 'Cliente'}
- Idioma: ${contact?.language || 'ES'} ← RESPONDE SIEMPRE EN ESTE IDIOMA
- Segmento: ${contact?.segment || 'Normal'}
- Visitas al club: ${contact?.visits || 0}
- Hándicap: ${contact?.handicap || '—'}
- Etiquetas: ${(contact?.tags || []).join(', ') || 'ninguna'}
- Sentimiento reciente: ${contact?.sentiment || 'neutral'}
${birthdayNote}

CONVERSACIÓN RECIENTE:
${lastMsgs || '(sin mensajes previos — es el primer contacto)'}

${context ? `INSTRUCCIÓN ESPECÍFICA: ${context}` : ''}

NORMAS DE REDACCIÓN:
- Escribe SOLO el mensaje Telegram, sin comillas ni explicaciones previas
- Máximo 3-4 frases, directo y natural
- Si hay tarifas o torneos relevantes para el contexto, menciona datos reales
- Tono cálido y profesional, como un concierge de club de lujo
- Máximo 2 emojis
- Si el idioma es EN, SV, DE, FR o IT, responde en ese idioma
- Termina con /menu si es una primera interacción o consulta general`

  try {
    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 300,
      messages: [{ role: 'user', content: prompt }],
    })
    const draft = response.content[0].type === 'text' ? response.content[0].text.trim() : ''
    return NextResponse.json({ draft, isBirthday: !!isBirthday })
  } catch (e: any) {
    console.error('Anthropic error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
