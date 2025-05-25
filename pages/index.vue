<script setup lang="ts">
import { object, string, type InferType } from 'yup'
import type { FormSubmitEvent } from '@nuxt/ui'
import TodoItem from '@/components/TodoItem.vue';
import { onMounted } from 'vue'
import { v4 as uuidv4 } from 'uuid';

import { useTodos } from '~/composables/useTodos' 

const { todos, loading, fetchTodos, addTodo, updateTodoItem, removeTodo } = useTodos()
const toast = useToast()

onMounted(() => {
  fetchTodos()
})

console.log(todos.value)

const schema = object({
  name: string().required('入力してください。'),
  description: string().required('入力してください。'),
})

type Schema = InferType<typeof schema>


const state = reactive({
  name: '',
  description: '',
})

const handleAddTodo = async (event: FormSubmitEvent<Schema>) => {
  try {
    const newTodo = {
      id: uuidv4(), 
      name: state.name, 
      description: state.description,
      isCompleted: false,
    }
    
    await addTodo(newTodo)
    
    // Reset form
    state.name = ''
    state.description = ''
    
    toast.add({ 
      title: 'Success', 
      description: 'Todo added successfully!', 
      color: 'success' 
    })
  } catch (err) {
    console.error('Add todo failed:', err)
    toast.add({ 
      title: 'Error', 
      description: (err as Error).message || 'Failed to add todo', 
      color: 'error' 
    })
  }
}

const updateTodoCompleted = async (id: string, isCompleted: boolean) => {
  const todo = todos.value.find(t => t.id === id)
  if (!todo) return

  const originalState = todo.isCompleted
  const updatedTodoInfo = { id, isCompleted }

  await updateTodoItem(updatedTodoInfo).then((result) => {
    todo.isCompleted = result.isCompleted
    toast.add({ 
      title: 'Success', 
      description: `Todo ${isCompleted ? 'completed' : 'uncompleted'} successfully!`, 
      color: 'success' 
    })
  }).catch((err) => {
    console.log('Update todo failed:', err)
    todo.isCompleted = originalState 
    toast.add({ 
      title: 'Error', 
      description: (err as Error).message || 'Failed to update todo', 
      color: 'error' 
    })
  })

}

const handleDeleteTodo = async (id: string) => {
    await removeTodo({id})
    .then(() => {
      toast.add({ 
      title: 'Success', 
      description: 'Todo deleted successfully!', 
      color: 'success' 
    })
    }).catch((err) => {
    console.error('Delete todo failed:', err)
      toast.add({ 
        title: 'Error', 
        description: (err as Error).message || 'Failed to delete todo', 
        color: 'error',
      })
    });
}


</script>

<template>
  <UContainer class="mt-8">
    <UCard>
      <template #header>
        <h1 class="text-xl font-bold">Todo App</h1>
      </template>
  
      <!-- Form should always be visible -->
      <UForm :schema="schema" :state="state" class=" space-y-4 mb-6" @submit="handleAddTodo">
        <UFormField label="Name" name="name"  required>
          <UInput v-model="state.name" class="w-full" placeholder=""/>
        </UFormField>
        <UFormField type="textarea" label="Description" name="description" required>
          <UTextarea v-model="state.description" class="w-full" />
        </UFormField>
        <UButton class="cursor-pointer" trailing-icon="i-lucide-plus" type="submit">Add</UButton>
      </UForm>
      <hr class="my-12 h-0.5 border-t-0 bg-neutral-100 dark:bg-white/10" />
  
      <!-- Then show todos or loading/empty states -->
      <template v-if="loading">
        <div class="text-gray-500">ローディング...</div>
        <div class="grid gap-2">
          <USkeleton class="h-6 w-[250px]" />
          <USkeleton class="h-6 w-[200px]" />
        </div>
      </template>
  
      <!-- Empty State -->
      <template v-else-if="todos.length === 0">
        <div class="text-center py-8 text-gray-500">
          <div class="text-lg mb-2">📝</div>
          <div>データがありません。</div>
          <div class="text-sm">上のフォームからTodoを追加してください。</div>
        </div>
      </template>
  
      <template v-else>
        <div class="space-y-2">
          <TodoItem 
            v-for="todo in todos" 
            :key="todo.id" 
            :todo="todo" 
            @toggle-completed="updateTodoCompleted"
            @delete-todo="handleDeleteTodo"
            />
        </div>

        <!-- Summary -->
        <div class="mt-4 pt-4 border-t text-sm text-gray-500">
          Total: {{ todos.length }} | 
          Completed: {{ todos.filter(t => t.isCompleted).length }} | 
          Remaining: {{ todos.filter(t => !t.isCompleted).length }}
        </div>
      </template>
    </UCard>
  </UContainer>
  </template>
<style>
  
</style>