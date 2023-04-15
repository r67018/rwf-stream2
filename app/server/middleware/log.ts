import fs from 'fs'
import { format } from 'date-fns-tz'

const filename = './server/access.log'

export default defineEventHandler((event) => {
  const req = event.node.req
  const now = format(new Date(), 'yyyy/MM/dd:HH:mm:ss', { timeZone: 'Asia/Tokyo' })
  const data = [
    req.headers.host,
    now,
    req.method,
    req.url,
    `HTTP/${req.httpVersion}`,
    req.statusCode,
  ]
  const log = data.map(v => v ?? '-').join(' ') + '\n'
  fs.appendFile(filename, log , (err) => {
    if (err) throw err
  })
})

