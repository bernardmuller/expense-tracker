import { hc } from 'hono/client'
import type { AppType } from '../../../../back-end/src/app'

const client = hc<AppType>('http://localhost:8787/', {
  init: {
    credentials: 'include', // Required for sending cookies cross-origin
  },
})

// Now your client requests will include credentials
const response = await client.someProtectedEndpoint.$get()
