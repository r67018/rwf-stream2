<template>
  <div>
    <base-edit
      :title="title"
      :handle-submit="handleSubmit"
    >
      <v-select
        v-model="edit"
        :items="items"
      ></v-select>
    </base-edit>
  </div>
</template>

<script setup lang="ts">
import BaseEdit from '~/components/admin/BaseEdit.vue'
import { useVModel } from '@vueuse/core'

const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    default: '',
  },
  items: {
    type: Array,
    required: true,
  },
  handleSubmit: {
    type: Function,
    required: true,
  },
})
const emit = defineEmits(['update:modelValue'])

const edit = useVModel(props, 'modelValue', emit)
</script>

<style scoped>

</style>
