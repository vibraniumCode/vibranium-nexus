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
      v-model:expandedRow="expandedRow"
    >
      <!-- 🔥 Slot para el contenido expandido -->
      <template #expanded-content="{ expandedRow, data }">
        <EditInput
          v-if="typeof expandedRow === 'number' && data[expandedRow]"
          v-model="editingPrice"
          :label="`Precio de ${data[expandedRow]?.tipo ?? ''}`"
          field-name="precio"
          input-type="number"
          :placeholder="`Ingresa el precio para ${
            data[expandedRow]?.tipo ?? ''
          }`"
          save-label="Actualizar Precio"
          :is-saving="isSaving"
          @save="savePrice(expandedRow, data[expandedRow]?.id)"
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
import { combustibleColumns } from "@/constants/combustibleConfig";
import { useCombustibleHandlers } from "@/composables/useCombustibleHandlers";
import type { Combustible } from "@/types/combustible";

//composables
const { combustibles, fetchCombustible } = useCombustibles();
const { handleCombustiblePriceUpdate } = useCombustibleHandlers();

const props = defineProps<{ show: boolean }>();
const emit = defineEmits(["close"]);

const editingPrice = ref<number>(0);
const isSaving = ref(false);
const expandedRow = ref<number | null>(null);

const close = () => {
  emit("close");
};

const handleEdit = (index: number, data: Combustible) => {
  expandedRow.value = index;
  editingPrice.value = data.precio; //aca cargo el precio de la tabla(db) en el input
};

const closeEdit = () => {
  expandedRow.value = null;
  editingPrice.value = 0;
};

const savePrice = async (index: number, id: number) => {
  try {
    const newPrice = Number(editingPrice.value);
    isSaving.value = true;

    const success = await handleCombustiblePriceUpdate(
      id,
      newPrice,
      combustibles.value
    );

    if (success) {
      console.log("Precio actualizado correctamente");
      closeEdit();
      //refrescar la lista
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
</script>
