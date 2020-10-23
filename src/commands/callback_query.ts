import { MyContext, nonNull } from 'prelude'

export function onCallbackQuery(ctx: MyContext) {
    const words = nonNull('query', ctx.callbackQuery?.data?.split(' '))
    if (words[0] == 'delete' && ctx.session.stickers != undefined) {
        ctx.session.stickers[words[1]] = undefined
        ctx.answerCbQuery(ctx.i18n.t('sticker_deleted'))
    }
}