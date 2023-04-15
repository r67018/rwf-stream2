<template>
  <v-form @submit.prevent>
    <h3>{{ title }}</h3>
    <slot></slot>
    <div class="d-flex">
      <v-btn
        type="submit"
        @click="handleSubmit"
        color="primary"
      >
        {{ btnText }}
      </v-btn>
      <slot name="btn"></slot>
    </div>
  </v-form>
</template>

<script setup lang="ts">
defineProps({
  title: {
    type: String,
    default: ''
  },
  btnText: {
    type: String,
    default: '更新'
  },
  handleSubmit: {
    type: Function,
    required: true
  },
})
</script>
<style scoped>
</style>