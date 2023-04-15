<template>
  <v-container>
    <v-row>
      <v-col>
        <edit-current-stage-event
          :streaming-info="streamingInfo ?? streamingInfoDefault"
          :stage-events="stageEvents ?? []"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <edit-announcement
          :streaming-info="streamingInfo ?? streamingInfoDefault"
          :announcements="announcements ?? []"
        />
      </v-col>
      <v-col>
        <edit-alert
          :streaming-info="streamingInfo ?? streamingInfoDefault"
          :alert-templates="alertTemplates ?? []"
          :refresh="refreshStreamingInfo"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { IStreamingInfo } from '~/server/models/StreamingInfo'
import { AsyncData } from '#app'
import { IStageEvent } from '~/server/models/StageEvent'
import EditAlert from '~/components/admin/EditAlert.vue'
import { IAlertTemplate } from '~/server/models/AlertTemplate'
import EditCurrentStageEvent from '~/components/admin/EditCurrentStageEvent.vue'
import EditAnnouncement from '~/components/admin/EditAnnouncement.vue'
import { IAnnouncement } from '~/server/models/Announcement'

const props = defineProps<{
  streamingInfoAsyncData: AsyncData<IStreamingInfo, any>
  stageEventsAsyncData: AsyncData<IStageEvent[], any>
  announcementsAsyncData: AsyncData<IAnnouncement[], any>
  alertTemplatesAsyncData: AsyncData<IAlertTemplate[], any>
}>()

const { data: stageEvents } = props.stageEventsAsyncData
const { data: announcements } = props.announcementsAsyncData
const { data: alertTemplates } = props.alertTemplatesAsyncData
const streamingInfoDefault: IStreamingInfo = {
  _id: '',
  currentStageEvent: {
    _id: '',
    name: '',
    startTime: '',
    endTime: '',
  },
  nextStageEvent: {
    _id: '',
    name: '',
    startTime: '',
    endTime: '',
  },
  announcement: {
    _id: '',
    title: '',
    content: '',
  },
}
const { data: streamingInfo, refresh: refreshStreamingInfo } = props.streamingInfoAsyncData
</script>

<style scoped>
</style>