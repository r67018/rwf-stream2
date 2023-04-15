<template>
  <v-sheet
      elevation="3"
      class="text-center d-flex flex-column ma-1 pa-2"
  >
    <div class="font-weight-bold">
      {{ label }}
    </div>
    <div style="font-size: 3em">
      {{ stageEvent?.name ?? 'イベントは終了しました' }}
    </div>
    <div
      v-if="stageEvent"
      class="text-h6 font-weight-bold"
    >
      {{ stageEvent?.startTime }}
      ~
      {{ stageEvent?.endTime }}
    </div>
  </v-sheet>
</template>

<script setup lang="ts">
import { IStageEvent } from '~/server/models/StageEvent'

const props = defineProps<{
  stageEvent?: IStageEvent
  label: string
}>()
</script>

<style scoped>
</style>