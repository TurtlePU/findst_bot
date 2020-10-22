export type Entry = {
    file_id: string
    tags: string[]
}

export type Dict = Partial<Record<string, Entry>>

export const unique = <T>(...arr: T[]) => [ ...new Set(arr).values() ]

export const stickerAnswer = (sticker_file_id: string, id: number) =>
    ({ type: 'sticker', id: `${id}`, sticker_file_id })

export const search = (dict: Dict, query: string) =>
    Object.values(dict).filter(compose(someIncludes(query), get('tags'))).map(get('file_id'))

export const parseTags = (text: string) => text.split(/[,\n]/).map(trim).filter(nEmpty)

export const enumTags = (tags: string[]) => tags.map((x, i) => `\n${i + 1}. ${x}`).join()

export const nonNull = <T>(name: string, x?: T | null): T => x ?? error(`${name} is null`)

export const error = <T>(msg?: string): T => { throw new Error(msg) }

const someIncludes = (query: string) => (tags: string[]) => tags.some(includes(query))

const compose = <X, Y, Z>(f: (y: Y) => Z, g: (x: X) => Y) => (x: X) => f(g(x))

const get = <T, K extends keyof T>(key: K) => (x?: T) => nonNull(key as string, x?.[key])

const includes = (a: string) => (b: string) => a.includes(b) || b.includes(a)

const trim = (str: string) => str.trim()

const nEmpty = (str: string) => str.length > 0