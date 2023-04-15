<template>
  <div>
    <base-edit
      title="画面上部通知"
      :handle-submit="handleSubmit"
    >
      <div>
        <div v-if="streamingInfo.alert?.content">
          <div class="d-flex justify-space-between">
            <v-label>現在の通知</v-label>
            <div>{{ currentAlertDisplayedUntil }}まで</div>
          </div>
          <v-card variant="tonal">
            <v-card-text>
              {{ streamingInfo.alert?.content ?? '' }}
            </v-card-text>
          </v-card>
        </div>
        <div v-else>
          <span>現在の通知はありません</span>
        </div>
      </div>
      <div class="d-flex justify-space-between">
        <div class="w-66">
          <v-label>テンプレート</v-label>
          <v-select
            v-model="selectedTemplateId"
            :items="alertTemplates"
            item-title="title"
            item-value="_id"
          >
          </v-select>
        </div>
        <div class="w-33">
          <v-label>表示時間</v-label>
          <v-select
            v-model="displayTime"
            :items="displayTimeItems"
            item-title="title"
            item-value="value"
          >
          </v-select>
        </div>
      </div>
      <v-card
        variant="outlined"
        class="mb-3"
      >
        <v-card-text>
          <div v-for="part in parsedAlertTemplate">
            <v-text-field
              v-if="part.type === Token.VARIABLE"
              v-model="part.value"
              :label="part.label"
              :rules="parsedAlertTemplateVariableRules"
              validate-on="submit"
            />
            <span v-else>
          {{ part.value }}
        </span>
          </div>
        </v-card-text>
      </v-card>
      <template #btn>
        <v-btn
          color="red"
          class="ml-2"
        >
          削除
          <dialog-confirm
            :on-confirm="handleDeleteCurrentAlert"
            message="現在の通知を削除しますか？"
          />
        </v-btn>
      </template>
    </base-edit>
  </div>
</template>

<script setup lang="ts">
import BaseEdit from '~/components/admin/BaseEdit.vue'
import { IAlertTemplate } from '~/server/models/AlertTemplate'
import { IStreamingInfo } from '~/server/models/StreamingInfo'
import { addSeconds, parseISO } from 'date-fns'
import { format } from 'date-fns-tz'
import DialogConfirm from '~/components/utils/DialogConfirm.vue'

const props = defineProps<{
  streamingInfo: IStreamingInfo
  alertTemplates: IAlertTemplate[]
  refresh: () => Promise<void>
}>()

const displayTimeItems = [
  { title: '30秒', value: 30 },
  { title: '1分', value: 60 },
  { title: '5分', value: 300 },
  { title: '10分', value: 600 },
  { title: '30分', value: 1800 },
  { title: '1時間', value: 3600 },
  { title: '3時間', value: 10800 },
  { title: '止めるまで', value: -1 },
]

const selectedTemplateId = ref<string>(props.streamingInfo.alert?.template?._id ?? '')
const selectedTemplate = computed<IAlertTemplate | undefined>(() => props.alertTemplates.find((t) => t._id === selectedTemplateId.value))
// テンプレートが編集されたらIDを更新
// 現在選択しているテンプレートが削除されたとき用
watch(() => props.alertTemplates, () => {
  const template = props.alertTemplates.find((t) => t._id === selectedTemplateId.value)
  if (template) {
    selectedTemplateId.value = template._id
  } else {
    selectedTemplateId.value = ''
  }
})
const displayTime = ref<number>(props.streamingInfo.alert?.displayTime ?? 30)
const currentAlertDisplayedUntil = computed<string>(() => {
  const until: string | undefined = props.streamingInfo.alert?.until
  if (!until) {
    return '手動で止める'
  }
  return format(parseISO(until), 'HH:mm:ss', { timeZone: 'Asia/Tokyo' })
})

// テンプレートのパース
// 1. テンプレートの中に {} がある場合、変数として扱う
// 2. テンプレートの中に {} がない場合、を文字列として扱う
const Token = {
  STRING: 0,
  VARIABLE: 1,
} as const
type Token = typeof Token[keyof typeof Token]
type ParsedAlertTemplateElement = {
  type: Token
  value: string
  label?: string
}
const parsedAlertTemplate = ref<ParsedAlertTemplateElement[]>([])
watch(selectedTemplateId, () => {
  if (selectedTemplate.value) {
    parsedAlertTemplate.value = selectedTemplate.value.content
      // 変数の正規表現 {ラベル} の形式
      .split(/({.*?})/g)
      .filter(v => v !== '')
      .map(v => {
        if (/{.*?}/.test(v)) {
          return {
            type: Token.VARIABLE,
            value: '',
            label: v.replace(/{|}/g, '')
          }
        } else {
          return {
            type: Token.STRING,
            value: v,
          }
        }
      })
  } else {
    parsedAlertTemplate.value = []
  }
}, { immediate: true })
const alertContent = computed<string>(() => parsedAlertTemplate.value.map(v => v.value).join(''))
const parsedAlertTemplateVariableRules: ((v: string) => true | string)[] = [
  (v: string) => !!v || '入力してください',
]

const handleSubmit = async () => {
  // バリデーション
  // 変数が空の場合は終了
  if (parsedAlertTemplate.value.some(v => v.type === Token.VARIABLE && v.value === '')) {
    return
  }
  await useFetch(`/api/streaming-infos/${props.streamingInfo._id}`, {
    method: 'PATCH',
    body: {
      alert: {
        template: selectedTemplateId.value,
        content: alertContent.value,
        displayTime: displayTime.value,
        until: displayTime.value === -1 ? null : addSeconds(new Date(), displayTime.value)
      }
    }
  })
  await props.refresh()
}

const handleDeleteCurrentAlert = async () => {
  await useFetch(`/api/streaming-infos/${props.streamingInfo._id}`, {
    method: 'PATCH',
    body: {
      alert: null
    }
  })
  await props.refresh()
}
</script>

<style scoped>
</style>