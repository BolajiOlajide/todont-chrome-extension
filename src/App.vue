<script setup lang="ts">
import { ref, Ref } from "vue";
import uniqid from "uniqid";

const data: Ref<{ columns: Column[] }> = ref({
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

interface Column {
  name: string;
  list: {
    id: string;
    description: string;
    state: 'now' | 'done';
  }[];
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
        class="rounded-md bg-slate-50 py-2 px-3 shadow-md"
        v-for="item in column.list"
        :key="item.id"
      >
        {{ item.description }}
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
