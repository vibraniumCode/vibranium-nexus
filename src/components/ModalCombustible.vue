<template>
  <div v-if="show" class="fixed inset-0 flex items-center justify-center">
    <!-- Backdrop con blur -->
    <div
      class="absolute inset-0 bg-opacity-40 backdrop-blur-xs"
      @click="close"
    ></div>

    <!-- Modal content -->
    <div class="bg-white p-6 rounded-lg shadow-lg w-auto relative z-10">
      <!-- Encabezado -->
      <div class="flex justify-between items-center border-b pb-2 mb-4">
        <h2 class="text-lg font-bold">Combustibles</h2>
        <!-- Footer -->
        <div class="flex justify-end">
          <button
            @click="close"
            class="px-4 py-2 bg-neutral-800 text-white rounded hover:bg-neutral-600"
          >
            X
          </button>
        </div>
      </div>

      <!-- Contenido dinámico -->
      <TableLayout
        :title="'Listado de Combustibles'"
        :data="combustibles"
        :columns="combustibleColumns"
        :centerColumns="true"
        :showActions="true"
        :showReport="false"
        :actionConfig="{
          showDetail: false,
          showEdit: true,
          showDelete: false,
          editLabel: 'Actualizar',
        }"
        @edit-row="handleUpdate"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref, onMounted } from "vue";
import TableLayout from "@/components/common/TableLayout.vue";
import { useCombustibles } from "@/composables/useCombustible";
import type { Combustible } from "@/types/combustible";
import type { TableColumn } from "@/types/table";

const { combustibles, fetchCombustible } = useCombustibles();
const props = defineProps<{ show: boolean }>();
const emit = defineEmits(["close"]);

const close = () => {
  emit("close");
};

// Función para manejar la actualización
const handleUpdate = (rowIndex: number) => {
  const combustible = combustibles.value[rowIndex];
  console.log("Actualizando combustible:", combustible);
  // Aquí puedes implementar la lógica para actualizar el combustible
  // Por ejemplo, abrir otro modal de edición, navegar a otra página, etc.
};

onMounted(() => {
  fetchCombustible();
});

// definís qué columnas mostrar y con qué nombre
const combustibleColumns: TableColumn<Combustible>[] = [
  { key: "tipo", label: "tipo" },
  { key: "precio", label: "precio" },
];
</script>
