import {DB} from "./db"
import {AsyncLocker} from "./asynclocker"

export interface Item {
  id: string
}

class Num {
  constructor(public no:number) {
  }
}

class Data<T extends Item> extends Num{
  constructor(no:number, public d:T) {
    super(no)
  }
}

/**
 * xxx.id-${id} : Data
 * xxx.meta.0: Meta0
 * xxx.meta.${no}: IDs
 *
 */

class IDs {
  constructor(public ids:string[]) {
  }
}

class Meta0 {
  constructor(public maxNo: number) {
  }
}

const MAX_PER_ARR = 100

export class Table<T extends Item> {
  private locker = new AsyncLocker()

  private static tables = new Map<string, Table<Item>>()

  public static New<T extends Item>(name:string, itemConstructor: {new (...args: any[]):T}
    , db: DB): Table<T> {

    let old = Table.tables.get(name)
    if (old !== undefined) {
      if (old.itemConstructor !== itemConstructor) {
        throw new Error(`table<${name}> has different item`)
      }
      return old as Table<T>
    }

    let n = new Table(name, itemConstructor, db) as Table<any>
    Table.tables.set(name, n)
    return n
  }

  private constructor(private readonly name:string, private itemConstructor: {new (...args: any[]):T}
    , private readonly db: DB) {
  }

  // return: start
  private async metaNum(step: number = 1):Promise<number> {
    if (step <= 0) {
      throw Error("step must be > 0")
    }

    const key0 = Table.metaKey(0)
    await this.locker.lock(key0)
    let meta0 = await this.db.get(this.getName(key0), Meta0) || new Meta0(0)
    let start = meta0.maxNo + 1
    meta0.maxNo += step
    await this.db.set(this.getName(key0), meta0)
    this.locker.unlock(key0)
    return start
  }

  private async saveMeta(id:string, num: number) {
    const no = Math.ceil(num/MAX_PER_ARR)
    const key = Table.metaKey(no)
    await this.locker.lock(key)
    let old = await this.db.get(this.getName(key), IDs) || new IDs([])
    old.ids.push(id)
    await this.db.set(this.getName(key), old)
    await this.locker.unlock(key)
  }

  async get(id:string): Promise<T|undefined> {
    let old = await this.db.get(this.getName(Table.idKey(id)), Data<T>)
    if (old === undefined) {
      return undefined
    }
    return old.d
  }

  async getIds(): Promise<string[]> {
    const key0 = Table.metaKey(0)
    let ret:string[] = []
    let meta0 = await this.db.get(this.getName(key0), Meta0) || new Meta0(0)
    for (let i = 0; i < meta0.maxNo; ++i) {
      let no = Math.ceil(i/MAX_PER_ARR)
      let key = Table.metaKey(no)
      let old = await this.db.get(this.getName(key), IDs) || new IDs([])
      ret = ret.concat(old.ids)
    }

    return Array.from(new Set(ret))
  }

  // todo: batch insert

  async insert(id:string, item: T) {
    item.id = id
    const key = Table.idKey(id)
    await this.locker.lock(key)
    let num = await this.metaNum()
    await this.saveMeta(id, num)
    await this.db.set(this.getName(key), new Data(num, item))
    this.locker.unlock(key)
  }

  async delete(id: string) {
    // todo: delete meta
    const key = Table.idKey(id)
    await this.locker.lock(key)
    await this.db.remove(this.getName(key))
    this.locker.unlock(key)
  }

  async updateOrInsert(id:string, data: Partial<T>) {
    let idKey = Table.idKey(id)
    await this.locker.lock(idKey)
    let old = await this.db.get(this.getName(idKey), Data<T>)
    let num = old?.no
    if (num === undefined) {
      num = await this.metaNum()
      await this.saveMeta(id, num)
    }

    let nItem = {...old?.d, ...data, ...{id: id}}
    await this.db.set(this.getName(idKey), new Data(num, nItem))
    this.locker.unlock(idKey)
  }

  private static idKey(id:string):string {
    return "id-" + id
  }

  private static metaKey(no:number):string {
    return "meta-" + no
  }

  private getName(key:string):string {
    return this.name + "." + key
  }
}

