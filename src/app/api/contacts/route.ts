import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  const { data, error } = await supabase
    .from('contacts')
    .select('*, messages(*)')
    .order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data || [])
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { data, error } = await supabase
    .from('contacts')
    .insert({
      name: body.name,
      telegram_username: body.telegram_username || null,
      telegram_chat_id: body.telegram_chat_id || null,
      handicap: body.handicap || null,
      language: body.language || 'ES',
      segment: body.segment || 'Normal',
      tags: body.tags || [],
      opted_in: body.opted_in || false,
      sentiment: 'neutral',
      date_of_birth: body.date_of_birth || null,
      conversation_status: 'open',
    })
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
