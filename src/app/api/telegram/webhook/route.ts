import { Bot, InlineKeyboard } from 'grammy'
import { NextRequest } from 'next/server'

const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN!)

bot.command('start', async (ctx) => {
  await ctx.reply('¡Hola! 👋 Soy Valeria, asistente de Golf Valle Verde 🌿\n\n¿En qué puedo ayudarte?')
})

bot.command('tarifas', async (ctx) => {
  await ctx.reply('⛳ Tarifas:\n\n• Green fee 18h: 65€\n• Green fee 9h: 40€\n• Bono mensual: 180€')
})

bot.command('stop', async (ctx) => {
  await ctx.reply('✅ Te has dado de baja. Escribe /start para volver.')
})

bot.on('message:text', async (ctx) => {
  await ctx.reply('Recibido 👍 Un agente te responderá pronto.\n\n/tarifas — /stop')
})

export async function POST(req: NextRequest) {
  const secret = req.headers.get('X-Telegram-Bot-Api-Secret-Token')
  if (secret !== process.env.TELEGRAM_WEBHOOK_SECRET) {
    return new Response('Forbidden', { status: 403 })
  }
  const update = await req.json()
  await bot.handleUpdate(update)
  return new Response('OK')
}