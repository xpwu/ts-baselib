import {TableFactory} from "./db/table"
import {DB} from "./db/db"
import { NC } from "ts-nc"
import {Net} from "./api/net"


export interface UserSpace {
  readonly tf: TableFactory
  readonly selfDB: DB
  readonly shareDB: DB
  readonly nc: NC
  readonly nf: { get(name: string): Net }
  readonly uid:string

  clone(uid: string, becauseOfNet: string): UserSpace
}