

export interface BlStorage {
  set(key:string, value:object): Promise<void>;
  get(key:string): Promise<object|undefined>;
  remove(key:string): Promise<void>;
}

export class MemoryStorage implements BlStorage{
  private storage = new Map<string, object>()

  async get(key: string): Promise<object | undefined> {
    return this.storage.get(key);
  }

  async remove(key: string): Promise<void> {
    this.storage.delete(key);
  }

  async set(key: string, value: object): Promise<void> {
    this.storage.set(key, value);
  }

}

class dummyStorage implements BlStorage {
  constructor(public log: string) {
  }

  get(key:string):Promise<object|undefined> {
    throw Error(`must set ${this.log}, please use 'setXXXStorage'`);
  }

  remove(key:string):Promise<void> {
    throw Error(`must set ${this.log}, please use 'setXXXStorage'`);
  }

  set(key:string, value:object):Promise<void> {
    throw Error(`must set ${this.log}, please use 'setXXXStorage'`);
  }
}


let localSto: BlStorage = new dummyStorage("local storage")

let sessionSto: BlStorage = new dummyStorage("session storage")

export function localStorage(): BlStorage {
  return localSto
}

export function sessionStorage(): BlStorage {
  return sessionSto
}

export function setSessionStorage(storage: BlStorage) {
  sessionSto = storage
}

export function setLocalStorage(storage: BlStorage) {
  localSto = storage
}
