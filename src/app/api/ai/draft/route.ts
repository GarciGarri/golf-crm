import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@supabase/supabase-js'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  const { contact, messages, context } = await req.json()

  // Load club info for context
  const { data: clubRows } = await supabase.from('club_info').select('*')
  const clubInfo: Record<string, any> = {}
  for (const row of clubRows || []) {
    clubInfo[row.key] = row.value
  }

  const clubContext = Object.keys(clubInfo).length > 0 ? `
INFORMACIÓN DEL CLUB:
${clubInfo.prices ? `Tarifas: ${JSON.stringify(clubInfo.prices)}` : ''}
${clubInfo.local_rules ? `Reglas locales: ${clubInfo.local_rules}` : ''}
${clubInfo.tournaments ? `Torneos: ${JSON.stringify(clubInfo.tournaments)}` : ''}
${clubInfo.contact_info ? `Contacto: ${JSON.stringify(clubInfo.contact_info)}` : ''}
${clubInfo.general ? `Info general: ${clubInfo.general}` : ''}
` : 'Club de Golf Valle Verde — campo de 18 hoyos.'

  const lastMsgs = (messages || []).slice(-8).map((m: any) =>
    `${m.direction === 'in' ? (contact?.name || 'Cliente') : 'Agente'}: ${m.text}`
  ).join('\n')

  // Check birthday
  const today = new Date()
  const dob = contact?.date_of_birth ? new Date(contact.date_of_birth) : null
  const isBirthday = dob && dob.getMonth() === today.getMonth() && dob.getDate() === today.getDate()
  const birthdayNote = isBirthday ? `\n⚠️ HOY ES EL CUMPLEAÑOS del contacto — incluye felicitación y oferta especial de cumpleaños.` : ''

  const prompt = `Eres el asistente de comunicación del Club de Golf. Tu tarea es redactar un mensaje de Telegram para enviar a un cliente.

${clubContext}

PERFIL DEL CONTACTO:
- Nombre: ${contact?.name || 'Cliente'}
- Idioma: ${contact?.language || 'ES'} (RESPONDE SIEMPRE EN ESTE IDIOMA)
- Segmento: ${contact?.segment || 'Normal'}
- Visitas: ${contact?.visits || 0}
- Hándicap: ${contact?.handicap || '—'}
- Tags: ${(contact?.tags || []).join(', ') || 'ninguno'}
- Sentimiento: ${contact?.sentiment || 'neutral'}
${birthdayNote}

CONVERSACIÓN RECIENTE:
${lastMsgs || '(sin mensajes previos — primer contacto)'}

${context ? `CONTEXTO ADICIONAL: ${context}` : ''}

INSTRUCCIONES:
- Escribe SOLO el mensaje de Telegram, sin comillas ni explicaciones
- Máximo 3-4 frases
- Tono cálido y profesional
- Si hay tarifas relevantes, menciónalas
- Usa emojis con moderación (1-2 máximo)
- Si el idioma es EN, SV, DE, FR o IT, responde en ese idioma
- Incluye siempre /menu o /tarifas al final si es relevante`

  const response = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 300,
    messages: [{ role: 'user', content: prompt }],
  })

  const draft = response.content[0].type === 'text' ? response.content[0].text.trim() : ''
  return NextResponse.json({ draft, isBirthday })
}
