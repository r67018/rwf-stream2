import { model, Schema } from 'mongoose'
import { IAlertTemplate } from '~/server/models/AlertTemplate'
import { IAnnouncement } from '~/server/models/Announcement'
import { IStageEvent } from '~/server/models/StageEvent'

export interface IStreamingInfo {
  _id: string
  currentStageEvent: IStageEvent
  nextStageEvent?: IStageEvent
  announcement: IAnnouncement
  alert?: {
    template?: IAlertTemplate
    content: string
    displayTime: number
    until?: string
  }
}

const alertSchema = new Schema({
  template: {
    type: Schema.Types.ObjectId,
    ref: 'AlertTemplate',
  },
  content: {
    type: String,
    required: true,
  },
  displayTime: {
    type: Number,
    required: true,
  },
  until: Date,
})

const schema = new Schema({
  currentStageEvent: {
    type: Schema.Types.ObjectId,
    ref: 'StageEvent',
    required: true,
  },
  nextStageEvent: {
    type: Schema.Types.ObjectId,
    ref: 'StageEvent',
  },
  announcement: {
    type: Schema.Types.ObjectId,
    ref: 'Announcement',
  },
  alert: alertSchema,
})

export const StreamingInfo = model<IStreamingInfo>(
  'StreamingInfo',
  schema
)
