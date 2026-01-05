<script setup lang="ts">
import { ref, computed } from "vue";
import { useLocalStorage } from "../composables/useLocalStorage";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

const isOpen = ref(false);
const newTodo = ref("");
const todos = useLocalStorage<Todo[]>("todos", []);

const pendingCount = computed(
  () => todos.value.filter((t) => !t.completed).length
);

function addTodo() {
  if (!newTodo.value.trim()) return;

  todos.value.push({
    id: Date.now(),
    text: newTodo.value.trim(),
    completed: false,
  });
  newTodo.value = "";
}

function toggleTodo(id: number) {
  const todo = todos.value.find((t) => t.id === id);
  if (todo) {
    todo.completed = !todo.completed;
  }
}

function deleteTodo(id: number) {
  const index = todos.value.findIndex((t) => t.id === id);
  if (index > -1) {
    todos.value.splice(index, 1);
  }
}
</script>

<template>
  <div class="relative">
    <!-- Toggle Button -->
    <button
      class="relative w-12 h-12 rounded-full bg-black/30 backdrop-blur-lg border-none text-white cursor-pointer flex items-center justify-center transition-all duration-200 hover:bg-black/50 hover:scale-105"
      @click="isOpen = !isOpen"
    >
      <span class="text-xl">✓</span>
      <span
        v-if="pendingCount > 0"
        class="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-semibold w-5 h-5 rounded-full flex items-center justify-center"
      >
        {{ pendingCount }}
      </span>
    </button>

    <!-- Todo Panel -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      leave-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-2"
      leave-to-class="opacity-0 translate-y-2"
    >
      <div
        v-if="isOpen"
        class="absolute bottom-16 right-0 w-80 max-h-96 bg-black/60 backdrop-blur-xl rounded-2xl p-5 overflow-y-auto"
      >
        <h3 class="text-lg font-semibold text-white mb-4 font-inter">To-Do</h3>

        <!-- Add Todo Form -->
        <form @submit.prevent="addTodo" class="flex gap-2 mb-4">
          <input
            v-model="newTodo"
            type="text"
            placeholder="Add a task..."
            class="flex-1 px-3 py-2.5 border-none rounded-lg bg-white/10 text-white text-sm font-inter placeholder:text-white/50 focus:outline-none focus:bg-white/15"
          />
          <button
            type="submit"
            class="w-9 h-9 border-none rounded-lg bg-white/20 text-white text-xl cursor-pointer transition-colors hover:bg-white/30"
          >
            +
          </button>
        </form>

        <!-- Todo List -->
        <ul class="list-none p-0 m-0 flex flex-col gap-2">
          <li
            v-for="todo in todos"
            :key="todo.id"
            class="group flex items-center gap-3 p-2 rounded-lg transition-colors hover:bg-white/5"
          >
            <button
              class="w-5 h-5 border-2 rounded-full bg-transparent text-white cursor-pointer flex items-center justify-center text-xs shrink-0 transition-all"
              :class="
                todo.completed
                  ? 'bg-green-400/30 border-green-400'
                  : 'border-white/40 hover:border-white'
              "
              @click="toggleTodo(todo.id)"
            >
              <span v-if="todo.completed">✓</span>
            </button>
            <span
              class="flex-1 text-white text-sm font-inter"
              :class="todo.completed ? 'line-through opacity-50' : ''"
            >
              {{ todo.text }}
            </span>
            <button
              class="w-6 h-6 border-none rounded-full bg-transparent text-white/40 cursor-pointer text-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:text-red-500"
              @click="deleteTodo(todo.id)"
            >
              ×
            </button>
          </li>
        </ul>
      </div>
    </Transition>
  </div>
</template>
