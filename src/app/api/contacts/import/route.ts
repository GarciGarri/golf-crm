import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  const { contacts } = await req.json()
  if (!Array.isArray(contacts) || contacts.length === 0) {
    return NextResponse.json({ error: 'No contacts provided' }, { status: 400 })
  }

  const toInsert = contacts.map((c: any) => ({
    name: c.name || c.nombre || '',
    telegram_username: c.telegram_username || c.telegram || null,
    handicap: parseInt(c.handicap) || null,
    language: c.language || c.idioma || 'ES',
    segment: c.segment || c.segmento || 'Normal',
    tags: c.tags ? (typeof c.tags === 'string' ? c.tags.split(',').map((t: string) => t.trim()) : c.tags) : [],
    opted_in: c.opted_in === 'true' || c.opted_in === true || false,
    sentiment: 'neutral',
    date_of_birth: c.date_of_birth || c.fecha_nacimiento || null,
    conversation_status: 'open',
    visits: parseInt(c.visits || c.visitas) || 0,
  })).filter((c: any) => c.name)

  const { data, error } = await supabase
    .from('contacts')
    .upsert(toInsert, { onConflict: 'telegram_chat_id', ignoreDuplicates: true })
    .select()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true, imported: data?.length || toInsert.length })
}
