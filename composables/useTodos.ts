import { generateClient } from 'aws-amplify/api'
import { listTodos } from '~/src/graphql/queries'
import { createTodo, deleteTodo, updateTodo } from '~/src/graphql/mutations'
import type {
  Todo,
  CreateTodoInput,
  DeleteTodoInput,
  ListTodosQuery,
  CreateTodoMutation,
  DeleteTodoMutation,
  UpdateTodoInput,
  UpdateTodoMutation
} from '~/src/API'
import type { GraphQLResult } from '@aws-amplify/api'
import { getErrorMessage } from '~/helper/getErrorMessage'

const client = generateClient()


export function useTodos() {
  const todos = ref<Todo[]>([])
  const loading = ref(false)
  const error = ref<unknown>(null)

  const fetchTodos = async () => {
    loading.value = true
    error.value = null
    try {
      const res = await client.graphql<GraphQLResult<ListTodosQuery>>({
        query: listTodos,
        variables: {} 
      }) as GraphQLResult<ListTodosQuery>

      todos.value = res.data?.listTodos?.items ?? []
      console.log('Fetched todos:', todos.value)
    } catch (err) {
      if (err instanceof Error) {
        error.value = err.message
      } else {
        error.value = String(err)
      }
    } finally {
      loading.value = false
    }
  }

  const addTodo = async (input: CreateTodoInput) => {
    try {
      loading.value = true
      error.value = null
  
      const res = await client.graphql<GraphQLResult<CreateTodoMutation>>({
        query: createTodo,
        variables: { input },
      }) as GraphQLResult<CreateTodoMutation>
  
      const newTodo = res.data?.createTodo
      console.log('long check 1', newTodo)
      if (newTodo) {
        todos.value.push(newTodo)
      } else {
        console.warn('No todo returned from API')
      }
  
    } catch (err) {
      console.log('Failed to add todo:', err)
      error.value = err instanceof Error ? err.message : String(err)
    } finally {
      loading.value = false
    }
  }

  const updateTodoItem = async (input: UpdateTodoInput): Promise<Todo> => {
    try {
      loading.value = true
      error.value = null
  
      const res = await client.graphql<GraphQLResult<UpdateTodoMutation>>({
        query: updateTodo,
        variables: { input },
      }) as GraphQLResult<UpdateTodoMutation>
  
      const updatedTodo = res.data?.updateTodo
      if (!updatedTodo) {
        throw new Error('No todo returned from API')
      }
  
      return updatedTodo
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err)
      error.value = errorMessage
      console.error('Failed to update todo:', err)
      throw new Error(errorMessage)
    } finally {
      loading.value = false
    }
  }

  const removeTodo = async (input: DeleteTodoInput) => {
    const res = await client.graphql<GraphQLResult<DeleteTodoMutation>>({
      query: deleteTodo,
      variables: { input },
    }) as GraphQLResult<DeleteTodoMutation>
    const deleted = res.data?.deleteTodo
    if (deleted) {
      todos.value = todos.value.filter((todo:Todo)  => todo.id !== deleted.id)
      // return todos.value
    }
  }

  return {
    todos,
    loading,
    error,
    fetchTodos,
    addTodo,
    removeTodo,
    updateTodoItem
  }
}
