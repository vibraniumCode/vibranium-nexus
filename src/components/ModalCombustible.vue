<template>
  <ModalLayout :show="show" title="Combustibles" @close="close">
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
      @edit="handleEdit"
    >
      <!-- 🔥 Slot para el contenido expandido -->
      <template #expanded-content="{ expandedRow, data }">
        <EditInput
          v-if="expandedRow !== null"
          v-model="editingPrice"
          :label="`Precio de ${data[expandedRow].tipo}`"
          field-name="precio"
          input-type="number"
          :placeholder="`Ingresa el precio para ${data[expandedRow].tipo}`"
          save-label="Actualizar Precio"
          :is-saving="isSaving"
          @save="savePrice(expandedRow, data[expandedRow].id)"
          @cancel="closeEdit"
        />
      </template>
    </TableLayout>
  </ModalLayout>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref, onMounted } from "vue";
import ModalLayout from "@/components/common/ModalLayout.vue";
import TableLayout from "@/components/common/TableLayout.vue";
import EditInput from "@/components/common/EditInput.vue";

import { useCombustibles } from "@/composables/useCombustible";
import type { Combustible } from "@/types/combustible";
import type { TableColumn } from "@/types/table";

const { combustibles, fetchCombustible, updateCombustiblePrice } =
  useCombustibles();

const props = defineProps<{ show: boolean }>();
const emit = defineEmits(["close"]);

const editingPrice = ref<number>(0);
const isSaving = ref(false);

const close = () => {
  emit("close");
};

const handleEdit = (index: number, data: Combustible) => {
  console.log("Editando combustible:", data);
  editingPrice.value = data.precio; //aca cargo el precio de la tabla(db) en el input
};

const closeEdit = () => {
  editingPrice.value = 0;
};

const savePrice = async (index: number, id: number) => {
  try {
    const newPrice = Number(editingPrice.value);

    if (isNaN(newPrice) || newPrice < 0) {
      alert("Por favor, ingresa un precio válido mayor a 0");
      return;
    }

    isSaving.value = true;

    const success = await updateCombustiblePrice(id, newPrice);

    if (success) {
      console.log("Precio actualizado correctamente");
      closeEdit();
      // Opcional: refrescar la lista
      await fetchCombustible();
    } else {
      console.error("Error al actualizar el precio");
    }
  } catch (error) {
    console.error("Error inesperado:", error);
  } finally {
    isSaving.value = false;
  }
};

onMounted(() => {
  fetchCombustible();
});

const combustibleColumns: TableColumn<Combustible>[] = [
  { key: "tipo", label: "Tipo" },
  { key: "precio", label: "Precio" },
];
</script>
