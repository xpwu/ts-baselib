import {Item, Table, TableFactory} from "./table"
import {selfDB} from "./db"
import {sessionBlStorage} from "./storage"


class TokenItem implements Item{
  id: string
  token: string

  constructor(name: string, token: string) {
    this.id = name
    this.token = token
  }
}

export function TokenTable(uid:string, tf: TableFactory = TableFactory.default): Token {
  return tf.get("token", TokenItem, selfDB(uid, sessionBlStorage()), Token)
}

export class Token extends Table<TokenItem>{
  static readonly Empty = ""

  async value(name: string): Promise<string> {
    let v = await this.get(name)
    if (v === undefined) {
      return Token.Empty
    }

    return v.token
  }

  async setValue(name: string, v:string) {
    this.updateOrInsert(name, new TokenItem(name, v))
  }
}

