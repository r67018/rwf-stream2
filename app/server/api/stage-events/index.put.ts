import { IStageEvent, StageEvent } from '~/server/models/StageEvent'

export default defineEventHandler(async (event): Promise<null> => {
  const body: IStageEvent[] = await readBody(event)
  await StageEvent.deleteMany()
  await StageEvent.insertMany(body)
  return null
})
