<template>
  <div class="bg-white shadow-lg mt-4 p-6">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h3
        class="text-lg font-semibold text-gray-900 border-l-4 border-indigo-600 pl-3"
      >
        ESTACION <span class="text-gray-600">({{ props.id }})</span>
      </h3>
      <button
        @click="emit('close')"
        class="inline-flex items-center px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
      >
        Cerrar
      </button>
    </div>

    <!-- Contenido -->
    <div v-if="loading" class="text-gray-500 text-center">
      Cargando datos...
    </div>
    <div v-else-if="error" class="text-red-500 text-center">
      Error: {{ error }}
    </div>

    <div
      v-else-if="detalle"
      class="grid grid-cols-2 gap-x-16 gap-y-2 items-start"
    >
      <!-- Columna izquierda -->
      <div class="space-y-2">
        <div class="flex">
          <span class="font-semibold w-28 text-gray-900">Empresa:</span>
          <span class="text-gray-700">{{ detalle.empresa.nombre }}</span>
        </div>
        <div class="flex">
          <span class="font-semibold w-28 text-gray-900">CUIT:</span>
          <span class="text-gray-700">{{ detalle.empresa.cuit }}</span>
        </div>
        <div class="flex">
          <span class="font-semibold w-28 text-gray-900">Dirección:</span>
          <span class="text-gray-700">{{ detalle.empresa.direccion }}</span>
        </div>
        <div class="flex">
          <span class="font-semibold w-28 text-gray-900">Localidad:</span>
          <span class="text-gray-700">{{ detalle.empresa.localidad }}</span>
        </div>
      </div>

      <!-- Columna derecha -->
      <div class="space-y-2">
        <div class="flex">
          <span class="font-semibold w-28 text-gray-900">Provincia:</span>
          <span class="text-gray-700">{{ detalle.empresa.provincia }}</span>
        </div>
        <div class="flex">
          <span class="font-semibold w-28 text-gray-900">Teléfono:</span>
          <span class="text-gray-700">{{ detalle.empresa.telefono }}</span>
        </div>
      </div>

      <div class="col-span-2 mt-6">
        <AsignarCombustible
          :idEstacion="props.id"
          @refreshData="handleRefreshData"
        />
        <h2
          class="text-gray-500 text-xl font-semibold mb-4 border-b border-t py-2"
        >
          Combustibles con Impuestos
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          <div
            v-for="(item, index) in detalle.combustible"
            :key="index"
            class="p-4 bg-gray-50 border border-gray-200 shadow-sm rounded-lg hover:shadow-md transition"
          >
            <!-- Encabezado del combustible -->
            <div class="flex justify-between mb-2 items-center">
              <span class="font-semibold text-gray-900 uppercase">
                {{ item.Combustible }}
              </span>
              <div class="flex items-center gap-2">
                <span class="text-gray-700 font-medium">
                  ${{ item.Imp_combustible.toFixed(2) }}
                </span>

                <!-- Menú desplegable -->
                <details class="relative">
                  <summary
                    class="cursor-pointer list-none p-1 hover:bg-gray-100 rounded transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5 text-gray-600"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"
                      />
                    </svg>
                  </summary>

                  <div
                    class="absolute right-0 mt-1 bg-white border border-gray-200 rounded shadow-lg z-10"
                  >
                    <button
                      @click="
                        iniciarEdicionCombustible(item.id, item.Imp_combustible)
                      "
                      class="w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 flex items-center gap-2 border-b"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
                        />
                      </svg>
                      Editar
                    </button>
                    <button
                      @click="eliminarCombustible(item.id)"
                      :disabled="loadingDeleteCombustible"
                      class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50 flex items-center gap-2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clip-rule="evenodd"
                        />
                      </svg>
                      Eliminar
                    </button>
                  </div>
                </details>
              </div>
            </div>

            <div
              v-if="estaEditandoCombustible(item.id)"
              class="mb-2 p-2 bg-blue-50 rounded border border-blue-200"
            >
              <div class="flex gap-2 items-center">
                <input
                  v-model.number="nuevoMontoCombustible"
                  type="number"
                  step="0.01"
                  class="border border-blue-300 rounded-md text-sm p-1 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  @keyup.enter="guardarEdicionCombustible(item.id)"
                  @keyup.esc="cancelarEdicionCombustible"
                />
                <button
                  @click="guardarEdicionCombustible(item.id)"
                  class="text-green-600 hover:text-green-800 hover:bg-green-50 rounded p-1"
                  title="Guardar"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </button>
                <button
                  @click="cancelarEdicionCombustible"
                  class="text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded p-1"
                  title="Cancelar"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <div class="flex justify-between items-center mb-3">
              <span class="text-sm text-gray-700">Importe impuesto:</span>
              <div class="flex items-center gap-3">
                <span class="text-sm text-gray-700 font-medium">
                  ${{ item.Imp_impuesto.toFixed(2) }}
                </span>
                <div class="w-6.5"></div>
                <!-- Espaciador para alinear con los 3 puntitos -->
              </div>
            </div>

            <!-- Botón para desplegar impuestos -->
            <details class="bg-white rounded-md mt-2 border border-gray-100">
              <summary
                class="cursor-pointer select-none px-3 py-2 text-sm text-gray-800 font-medium hover:text-indigo-600"
              >
                Ver impuestos
              </summary>

              <!-- Tabla o lista de impuestos -->
              <div
                class="px-3 py-2 text-sm text-gray-700 border-t border-gray-100"
              >
                <div
                  v-for="(imp, idx) in detalle.impuesto.filter(
                    (i) => i.idCombustible === item.id
                  )"
                  :key="idx"
                  class="flex justify-between items-center py-1 border-b last:border-0 group"
                >
                  <span>{{ imp.tipo }}</span>

                  <!-- Modo normal -->
                  <div
                    v-if="!estaEditando(item.id, imp.tipo)"
                    class="flex items-center gap-2"
                  >
                    <span>${{ imp.importe.toFixed(2) }}</span>

                    <!-- Botón editar -->
                    <button
                      @click="iniciarEdicion(item.id, imp)"
                      class="opacity-0 group-hover:opacity-100 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded p-1 transition-all"
                      title="Editar monto"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
                        />
                      </svg>
                    </button>

                    <!-- Botón eliminar -->
                    <button
                      @click="eliminarImpuesto(imp, item.id)"
                      :disabled="loadingDelete"
                      class="opacity-0 group-hover:opacity-100 text-red-600 hover:text-red-800 hover:bg-red-50 rounded p-1 transition-all disabled:opacity-50"
                      title="Eliminar impuesto"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>

                  <!-- Modo edición -->
                  <div v-else class="flex items-center gap-2">
                    <input
                      v-model.number="nuevoMonto"
                      type="number"
                      step="0.01"
                      class="border border-blue-300 rounded-md text-sm p-1 w-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      @keyup.enter="guardarEdicion(imp, item.id)"
                      @keyup.esc="cancelarEdicion"
                    />

                    <!-- Botón guardar -->
                    <button
                      @click="guardarEdicion(imp, item.id)"
                      class="text-green-600 hover:text-green-800 hover:bg-green-50 rounded p-1 transition-all"
                      title="Guardar"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </button>

                    <!-- Botón cancelar -->
                    <button
                      @click="cancelarEdicion"
                      class="text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded p-1 transition-all"
                      title="Cancelar"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                <!-- Agregar nuevo impuesto -->
                <div class="mt-4 pt-2 border-t border-gray-200">
                  <div class="flex gap-2 items-center">
                    <!-- Select con tipos de impuestos -->
                    <select
                      v-model="nuevoImpuesto[index].tipo"
                      class="border border-gray-300 rounded-md text-sm p-1 flex-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option disabled value="">Seleccionar impuesto</option>
                      <option
                        v-for="imp in impuestos"
                        :key="imp.id"
                        :value="imp.id"
                      >
                        {{ imp.tipo }}
                      </option>
                    </select>

                    <!-- Input de importe -->
                    <input
                      v-model.number="nuevoImpuesto[index].importe"
                      type="number"
                      step="0.01"
                      placeholder="Importe"
                      class="border border-gray-300 rounded-md text-sm p-1 w-28 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />

                    <!-- Botón para agregar -->
                    <button
                      @click="agregarImpuesto(item.id, index)"
                      :disabled="loadingAdd"
                      class="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {{ loadingAdd ? "..." : "+" }}
                    </button>
                  </div>
                </div>
              </div>
            </details>

            <!-- Total -->
            <div
              class="flex justify-between font-semibold text-gray-900 border-t mt-3 pt-2"
            >
              <span>Total</span>
              <span>${{ item.Imp_total.toFixed(2) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import axios from "axios";
import type { EmpresaDetalle } from "@/types/empresa";
import { useImpuestos } from "@/composables/useImpuestos";
import { useCombustibles } from "@/composables/useCombustible";
import { useToast } from "vue-toast-notification";
import AsignarCombustible from "@/components/Estaciones/AsignarCombustible.vue";
import Swal from "sweetalert2";

const props = defineProps<{
  id: number;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

// --- composable ---
const {
  impuestos,
  loading: loadingImpuestos,
  error: errorImpuestos,
  fetchTImpuesto,
  crearImpuesto,
  deleteImpuesto,
  updateImpuesto,
} = useImpuestos();
const $toast = useToast();
const { deleteEmpresaCombustible, updateEmpresaCombustible } =
  useCombustibles();

// --- datos ---
const detalle = ref<EmpresaDetalle | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);
const loadingAdd = ref(false);
const loadingDelete = ref(false);
const editandoImpuesto = ref<{ idCombustible: number; tipo: string } | null>(
  null
);
const nuevoMonto = ref<number>(0);
const loadingDeleteCombustible = ref(false);
const loadingUpdateCombustible = ref(false);
const editandoCombustible = ref<number | null>(null); // ID del combustible siendo editado
const nuevoMontoCombustible = ref<number>(0);

// Escuchar el evento refreshData del componente AsignarCombustible
const handleRefreshData = async () => {
  // Recargar los datos de detalle que incluyen combustibles e impuestos
  await fetchDetalle(props.id);
  fetchTImpuesto();
};

// --- obtener detalle de empresa ---
const fetchDetalle = async (id: number) => {
  try {
    loading.value = true;
    error.value = null;
    const { data } = await axios.get<EmpresaDetalle>(
      `https://vibranium-nexus-backend.onrender.com/api/empresas/details/${id}`
    );
    detalle.value = data;
  } catch (err: any) {
    error.value = err.message || "Error al obtener los detalles";
  } finally {
    loading.value = false;
  }
};

// --- cargar datos cuando cambia id ---
watch(
  () => props.id,
  (newId) => {
    if (newId) fetchDetalle(newId);
  },
  { immediate: true }
);

// --- cargar tipos de impuestos del backend ---
onMounted(() => {
  fetchTImpuesto();
});

// --- estado temporal por combustible ---
interface NuevoImpuestoForm {
  tipo: number | "";
  importe: number;
}

const nuevoImpuesto = ref<NuevoImpuestoForm[]>([]);

watch(
  () => detalle.value?.combustible,
  (comb) => {
    if (comb) {
      nuevoImpuesto.value = comb.map(() => ({ tipo: "", importe: 0 }));
    }
  },
  { immediate: true }
);

// --- función para agregar impuesto ---
const agregarImpuesto = async (idCombustible: number, index: number) => {
  const { tipo, importe } = nuevoImpuesto.value[index];
  if (!tipo || !importe) {
    $toast.warning("Selecciona un impuesto y un importe válido");
    return;
  }

  try {
    loadingAdd.value = true;
    const resultado = await crearImpuesto(
      props.id,
      idCombustible, // Ahora es el ID real, no el index
      tipo as number,
      importe
    );

    if (resultado.success) {
      $toast.success("Impuesto agregado correctamente");

      await fetchDetalle(props.id);
      fetchTImpuesto();
      nuevoImpuesto.value[index] = { tipo: "", importe: 0 };
    } else {
      $toast.error(resultado.message);
    }
  } catch (err: any) {
    $toast.error("Error: " + (err.message || "No se pudo agregar el impuesto"));
  } finally {
    loadingAdd.value = false;
  }
};

// --- función para eliminar impuesto ---
const eliminarImpuesto = async (impuesto: any, idCombustible: number) => {
  const result = await Swal.fire({
    title: "¿Está seguro de que desea eliminar el impuesto?",
    showDenyButton: true,
    confirmButtonText: "Sí",
    denyButtonText: "No",
  });
  if (!result.isConfirmed) {
    $toast.warning("Operación cancelada");
    return;
  }

  try {
    loadingDelete.value = true;
    const impuestoEncontrado = impuestos.value.find(
      (i) => i.tipo === impuesto.tipo
    );

    if (!impuestoEncontrado) {
      $toast.warning("⚠️ No se pudo identificar el impuesto");
      return;
    }

    const resultado = await deleteImpuesto(
      props.id,
      idCombustible, // Ahora es el ID real
      impuestoEncontrado.id
    );

    if (resultado.success) {
      $toast.success("Impuesto eliminado correctamente");
      await fetchDetalle(props.id);
    } else {
      $toast.error(resultado.message);
    }
  } catch (err: any) {
    $toast.error(
      "Error: " + (err.message || "No se pudo eliminar el impuesto")
    );
  } finally {
    loadingDelete.value = false;
  }
};

// --- funciones para editar impuesto ---
const estaEditando = (idCombustible: number, tipo: string) => {
  return (
    editandoImpuesto.value?.idCombustible === idCombustible &&
    editandoImpuesto.value?.tipo === tipo
  );
};

const iniciarEdicion = (idCombustible: number, impuesto: any) => {
  editandoImpuesto.value = { idCombustible, tipo: impuesto.tipo };
  nuevoMonto.value = impuesto.importe;
};

const cancelarEdicion = () => {
  editandoImpuesto.value = null;
  nuevoMonto.value = 0;
};

const guardarEdicion = async (impuesto: any, idCombustible: number) => {
  if (!nuevoMonto.value || nuevoMonto.value <= 0) {
    $toast.warning("Ingresá un monto válido");
    return;
  }

  try {
    const impuestoEncontrado = impuestos.value.find(
      (i) => i.tipo === impuesto.tipo
    );

    if (!impuestoEncontrado) {
      $toast.warning("⚠️ No se pudo identificar el impuesto");
      return;
    }

    const resultado = await updateImpuesto(
      props.id,
      idCombustible, // Ahora es el ID real
      impuestoEncontrado.id,
      nuevoMonto.value
    );

    if (resultado.success) {
      $toast.success("Impuesto actualizado correctamente");
      await fetchDetalle(props.id);
      cancelarEdicion();
    } else {
      $toast.error(resultado.message);
    }
  } catch (err: any) {
    $toast.error(
      "Error: " + (err.message || "No se pudo actualizar el impuesto")
    );
  }
};

// Funciones para editar combustible
const estaEditandoCombustible = (idCombustible?: number) => {
  return editandoCombustible.value === idCombustible;
};

const iniciarEdicionCombustible = (
  idCombustible: number | undefined,
  monto: number
) => {
  if (!idCombustible) return;
  editandoCombustible.value = idCombustible;
  nuevoMontoCombustible.value = monto;
};

const cancelarEdicionCombustible = () => {
  editandoCombustible.value = null;
  nuevoMontoCombustible.value = 0;
};

const guardarEdicionCombustible = async (idCombustible: number | undefined) => {
  if (!idCombustible) return;

  if (!nuevoMontoCombustible.value || nuevoMontoCombustible.value <= 0) {
    $toast.warning("Ingresá un monto válido");
    return;
  }

  try {
    loadingUpdateCombustible.value = true;
    // Aquí debes llamar a tu API para actualizar el precio del combustible
    // Ejemplo: const resultado = await updateCombustiblePrecio(props.id, idCombustible, nuevoMontoCombustible.value);

    // Si tu composable useImpuestos no tiene esta función, necesitas crearla en tu API
    // O si lo manejas en otro composable, úsalo así:
    const resultado = await updateEmpresaCombustible(
      props.id,
      idCombustible,
      nuevoMontoCombustible.value
    );

    if (resultado.success) {
      $toast.success("Precio del combustible actualizado correctamente");
      await fetchDetalle(props.id);
      cancelarEdicionCombustible();
    } else {
      $toast.error(resultado.message);
    }
  } catch (err: any) {
    $toast.error(
      "Error: " + (err.message || "No se pudo actualizar el combustible")
    );
  } finally {
    loadingUpdateCombustible.value = false;
  }
};

const eliminarCombustible = async (idCombustible: number | undefined) => {
  if (!idCombustible) return;

  const combustible = detalle.value?.combustible.find(
    (c) => c.id === idCombustible
  );

  const result = await Swal.fire({
    title: `¿Estás seguro de eliminar el combustible "${combustible?.Combustible}"?`,
    showDenyButton: true,
    confirmButtonText: "Sí",
    denyButtonText: "No",
  });

  if (!result.isConfirmed) {
    $toast.warning("Operación cancelada");
    return;
  }

  try {
    loadingDeleteCombustible.value = true;
    // Llamar a tu API para eliminar el combustible
    // Ejemplo: const resultado = await deleteCombustible(props.id, idCombustible);

    const resultado = await deleteEmpresaCombustible(props.id, idCombustible);

    if (resultado.success) {
      $toast.success("Combustible eliminado correctamente");
      await fetchDetalle(props.id);
    } else {
      $toast.error(resultado.message);
    }
  } catch (err: any) {
    $toast.error(
      "Error: " + (err.message || "No se pudo eliminar el combustible")
    );
  } finally {
    loadingDeleteCombustible.value = false;
  }
};
</script>
