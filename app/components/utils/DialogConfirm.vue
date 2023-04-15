<template>
  <v-dialog
    v-model="display"
    activator="parent"
    persistent
    width="auto"
  >
    <v-card>
      <v-card-text class="text-center">
        {{ message }}
      </v-card-text>
      <v-card-actions class="d-flex justify-space-evenly">
        <v-btn color="blue darken-1" text @click="display = false">キャンセル</v-btn>
        <v-btn color="blue darken-1" text @click="confirm">OK</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
const props = defineProps<{
  message: string
  onConfirm: () => any
}>()

const display = ref(false)

const confirm = async () => {
  await props.onConfirm()
  display.value = false
}
</script>

<style scoped>
</style>