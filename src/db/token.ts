import {Item, Table} from "./table"
import {selfDB} from "./db"
import {sessionBlStorage} from "./storage"


export class Token implements Item{
  id: string
  token: string

  constructor(name: string, token: string) {
    this.id = name
    this.token = token
  }
}

export function TokenTable(uid:string): Table<Token> {
  return Table.New("token", Token, selfDB(uid, sessionBlStorage()))
}

