import { readFileSync } from 'fs'
import * as path from 'path'

export default function (location) {
  const fullpath = path.join(__dirname, '..', location)
  const result = readFileSync(fullpath, 'utf8')

  return result
}
