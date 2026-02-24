import { bot } from '../../../../lib/telegram'
import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  const secret = req.headers.get('X-Telegram-Bot-Api-Secret-Token')
  
  if (secret !== process.env.TELEGRAM_WEBHOOK_SECRET) {
    return new Response('Forbidden', { status: 403 })
  }

  const update = await req.json()
  await bot.handleUpdate(update)
  
  return new Response('OK')
}