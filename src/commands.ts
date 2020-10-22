import { Context } from 'telegraf'
import TelegraphI18n from 'telegraf-i18n'
import merge from 'lodash.merge'

import { Dict, Entry, unique, parseTags, stickerAnswer, search, nonNull, enumTags } from './prelude'

type Session = Partial<{
    lastSticker: { file_id: string, file_unique_id: string } | null
    stickers: Dict
}>

type PartialSession = Partial<{
    lastSticker: Partial<{ file_id: string, file_unique_id: string }> | null
    stickers: PartialDict
}>

type PartialDict = Partial<Record<string, Partial<Entry>>>

export interface MyContext extends Context {
    i18n: TelegraphI18n
    session: Session
    message: Context['message'] & {
        sticker?: NonNullable<Context['message']>['sticker'] & {
            file_unique_id: string
        }
    }
}

export function start(ctx: MyContext) {
    ctx.reply(ctx.i18n.t('start'))
}

export function onSticker(ctx: MyContext) {
    const { file_id, file_unique_id } = nonNull('sticker', ctx.message.sticker)
    const tags = ctx.session.stickers?.[file_unique_id]?.tags ?? []
    if (tags.length > 0) {
        ctx.session = merge<Session, PartialSession>(ctx.session, {
            stickers: { [file_unique_id]: { file_id } }
        })
        ctx.reply(ctx.i18n.t('sticker_info', { tags: enumTags(tags) }), {
            reply_markup: { inline_keyboard: [ [ {
                text: ctx.i18n.t('delete_sticker'),
                callback_data: `delete ${file_unique_id}`
            } ] ] }
        })
    } else {
        ctx.session.lastSticker = { file_id, file_unique_id }
        ctx.reply(ctx.i18n.t('saved_sticker', ctx.message?.sticker))
    }
}

export function onText(ctx: MyContext) {
    const sticker = ctx.session.lastSticker
    if (sticker == undefined) {
        ctx.reply(ctx.i18n.t('start'))
    } else {
        const { file_id, file_unique_id } = sticker
        const newTags = parseTags(nonNull('text', ctx.message?.text))
        const oldTags = ctx.session.stickers?.[sticker.file_unique_id] ?? []
        const tags = unique(...oldTags, ...newTags)
        ctx.session = merge<Session, Session>(ctx.session, {
            stickers: { [file_unique_id]: { tags, file_id } },
            lastSticker: null
        })
        ctx.reply(ctx.i18n.t('commit_sticker'))
    }
}

export function sendStickers(ctx: MyContext) {
    const query = nonNull('query', ctx.inlineQuery?.query)
    const stickers = search(ctx.session.stickers ?? {}, query)
    const answer = stickers.map(stickerAnswer)
    ctx.answerInlineQuery(answer, { cache_time: 0 })
}

export function onCallbackQuery(ctx: MyContext) {
    const words = nonNull('query', ctx.callbackQuery?.data?.split(' '))
    if (words[0] == 'delete' && ctx.session.stickers != undefined) {
        ctx.session.stickers[words[1]] = undefined
        ctx.answerCbQuery(ctx.i18n.t('sticker_deleted'))
    }
}