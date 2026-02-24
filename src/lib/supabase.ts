import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

export async function saveMessage(chatId: number, text: string, direction: 'in' | 'out' | 'bot') {
  const { data: contact } = await supabaseAdmin
    .from('contacts')
    .select('id')
    .eq('telegram_chat_id', chatId)
    .single()

  if (!contact) return

  await supabaseAdmin.from('messages').insert({
    contact_id: contact.id,
    text,
    direction,
  })
}