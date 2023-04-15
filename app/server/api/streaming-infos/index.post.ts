import { IStreamingInfo, StreamingInfo } from '~/server/models/StreamingInfo'

export default defineEventHandler(async (event): Promise<IStreamingInfo> => {
  const body: Omit<IStreamingInfo, '_id'> = await readBody(event)
  const doc: IStreamingInfo = await StreamingInfo.create(body)
  return doc
})
