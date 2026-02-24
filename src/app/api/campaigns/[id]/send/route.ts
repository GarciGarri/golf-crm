import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  // Get campaign
  const { data: campaign } = await supabase
    .from('campaigns')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!campaign) return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })

  // Get contacts with telegram_chat_id and opted_in
  let query = supabase
    .from('contacts')
    .select('id, name, telegram_chat_id, segment')
    .not('telegram_chat_id', 'is', null)
    .eq('opted_in', true)

  if (campaign.segment && campaign.segment !== 'Todos') {
    query = query.eq('segment', campaign.segment)
  }

  const { data: contacts } = await query

  if (!contacts || contacts.length === 0) {
    return NextResponse.json({ error: 'No contacts with Telegram in this segment', sent: 0 })
  }

  let sent = 0
  for (const contact of contacts) {
    try {
      // Personalize message
      const text = campaign.message.replace('{{nombre}}', contact.name.split(' ')[0])

      // Send via Telegram
      const res = await fetch(
        `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: contact.telegram_chat_id, text }),
        }
      )

      if (res.ok) {
        // Save outbound message
        await supabase.from('messages').insert({
          contact_id: contact.id,
          text,
          direction: 'out',
        })
        sent++
      }
    } catch (e) {
      console.error('Error sending to', contact.name, e)
    }
  }

  // Update campaign status
  await supabase
    .from('campaigns')
    .update({ status: 'sent', sent_count: sent, sent_at: new Date().toISOString() })
    .eq('id', params.id)

  return NextResponse.json({ ok: true, sent })
}
