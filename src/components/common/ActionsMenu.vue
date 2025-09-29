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
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="size-6 hover:stroke-neutral-700"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z"
        />
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
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
        <div
          v-if="actions.showDelete"
          class="border-t border-gray-200 my-1"
        ></div>

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
  showDuplicate?: boolean;
  showDelete?: boolean;
  detailLabel?: string;
  editLabel?: string;
  duplicateLabel?: string;
  deleteLabel?: string;
}

const props = withDefaults(
  defineProps<{
    actions?: ActionConfig;
    menuPosition?: string;
  }>(),
  {
    actions: () => ({
      showDetail: true,
      showEdit: true,
      showDuplicate: false,
      showDelete: true,
    }),
    menuPosition: "origin-top-right",
  }
);

const emit = defineEmits<{
  detail: [];
  edit: [];
  duplicate: [];
  delete: [];
}>();

const isOpen = ref(false);

function toggleMenu() {
  isOpen.value = !isOpen.value;
}

function closeMenu() {
  isOpen.value = false;
}

function handleAction(action: "detail" | "edit" | "duplicate" | "delete") {
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
