import { MyContext, nonNull, Sticker, update } from 'prelude'

export function onSticker(ctx: MyContext) {
    const sticker = nonNull('sticker', ctx.message?.sticker)
    const tags = ctx.session.stickers?.[sticker.file_unique_id]?.tags ?? []
    if (tags.length > 0) {
        showStickerWidget(ctx, sticker, tags)
    } else {
        setLastSticker(ctx, sticker)
    }
}

function showStickerWidget(ctx: MyContext, { file_id, file_unique_id }: Sticker, tags: string[]) {
    ctx.session = update(ctx.session, {
        stickers: { [file_unique_id]: { file_id, tags: [] } }
    })
    ctx.reply(ctx.i18n.t('sticker_info', { tags: enumTags(tags) }), {
        reply_markup: { inline_keyboard: [ [ {
            text: ctx.i18n.t('delete_sticker'),
            callback_data: `delete ${file_unique_id}`
        } ] ] }
    })
}

function setLastSticker(ctx: MyContext, sticker: Sticker) {
    const { file_id, file_unique_id } = sticker
    ctx.session.last_sticker = { file_id, file_unique_id }
    ctx.reply(ctx.i18n.t('saved_sticker', sticker))
}

const enumTags = (tags: string[]) => tags.map(enumMap).join()

const enumMap = (x: any, i: number) => `\n${i + 1}. ${x}`
