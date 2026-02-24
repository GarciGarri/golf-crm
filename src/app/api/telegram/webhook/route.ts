import { Bot } from 'grammy'
import { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN!)

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function saveContact(chatId: number, username: string, name: string) {
  const { data } = await supabase
    .from('contacts')
    .select('id')
    .eq('telegram_chat_id', chatId)
    .single()

  if (!data) {
    await supabase.from('contacts').insert({
      name,
      telegram_username: username,
      telegram_chat_id: chatId,
      segment: 'Normal',
      language: 'ES',
      opted_in: true,
    })
  }
}

async function saveMessage(chatId: number, text: string, direction: string) {
  const { data: contact } = await supabase
    .from('contacts')
    .select('id')
    .eq('telegram_chat_id', chatId)
    .single()

  if (contact) {
    await supabase.from('messages').insert({
      contact_id: contact.id,
      text,
      direction,
    })
  }
}

bot.command('start', async (ctx) => {
  const name = ctx.from?.first_name || 'Jugador'
  const username = ctx.from?.username || ''
  await saveContact(ctx.chat.id, username, name)
  await saveMessage(ctx.chat.id, '/start', 'in')
  await ctx.reply(`¡Hola ${name}! 👋 Soy Valeria, asistente de Golf Valle Verde 🌿\n\n/tarifas — /stop`)
})

bot.command('tarifas', async (ctx) => {
  await saveMessage(ctx.chat.id, '/tarifas', 'in')
  await ctx.reply('⛳ Tarifas:\n\n• Green fee 18h: 65€\n• Green fee 9h: 40€\n• Bono mensual: 180€')
})

bot.command('stop', async (ctx) => {
  await saveMessage(ctx.chat.id, '/stop', 'in')
  await ctx.reply('✅ Dado de baja. Escribe /start para volver.')
})

bot.on('message:text', async (ctx) => {
  await saveMessage(ctx.chat.id, ctx.message.text, 'in')
  await ctx.reply('Recibido 👍 Un agente te responderá pronto.')
})

export async function POST(req: NextRequest) {
  const secret = req.headers.get('X-Telegram-Bot-Api-Secret-Token')
  if (secret !== process.env.TELEGRAM_WEBHOOK_SECRET) {
    return new Response('Forbidden', { status: 403 })
  }
  const update = await req.json()
  await bot.init()
  await bot.handleUpdate(update)
  return new Response('OK')
}