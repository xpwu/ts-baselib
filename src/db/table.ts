import {DB} from "./db"
import {AsyncLocker} from "./asynclocker"

export interface Item {
  id: string
}

export class Table<T extends Item> {
  private locker = new AsyncLocker()

  constructor(private readonly name:string, itemConstructor: {new (...args: any[]):T}, private readonly db: DB) {
  }

  async get(id:string): Promise<T|undefined> {
    return (await this.db.get(this.getName(id)) as unknown as T|undefined)
  }

  async save(id:string, item: Item) {
    item.id = id
    await this.locker.lock(id)
    await this.db.set(this.getName(item.id), item)
    this.locker.unlock(id)
  }

  async delete(id: string) {
    await this.locker.lock(id)
    await this.db.remove(this.getName(id))
    this.locker.unlock(id)
  }

  async update(id:string, data: Partial<T>) {
    await this.locker.lock(id)
    let old = (await this.db.get(this.getName(id)) as unknown as T|undefined)
    let nItem = {...old, ...data, ...{id: id}}
    await this.db.set(this.getName(id), nItem)
    this.locker.unlock(id)
  }

  private getName(id:string):string {
    return this.name + "." + id
  }
}

