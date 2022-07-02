import { ProNullable } from "ts-json";


export interface BlStorage {
  set<T>(key:string, value:T): Promise<void>;
  get<T>(key:string, con:{new (...args:any[]):T}):Promise<ProNullable<T>|undefined>;
  has(key:string):boolean
  remove(key:string): Promise<void>;
}

// export class MemoryStorage implements BlStorage{
//   private storage = new Map<string, object>()
//
//   async get(key: string): Promise<object | undefined> {
//     return this.storage.get(key);
//   }
//
//   async remove(key: string): Promise<void> {
//     this.storage.delete(key);
//   }
//
//   async set(key: string, value: object): Promise<void> {
//     this.storage.set(key, value);
//   }
//
// }

class dummyStorage implements BlStorage {
  constructor(public log: string) {
  }

  has(key:string):boolean {
    throw Error(`must set ${this.log}, please use 'setXXXStorage'`);
  }

  get<T>(key:string, con:{new (...args:any[]):T}):Promise<ProNullable<T>|undefined> {
    throw Error(`must set ${this.log}, please use 'setXXXStorage'`);
  }

  remove(key:string):Promise<void> {
    throw Error(`must set ${this.log}, please use 'setXXXStorage'`);
  }

  set<T>(key:string, value:T): Promise<void> {
    throw Error(`must set ${this.log}, please use 'setXXXStorage'`);
  }
}


let localSto: BlStorage = new dummyStorage("local storage")

let sessionSto: BlStorage = new dummyStorage("session storage")

export function localBlStorage(): BlStorage {
  return localSto
}

export function sessionBlStorage(): BlStorage {
  return sessionSto
}

export function setSessionStorage(storage: BlStorage) {
  sessionSto = storage
}

export function setLocalStorage(storage: BlStorage) {
  localSto = storage
}
