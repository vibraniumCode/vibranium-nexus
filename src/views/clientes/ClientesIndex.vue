<template>
  <div class="w-full flex flex-col">
    <div class="flex-1 bg-gray-200 p-2">
      <div class="flex items-center justify-between mb-4 mt-2">
        <h1
          class="text-3xl font-semibold text-gray-900 border-l-4 border-indigo-600 pl-3"
        >
          Clientes
        </h1>
      </div>
      <!-- Dashboard Card -->
      <div class="h-full w-full mb-6 bg-white p-6 font-sans rounded-lg">
        <div class="flex justify-between">
          <div
            class="flexw-[50%] max-w-md flex-col w-full justify-between rounded-sm ring-1 bg-neutral-800 text-white ring-slate-300/20 xl:p-4"
          >
            <div>
              <div class="flex items-center justify-between mb-6">
                <p class="mt-2 font-semibold text-white">Total Clientes</p>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#ffffff"
                >
                  <path
                    d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm246-164q-59 0-99.5-40.5T340-580q0-59 40.5-99.5T480-720q59 0 99.5 40.5T620-580q0 59-40.5 99.5T480-440Zm0 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q53 0 100-15.5t86-44.5q-39-29-86-44.5T480-280q-53 0-100 15.5T294-220q39 29 86 44.5T480-160Zm0-360q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm0-60Zm0 360Z"
                  />
                </svg>
              </div>
              <p class="flex items-baseline gap-x-1">
                <span class="text-6xl font-bold tracking-tight">
                  {{ clientes.length }}
                </span>
              </p>
            </div>
          </div>
          <div class="flex items-end gap-4">
            <button
              @click="$emit('add-new')"
              class="inline-flex items-center px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            >
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>

              <span class="ml-4">
                <router-link to="/clientes/crear">
                  Agregar nuevo cliente
                </router-link>
              </span>
            </button>
          </div>
        </div>
      </div>
      <!-- Table -->
      <TableLayout
        title="Clientes"
        :data="clientes"
        :columns="clienteColumns"
        :centerColumns="true"
        :showActions="true"
        :showReport="true"
        v-model:expandedRow="expandedRow"
        :actionConfig="{
          showDetail: false,
          showEdit: true,
          showDelete: true,
          editLabel: 'Editar Cliente',
        }"
        @delete="handleDelete"
        @toggle-expand="handleToggleExpand"
      >
        <template #expanded-content="{ expandedRow, data }">
          <Transition
            enter-active-class="transition duration-300"
            enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100"
            leave-active-class="transition duration-200"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-95"
          >
            <Form
              v-if="typeof expandedRow === 'number' && expandedRow !== null"
              title="Editar Cliente"
              subtitle="Modifica los datos del cliente"
              :fields="clienteFormFields"
              :initialData="data[expandedRow]"
              @submit="(formData) => handleUpdate(formData, expandedRow)"
              @cancel="closeExpandedForm"
            />
          </Transition>
        </template>
      </TableLayout>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import TableLayout from "@/components/common/TableLayout.vue";
import Form from "@/components/common/Form.vue";
import { useClientes } from "@/composables/useClientes";
import { useClienteHandlers } from "@/composables/useClienteHandlers";
import { clienteColumns, clienteFormFields } from "@/constants/clienteConfig";

// Composables
const { clientes, fetchClientes } = useClientes();
const { handleClienteUpdate, handleClienteDelete } = useClienteHandlers();

// State
const expandedRow = ref<number | null>(null);

const closeExpandedForm = () => {
  expandedRow.value = null;
};

const handleToggleExpand = (index: number | null) => {
  expandedRow.value = index;
};

const handleUpdate = async (formData: any, index: number) => {
  const success = await handleClienteUpdate(formData, index, clientes.value);
  if (success) expandedRow.value = null;
};

const handleDelete = async (index: number, rowData: any) => {
  expandedRow.value = null;

  const success = await handleClienteDelete(index, clientes.value);
  if (success) {
    await fetchClientes("CTA"); // 🔁 refresca la lista visible
  }
};

// Lifecycle
onMounted(async () => {
  await fetchClientes("CTA");
});
</script>
