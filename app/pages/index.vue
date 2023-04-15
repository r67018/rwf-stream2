<template>
  <v-main class="h-screen">
    <div style="height: 2rem">
      <transition name="alert" appear>
        <div
          id="alert"
          class="h-100 d-flex align-center bg-pink-accent-2"
          v-if="displayAlert"
        >
          <div
            id="alert-content"
          >
            {{ streamingInfo.alert.content }}
          </div>
        </div>
      </transition>
    </div>
    <div class="px-3" style="height: calc(100% - 2rem)">
      <div class="d-flex" style="height: 80%">
        <video src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"></video>
      </div>
      <div class="d-flex align-center" style="height: 20%">
        <display-stage-event
          label="現在のステージイベント"
          :stage-event="streamingInfo.currentStageEvent"
          class="w-100 mx-4"
        />
        <display-stage-event
          label="次のステージイベント"
          :stage-event="streamingInfo.nextStageEvent"
          class="w-100 mx-4"
        />
        <v-sheet
          elevation="3"
          class="w-100 text-center"
        >
          <div class="font-weight-bold">お知らせ</div>
          <div style="font-size: 3em">
            {{ streamingInfo.announcement.content }}
          </div>
        </v-sheet>
      </div>
    </div>
  </v-main>
</template>

<script setup lang="ts">
import DisplayStreamingInfo from '~/components/DisplayStageEvent.vue'
import { onMounted } from 'vue'
import { parseISO } from 'date-fns'

const { data: streamingInfo } = await useFetch('/api/streaming-infos/latest')

const displayAlert = ref<boolean>(false)
const alertTimeoutId = ref<ReturnType<typeof setTimeout>>()
watch(() => streamingInfo.value?.alert, () => {
  clearTimeout(alertTimeoutId.value)
  alertTimeoutId.value = undefined
  const alert = streamingInfo.value?.alert
  if (alert) {
    displayAlert.value = true
    // 期限がある場合は期限を設定する
    if (alert.until) {
      // 期限までの秒を計算する
      const diffSecond = (parseISO(alert.until).getTime() - new Date().getTime()) / 1000
      // 四捨五入してミリ秒に変換する
      const diffMilliSecond = Math.round(diffSecond) * 1000
      alertTimeoutId.value = setTimeout(() => {
        displayAlert.value = false
      }, diffMilliSecond)
    }
  } else {
    displayAlert.value = false
  }
}, { immediate: true })

const longPollingStreamingInfo = (): Promise<void> => {
  return new Promise<void>(async (resolve) => {
    const { data } = await useFetch('/api/streaming-infos/latest', {
      query: {
        polling: true
      },
    })
    if (data.value) {
      streamingInfo.value = data.value
    }
    resolve()
  }).then(longPollingStreamingInfo)
    .catch(e => console.error(e))
}

onMounted(() => {
  longPollingStreamingInfo()
})
</script>

<style scoped>
#alert-content {
  display: inline-block;
  font-size: 100%;
  font-weight: bold;
  padding-left: 100%;
  white-space: nowrap;
  animation: scroll-left 15s linear infinite;
}

@keyframes scroll-left {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-100%);
  }
}

/* vue transitionを使用したアニメーション */
.alert-enter-active {
  transition: all 2s ease-out;
}
.alert-leave-active {
  transition: all 1s ease-out;
}

.alert-enter-from,
.alert-leave-to
{
  /*opacity: 0;*/
  transform: translateY(-100%);
}
</style>