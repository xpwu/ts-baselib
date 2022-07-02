import {BlStorage} from "./storage"


export class DB {
  public async get(key:string):Promise<object|undefined> {
    return (await this.storage_.get(this.getFullKey(key)));
  }

  public async set(key:string, value:object):Promise<void> {
    return (await this.storage_.set(this.getFullKey(key), value));
  }

  public async remove(key:string):Promise<void> {
    return (await this.storage_.remove(this.getFullKey(key)));
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

export function shareDB(storage: BlStorage, prefix: string = ""):DB {
  return new DB(prefix + "share", storage)
}

export function selfDB(uid: string, storage: BlStorage, prefix: string = ""): DB {
  return new DB(prefix + uid, storage)
}

