<template>
  <div class="w-full flex flex-col">
    <div class="flex-1 bg-gray-200 p-2">
      <!-- Dashboard Card -->
      <div class="h-full w-full mb-6 bg-white p-6 font-sans rounded-lg">
        <div class="flex justify-between">
          <div
            class="flexw-[50%] max-w-md flex-col w-full justify-between rounded-xl bg-slate-50 p-8 text-slate-900 ring-1 ring-slate-300 dark:bg-neutral-800 dark:text-slate-200 dark:ring-slate-300/20 xl:p-4"
          >
            <div>
              <div class="flex items-center justify-between mb-6">
                <p class="mt-2 font-semibold text-gray-500 dark:text-gray-400">
                  Total Clientes
                </p>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#e3e3e3"
                >
                  <path
                    d="M400-106v-228l56-160q5-11 14.5-18.5T494-520h292q14 0 24 7.5t14 18.5l56 160v228q0 11-7.5 18.5T854-80h-28q-11 0-18.5-7.5T800-106v-34H480v34q0 11-7.5 18.5T454-80h-28q-11 0-18.5-7.5T400-106Zm80-274h320l-28-80H508l-28 80Zm-20 60v120-120Zm60 100q17 0 28.5-11.5T560-260q0-17-11.5-28.5T520-300q-17 0-28.5 11.5T480-260q0 17 11.5 28.5T520-220Zm240 0q17 0 28.5-11.5T800-260q0-17-11.5-28.5T760-300q-17 0-28.5 11.5T720-260q0 17 11.5 28.5T760-220ZM240-400v-80h80v80h-80Zm200-240v-80h80v80h-80ZM240-240v-80h80v80h-80Zm0 160v-80h80v80h-80ZM80-80v-560h200v-240h400v280h-80v-200H360v240H160v480H80Zm380-120h360v-120H460v120Z"
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
              class="inline-flex items-center px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
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
