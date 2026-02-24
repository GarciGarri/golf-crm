import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: NextRequest) {
  const { contact, messages } = await req.json()

  const lastMsgs = (messages || []).slice(-5).map((m: any) =>
    `${m.direction === 'in' ? contact.name : 'Agente'}: ${m.text}`
  ).join('\n')

  const prompt = `Eres el asistente del Club de Golf Valle Verde. 
Genera un borrador de respuesta corto (máx 2-3 frases) para Telegram.

Contacto: ${contact.name}
Idioma preferido: ${contact.language || 'ES'}
Segmento: ${contact.segment || 'Normal'}
Visitas: ${contact.visits || 0}
Sentimiento: ${contact.sentiment || 'neutral'}

Últimos mensajes:
${lastMsgs || '(primer contacto)'}

Responde en el idioma del contacto. Tono cálido y profesional. 
Solo escribe el borrador del mensaje, sin explicaciones ni comillas.`

  const response = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 200,
    messages: [{ role: 'user', content: prompt }],
  })

  const draft = response.content[0].type === 'text' ? response.content[0].text : ''
  return NextResponse.json({ draft })
}
