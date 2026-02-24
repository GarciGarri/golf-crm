import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  const { contact_id, text, telegram_chat_id } = await req.json()

  // Enviar por Telegram
  await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: telegram_chat_id, text }),
  })

  // Guardar en Supabase
  await supabase.from('messages').insert({
    contact_id,
    text,
    direction: 'out',
  })

  return NextResponse.json({ ok: true })
}