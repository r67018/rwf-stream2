<template>
  <v-container>
    <v-row>
      <v-col>
        <edit-stage-event-list
          :stage-events="stageEvents ?? []"
          :refresh="refreshStageEvents"
        />
<!--        <edit-textarea-->
<!--          v-model="editedStageEventsString"-->
<!--          title="ステージイベント"-->
<!--          :handle-submit="handleSubmitEditStageEventList"-->
<!--        />-->
      </v-col>
      <v-col>
        <edit-alert-template
          :templates="alertTemplates"
          :refresh="refreshAlertTemplates"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { IStageEvent } from '~/server/models/StageEvent'
import EditTextarea from '~/components/admin/EditTextarea.vue'
import EditAlertTemplate from '~/components/admin/EditAlertTemplate.vue'
import { IAlertTemplate } from '~/server/models/AlertTemplate'
import { AsyncData } from '#app'
import EditStageEventList from '~/components/admin/EditStageEventList.vue'

const props = defineProps<{
  stageEventsAsyncData: AsyncData<IStageEvent[], any>
  alertTemplatesAsyncData: AsyncData<IAlertTemplate[], any>
}>()

const { data: stageEvents, refresh: refreshStageEvents } = props.stageEventsAsyncData
const { data: alertTemplates, refresh: refreshAlertTemplates } = props.alertTemplatesAsyncData

const editedStageEventsString = ref<string>(stageEvents.value?.map(v => v.name).join('\n') ?? '')

const handleSubmitEditStageEventList = async () => {
  const body: Omit<IStageEvent, '_id'>[] = editedStageEventsString.value
    // 改行で分割する
    .split('\n')
    // 前後の空白を削除する
    .map(v => v.trim())
    // 空文字を削除する
    .filter(v => v !== '')
    // 重複を削除する
    .filter((v, i, self) => self.indexOf(v) === i)
    // IStageEventに変換する
    .map(v => ({ name: v }))
  await useFetch('/api/stage-events', {
    method: 'PUT',
    body
  })
  await refreshStageEvents()
}

</script>

<style scoped>
</style>