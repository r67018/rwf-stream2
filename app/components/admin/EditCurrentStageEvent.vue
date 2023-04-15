<template>
  <base-edit
    title="ステージイベント"
    :handle-submit="handleSubmit"
  >
    <div class="d-flex justify-space-between">
      <div class="w-100 mr-1">
        <v-label>現在のステージイベント</v-label>
        <v-select
          v-model="editedCurrentStageEvent"
          :items="stageEvents"
          item-title="name"
          return-object
        />
      </div>
      <div class="w-100">
        <v-label>次のステージイベント(自動)</v-label>
        <v-text-field
          :model-value="editedNextStageEvent?.name ?? 'なし'"
          readonly
        />
      </div>
    </div>
  </base-edit>
</template>

<script setup lang="ts">
import { IStageEvent } from '~/server/models/StageEvent'
import { IStreamingInfo } from '~/server/models/StreamingInfo'
import BaseEdit from '~/components/admin/BaseEdit.vue'

const props = defineProps<{
  streamingInfo: IStreamingInfo
  stageEvents: IStageEvent[]
}>()

const editedCurrentStageEvent = ref<IStageEvent | null>(props.streamingInfo.currentStageEvent ?? null)
const editedNextStageEvent = computed<IStageEvent | null>(() => {
  if (!editedCurrentStageEvent.value) {
    return null
  }
  const index = props.stageEvents.findIndex((stageEvent) => stageEvent._id === editedCurrentStageEvent.value?._id)
  if (index === -1 || index === props.stageEvents.length - 1) {
    return null
  } else {
    return props.stageEvents[index + 1]
  }
})

const handleSubmit = async () => {
  await useFetch(`/api/streaming-infos/${props.streamingInfo._id}`, {
    method: 'PATCH',
    body: {
      currentStageEvent: editedCurrentStageEvent.value?._id ?? null,
      nextStageEvent: editedNextStageEvent.value?._id ?? null,
    },
  })
}
</script>

<style scoped>
</style>