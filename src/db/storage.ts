import { ProNullable } from "ts-json";


export interface BlStorage {
  set<T>(key:string, value:T):Promise<void>
  get<T>(key:string, con:{new (...args:any[]):T}):Promise<ProNullable<T>|undefined>
  has(key:string): Promise<boolean>
  remove(key:string): Promise<void>
}

export const memoryStorage = new class ms implements BlStorage{
  static storage = new Map<string, any>()

  async get<T>(key:string, con:{new (...args:any[]):T}):Promise<ProNullable<T>|undefined> {
    return ms.storage.get(key);
  }

  async remove(key: string): Promise<void> {
    ms.storage.delete(key);
  }

  async set<T>(key:string, value:T): Promise<void> {
    ms.storage.set(key, value);
  }

  async has(key:string):Promise<boolean> {
    return ms.storage.has(key)
  }
}

// class dummyStorage implements BlStorage {
//   constructor(public log: string) {
//   }
//
//   has(key:string):Promise<boolean> {
//     throw Error(`must set ${this.log}, please use 'setXXXStorage'`);
//   }
//
//   get<T>(key:string, con:{new (...args:any[]):T}):Promise<ProNullable<T>|undefined> {
//     throw Error(`must set ${this.log}, please use 'setXXXStorage'`);
//   }
//
//   remove(key:string):Promise<void> {
//     throw Error(`must set ${this.log}, please use 'setXXXStorage'`);
//   }
//
//   set<T>(key:string, value:T): Promise<void> {
//     throw Error(`must set ${this.log}, please use 'setXXXStorage'`);
//   }
// }
//
//
// let localSto: BlStorage = new dummyStorage("local storage")
//
// let sessionSto: BlStorage = new dummyStorage("session storage")
//
// export function localBlStorage(): BlStorage {
//   return localSto
// }
//
// export function sessionBlStorage(): BlStorage {
//   return sessionSto
// }
//
// export function setSessionStorage(storage: BlStorage) {
//   sessionSto = storage
// }
//
// export function setLocalStorage(storage: BlStorage) {
//   localSto = storage
// }
