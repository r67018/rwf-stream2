<template>
  <v-dialog
    v-model="display"
    activator="parent"
    max-width="50%"
    persistent
  >
    <v-card>
      <v-card-title class="text-center">
        {{ title }}
      </v-card-title>
      <v-card-text>
        <slot></slot>
      </v-card-text>
      <v-card-actions class="d-flex justify-space-around">
        <v-btn
          color="primary"
          @click="cancel"
          width="5rem"
        >
          キャンセル
        </v-btn>
        <v-btn
          color="primary"
          @click="submit"
          width="5rem"
        >
          更新
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
const props = defineProps<{
  title: string
  handleSubmit: () => Promise<boolean> // true: success, false: failure
  handleCancel?: () => void
}>()

const display = ref(false)

const submit = async () => {
  const res = await props.handleSubmit()
  if (res) {
    display.value = false
  }
}
const cancel = () => {
  if (props.handleCancel) {
    props.handleCancel()
  }
  display.value = false
}
</script>

<style scoped>
</style>