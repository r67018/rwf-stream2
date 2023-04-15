<template>
  <div>
    <h3>{{ title }}</h3>
    <v-btn color="primary">
      編集
      <dialog-edit
        :title="title"
        :handle-submit="handleSubmit"
        :handle-cancel="handleCancel"
      >
        <slot></slot>
      </dialog-edit>
    </v-btn>
  </div>
</template>

<script setup lang="ts">
import DialogEdit from '~/components/utils/DialogEdit.vue'

const props = defineProps<{
  title: string
  handleSubmit: () => Promise<boolean>
  handleCancel?: () => void
}>()
</script>

<style scoped>
</style>