import { ref, watch, type Ref } from "vue";

const store: Record<string, Ref<any>> = {};

export function useLocalStorage<T>(key: string, defaultValue: T): Ref<T> {
  if (store[key]) {
    return store[key];
  }

  const stored = localStorage.getItem(key);
  const data = ref<T>(stored ? JSON.parse(stored) : defaultValue) as Ref<T>;

  watch(
    data,
    (newValue) => {
      localStorage.setItem(key, JSON.stringify(newValue));
    },
    { deep: true }
  );

  // Listen for changes from other tabs/windows
  window.addEventListener("storage", (event) => {
    if (event.key === key && event.newValue) {
      data.value = JSON.parse(event.newValue);
    }
  });

  store[key] = data;
  return data;
}
