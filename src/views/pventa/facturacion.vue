<template>
  <div class="w-full flex flex-col">
    <div class="flex-1 bg-gray-200 p-4">
      <!-- Header -->
      <div class="flex items-center justify-between mb-4">
        <h1 class="text-4xl font-semibold text-gray-900">
          Facturación
          <span
            class="bg-indigo-100 text-indigo-700 text-xs font-medium px-2 py-1 rounded"
          >
            Generador
          </span>
        </h1>
      </div>
      <div
        class="bg-indigo-600 text-white shadow-md border-t rounded-t-2xl p-2"
      >
        <h2 class="text-lg font-semibold">Generación de tickets</h2>
        <p class="text-sm opacity-90">
          Seleccioná los siguientes datos para generar los tickets de venta:
        </p>
      </div>

      <div class="h-full w-full mb-6 bg-white p-6 font-sans shadow-md">
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
              class="px-3 py-2 border text-sm text-gray-600 border-gray-400 hover:border-indigo-600 focus:outline-none focus:ring-0"
            />
          </div>
        </div>

        <!-- Sección Combustibles -->
        <div class="mt-8">
          <h2
            class="text-lg font-semibold text-gray-800 mb-4 flex items-center"
          >
            <span class="w-1 h-8 bg-indigo-600 mr-2 rounded"></span>
            Combustibles de la estación
          </h2>

          <div
            v-if="selectedEmpresa && combustibles.length > 0"
            class="grid grid-cols-3 gap-6"
          >
            <div
              v-for="c in combustibles"
              :key="c.id"
              @click="selectedCombustible = c"
              class="border rounded-md p-4 cursor-pointer transition hover:shadow-md hover:bg-indigo-600 text-gray-800 hover:text-white"
              :class="{
                'border-gray-300 bg-gray-200': selectedCombustible?.id === c.id,
                'border-gray-300': selectedCombustible?.id !== c.id,
              }"
            >
              <p class="font-semibold">
                {{ c.tipo }}
              </p>
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
                class="px-3 py-2 border text-gray-600 border-gray-400 hover:border-indigo-600 text-sm focus:outline-none focus:ring-0"
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
                class="px-3 py-2 border text-gray-600 border-gray-400 hover:border-indigo-600 text-sm focus:outline-none focus:ring-0"
                :readonly="key === 'PrecioPorLitro'"
              />
            </div>
          </div>

          <div class="flex justify-end mt-6">
            <button
              @click="calcularComprobantes"
              :disabled="loading"
              class="bg-indigo-600 text-white px-5 py-2 font-medium hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ loading ? "Calculando..." : "Calcular comprobantes" }}
            </button>
          </div>

          <!-- Mensaje de error -->
          <div v-if="error" class="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {{ error }}
          </div>
        </div>

        <!-- Resultados -->
        <div v-if="resultado.length" class="mt-10">
          <h2
            class="text-lg font-semibold text-gray-800 border-l-4 border-teal-500 pl-2 mb-4"
          >
            Resultado del cálculo
          </h2>

          <TableLayout
            title="Detalle de comprobantes"
            :data="resultado"
            :columns="columnasResultado"
            :center-columns="true"
            :show-actions="false"
            :show-table-actions="false"
          />

          <div class="mt-4 bg-gray-100 p-4 rounded-lg grid grid-cols-2 gap-4">
            <div>
              <p class="text-sm text-gray-600">Total comprobantes</p>
              <p class="text-2xl font-bold text-gray-900">
                {{ resumen?.CantidadComprobantes }}
              </p>
            </div>
            <div>
              <p class="text-sm text-gray-600">Total calculado</p>
              <p class="text-2xl font-bold text-gray-900">
                ${{ resumen?.TotalCalculado?.toLocaleString() }}
              </p>
            </div>
          </div>

          <!-- Botones para acciones -->
          <div class="mt-6 flex gap-3">
            <button
              @click="mostrarTicket = true"
              class="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition"
            >
              👁️ Ver ticket térmico
            </button>
            <button
              @click="descargarTicketPDF"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
            >
              📥 Descargar PDF
            </button>
          </div>

          <!-- Modal del ticket -->
          <div
            v-if="mostrarTicket"
            class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            @click="mostrarTicket = false"
          >
            <div
              class="bg-white rounded-lg p-6 max-h-[80vh] overflow-y-auto"
              @click.stop
            >
              <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-bold">Vista previa del ticket</h3>
                <button
                  @click="mostrarTicket = false"
                  class="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              <TicketTermico
                :numero-comprobante="
                  '0001-' +
                  String(resultado[0]?.NroComprobante).padStart(8, '0')
                "
                :cliente="selectedCliente"
                :empresa="selectedEmpresa"
                :items="
                  resultado.map((r) => ({
                    id: r.NroComprobante,
                    descripcion: selectedCombustible?.tipo || 'Combustible',
                    cantidad: r.Litros,
                    precio: r.Importe / r.Litros,
                    total: r.Importe,
                  }))
                "
                :metodo-pago="'Efectivo'"
                :fecha="new Date(fechaEmision)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from "vue";
import Dropdown from "@/components/common/Dropdown.vue";
import TableLayout from "@/components/common/TableLayout.vue";
import TicketTermico from "@/components/TicketTermico.vue";
import { useEmpresas } from "@/composables/useEmpresas";
import { useClientes } from "@/composables/useClientes";
import { useCombustibles } from "@/composables/useCombustible";
import { useTickets } from "@/composables/useTickets";

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

// Configuración de columnas para TableLayout
const columnasResultado = [
  { key: "NroComprobante", label: "#" },
  { key: "Litros", label: "Litros" },
  { key: "Importe", label: "Importe" },
];

// Controla si el margen es editable
const margenEditable = ref(false);

// Controla si mostrar el ticket
const mostrarTicket = ref(false);

// Usar composables
const { empresas, fetchEmpresas } = useEmpresas();
const { clientes, fetchClientes } = useClientes();
const { combustibles, fetchCombustibles } = useCombustibles();
const { generarTickets, loading, error } = useTickets();

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
  // Validar que todos los parámetros requeridos estén completos
  if (
    !parametros.ImporteTotal.value ||
    !parametros.LitrosPromedio.value ||
    !parametros.ImporteMin.value ||
    !parametros.ImporteMax.value ||
    !selectedEmpresa.value
  ) {
    error.value = "Por favor completa todos los parámetros";
    return;
  }

  const response = await generarTickets(selectedEmpresa.value.id, {
    importeTotal: parametros.ImporteTotal.value,
    litrosPromedio: parametros.LitrosPromedio.value,
    margenLitros: parametros.MargenLitros.value,
    importeMinimo: parametros.ImporteMin.value,
    importeMaximo: parametros.ImporteMax.value,
  });

  if (response.success && response.data) {
    resultado.value = response.data.comprobantes;
    resumen.value = response.data.resumen;
  }
};

const descargarTicketPDF = () => {
  // Aquí irá la lógica para descargar PDF
  alert("Función de descargar PDF en desarrollo");
};
</script>

<style scoped>
input[type="date"]::-webkit-calendar-picker-indicator {
  filter: invert(0);
}
</style>
