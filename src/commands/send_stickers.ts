import { Dict, MyContext, nonNull } from 'prelude'

export function sendStickers(ctx: MyContext) {
    const query = nonNull('query', ctx.inlineQuery?.query)
    const stickers = search(ctx.session.stickers ?? {}, query)
    const answer = stickers.map(stickerAnswer)
    ctx.answerInlineQuery(answer, { cache_time: 0 })
}

const stickerAnswer = (sticker_file_id: string, id: number) =>
    ({ type: 'sticker', id: `${id}`, sticker_file_id })

const search = (dict: Dict, query: string) =>
    Object.values(dict).filter(compose(someIncludes(query), get('tags'))).map(get('file_id'))

const someIncludes = (query: string) => (tags: string[]) => tags.some(includes(query))

const compose = <X, Y, Z>(f: (y: Y) => Z, g: (x: X) => Y) => (x: X) => f(g(x))

const get = <T, K extends keyof T>(key: K) => (x?: T) => nonNull(key as string, x?.[key])

const includes = (a: string) => (b: string) => a.includes(b) || b.includes(a)
    