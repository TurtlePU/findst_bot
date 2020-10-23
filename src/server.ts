require('dotenv').config()

import path from 'path'
import { Telegraf } from 'telegraf'
import TelegraphI18n from 'telegraf-i18n'
import LocalSession from 'telegraf-session-local'

import { MyContext, nonNull } from 'prelude'
import { start } from 'commands/start'
import { onSticker } from 'commands/on_sticker'
import { onText } from 'commands/on_text'
import { sendStickers } from 'commands/send_stickers'
import { onCallbackQuery } from 'commands/callback_query'

const i18n_config = {
    defaultLanguage: 'ru',
    directory: path.join(__dirname, '../locales')
}

new Telegraf<MyContext>(nonNull('bot token', process.env.BOT_TOKEN))
    .use(new TelegraphI18n(i18n_config))
    .use(new LocalSession())
    .start(start)
    .on('sticker', onSticker)
    .on('text', onText)
    .on('inline_query', sendStickers)
    .on('callback_query', onCallbackQuery)
    .launch()
