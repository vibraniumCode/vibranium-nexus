<template>
  <details class="bg-white rounded-md mb-2 border border-gray-200">
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
        Enlazar Combustible
      </span>
    </summary>

    <div class="p-4 border-t border-gray-100 flex flex-col gap-3">
      <div class="flex gap-2 items-center">
        <!-- Select con tipos de combustibles -->
        <select
          v-model.number="nuevoCombustible.idCombustible"
          class="border border-gray-300 rounded-md text-sm p-2 flex-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option disabled :value="null">Seleccionar combustible</option>
          <option v-for="comb in tcombustibles" :key="comb.id" :value="comb.id">
            {{ comb.txtDesc }}
          </option>
        </select>

        <!-- Input monto -->
        <input
          type="number"
          v-model.number="nuevoCombustible.monto"
          placeholder="Monto"
          class="border border-gray-300 rounded-md text-sm p-2 w-28 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <!-- Botón para agregar -->
        <button
          @click="agregarCombustible"
          :disabled="loadingAddCombustible"
          class="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ loadingAddCombustible ? "..." : "+" }}
        </button>
      </div>
    </div>
  </details>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useToast } from "vue-toast-notification"; // ✅ AGREGAR
import { useCombustibles } from "@/composables/useCombustible";

const { tcombustibles, fetchTCombustibles, crearEmpresaCombustible } =
  useCombustibles();

const $toast = useToast(); // ✅ AGREGAR

const loadingAddCombustible = ref(false);

const props = defineProps<{
  idEstacion: number;
}>();

const emit = defineEmits<{
  (e: "refreshData"): void;
}>();

onMounted(() => {
  fetchTCombustibles();
});

interface NuevoCombustibleForm {
  idCombustible: number | null;
  monto: number | null;
}

const nuevoCombustible = ref<NuevoCombustibleForm>({
  idCombustible: null,
  monto: null,
});

const agregarCombustible = async () => {
  if (!nuevoCombustible.value.idCombustible || !nuevoCombustible.value.monto) {
    $toast.warning("Selecciona un combustible y monto"); // ✅ CAMBIAR
    return;
  }
  loadingAddCombustible.value = true;
  try {
    const res = await crearEmpresaCombustible(
      props.idEstacion,
      nuevoCombustible.value.idCombustible,
      nuevoCombustible.value.monto
    );

    if (res.success) {
      $toast.success("¡Combustible agregado!"); // ✅ CAMBIAR
      emit("refreshData");
      nuevoCombustible.value = { idCombustible: null, monto: null };
    } else {
      $toast.error(res.message); // ✅ CAMBIAR
    }
  } catch (err: any) {
    $toast.error(
      "Error: " + (err.message || "No se pudo agregar el combustible")
    ); // ✅ CAMBIAR
  } finally {
    loadingAddCombustible.value = false;
  }
};
</script>
