import { IStageEvent, StageEvent } from '~/server/models/StageEvent'

// 空のステージイベントを作成して返す
export default defineEventHandler(async (event): Promise<IStageEvent> => {
  const body: IStageEvent = await readBody(event)
  const doc: IStageEvent = await StageEvent.create(body)
  return doc
})
