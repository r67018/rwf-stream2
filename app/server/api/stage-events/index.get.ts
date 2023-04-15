import { IStageEvent, StageEvent } from '~/server/models/StageEvent'

export default defineEventHandler(async (event): Promise<IStageEvent[]> => {
  const docs: IStageEvent[] = await StageEvent.find().lean()
  return docs
})
