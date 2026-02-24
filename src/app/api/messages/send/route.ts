import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  const { contact_id, text, telegram_chat_id } = await req.json()

  // Send via Telegram
  if (telegram_chat_id) {
    const res = await fetch(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: telegram_chat_id, text }),
      }
    )
    if (!res.ok) {
      const err = await res.json()
      console.error('Telegram error:', err)
    }
  }

  // Save to Supabase
  const { data, error } = await supabase.from('messages').insert({
    contact_id,
    text,
    direction: 'out',
  }).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true, message: data })
}
