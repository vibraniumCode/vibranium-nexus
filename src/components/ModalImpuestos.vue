<template>
  <ModalLayout :show="show" title="Impuestos" @close="close">
    <TableLayout
      :title="'Listado de Impuestos'"
      :data="impuestos"
      :columns="combustibleColumns"
      :centerColumns="true"
      :showActions="false"
      :showReport="false"
    />
  </ModalLayout>
</template>
<script setup lang="ts">
import { defineProps, defineEmits, ref, onMounted } from "vue";
import ModalLayout from "@/components/common/ModalLayout.vue";
import TableLayout from "@/components/common/TableLayout.vue";

import { useImpuestos } from "@/composables/useImpuestos";
import type { Impuesto } from "@/types/impuesto";
import type { TableColumn } from "@/types/table";

const { impuestos, fetchImpuesto } = useImpuestos();
const props = defineProps<{ show: boolean }>();
const emit = defineEmits(["close"]);

const close = () => {
  emit("close");
};

onMounted(() => {
  fetchImpuesto();
});

// definís qué columnas mostrar y con qué nombre
const combustibleColumns: TableColumn<Impuesto>[] = [
  { key: "tipo", label: "tipo" },
];
</script>
