import { LastSticker, MyContext, nonNull, update } from 'prelude'
import { start } from './start'

export function onText(ctx: MyContext) {
    const sticker = ctx.session.last_sticker
    if (sticker == undefined) {
        start(ctx)
    } else {
        updateTags(ctx, sticker)
    }
}

function updateTags(ctx: MyContext, { file_id, file_unique_id }: LastSticker) {
    const newTags = parseTags(nonNull('text', ctx.message?.text))
    const oldTags = ctx.session.stickers?.[file_unique_id] ?? []
    const tags = unique(...oldTags, ...newTags)
    ctx.session = update(ctx.session, {
        stickers: { [file_unique_id]: { tags, file_id } },
        last_sticker: null
    })
    ctx.reply(ctx.i18n.t('commit_sticker'))
}

const parseTags = (text: string) => text.split(/[,\n]/).map(trim).filter(nEmpty)

const trim = (str: string) => str.trim()

const nEmpty = (str: string) => str.length > 0

const unique = <T>(...arr: T[]) => [ ...new Set(arr).values() ]
