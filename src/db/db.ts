import {BlStorage} from "./storage"
import {ProNullable} from "ts-json"


export class DB {
  public async get<T>(key:string, con:{new (...args:any[]):T}):Promise<ProNullable<T>|undefined> {
    return this.storage_.get(this.getFullKey(key), con)
  }

  public async set<T>(key:string, value:T): Promise<void> {
    return this.storage_.set(this.getFullKey(key), value)
  }

  public async has(key:string):Promise<boolean> {
    return this.storage_.has(this.getFullKey(key))
  }

  public async remove(key:string):Promise<void> {
    return this.storage_.remove(this.getFullKey(key))
  }

  private getFullKey(key:string):string{
    return this.name_ + "." + key;
  }

  constructor(name:string, storage:BlStorage) {
    this.name_ = name;
    this.storage_ = storage;
  }

  private storage_:BlStorage;
  private readonly name_:string;
}

