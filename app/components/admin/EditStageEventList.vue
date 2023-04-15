<template>
  <base-edit-with-dialog
    title="ステージイベントデータ"
    :handle-submit="handleSubmit"
    :handle-cancel="handleCancel"
  >
    <div class="d-flex justify-space-between">
      <!-- 新規作成の場合_idを持たないためitem-keyはnameにする -->
      <draggable
        v-model="editedStageEvents"
        item-key="name"
        class="w-50 d-flex flex-column align-center"
      >
        <template #item="{ element }">
          <v-card
            @click="selectStageEvent(element._id)"
            class="w-75 mb-2"
            :color="selectedStageEvent?._id === element._id ? 'blue-grey-lighten-5' : 'white'"
            style="height: 3em"
          >
            <v-card-text class="text-center">
              {{ element.name }}
            </v-card-text>
          </v-card>
        </template>
        <template #footer>
          <v-btn
            @click="createStageEvent"
            color="primary"
            class="w-75"
            variant="outlined"
          >
            追加
          </v-btn>
        </template>
      </draggable>
      <div class="w-50" v-if="selectedStageEvent">
        <div >
          <v-label>名前</v-label>
          <v-text-field
            v-model="selectedStageEvent.name"
            :rules="[ruleNotEmpty]"
          />
        </div>
        <div>
          <v-label>開始時間</v-label>
          <v-text-field
            v-model="selectedStageEvent.startTime"
            :rules="[ruleNotEmpty]"
          />
        </div>
        <div>
          <v-label>終了時間</v-label>
          <v-text-field
            v-model="selectedStageEvent.endTime"
            :rules="[ruleNotEmpty]"
          />
        </div>
        <div>
          <v-btn
            @click="deleteSelectedStageEvent"
            color="red"
            variant="outlined"
          >
            削除
          </v-btn>
        </div>
      </div>
    </div>
  </base-edit-with-dialog>
</template>

<script setup lang="ts">
import BaseEditWithDialog from '~/components/admin/BaseEditWithDialog.vue'
import draggable from 'vuedraggable'
import { IStageEvent } from '~/server/models/StageEvent'
import _ from 'lodash'

const props = defineProps<{
  stageEvents: IStageEvent[]
  refresh: () => Promise<void>
}>()

const editedStageEvents = ref<IStageEvent[]>(_.cloneDeep(props.stageEvents))
const selectedStageEvent = ref<IStageEvent | null>(editedStageEvents.value[0] ?? null)
const createdStageEventIds: string[] = []
const deletedStageEventIds: string[] = []

const selectStageEvent = (id: string) => {
  const stageEvent = editedStageEvents.value.find((stageEvent) => stageEvent._id === id)
  if (stageEvent) {
    selectedStageEvent.value = stageEvent
  }
}

const createStageEvent = async () => {
  // 新しいidを取得する
  const { data: id } = await useFetch('/api/id/new', {
    method: 'GET'
  })
  if (!id.value) {
    return
  }
  const newStageEvent: IStageEvent = {
    _id: id.value,
    name: '新規作成',
    startTime: '00:00',
    endTime: '00:00'
  }
  createdStageEventIds.push(newStageEvent._id)
  editedStageEvents.value.push(newStageEvent)
  selectStageEvent(newStageEvent._id)
}

const deleteSelectedStageEvent = async () => {
  if (!selectedStageEvent.value) {
    return
  }
  // 削除するidを記録
  deletedStageEventIds.push(selectedStageEvent.value._id)
  // 削除した後にselectedStageEventを変更するためにindexを取得する
  const index = editedStageEvents.value.findIndex((stageEvent) => stageEvent._id === selectedStageEvent.value?._id)
  editedStageEvents.value = editedStageEvents.value.filter((stageEvent) => stageEvent._id !== selectedStageEvent.value?._id)
  // selectedStageEventを変更
  if (editedStageEvents.value.length === 0) {
    selectedStageEvent.value = null
  } else if (index === 0) {
    selectStageEvent(editedStageEvents.value[0]._id)
  } else {
    selectedStageEvent.value = editedStageEvents.value[index - 1]
  }
}

const isEmpty = (value: string) => !value
const ruleNotEmpty = (value: string) => !isEmpty(value) || '入力してください'

const handleSubmit = async (): Promise<boolean> => {
  // バリデーション
  for (const stageEvent of editedStageEvents.value) {
    if (isEmpty(stageEvent.name) || isEmpty(stageEvent.startTime) || isEmpty(stageEvent.endTime)) {
      // バリデーションエラーが発生した場所を選択する
      selectedStageEvent.value = stageEvent
      return false
    }
  }

  await useFetch('/api/stage-events', {
    method: 'PUT',
    body: editedStageEvents.value
  })
  // 削除したstageEventを削除
  deletedStageEventIds.forEach((id) => {
    useFetch(`/api/stage-events/${id}`, {
      method: 'DELETE'
    })
  })
  await props.refresh()
  return true
}
const handleCancel = () => {
  editedStageEvents.value = _.cloneDeep(props.stageEvents)
}
</script>

<style scoped>
</style>