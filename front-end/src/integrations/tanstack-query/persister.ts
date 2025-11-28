import type { Persister } from '@tanstack/query-persist-client-core'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'

export function createPersister(): Persister {
  return createSyncStoragePersister({
    storage: window.localStorage,
    key: 'expense-tracker-query-cache',
    serialize: (data) => JSON.stringify(data),
    deserialize: (data) => JSON.parse(data),
  })
}
