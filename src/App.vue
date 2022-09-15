<script setup lang="ts">
import { reactive, watch, ref, toRaw } from "vue";
import uniqid from "uniqid";
import IconAccountBox from "~icons/mdi/account-box";
import IconCheckboxBlankOutline from "~icons/mdi/checkbox-blank-outline";
import IconCheckboxMarked from "~icons/mdi/checkbox-marked";
import IconTrashCan from "~icons/mdi/trash-can";
import IconEdit from "~icons/mdi/edit";
import draggable from "vuedraggable";

const STORAGE_KEY = "todont-app-data";

const defaultData: Data = {
  columns: [
    {
      name: "now",
      list: [],
    },
    {
      name: "next",
      list: [],
    },
    {
      name: "later",
      list: [],
    },
  ],
};

const dragging = ref(false);

const data = reactive(defaultData);

if (chrome?.storage) {
  chrome.storage.sync.get([STORAGE_KEY], (data) => {
    if (data[STORAGE_KEY]) {
      data.columns = (data[STORAGE_KEY] as Data).columns;
    }
  });
} else {
  const storedDataStr = localStorage.getItem(STORAGE_KEY);
  if (storedDataStr) {
    data.columns = (JSON.parse(storedDataStr) as Data).columns;
  }
}

watch(data, (newData) => {
  if (chrome?.storage) {
    const raw = toRaw(newData);
    chrome.storage.sync.set({ STORAGE_KEY: raw }, function() {
      console.log("Data is saved", raw);
    });
  } else {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
  }
});

function addItem(e: Event, column: Column) {
  const form = e.target as HTMLFormElement;
  const formData = new FormData(form);
  const description = formData.get("description");

  column.list.push({
    id: uniqid(),
    description: description as string,
    state: "new",
  });

  form.reset();
}

function deleteItem(e: Event, column: Column, itemId: string) {
  column.list = column.list.filter((item) => item.id !== itemId);
}

function editItem(e: Event, column: Column, item: List) {
  const form = e.target as HTMLFormElement;
  const formData = new FormData(form);
  const updatedDescription = formData.get("description");

  column.list = column.list.map((item) => {
    if (item.id === item.id) {
      item.description = updatedDescription as string;
    }
    return item;
  });

  item.editing = false
}

interface Data {
  columns: Column[];
}

interface Column {
  name: string;
  list: List[];
}

interface List {
  id: string;
  description: string;
  state: "new" | "done";
  editing?: boolean;
}
</script>

<template>
  <ul class="flex flex-row justify-center space-x-6 pt-10">
    <li
      v-for="column of data.columns"
      :key="column.name"
      class="rounded-md shadow-md bg-slate-100 py-4 px-4 w-1/4 space-y-4"
    >
      <p class="mb-3">{{ column.name }}</p>
      <draggable
        v-model="column.list"
        group="items"
        item-key="id"
        class="space-y-4"
        ghost-class="ghost"
        @start="dragging = true"
        @end="dragging = false"
        :class="{
          'min-h-[40px] bg-slate-200 rounded-md': dragging,
        }"
      >
        <template #item="{ element: item }">
          <div
            class="group rounded-md bg-slate-50 py-2 px-3 shadow-md flex flex-row space-x-2 items-center relative cursor-pointer"
          >
            <template v-if="item.editing">
              <form
                @submit.prevent="editItem($event, column, item)"
                class="w-full flex flex-col items-end"
              >
                <input
                  type="text"
                  :defaultValue="item.description"
                  name="description"
                  class="w-full px-3 py-2 rounded-md mb-2 bg-white outline-black border-gray-600 border"
                />

                <section class="flex">
                  <button class="mx-2">Update</button>
                  <button type="button" @click="item.editing = false" class="text-xs">Cancel</button>
                </section>
              </form>
            </template>

            <template v-else>
              <div
                class="hidden absolute bottom-0 right-0 p-3 bg-slate-50 opacity-90 max-h-full space-x-3 flex-row group-hover:flex"
              >
                <button @click="item.editing = true">
                  <IconEdit />
                </button>

                <button @click="deleteItem($event, column, item.id)">
                  <IconTrashCan class="text-red-500" />
                </button>
              </div>

              <button
                class="mt-[2px]"
                @click="item.state = item.state === 'done' ? 'new' : 'done'"
              >
                <IconCheckboxBlankOutline v-if="item.state !== 'done'" />
                <IconCheckboxMarked v-else />
              </button>

              <span
                class="inline-block break-words min-w-0"
                :class="{
                  'line-through': item.state === 'done',
                }"
                >{{ item.description }}</span
              >
            </template>
          </div>
        </template>
      </draggable>
      <form
        @submit.prevent="addItem($event, column)"
        class="flex flex-col items-end"
      >
        <input
          type="text"
          name="description"
          class="w-full px-3 py-2 rounded-md mb-2 bg-white outline-black border-gray-600 border"
        />
        <button>Add</button>
      </form>
    </li>
  </ul>
</template>

<style scoped>
.ghost {
  @apply bg-slate-400 opacity-30;
}
</style>
