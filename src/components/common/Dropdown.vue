<template>
  <div class="relative inline-block text-left" ref="dropdownRef">
    <!-- Label arriba -->
    <label class="block text-sm font-medium text-gray-700 mb-1">
      {{ label }}
    </label>
    <!-- Botón -->
    <button
      @click="toggleDropdown"
      class="flex items-center justify-between w-100 px-4 py-2 text-sm font-medium text-gray-600 border border-gray-400 hover:border-indigo-600"
    >
      {{ selectedLabel || placeholder }}

      <svg
        class="w-4 h-4 ml-2 transition-transform"
        :class="{ 'rotate-180': isOpen }"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </button>

    <!-- Menú -->
    <transition name="fade">
      <div
        v-if="isOpen"
        class="absolute z-20 w-100 mt-2 bg-white border border-indigo-200 shadow-lg dark:bg-neutral-800 dark:border-gray-700"
      >
        <ul class="max-h-56 overflow-y-auto">
          <li
            v-for="(item, index) in users"
            :key="item[valueKey] || index"
            @click="selectUser(item)"
            class="px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            {{ item[labelKey] }}
          </li>
        </ul>

        <div
          @click="addUser"
          class="p-2 text-sm font-medium text-blue-600 border-t border-gray-200 cursor-pointer hover:bg-gray-50 dark:border-gray-600 dark:text-blue-400 dark:hover:bg-gray-700"
        >
          <slot> </slot>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from "vue";

const props = defineProps({
  users: {
    type: Array as () => any[],
    default: () => [],
  },
  labelKey: {
    type: String,
    default: "name", // el campo que se mostrará en la lista
  },
  valueKey: {
    type: String,
    default: "id", // el valor único de cada item
  },
  placeholder: {
    type: String,
    default: "Seleccionar tu estacion",
  },
  label: {
    type: String,
  },
  modelValue: {
    // 🔹 Nuevo prop para sincronizar la selección con el padre
    type: Object as () => any,
    default: null,
  },
});

const emit = defineEmits(["select", "add"]);

const isOpen = ref(false);

const dropdownRef = ref<HTMLElement | null>(null);

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const selectUser = (item: any) => {
  emit("select", item); // evento normal
  emit("update:modelValue", item); // 🔹 sincroniza con padre
  isOpen.value = false;
};

const addUser = () => {
  emit("add");
  isOpen.value = false;
};

// Cerrar al hacer clic fuera
const handleClickOutside = (e: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target as Node)) {
    isOpen.value = false;
  }
};

onMounted(() => document.addEventListener("click", handleClickOutside));
onBeforeUnmount(() =>
  document.removeEventListener("click", handleClickOutside)
);

// Computed para mostrar en el botón
const selectedLabel = computed(() => {
  return props.modelValue ? props.modelValue[props.labelKey] : "";
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
