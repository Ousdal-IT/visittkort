const DATABASE_NAME = 'ousdal-it-tools';
const STORE_NAME = 'key-value';
const DATABASE_VERSION = 1;

let databasePromise: Promise<IDBDatabase> | undefined;

function openDatabase(): Promise<IDBDatabase> {
  databasePromise ??= new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE_NAME)) {
        request.result.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
  return databasePromise;
}

async function useStore<T>(mode: IDBTransactionMode, action: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const database = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, mode);
    const request = action(transaction.objectStore(STORE_NAME));
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    transaction.onerror = () => reject(transaction.error);
  });
}

export async function getValue<T>(key: IDBValidKey): Promise<T | undefined> {
  return useStore<T | undefined>('readonly', (store) => store.get(key));
}

export async function setValue<T>(key: IDBValidKey, value: T): Promise<void> {
  await useStore<IDBValidKey>('readwrite', (store) => store.put(value, key));
}

export async function deleteValue(key: IDBValidKey): Promise<void> {
  await useStore<undefined>('readwrite', (store) => store.delete(key));
}

export async function clearStorage(): Promise<void> {
  await useStore<undefined>('readwrite', (store) => store.clear());
}
