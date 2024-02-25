import { drizzle } from 'drizzle-orm/libsql'
import { createClient } from '@libsql/client'
import { schema } from './schema'

const client = createClient({
    url: 'file:local.db',
})

export const db = drizzle(client, { schema })
