import { MyContext } from 'prelude'

export function start(ctx: MyContext) {
    ctx.reply(ctx.i18n.t('start'))
}
