<template>
  <ModalLayout :show="show" title="Combustibles" @close="close">
    <div class="max-h-[70vh] overflow-y-auto pr-1">
      <!-- Agregar nuevo combustible -->
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
            Agregar nuevo combustible
          </span>
        </summary>

        <div class="p-4 border-t border-gray-100 flex flex-col gap-3">
          <input
            v-model="nuevoCombustible.tipo"
            type="text"
            placeholder="Nombre del combustible"
            class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          />
          <button
            @click="agregarCombustible"
            class="bg-indigo-600 text-white text-sm px-4 py-2 rounded-md hover:bg-indigo-700 w-fit"
          >
            Guardar
          </button>
        </div>
      </details>
      <TableLayout
        :title="'Listado de Combustibles'"
        :data="tcombustibles"
        :columns="tcombustibleColumns"
        :centerColumns="true"
        :showActions="true"
        :showReport="false"
        :actionConfig="{
          showDelete: true,
          showEdit: false,
        }"
        @delete="handleDelete"
      >
      </TableLayout>
    </div>
  </ModalLayout>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref, onMounted } from "vue";
import ModalLayout from "@/components/common/ModalLayout.vue";
import TableLayout from "@/components/common/TableLayout.vue";
import { useCombustibles } from "@/composables/useCombustible";
import { tcombustibleColumns } from "@/constants/combustibleConfig";
import Swal from "sweetalert2";
import { useToast } from "vue-toast-notification";

//composables
const {
  tcombustibles,
  fetchTCombustibles,
  crearTCombustible,
  deleteTCombustible,
} = useCombustibles();

const props = defineProps<{ show: boolean }>();
const emit = defineEmits(["close"]);
const $toast = useToast();

// nuevo impuesto
const nuevoCombustible = ref({ tipo: "" });

const agregarCombustible = async () => {
  if (!nuevoCombustible.value.tipo.trim()) return;
  await crearTCombustible(nuevoCombustible.value.tipo);
  nuevoCombustible.value.tipo = "";
};

const close = () => {
  emit("close");
};

onMounted(() => {
  fetchTCombustibles();
});

// ✅ HANDLE DELETE CON ALERT
const handleDelete = async (index: number, rowData: any) => {
  // ✅ CONFIRMAR ANTES DE ELIMINAR

  const result = await Swal.fire({
    title: `¿Está seguro de que desea eliminar "${rowData.txtDesc}"?`,
    showDenyButton: true,
    confirmButtonText: "Sí",
    denyButtonText: "No",
  });

  if (!result.isConfirmed) return;

  // ✅ ELIMINAR Y CAPTURAR RESPUESTA
  const resultado = await deleteTCombustible(rowData.idTC);

  // ✅ MOSTRAR ALERT SEGÚN EL RESULTADO
  if (resultado.success) {
    ($toast as any).info("✅ Combustible eliminado correctamente");
    await fetchTCombustibles();
  } else {
    ($toast as any).error(`❌ ${resultado.message}`);
  }
};
</script>
