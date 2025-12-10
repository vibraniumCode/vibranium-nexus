<template>
  <div class="relative inline-block text-left">
    <!-- Botón de menú -->
    <button
      @click="toggleMenu"
      class="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
      :class="{ 'bg-gray-100': isOpen }"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="24px"
        viewBox="0 -960 960 960"
        width="24px"
        fill="black"
      >
        <path
          d="M240-160q-33 0-56.5-23.5T160-240q0-33 23.5-56.5T240-320q33 0 56.5 23.5T320-240q0 33-23.5 56.5T240-160Zm240 0q-33 0-56.5-23.5T400-240q0-33 23.5-56.5T480-320q33 0 56.5 23.5T560-240q0 33-23.5 56.5T480-160Zm240 0q-33 0-56.5-23.5T640-240q0-33 23.5-56.5T720-320q33 0 56.5 23.5T800-240q0 33-23.5 56.5T720-160ZM240-400q-33 0-56.5-23.5T160-480q0-33 23.5-56.5T240-560q33 0 56.5 23.5T320-480q0 33-23.5 56.5T240-400Zm240 0q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm240 0q-33 0-56.5-23.5T640-480q0-33 23.5-56.5T720-560q33 0 56.5 23.5T800-480q0 33-23.5 56.5T720-400ZM240-640q-33 0-56.5-23.5T160-720q0-33 23.5-56.5T240-800q33 0 56.5 23.5T320-720q0 33-23.5 56.5T240-640Zm240 0q-33 0-56.5-23.5T400-720q0-33 23.5-56.5T480-800q33 0 56.5 23.5T560-720q0 33-23.5 56.5T480-640Zm240 0q-33 0-56.5-23.5T640-720q0-33 23.5-56.5T720-800q33 0 56.5 23.5T800-720q0 33-23.5 56.5T720-640Z"
        />
      </svg>
    </button>

    <!-- Dropdown Menu -->
    <Transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        v-if="isOpen"
        class="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10"
        :class="menuPosition"
      >
        <!-- Ver detalle -->
        <button
          v-if="actions.showDetail"
          @click="handleAction('detail')"
          class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left rounded-t-lg transition-colors duration-150"
        >
          <svg
            class="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
          {{ actions.detailLabel || "Ver detalle" }}
        </button>

        <!-- Editar -->
        <button
          v-if="actions.showEdit"
          @click="handleAction('edit')"
          class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left transition-colors duration-150"
        >
          <svg
            class="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          {{ actions.editLabel || "Editar" }}
        </button>

        <!-- ✅ IMPRIMIR - AGREGAR ESTO -->
        <button
          v-if="actions.showPrint"
          @click="handleAction('print')"
          class="flex items-center w-full px-4 py-2 text-sm text-purple-600 hover:bg-purple-50 text-left transition-colors duration-150"
        >
          <svg
            class="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
            />
          </svg>
          {{ actions.printLabel || "Imprimir" }}
        </button>

        <!-- Duplicar -->
        <button
          v-if="actions.showDuplicate"
          @click="handleAction('duplicate')"
          class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left transition-colors duration-150"
        >
          <svg
            class="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
          {{ actions.duplicateLabel || "Duplicar" }}
        </button>

        <!-- Divider antes de eliminar -->
        <div v-if="actions.showDelete" class="my-1"></div>

        <!-- Eliminar -->
        <button
          v-if="actions.showDelete"
          @click="handleAction('delete')"
          class="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left rounded-b-lg transition-colors duration-150"
        >
          <svg
            class="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
          {{ actions.deleteLabel || "Eliminar" }}
        </button>

        <!-- Slot para acciones personalizadas -->
        <slot name="custom-actions" :close="closeMenu"></slot>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

interface ActionConfig {
  showDetail?: boolean;
  showEdit?: boolean;
  showPrint?: boolean; // ✅ AGREGAR
  showDuplicate?: boolean;
  showDelete?: boolean;
  detailLabel?: string;
  editLabel?: string;
  printLabel?: string; // ✅ AGREGAR
  duplicateLabel?: string;
  deleteLabel?: string;
}

type MenuActions = "detail" | "edit" | "print" | "duplicate" | "delete"; // ✅ AGREGAR "print"

const { actions, menuPosition } = withDefaults(
  defineProps<{
    actions?: ActionConfig;
    menuPosition?: string;
  }>(),
  {
    actions: () => ({
      showDetail: true,
      showEdit: true,
      showPrint: false, // ✅ AGREGAR
      showDuplicate: false,
      showDelete: true,
    }),
    menuPosition: "origin-top-right",
  }
);

const emit = defineEmits<{
  (e: MenuActions): void;
}>();

const isOpen = ref(false);

function toggleMenu() {
  isOpen.value = !isOpen.value;
}

function closeMenu() {
  isOpen.value = false;
}

function handleAction(action: MenuActions) {
  emit(action);
  closeMenu();
}

// Cerrar el menú al hacer clic fuera
function handleClickOutside(event: MouseEvent) {
  const target = event.target as HTMLElement;
  if (isOpen.value && !target.closest(".relative")) {
    closeMenu();
  }
}

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>
