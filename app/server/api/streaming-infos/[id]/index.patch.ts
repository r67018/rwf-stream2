import { readBody } from 'h3'
import { StreamingInfo, IStreamingInfo } from '~/server/models/StreamingInfo'

export default defineEventHandler(async (event): Promise<null> => {
  const body: Partial<IStreamingInfo> = await readBody(event)
  const id = event.context.params?.id
  if (!id) {
    throw new Error('No id provided')
  }
  await StreamingInfo.updateOne({'_id': id}, {$set: body}, {upsert: true})
  return null
})
