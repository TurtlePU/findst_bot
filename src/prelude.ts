import { Context } from 'telegraf'
import TelegraphI18n from 'telegraf-i18n'
import { Sticker as TTSticker } from 'telegram-typings'
import { IncomingMessage } from 'telegraf/typings/telegram-types'
import merge from 'lodash.merge'

export interface MyContext extends Context {
    i18n: TelegraphI18n
    session: Session
    message?: Message
}

export interface Message extends IncomingMessage {
    sticker?: Sticker
}

export interface Sticker extends TTSticker {
    file_unique_id: string
}

export interface Session {
    last_sticker?: LastSticker | null
    stickers?: Dict
}

export interface LastSticker {
    file_id: string
    file_unique_id: string
}

export type Dict = Partial<Record<string, Entry>>

export interface Entry {
    file_id: string
    tags: string[]
}

export const update = (session: Session, update: Session) => merge(session, update)

export const nonNull = <T>(name: string, x?: T | null): T => x ?? error(`${name} is null`)

export const error = <T>(msg?: string): T => { throw new Error(msg) }