<template>
  <div>
    <base-edit
      title="通知テンプレート"
      :handle-submit="handleSubmit"
    >
      <div class="d-flex">
        <v-select
          v-model="selectedTemplateId"
          :items="templates"
          item-title="title"
          item-value="_id"
        ></v-select>
        <v-btn
          variant="outlined"
          color="primary"
          @click="createTemplate"
          class="mt-2 mx-3"
        >
          新規作成
        </v-btn>
      </div>
<!--      TODO: requiredを付ける-->
      <v-text-field
        v-model="editedTemplate.title"
        label="名前"
        :rules="rules"
        validate-on="submit"
      ></v-text-field>
      <v-textarea
        v-model="editedTemplate.content"
        label="内容"
        :rules="rules"
        validate-on="submit"
      ></v-textarea>

      <template #btn>
        <v-btn
          color="red"
          class="ml-2"
          :disabled="isCreate"
        >
          削除
          <dialog-confirm
            message="テンプレートを削除しますか？"
            :on-confirm="handleDelete"
          />
        </v-btn>
      </template>
    </base-edit>
  </div>
</template>

<script setup lang="ts">
import { IAlertTemplate } from '~/server/models/AlertTemplate'
import BaseEdit from '~/components/admin/BaseEdit.vue'
import DialogConfirm from '~/components/utils/DialogConfirm.vue'
import _ from 'lodash'

const props = defineProps<{
  templates: IAlertTemplate[]
  refresh: () => Promise<void>
}>()

const selectedTemplateId = ref<string>(props.templates[0]._id)
const editedTemplate = ref<IAlertTemplate>(_.cloneDeep(props.templates[0]))
// 選択されたテンプレートが変更されたら、編集中のテンプレートを更新
// IDが空の場合は新規作成
watch(selectedTemplateId, (id) => {
  editedTemplate.value = props.templates.find(v => v._id === id)
    ? _.cloneDeep(props.templates.find(v => v._id === id)!)
    : {
        _id: '',
        title: '新規作成',
        content: '',
      }
})
const isCreate = computed(() => !editedTemplate.value._id)

const rules: ((v: string) => boolean | string)[] = [
  (v) => !!v || '必須項目です'
]

const createTemplate = async () => {
  selectedTemplateId.value = ''
}

const handleSubmit = async () => {
  // バリデーション
  if (!editedTemplate.value.title || !editedTemplate.value.content) {
    return
  }
  // _idがあればPUT、なければPOST
  if (editedTemplate.value._id) {
    await useFetch(`/api/alert-templates/${editedTemplate.value._id}`, {
      method: 'PUT',
      body: editedTemplate.value,
    })
    await props.refresh()
  } else {
    const { data: createdTemplate } = await useFetch('/api/alert-templates', {
      method: 'POST',
      body: {
        ...editedTemplate.value,
        _id: undefined,
      }
    })
    if (!createdTemplate.value) {
      return
    }
    await props.refresh()
    // @ts-ignore
    selectedTemplateId.value = createdTemplate.value._id
  }
}
const handleDelete = async () => {
  await useFetch(`/api/alert-templates/${editedTemplate.value._id}`, {
    method: 'DELETE',
  })
  await props.refresh()
  selectedTemplateId.value = props.templates[0]._id
}
</script>

<style scoped>
</style>