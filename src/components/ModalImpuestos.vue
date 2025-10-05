<template>
  <ModalLayout :show="show" title="Impuestos" @close="close">
    <TableLayout
      title="Listado de Impuestos"
      :data="impuestos"
      :columns="impuestoColumns"
      :centerColumns="true"
      :showActions="false"
      :showReport="false"
    />
  </ModalLayout>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, onMounted } from "vue";
import ModalLayout from "@/components/common/ModalLayout.vue";
import TableLayout from "@/components/common/TableLayout.vue";

import { useImpuestos } from "@/composables/useImpuestos";
import type { Impuesto } from "@/types/impuesto";
import type { TableColumn } from "@/types/table";

// props y emits
const { show } = defineProps<{ show: boolean }>();

const emit = defineEmits(["close"]);

// store/composable
const { impuestos, fetchImpuesto } = useImpuestos();

// cerrar modal
const close = () => emit("close");

// fetch inicial
onMounted(fetchImpuesto);

// columnas de la tabla
const impuestoColumns: TableColumn<Impuesto>[] = [
  { key: "tipo", label: "Tipo" },
];
</script>
