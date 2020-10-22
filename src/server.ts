require('dotenv').config()

import path from 'path'
import { Telegraf } from 'telegraf'
import TelegraphI18n from 'telegraf-i18n'
import LocalSession from 'telegraf-session-local'

import { MyContext, start, onSticker, onText, sendStickers, onCallbackQuery } from './commands'
import { nonNull } from './prelude'

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