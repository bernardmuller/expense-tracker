import type { Persister } from '@tanstack/query-persist-client-core'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'
import { getItem, removeItem, setItem } from '@/lib/storage/data-store'
import { STORAGE_KEYS } from '@/lib/storage/storage-keys'

// Create a storage adapter that wraps our data-store
const storageAdapter: Storage = {
  getItem: (key: string) => {
    const value = getItem(STORAGE_KEYS.QUERY_CACHE)
    return value !== undefined ? value : null
  },
  setItem: (key: string, value: string) => {
    setItem(STORAGE_KEYS.QUERY_CACHE, value)
  },
  removeItem: (key: string) => {
    removeItem(STORAGE_KEYS.QUERY_CACHE)
  },
  clear: () => {
    removeItem(STORAGE_KEYS.QUERY_CACHE)
  },
  key: (index: number) => null,
  length: 0,
}

export function createPersister(): Persister {
  return createSyncStoragePersister({
    storage: storageAdapter,
    key: 'expense-tracker-query-cache',
    serialize: (data) => JSON.stringify(data),
    deserialize: (data) => JSON.parse(data),
  })
}
