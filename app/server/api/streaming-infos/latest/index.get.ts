import { getQuery } from 'h3'
import { StreamingInfo, IStreamingInfo } from '~/server/models/StreamingInfo'
import { convertToBool } from '~/utils'
import { ChangeStreamUpdateDocument, ResumeToken } from 'mongodb'

type Query = {
  polling?: string
}

let resumeAfter: ResumeToken = undefined

export default defineEventHandler(async (event): Promise<IStreamingInfo | null> => {
  const query: Query = getQuery(event)
  if (convertToBool(query?.polling)) {
    const pipeline = [
      { $match: { operationType: 'update' } }
    ]
    const changeStream = StreamingInfo.watch(pipeline, {
      resumeAfter,
      fullDocument: 'updateLookup',
    })
    // timeout after 180 seconds
    const timeoutPromise = new Promise((resolve) => setTimeout(() => resolve(null), 180000))
    const doc = await Promise.race([changeStream.next(), timeoutPromise]) as ChangeStreamUpdateDocument<IStreamingInfo> | null
    resumeAfter = changeStream.resumeToken
    await changeStream.close()
  }
  return StreamingInfo.findOne()
    .populate('currentStageEvent')
    .populate('nextStageEvent')
    .populate('announcement')
    .populate('alert.template')
    .lean()
})
