<template>
  <ModalLayout :show="show" title="Impuestos" @close="close">
    <!-- Agregar nuevo impuesto -->
    <details class="bg-white rounded-md mt-2 border border-gray-200">
      <summary
        class="flex items-center justify-between cursor-pointer select-none px-4 py-2 text-sm font-medium text-gray-800 hover:text-indigo-600"
      >
        <span class="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4 text-indigo-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 4v16m8-8H4"
            />
          </svg>
          Agregar nuevo impuesto
        </span>
      </summary>

      <div class="p-4 border-t border-gray-100 flex flex-col gap-3">
        <input
          v-model="nuevoImpuesto.tipo"
          type="text"
          placeholder="Nombre del impuesto"
          class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
        />
        <button
          @click="agregarImpuesto"
          class="bg-indigo-600 text-white text-sm px-4 py-2 rounded-md hover:bg-indigo-700 w-fit"
        >
          Guardar
        </button>
      </div>
    </details>

    <!-- Tabla -->
    <TableLayout
      title="Listado de Impuestos"
      :data="impuestos"
      :columns="impuestoColumns"
      :centerColumns="true"
      :showReport="false"
    >
      <!--<template #actions="{ row }">
        <div class="flex gap-2 justify-center">
          <button
            @click="editarImpuesto(row)"
            class="text-indigo-600 hover:text-indigo-800"
          >
            ✏️
          </button>
          <button
            @click="eliminarImpuesto(row.id)"
            class="text-red-600 hover:text-red-800"
          >
            🗑️
          </button>
        </div>
      </template>-->
    </TableLayout>
  </ModalLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import ModalLayout from "@/components/common/ModalLayout.vue";
import TableLayout from "@/components/common/TableLayout.vue";
import { useImpuestos } from "@/composables/useImpuestos";
import type { Impuesto } from "@/types/impuesto";
import type { TableColumn } from "@/types/table";

const { show } = defineProps<{ show: boolean }>();
const emit = defineEmits(["close"]);

const close = () => emit("close");

// store/composable
const {
  impuestos,
  fetchTImpuesto,
  crearTImpuesto,
  // updateImpuesto,
  // deleteImpuesto,
} = useImpuestos();

// inicialización
onMounted(fetchTImpuesto);

// columnas de la tabla
const impuestoColumns: TableColumn<Impuesto>[] = [
  { key: "tipo", label: "Tipo" },
];

// nuevo impuesto
const nuevoImpuesto = ref({ tipo: "" });

const agregarImpuesto = async () => {
  if (!nuevoImpuesto.value.tipo.trim()) return;
  await crearTImpuesto(nuevoImpuesto.value.tipo);
  nuevoImpuesto.value.tipo = "";
};

// editar
{
  /* const editarImpuesto = async (row: Impuesto) => {
  const nuevo = prompt("Editar tipo de impuesto:", row.tipo);
  if (nuevo && nuevo !== row.tipo) {
    await updateImpuesto(row.id, { tipo: nuevo });
  }
};

// eliminar
const eliminarImpuesto = async (id: number) => {
  if (confirm("¿Seguro que deseas eliminar este impuesto?")) {
    await deleteImpuesto(id);
  }
}; */
}
</script>
