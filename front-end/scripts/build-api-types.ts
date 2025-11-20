import { writeFile } from 'fs/promises'
import { execSync } from 'child_process'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { ResultAsync, errAsync } from 'neverthrow'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const API_DOCS_URL = 'http://localhost:8080/doc'
const SCHEMA_PATH = join(__dirname, '../src/lib/http/schema.json')
const TYPES_PATH = join(__dirname, '../src/lib/http/schema.d.ts')

ResultAsync.fromPromise(fetch(API_DOCS_URL), () => 'Fetch failed')
  .andThen((res) =>
    res.ok
      ? ResultAsync.fromPromise(res.json(), () => 'Parse failed')
      : errAsync('HTTP error'),
  )
  .andThen((schema) =>
    ResultAsync.fromPromise(
      writeFile(SCHEMA_PATH, JSON.stringify(schema, null, 2)),
      () => 'Write failed',
    ).map(() => schema),
  )
  .andThen(() =>
    ResultAsync.fromPromise(
      Promise.resolve().then(() =>
        execSync(`npx openapi-typescript ${SCHEMA_PATH} -o ${TYPES_PATH}`, {
          stdio: 'inherit',
        }),
      ),
      () => 'Generate failed',
    ),
  )
  .match(
    () => console.log('Successfully built api types'),
    () => process.exit(1),
  )
