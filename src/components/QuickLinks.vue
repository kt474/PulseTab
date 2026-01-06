<script setup lang="ts">
import { ref } from "vue";
import { useLocalStorage } from "../composables/useLocalStorage";

interface QuickLink {
  id: string;
  url: string;
  title: string;
}

const showAddModal = ref(false);
const newLinkUrl = ref("");
const newLinkTitle = ref("");
const links = useLocalStorage<QuickLink[]>("quickLinks", []);

function getFavicon(url: string) {
  try {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
  } catch {
    return "";
  }
}

function addLink() {
  if (!newLinkUrl.value) return;

  let url = newLinkUrl.value;
  if (!url.startsWith("http")) {
    url = "https://" + url;
  }

  links.value.push({
    id: Date.now().toString(),
    url,
    title: newLinkTitle.value || new URL(url).hostname,
  });

  newLinkUrl.value = "";
  newLinkTitle.value = "";
  showAddModal.value = false;
}

function removeLink(id: string) {
  links.value = links.value.filter((l) => l.id !== id);
}
</script>

<template>
  <div class="flex gap-4 items-center">
    <a
      v-for="link in links"
      :key="link.id"
      :href="link.url"
      class="group relative flex flex-col items-center justify-center w-10 h-10 rounded-xl bg-black/20 backdrop-blur-md hover:bg-black/40 transition-all duration-300 hover:scale-105"
    >
      <img
        :src="getFavicon(link.url)"
        class="w-6 h-6 drop-shadow-md rounded-sm"
        alt="icon"
      />
      <span
        class="absolute -bottom-6 text-[10px] text-white/80 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap overflow-hidden text-ellipsis max-w-[120%]"
        >{{ link.title }}</span
      >
      <button
        @click.prevent="removeLink(link.id)"
        class="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full text-white text-xs opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity hover:bg-red-600 cursor-pointer"
      >
        ×
      </button>
    </a>

    <!-- Add Button -->
    <div class="relative">
      <button
        @click="showAddModal = !showAddModal"
        class="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md hover:bg-black/40 text-white hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-105 cursor-pointer"
      >
        <svg
          width="20px"
          height="20px"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M21 9L21 3M21 3H15M21 3L13 11M10 5H7.8C6.11984 5 5.27976 5 4.63803 5.32698C4.07354 5.6146 3.6146 6.07354 3.32698 6.63803C3 7.27976 3 8.11984 3 9.8V16.2C3 17.8802 3 18.7202 3.32698 19.362C3.6146 19.9265 4.07354 20.3854 4.63803 20.673C5.27976 21 6.11984 21 7.8 21H14.2C15.8802 21 16.7202 21 17.362 20.673C17.9265 20.3854 18.3854 19.9265 18.673 19.362C19 18.7202 19 17.8802 19 16.2V14"
            stroke="#fff"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>

      <!-- Add Modal Popover -->
      <div
        v-if="showAddModal"
        class="absolute top-16 right-0 w-64 bg-black/60 backdrop-blur-xl p-4 rounded-2xl shadow-2xl z-50 animate-in fade-in slide-in-from-top-2"
      >
        <h3 class="text-white text-sm font-medium mb-3">Add Shortcut</h3>
        <input
          v-model="newLinkTitle"
          type="text"
          placeholder="Name"
          class="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-white text-sm mb-2 focus:outline-none focus:border-white/30 placeholder:text-white/30"
          @keyup.enter="addLink"
        />
        <input
          v-model="newLinkUrl"
          type="text"
          placeholder="URL"
          ref="urlInput"
          class="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-white text-sm mb-3 focus:outline-none focus:border-white/30 placeholder:text-white/30"
          @keyup.enter="addLink"
        />
        <div class="flex justify-end gap-2">
          <button
            @click="showAddModal = false"
            class="px-3 py-1.5 text-xs text-white/60 hover:text-white transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            @click="addLink"
            class="px-3 py-1.5 text-xs bg-white text-black font-medium rounded-md hover:bg-white/90 transition-colors cursor-pointer"
            :disabled="!newLinkUrl"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
