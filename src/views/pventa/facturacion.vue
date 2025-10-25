<template>
  <div class="w-full flex flex-col">
    <div class="flex-1 bg-gray-200 p-6">
      <!-- Header -->
      <div class="flex items-center justify-between mb-2">
        <h1 class="text-xl font font-semibold text-gray-500">
          Datos del Ticket
        </h1>
      </div>

      <!-- Dashboard Card -->
      <div class="h-full w-full mb-6 bg-white p-6 font-sans rounded-lg">
        <div class="flex gap-4">
          <Dropdown
            v-model="selectedEmpresa"
            :users="empresas"
            labelKey="nombre"
            valueKey="id"
            @select="handleSelectEmpresa"
            label="Nombre de la Estacion"
          >
            <router-link to="/empresas/crear">
              <div class="flex items-center justify-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="size-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z"
                  />
                </svg>

                Nueva estacion
              </div>
            </router-link>
          </Dropdown>
          <!-- Dropdown Cliente -->
          <Dropdown
            v-model="selectedCliente"
            :users="clientes"
            labelKey="nombre"
            valueKey="id"
            @select="handleSelectCliente"
            label="Nombre del Cliente"
          >
            <router-link to="/clientes/crear">
              <div class="flex items-center justify-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="size-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z"
                  />
                </svg>

                Nuevo cliente
              </div>
            </router-link>
          </Dropdown>
          <!-- Campo de Fecha de Emisión -->
          <div class="flex flex-col">
            <label
              for="fechaEmision"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Fecha de emisión</label
            >
            <input id="fechaEmision" type="date" v-model="fechaEmision"
            class="px-3 py-2 border border-gray-300 rounded-lg text-sm
            text-white dark:bg-neutral-800 dark:border-gray-700
            focus:outline-none focus:ring-2 hover:ring-gray-400"
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue";
import Dropdown from "@/components/common/Dropdown.vue";
import { useEmpresas } from "@/composables/useEmpresas";
import { useClientes } from "@/composables/useClientes";

// Variables reactivas
const selectedEmpresa = ref<any>(null);
const selectedCliente = ref<any>(null);
const fechaEmision = ref<string>("");

// Composables
const { empresas, fetchEmpresas } = useEmpresas();
const { clientes, fetchClientes } = useClientes();

// Cargar empresas al montar
onMounted(() => {
  fetchEmpresas("CTA"); // o la acción que necesites
  fetchClientes("CTA");
});

// Manejar la selección
const handleSelectEmpresa = (empresa: any) => {
  selectedEmpresa.value = empresa;
  console.log("Empresa seleccionada:", empresa);
};

const handleSelectCliente = (cliente: any) => {
  selectedCliente.value = cliente;
  console.log("Cliente seleccionado:", cliente);
};

// Manejar “Agregar nuevo”
const handleAddEmpresa = () => {
  console.log("Agregar nueva empresa");
};
</script>
<style scoped>
input[type="date"]::-webkit-calendar-picker-indicator {
  filter: invert(1);
}
</style>
