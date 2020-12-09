import { existsSync, unlinkSync, writeFileSync } from 'fs'
import * as mkdirp from 'mkdirp'
import * as path from 'path'

export default function (location, output) {
  const fullpath = path.join(location)
  const folderPath = fullpath.substr(0, fullpath.lastIndexOf('/'))
  const dir = folderPath

  if (!existsSync(dir)) {
    mkdirp.sync(folderPath)
  }

  if (existsSync(fullpath)) {
    unlinkSync(fullpath)
  }

  writeFileSync(fullpath, output, { flag: 'wx' })
}
