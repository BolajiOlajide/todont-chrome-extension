<script setup lang="ts">
import { reactive, watch } from "vue";
import uniqid from "uniqid";
import IconAccountBox from "~icons/mdi/account-box";
import IconCheckboxBlankOutline from "~icons/mdi/checkbox-blank-outline";
import IconCheckboxMarked from "~icons/mdi/checkbox-marked";

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

const storedDataStr = localStorage.getItem(STORAGE_KEY);
const storedData = (
  storedDataStr ? JSON.parse(storedDataStr) : defaultData
) as Data;

const data = reactive(storedData);

watch(data, (newData) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
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
}
</script>

<template>
  <ul class="flex flex-row justify-center space-x-6 pt-10">
    <li
      v-for="column of data.columns"
      :key="column.name"
      class="rounded-md shadow-md bg-slate-100 py-4 px-4 w-1/4 space-y-4"
    >
      <p>{{ column.name }}</p>
      <div
        class="rounded-md bg-slate-50 py-2 px-3 shadow-md flex flex-row space-x-2 items-center"
        v-for="item in column.list"
        :key="item.id"
      >
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
      </div>
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

<style scoped></style>
