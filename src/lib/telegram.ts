import { Bot, InlineKeyboard } from 'grammy'
import { saveMessage } from './supabase'

export const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN!)

bot.command('start', async (ctx) => {
  await saveMessage(ctx.chat.id, ctx.message?.text || '/start', 'in')
  await ctx.reply(
    '¡Hola! 👋 Soy Valeria, asistente de Golf Valle Verde 🌿\n\n¿En qué puedo ayudarte?',
    { reply_markup: mainMenu() }
  )
})

bot.command('menu', async (ctx) => {
  await ctx.reply('¿Qué necesitas?', { reply_markup: mainMenu() })
})

bot.command('tarifas', async (ctx) => {
  await ctx.reply('⛳ Tarifas Valle Verde:\n\n• Green fee 18h: 65€\n• Green fee 9h: 40€\n• Bono mensual: 180€\n• Clases pro: 50€/h\n\n¿Quieres reservar? /reservar')
})

bot.command('stop', async (ctx) => {
  await ctx.reply('✅ Te has dado de baja. No recibirás más mensajes.\n\nEscribe /start para volver cuando quieras.')
})

bot.on('message:text', async (ctx) => {
  await saveMessage(ctx.chat.id, ctx.message.text, 'in')
  await ctx.reply('Recibido 👍 Un agente te responderá pronto.\n\n/menu — /tarifas — /stop')
})

function mainMenu() {
  return new InlineKeyboard()
    .text('📅 Reservar', 'reservar').text('💰 Tarifas', 'tarifas').row()
    .text('🏆 Torneos', 'torneos').text('📞 Agente', 'agente')
}