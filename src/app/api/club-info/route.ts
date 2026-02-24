import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    const { data, error } = await supabase.from('club_info').select('*')
    if (error) throw error
    const result: Record<string, any> = {}
    for (const row of data || []) {
      result[row.key] = row.value
    }
    return NextResponse.json(result)
  } catch (e: any) {
    console.error('club_info GET error:', e)
    return NextResponse.json({})
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const entries = Object.entries(body)
    for (const [key, value] of entries) {
      const { error } = await supabase
        .from('club_info')
        .upsert(
          { key, value, updated_at: new Date().toISOString() },
          { onConflict: 'key' }
        )
      if (error) throw error
    }
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    console.error('club_info POST error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
