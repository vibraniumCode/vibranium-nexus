<template>
  <div class="w-full flex flex-col">
    <div class="flex-1 bg-gray-200 p-2">
      <!-- Header -->
      <div class="flex items-center justify-between mb-4 mt-2">
        <h1
          class="text-3xl font-semibold text-gray-900 border-l-4 border-indigo-600 pl-3"
        >
          Empresa <span class="text-sm text-gray-500 ml-2">Estaciones</span>
        </h1>
        <button
          @click="$emit('add-new')"
          class="inline-flex items-center px-4 py-2 bg-neutral-800 text-white text-sm font-medium rounded-sm hover:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
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

          <span class="ml-4 hover:text-indigo-200">
            <router-link to="/empresas/crear">
              Agregar nueva estacion
            </router-link>
          </span>
        </button>
      </div>

      <!-- Dashboard Card -->
      <div class="h-full w-full mb-6 bg-white p-6 font-sans">
        <div class="flex justify-between">
          <div
            class="flexw-[50%] max-w-md flex-col w-full justify-between rounded-sm bg-neutral-800 p-8 text-white ring-1 ring-slate-300 xl:p-4"
          >
            <div>
              <div class="flex items-center justify-between mb-6">
                <p class="mt-2 font-semibold text-white dark:text-gray-400">
                  Total Estaciones
                </p>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#ffffff"
                >
                  <path
                    d="M400-106v-228l56-160q5-11 14.5-18.5T494-520h292q14 0 24 7.5t14 18.5l56 160v228q0 11-7.5 18.5T854-80h-28q-11 0-18.5-7.5T800-106v-34H480v34q0 11-7.5 18.5T454-80h-28q-11 0-18.5-7.5T400-106Zm80-274h320l-28-80H508l-28 80Zm-20 60v120-120Zm60 100q17 0 28.5-11.5T560-260q0-17-11.5-28.5T520-300q-17 0-28.5 11.5T480-260q0 17 11.5 28.5T520-220Zm240 0q17 0 28.5-11.5T800-260q0-17-11.5-28.5T760-300q-17 0-28.5 11.5T720-260q0 17 11.5 28.5T760-220ZM240-400v-80h80v80h-80Zm200-240v-80h80v80h-80ZM240-240v-80h80v80h-80Zm0 160v-80h80v80h-80ZM80-80v-560h200v-240h400v280h-80v-200H360v240H160v480H80Zm380-120h360v-120H460v120Z"
                  />
                </svg>
              </div>
              <p class="flex items-baseline gap-x-1">
                <span class="text-6xl font-bold tracking-tight">
                  {{ empresas.length }}
                </span>
              </p>
            </div>
          </div>
          <div class="flex items-end gap-4">
            <button
              @click="openCombustibleModal"
              class="inline-flex items-center px-4 py-2 bg-neutral-800 text-white text-sm font-medium rounded-sm hover:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#e3e3e3"
              >
                <path
                  d="M160-120v-640q0-33 23.5-56.5T240-840h240q33 0 56.5 23.5T560-760v280h40q33 0 56.5 23.5T680-400v180q0 17 11.5 28.5T720-180q17 0 28.5-11.5T760-220v-288q-9 5-19 6.5t-21 1.5q-42 0-71-29t-29-71q0-32 17.5-57.5T684-694l-84-84 42-42 148 144q15 15 22.5 35t7.5 41v380q0 42-29 71t-71 29q-42 0-71-29t-29-71v-200h-60v300H160Zm80-440h240v-200H240v200Zm480 0q17 0 28.5-11.5T760-600q0-17-11.5-28.5T720-640q-17 0-28.5 11.5T680-600q0 17 11.5 28.5T720-560ZM240-200h240v-280H240v280Zm240 0H240h240Z"
                />
              </svg>
              <span class="ml-4">Combustible</span>
            </button>
            <button
              @click="openImpuestosModal"
              class="inline-flex items-center px-4 py-2 bg-neutral-800 text-white text-sm font-medium rounded-sm hover:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#e3e3e3"
              >
                <path
                  d="M200-280v-280h80v280h-80Zm240 0v-280h80v280h-80ZM80-120v-80h800v80H80Zm600-160v-280h80v280h-80ZM80-640v-80l400-200 400 200v80H80Zm178-80h444-444Zm0 0h444L480-830 258-720Z"
                />
              </svg>
              <span class="ml-4">Impuestos</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Table -->
      <TableLayout
        title="Empresas"
        :data="empresas"
        :columns="empresaColumns"
        :centerColumns="true"
        :showActions="true"
        :showReport="true"
        v-model:expandedRow="expandedRow"
        :actionConfig="{
          showDetail: true,
          showEdit: true,
          showDelete: true,
          editLabel: 'Editar Empresa',
        }"
        @delete="handleDelete"
        @toggle-expand="handleToggleExpand"
        @detail="(_, rowData) => handleDetail(rowData)"
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
              title="Editar Empresa"
              subtitle="Modifica los datos de la empresa"
              :fields="empresaFormFields"
              :initialData="data[expandedRow]"
              @submit="(formData) => handleUpdate(formData, expandedRow)"
              @cancel="closeExpandedForm"
            />
          </Transition>
        </template>
      </TableLayout>

      <!-- Detalle-->
      <Transition
        enter-active-class="transition duration-300"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition duration-200"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
      >
        <EmpresaDetails
          v-if="showDetalle && detalleId"
          :id="detalleId"
          @close="closeDetalle"
        />
      </Transition>

      <!-- Modals -->
      <Transition
        enter-active-class="transition duration-300"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition duration-200"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
      >
        <ModalCombustible
          v-if="showCombustibleModal"
          :show="showCombustibleModal"
          @close="closeCombustibleModal"
        />
      </Transition>
      <ModalImpuestos
        v-if="showImpuestosModal"
        :show="showImpuestosModal"
        @close="closeImpuestosModal"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import TableLayout from "@/components/common/TableLayout.vue";
import ModalCombustible from "@/components/Combustibles/ModalCombustible.vue";
import ModalImpuestos from "@/components/Impuestos/ModalImpuestos.vue";
import Form from "@/components/common/Form.vue";
import { useEmpresas } from "@/composables/useEmpresas";
import { useEmpresaHandlers } from "@/composables/useEmpresaHandlers";
import { empresaColumns, empresaFormFields } from "@/constants/empresaConfig";
//import DetalleImpuesto from "@/components/DetalleImpuesto.vue";
import EmpresaDetails from "./EmpresaDetails.vue";

// 🔹 Estado del Detalle
const showDetalle = ref(false);
const detalleId = ref<number | null>(null);
const detalleNombre = ref<string>("");

// 🔹 Abrir detalle
const handleDetail = (rowData: any) => {
  expandedRow.value = null; // cerrar form si estaba abierto
  showCombustibleModal.value = false;
  showImpuestosModal.value = false;

  detalleId.value = rowData.id; // o el campo que tenga el ID de la empresa
  detalleNombre.value = rowData.nombre; // o el campo con el nombre
  showDetalle.value = true;
};

// 🔹 Cerrar detalle
const closeDetalle = () => {
  showDetalle.value = false;
  detalleId.value = null;
};

// Composables
const { empresas, fetchEmpresas } = useEmpresas();
const { handleEmpresaUpdate, handleEmpresaDelete } = useEmpresaHandlers();

// State
const showCombustibleModal = ref(false);
const showImpuestosModal = ref(false);
const expandedRow = ref<number | null>(null);

// 🔧 Funciones toggle (abren o cierran el modal)
const openCombustibleModal = () => {
  expandedRow.value = null;
  showImpuestosModal.value = false;
  showCombustibleModal.value = true;
};
const closeCombustibleModal = () => {
  showCombustibleModal.value = false;
};

const openImpuestosModal = () => {
  expandedRow.value = null;
  showCombustibleModal.value = false;
  showImpuestosModal.value = true;
};
const closeImpuestosModal = () => {
  showImpuestosModal.value = false;
};

const closeExpandedForm = () => {
  expandedRow.value = null;
};

const handleToggleExpand = (index: number | null) => {
  expandedRow.value = index;
};

const handleUpdate = async (formData: any, index: number) => {
  const success = await handleEmpresaUpdate(formData, index, empresas.value);
  if (success) expandedRow.value = null;
};

const handleDelete = async (index: number, rowData: any) => {
  expandedRow.value = null;

  const success = await handleEmpresaDelete(index, empresas.value);
  if (success) {
    await fetchEmpresas("CTA"); // 🔁 refresca la lista visible
  }
};

// Lifecycle
onMounted(async () => {
  await fetchEmpresas("CTA");
});
</script>
