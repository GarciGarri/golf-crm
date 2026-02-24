import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  const { data: contacts } = await supabase
    .from('contacts')
    .select('*, messages(*)')
    .order('created_at', { ascending: false })

  return NextResponse.json(contacts || [])
}