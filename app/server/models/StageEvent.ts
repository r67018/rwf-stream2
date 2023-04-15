import { model, Schema } from 'mongoose'

export interface IStageEvent {
  _id: string
  name: string
  startTime: string
  endTime: string
}

const schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
})

export const StageEvent = model<IStageEvent>(
  'StageEvent',
  schema
)
