<template>
  <UContainer class="flex items-center p-2 gap-2 hover:bg-green-100 hover:text-emerald-950 rounded-md justify-between">
    <div class="flex gap-2 items-center">
      <UCheckbox  :model-value="todo.isCompleted" 
      @click="handleToggle"
      />
      <span :class="{ 'line-through text-gray-400': todo.isCompleted }">{{ todo.name }} - {{ todo.description }}</span>
    </div>
    <UButton color="neutral" class="ml-2 cursor-pointer" @click="handleDelete">Delete</UButton>
  </UContainer>
</template>
<script setup lang="ts">
import type { Todo } from '~/src/API';


const props = defineProps<{
  todo: Todo;
}>()

const emit = defineEmits<{
  (e: 'toggle-completed', id: string, isCompleted: boolean): void
  (e: 'delete-todo', id: string): void;
}>()

const handleToggle = () => {
  emit('toggle-completed', props.todo.id, !props.todo.isCompleted)
}
const handleDelete = () => {
  emit('delete-todo', props.todo.id)
}

</script>
<style lang="">
  
</style>