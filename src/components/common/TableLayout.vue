<template>
  <div class="relative shadow-md sm:rounded-lg">
    <!-- Header con búsqueda y acciones -->
    <div class="p-6 bg-white border-b border-gray-200">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-900">{{ props.title }}</h3>
      </div>

      <!-- Barra de búsqueda y acciones -->
      <div class="flex items-center justify-between gap-4">
        <!-- 🔥 Componente de búsqueda -->
        <SearchBar
          v-model="searchQuery"
          :placeholder="searchPlaceholder"
          :show-result-count="showSearchCount"
          :result-count="filteredData.length"
        />

        <!-- 🔥 Componente de acciones de tabla -->
        <TableActions
          v-if="props.showTableActions"
          :show-export="showExport"
          :show-email="showEmail"
          :show-print="showPrint"
          :is-exporting="isExporting"
          :is-sending-email="isSendingEmail"
          @export="$emit('export', filteredData)"
          @email="$emit('email', filteredData)"
          @print="$emit('print', filteredData)"
        >
          <!-- Slot para acciones personalizadas -->
          <template #custom-actions>
            <slot name="custom-table-actions"></slot>
          </template>
        </TableActions>
      </div>
    </div>
    <!-- Contenedor con scroll horizontal y vertical -->
    <div class="max-h-[500px] overflow-y-auto overflow-x-auto">
      <!-- Tabla -->
      <div class="overflow-y-auto max-h-[500px]">
        <table class="w-full text-sm text-left rtl:text-right text-gray-500">
          <thead
            class="sticky top-0 z-10 text-sm uppercase bg-neutral-800 text-neutral-400"
          >
            <tr>
              <th
                v-for="(col, index) in computedColumns"
                :key="index"
                class="px-6 py-3"
                :class="{ 'text-center': centerColumns }"
              >
                {{ col }}
              </th>
              <th v-if="props.showActions" class="px-6 py-3 text-center">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(row, rowIndex) in computedRows"
              :key="rowIndex"
              class="text-center"
              :class="[
                rowIndex % 2 === 1 ? 'bg-gray-100' : 'bg-white',
                'hover:bg-gray-50 transition-colors duration-150',
              ]"
            >
              <td
                v-for="(value, colIndex) in row"
                :key="colIndex"
                class="px-6 py-4"
                :class="[centerRows ? 'text-center' : '']"
                v-html="value"
              ></td>

              <!-- 🔥 Componente de menú de acciones -->
              <td v-if="props.showActions" class="px-6 py-4 text-center">
                <ActionsMenu
                  :actions="actionConfig"
                  @detail="handleAction('detail', rowIndex)"
                  @edit="handleAction('edit', rowIndex)"
                  @duplicate="handleAction('duplicate', rowIndex)"
                  @delete="handleAction('delete', rowIndex)"
                  @print="handleAction('print', rowIndex)"
                >
                  <!-- Slot para acciones personalizadas en el menú -->
                  <template #custom-actions="{ close }">
                    <slot
                      name="custom-row-actions"
                      :row-index="rowIndex"
                      :row-data="filteredData[rowIndex]"
                      :close="close"
                    ></slot>
                  </template>
                </ActionsMenu>
              </td>
            </tr>

            <!-- Fila vacía si no hay datos -->
            <tr v-if="computedRows.length === 0">
              <td
                :colspan="computedColumns.length + (showActions ? 1 : 0)"
                class="px-6 py-8 text-center text-gray-500"
              >
                <div class="flex flex-col items-center justify-center">
                  <svg
                    class="w-12 h-12 text-gray-400 mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    />
                  </svg>
                  <p class="text-sm">{{ emptyMessage }}</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <!-- 🔥 Slot para contenido expandido (formularios, inputs, etc.) -->
    <slot
      name="expanded-content"
      :expanded-row="expandedRow"
      :data="filteredData"
    ></slot>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import SearchBar from "@/components/common/SearchBar.vue";
import TableActions from "@/components/common/TableActions.vue";
import ActionsMenu from "@/components/common/ActionsMenu.vue";
import type { ActionConfig, TableColumn } from "@/types/table";

const props = withDefaults(
  defineProps<{
    title: string;
    data: Record<string, any>[];
    columns: TableColumn[];
    expandedRow?: number | null;
    centerColumns?: boolean;
    centerRows?: boolean;
    showActions?: boolean;
    showTableActions?: boolean;
    showExport?: boolean;
    showEmail?: boolean;
    showPrint?: boolean;
    searchPlaceholder?: string;
    showSearchCount?: boolean;
    emptyMessage?: string;
    actionConfig?: ActionConfig;
    isExporting?: boolean;
    isSendingEmail?: boolean;
  }>(),
  {
    centerColumns: false,
    centerRows: false,
    showActions: false,
    showTableActions: false,
    showExport: true,
    showEmail: true,
    showPrint: true,
    searchPlaceholder: "Búsqueda general...",
    showSearchCount: false,
    emptyMessage: "No hay datos para mostrar",
    isExporting: false,
    isSendingEmail: false,
  }
);

defineOptions({
  inheritAttrs: false,
});

const emit = defineEmits<{
  detail: [index: number, data: any];
  edit: [index: number, data: any];
  duplicate: [index: number, data: any];
  delete: [index: number, data: any];
  print: [index: number, data: any]; // ✅ AGREGAR
  export: [data: any[]];
  email: [data: any[]];
  "update:expandedRow": [index: number | null];
  combustible: [];
  impuesto: [];
}>();

const searchQuery = ref("");
const computedColumns = computed(() => props.columns.map((c) => c.label));

const filteredData = computed(() => {
  if (!searchQuery.value) return props.data;
  return props.data.filter((item) =>
    Object.values(item).some((val) =>
      String(val).toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  );
});

const computedRows = computed(() =>
  filteredData.value.map((item) =>
    props.columns.map((c) => item[c.key as string])
  )
);

function handleAction(
  action: "detail" | "edit" | "duplicate" | "delete" | "print",
  index: number
) {
  if (action === "edit") {
    emit("update:expandedRow", props.expandedRow === index ? null : index);
  }

  emit(action, index, filteredData.value[index]);
}
</script>
