<template>
  <div>
    <the-header title="管理用ページ" />

    <v-main>
      <v-tabs v-model="tab" fixed-tabs>
        <v-tab value="operation">操作</v-tab>
        <v-tab value="setting">設定</v-tab>
      </v-tabs>

      <v-window v-model="tab">
        <v-window-item value="operation">
          <tab-operation
            :streaming-info-async-data="streamingInfoAsyncData"
            :stage-events-async-data="stageEventsAsyncData"
            :announcements-async-data="announcementsAsyncData"
            :alert-templates-async-data="alertTemplatesAsyncData"
          />
        </v-window-item>
        <v-window-item value="setting">
          <tab-setting
            :stage-events-async-data="stageEventsAsyncData"
            :alert-templates-async-data="alertTemplatesAsyncData"
          />
        </v-window-item>
      </v-window>
    </v-main>
  </div>
</template>

<script setup lang="ts">
import TheHeader from '~/components/TheHeader.vue'
import TabOperation from '~/components/admin/TabOperation.vue'
import TabSetting from '~/components/admin/TabSetting.vue'

const tab = ref<any>()

const streamingInfoAsyncData = shallowRef(await useFetch('/api/streaming-infos/latest'))
const stageEventsAsyncData = await useFetch('/api/stage-events')
const announcementsAsyncData = await useFetch('/api/announcements')
const alertTemplatesAsyncData = await useFetch('/api/alert-templates')

// データがない場合は初期値をPOSTする
if (!streamingInfoAsyncData.value.pending.value && !streamingInfoAsyncData.value.data.value) {
  streamingInfoAsyncData.value = await useFetch('/api/streaming-infos', {
    method: 'POST',
    body: {
      currentStageEvent: '',
      nextStageEvent: '',
      announcement: '',
    }
  })
}
</script>

<style scoped>
</style>