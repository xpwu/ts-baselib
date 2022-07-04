import {TableFactory} from "./db/table"
import {DB} from "./db/db"
import { NC } from "ts-nc"
import {NetFactory} from "./api/net"


export interface UserSpace {
  readonly tf: TableFactory
  readonly selfDB: DB
  readonly shareDB: DB
  readonly nc: NC
  readonly nf: NetFactory
  readonly uid:string

  clone(uid: string): UserSpace
}