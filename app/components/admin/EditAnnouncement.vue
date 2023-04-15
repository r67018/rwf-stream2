<template>
  <base-edit
    title="お知らせ"
    :handle-submit="handleSubmit"
  >
    <div>
      <v-label>現在のお知らせ</v-label>
      <v-select
        v-model="edit"
        :items="announcements"
        item-title="title"
        item-value="_id"
        />
    </div>
    <div class="mb-3">
      <v-label>内容</v-label>
      <v-card variant="tonal">
        <v-card-text>
          {{ selectedAnnouncement.content }}
        </v-card-text>
      </v-card>
    </div>
  </base-edit>
</template>

<script setup lang="ts">
import { IStreamingInfo } from '~/server/models/StreamingInfo'
import { IAnnouncement } from '~/server/models/Announcement'
import BaseEdit from '~/components/admin/BaseEdit.vue'

const props = defineProps<{
  streamingInfo: IStreamingInfo
  announcements: IAnnouncement[]
}>()

const edit = ref<string>(props.streamingInfo.announcement._id)
const selectedAnnouncement = computed(() => props.announcements.find(v => v._id === edit.value))

const handleSubmit = async () => {
  await useFetch(`/api/streaming-infos/${props.streamingInfo._id}`, {
    method: 'PATCH',
    body: {
      announcement: edit.value,
    },
  })
}
</script>

<style scoped>
</style>