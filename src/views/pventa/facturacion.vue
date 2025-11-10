<template>
  <div class="w-full flex flex-col">
    <div class="flex-1 bg-gray-200 p-4">
      <!-- Header -->
      <div class="flex items-center justify-between mb-4">
        <h1 class="text-4xl font-semibold text-gray-900">
          Facturación
          <span class="text-sm text-gray-500 ml-2">
            Proceso de comprobantes
          </span>
        </h1>
      </div>

      <!-- Card principal -->
      <div
        class="h-full w-full mb-6 bg-white p-6 font-sans rounded-lg shadow-md"
      >
        <!-- Sección Empresa, Cliente, Fecha -->
        <div class="grid grid-cols-3 gap-6 mb-6">
          <Dropdown
            v-model="selectedEmpresa"
            :users="empresas"
            labelKey="nombre"
            valueKey="id"
            @select="handleSelectEmpresa"
            label="Estación"
          />
          <Dropdown
            v-model="selectedCliente"
            :users="clientes"
            labelKey="nombre"
            valueKey="id"
            @select="handleSelectCliente"
            label="Cliente"
          />
          <div class="flex flex-col">
            <label class="text-sm font-medium text-gray-700 mb-1">
              Fecha de emisión
            </label>
            <input
              id="fechaEmision"
              type="date"
              v-model="fechaEmision"
              class="px-3 py-2 border rounded-lg text-sm text-white bg-neutral-800 border-gray-700 focus:outline-none focus:ring-2 hover:ring-gray-400"
            />
          </div>
        </div>

        <!-- Sección Combustibles -->
        <div class="mt-8">
          <h2
            class="text-lg font-semibold text-gray-800 border-l-4 border-indigo-600 pl-2 mb-4"
          >
            Combustibles de la estación
          </h2>

          <div
            v-if="selectedEmpresa && combustibles.length > 0"
            class="grid grid-cols-3 gap-6"
          >
            <div
              v-for="c in combustibles"
              :key="c.idTipo"
              @click="selectedCombustible = c"
              class="border rounded-xl p-4 cursor-pointer transition hover:shadow-md hover:bg-indigo-50"
              :class="{
                'border-indigo-600 bg-indigo-100':
                  selectedCombustible?.idTipo === c.idTipo,
                'border-gray-300': selectedCombustible?.idTipo !== c.idTipo,
              }"
            >
              <p class="font-semibold text-gray-800">{{ c.Combustible }}</p>
            </div>
          </div>

          <div
            v-else-if="selectedEmpresa && combustibles.length === 0"
            class="text-gray-500 italic"
          >
            La estación no tiene combustibles cargados.
          </div>

          <div v-else class="text-gray-500 italic">
            Seleccione una empresa para cargar sus combustibles.
          </div>
        </div>

        <!-- Sección Parámetros -->
        <div v-if="selectedCombustible" class="mt-10">
          <h2
            class="text-lg font-semibold text-gray-800 border-l-4 border-emerald-500 pl-2 mb-4"
          >
            Parámetros de cálculo
          </h2>

          <div class="grid grid-cols-3 gap-6">
            <div
              v-for="(field, key) in parametros"
              :key="key"
              class="flex flex-col"
            >
              <label class="text-sm font-medium text-gray-700 mb-1">{{
                field.label
              }}</label>

              <!-- Campo bloqueado para MargenLitros -->
              <input
                v-if="key === 'MargenLitros'"
                type="number"
                v-model.number="field.value"
                step="any"
                :readonly="!margenEditable"
                class="px-3 py-2 border rounded-lg bg-neutral-800 text-white text-sm border-gray-700 focus:outline-none focus:ring-2 hover:ring-gray-400"
              />
              <div v-if="key === 'MargenLitros'" class="flex items-center mt-1">
                <input
                  id="editarMargen"
                  type="checkbox"
                  v-model="margenEditable"
                  class="mr-2"
                />
                <label for="editarMargen" class="text-xs text-gray-600"
                  >Editar margen</label
                >
              </div>

              <!-- Los demás campos -->
              <input
                v-else
                type="number"
                v-model.number="field.value"
                step="any"
                class="px-3 py-2 border rounded-lg bg-neutral-800 text-white text-sm border-gray-700 focus:outline-none focus:ring-2 hover:ring-gray-400"
                :readonly="key === 'PrecioPorLitro'"
              />
            </div>
          </div>

          <div class="flex justify-end mt-6">
            <button
              @click="calcularComprobantes"
              class="bg-indigo-600 text-white px-5 py-2 rounded-xl font-medium hover:bg-indigo-700 transition"
            >
              Calcular comprobantes
            </button>
          </div>
        </div>

        <!-- Resultados -->
        <div v-if="resultado.length" class="mt-10">
          <h2
            class="text-lg font-semibold text-gray-800 border-l-4 border-teal-500 pl-2 mb-4"
          >
            Resultado del cálculo
          </h2>

          <div class="overflow-hidden rounded-lg border border-gray-300">
            <table class="w-full text-sm">
              <thead class="bg-gray-100 text-gray-700">
                <tr>
                  <th class="p-2 text-left">#</th>
                  <th class="p-2 text-left">Litros</th>
                  <th class="p-2 text-left">Importe</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="c in resultado"
                  :key="c.NroComprobante"
                  class="border-t hover:bg-gray-50"
                >
                  <td class="p-2">{{ c.NroComprobante }}</td>
                  <td class="p-2">{{ c.Litros }}</td>
                  <td class="p-2">${{ c.Importe }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="mt-4 bg-gray-100 p-4 rounded-lg">
            <p>
              <strong>Total comprobantes:</strong>
              {{ resumen?.CantidadComprobantes }}
            </p>
            <p>
              <strong>Total calculado:</strong> ${{ resumen?.TotalCalculado }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from "vue";
import Dropdown from "@/components/common/Dropdown.vue";
import { useEmpresas } from "@/composables/useEmpresas";
import { useClientes } from "@/composables/useClientes";
import { useCombustibles } from "@/composables/useCombustible";
import axios from "axios";

// Variables reactivas
const selectedEmpresa = ref<any>(null);
const selectedCliente = ref<any>(null);
const selectedCombustible = ref<any>(null);
const fechaEmision = ref<string>("");
const resultado = ref<any[]>([]);
const resumen = ref<any | null>(null);

// Parámetros del SP
const parametros = reactive({
  ImporteTotal: { label: "Importe Total", value: null },
  LitrosPromedio: { label: "Litros Promedio", value: null },
  MargenLitros: { label: "Margen Litros", value: 2 },
  ImporteMin: { label: "Importe Mínimo", value: null },
  ImporteMax: { label: "Importe Máximo", value: null },
  PrecioPorLitro: { label: "Precio por Litro", value: null },
});

// Controla si el margen es editable
const margenEditable = ref(false);

const { empresas, fetchEmpresas } = useEmpresas();
const { clientes, fetchClientes } = useClientes();
const { combustibles, fetchCombustibles } = useCombustibles();

// Cargar empresas y clientes al montar
onMounted(() => {
  fetchEmpresas("CTA");
  fetchClientes("CTA");
});

// Cuando selecciona una empresa -> carga combustibles
const handleSelectEmpresa = async (empresa: any) => {
  selectedEmpresa.value = empresa;
  selectedCombustible.value = null;
  resultado.value = [];
  resumen.value = null;

  await fetchCombustibles(empresa.id);
};

// Cuando selecciona un cliente
const handleSelectCliente = (cliente: any) => {
  selectedCliente.value = cliente;
};

// Cuando selecciona un combustible -> asigna precio por litro
watch(selectedCombustible, (nuevo) => {
  if (nuevo) {
    parametros.PrecioPorLitro.value = nuevo.precio || 0;
  } else {
    parametros.PrecioPorLitro.value = null;
  }
});

// Ejecutar SP de cálculo
const calcularComprobantes = async () => {
  try {
    const payload = Object.fromEntries(
      Object.entries(parametros).map(([k, v]) => [k, v.value])
    );
    const { data } = await axios.post(
      "http://localhost:3000/api/facturacion/calcular",
      payload
    );

    resultado.value = data.detalle || [];
    resumen.value = data.resumen || null;
  } catch (err) {
    console.error("Error calculando comprobantes:", err);
  }
};
</script>

<style scoped>
input[type="date"]::-webkit-calendar-picker-indicator {
  filter: invert(1);
}
</style>
