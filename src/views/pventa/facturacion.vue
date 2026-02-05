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

          <div class="flex flex-col">
            <label class="text-sm font-medium text-gray-700 mb-1">
              Fecha Desde
            </label>
            <input
              id="fechaDesde"
              type="date"
              v-model="fechaDesde"
              class="px-3 py-2 border text-sm text-gray-600 border-gray-400 hover:border-indigo-600 focus:outline-none focus:ring-0"
            />
          </div>
          <div class="flex flex-col">
            <label class="text-sm font-medium text-gray-700 mb-1">
              Fecha Hasta
            </label>
            <input
              id="fechaHasta"
              type="date"
              v-model="fechaHasta"
              class="px-3 py-2 border text-sm text-gray-600 border-gray-400 hover:border-indigo-600 focus:outline-none focus:ring-0"
            />
          </div>
          <Dropdown
            v-model="selectedCliente"
            :users="clientes"
            labelKey="nombre"
            valueKey="id"
            @select="handleSelectCliente"
            label="Cliente"
          />
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
              :key="c.idTipo"
              @click="selectedCombustible = c"
              class="border rounded-md p-4 cursor-pointer transition hover:shadow-md hover:bg-indigo-600 hover:text-white hover:animate-pulse"
              :class="{
                'border-indigo-600 bg-indigo-600 text-white':
                  selectedCombustible?.idTipo === c.idTipo,
                'border-gray-300 bg-white text-gray-800':
                  !selectedCombustible ||
                  selectedCombustible?.idTipo !== c.idTipo, // ✅ AGREGAR !selectedCombustible
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
            class="text-lg font-semibold text-gray-800 border-l-3 border-orange-500 pl-2 mb-4"
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
              class="bg-indigo-600 text-white px-5 py-2 font-medium rounded-sm hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
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
            class="text-lg font-semibold text-gray-800 border-l-3 border-teal-500 pl-2 mb-4"
          >
            Resultado del cálculo
          </h2>

          <!-- Tabla con botón de imprimir individual -->
          <div class="overflow-x-auto">
            <TableLayout
              title="Detalle de comprobantes"
              :data="resultado"
              :columns="columnasResultado"
              :center-columns="true"
              :show-actions="true"
              :show-table-actions="false"
              :actionConfig="{
                showDetail: false,
                showEdit: false,
                showDelete: false,
                showPrint: true,
              }"
              @print="
                async (index) => {
                  comprobanteSelecionado = resultado[index];
                  await obtenerDetalleImpuesto(comprobanteSelecionado); // ← LLAMADA AL SP
                  mostrarTicketIndividual = true;
                }
              "
            />
          </div>

          <!-- Resumen -->
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

          <!-- Botones principales -->
          <div class="mt-6 flex gap-3">
            <button
              @click="verTodosTickets"
              class="flex justify-center items-center px-4 py-2 bg-green-600 text-white rounded-sm font-medium hover:bg-green-700 transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#ffffff"
              >
                <path
                  d="M320-440h320v-80H320v80Zm0 120h320v-80H320v80Zm0 120h200v-80H320v80ZM240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T720-80H240Zm280-520v-200H240v640h480v-440H520ZM240-800v200-200 640-640Z"
                />
              </svg>
              <span class="ml-2">Ver Todos</span>
            </button>
            <!--<button
              @click="imprimirTodos"
              class="flex justify-center items-center px-4 py-2 bg-purple-600 text-white rounded-sm font-medium hover:bg-purple-700 transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#ffffff"
              >
                <path
                  d="M320-440h320v-80H320v80Zm0 120h320v-80H320v80Zm0 120h200v-80H320v80ZM240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T720-80H240Zm280-520v-200H240v640h480v-440H520ZM240-800v200-200 640-640Z"
                />
              </svg>
              <span class="ml-2">Imprimir Todos</span>
            </button>-->
          </div>

          <!-- Modal para ver todos los tickets -->
          <!-- Modal para ver todos los tickets -->
          <div
            v-if="mostrarTicket"
            class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            @click="mostrarTicket = false"
          >
            <div
              class="bg-white rounded-lg p-6 h-[80vh] overflow-y-scroll w-[90%]"
              @click.stop
            >
              <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-bold">
                  Vista previa de todos los tickets
                </h3>
                <button
                  @click="mostrarTicket = false"
                  class="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <!-- ✅ MOSTRAR TODOS LOS TICKETS -->
              <div class="space-y-8 flex flex-col items-start">
                <component
                  :is="obtenerComponenteTicket()"
                  v-for="ticket in resultado"
                  :key="ticket.NroComprobante"
                  :numero-comprobante="
                    '0001-' + String(ticket.NroComprobante).padStart(8, '0')
                  "
                  :cliente="selectedCliente"
                  :empresa="selectedEmpresa"
                  :items="[
                    {
                      id: ticket.NroComprobante,
                      idCombustible: selectedCombustible?.idTipo,
                      descripcion: selectedCombustible?.tipo || 'Combustible',
                      cantidad: ticket.Litros,
                      precio: ticket.Importe / ticket.Litros,
                      total: ticket.Importe,
                    },
                  ]"
                  :detalle-impuestos="
                    obtenerDetalleDelTicket(ticket.NroComprobante)
                      .detalleImpuestos
                  "
                  :metodo-pago="'Efectivo'"
                  :fecha="new Date(fechaEmision)"
                  :detalle-importe-general="
                    obtenerDetalleDelTicket(ticket.NroComprobante)
                      .detalleImporteGeneral
                  "
                  :detalle-final="
                    obtenerDetalleDelTicket(ticket.NroComprobante).detalleFinal
                  "
                />
              </div>
            </div>
          </div>

          <!-- Modal para imprimir individual -->
          <div
            v-if="mostrarTicketIndividual"
            class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            @click="mostrarTicketIndividual = false"
          >
            <div
              class="bg-white rounded-lg p-6 max-h-[80vh] overflow-y-auto"
              @click.stop
            >
              <!-- ✅ TICKET INDIVIDUAL -->
              <component
                :is="obtenerComponenteTicket()"
                v-if="comprobanteSelecionado"
                :numero-comprobante="
                  '0001-' +
                  String(comprobanteSelecionado.NroComprobante).padStart(8, '0')
                "
                :cliente="selectedCliente"
                :empresa="selectedEmpresa"
                :items="[
                  {
                    id: comprobanteSelecionado.NroComprobante,
                    idCombustible: selectedCombustible?.idTipo,
                    descripcion: selectedCombustible?.tipo || 'Combustible',
                    cantidad: comprobanteSelecionado.Litros,
                    precio:
                      comprobanteSelecionado.Importe /
                      comprobanteSelecionado.Litros,
                    total: comprobanteSelecionado.Importe,
                  },
                ]"
                :detalle-impuestos="
                  obtenerDetalleDelTicket(comprobanteSelecionado.NroComprobante)
                    .detalleImpuestos
                "
                :detalle-importe-general="
                  obtenerDetalleDelTicket(comprobanteSelecionado.NroComprobante)
                    .detalleImporteGeneral
                "
                :detalle-final="
                  obtenerDetalleDelTicket(comprobanteSelecionado.NroComprobante)
                    .detalleFinal
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
import TicketPETRORAFAELA from "@/components/Tickets/TicketPETRORAFAELA.vue";
import TicketVALCARA from "@/components/Tickets/TicketVALCARA.vue";
import TicketYPF from "@/components/Tickets/TicketYPF.vue";
import TicketOperadora from "@/components/Tickets/TicketOperadora.vue";
import { useEmpresas } from "@/composables/useEmpresas";
import { useClientes } from "@/composables/useClientes";
import { useCombustibles } from "@/composables/useCombustible";
import { useTickets } from "@/composables/useTickets";
import { useTicketDetalle } from "@/composables/useTicketImpuesto";

// Variables reactivas
const selectedEmpresa = ref<any>(null);
const selectedCliente = ref<any>(null);
const selectedCombustible = ref<any>(null);
const fechaDesde = ref<string>("");
const fechaHasta = ref<string>("");
const resultado = ref<any[]>([]);
const resumen = ref<any | null>(null);

// Parámetros del SP
const parametros = reactive({
  ImporteTotal: { label: "Importe Total", value: null },
  LitrosPromedio: { label: "Litros Promedio", value: null },
  MargenLitros: { label: "Margen Litros", value: 2 },
  ImporteMin: { label: "Importe Mínimo", value: null },
  ImporteMax: { label: "Importe Máximo", value: null },
  //PrecioPorLitro: { label: "Precio por Litro", value: null },
});

// Configuración de columnas para TableLayout
const columnasResultado = [
  { key: "NroComprobante", label: "Ticket" },
  { key: "Litros", label: "Litros" },
  { key: "Importe", label: "Importe" },
  { key: "FechaFactura", label: "Fecha" },
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
const { generarImpuestoTicket } = useTicketDetalle();

// Datos del detalle de impuestos
const detalleImporteGeneral = ref<any>(null);
const detalleImpuestos = ref<any[]>([]); // ✅ CAMBIAR A ARRAY VACÍO
const detalleFinal = ref<any>(null);

// Agregar este nuevo ref para almacenar todos los detalles por ticket
const detallesPorTicket = ref<Map<number, any>>(new Map());

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
//watch(selectedCombustible, (nuevo) => {
// if (nuevo) {
//  parametros.PrecioPorLitro.value = nuevo.precio || 0;
//} else {
// parametros.PrecioPorLitro.value = null;
//}
//});

// Ejecutar SP de cálculo
const calcularComprobantes = async () => {
  // Validar que todos los parámetros requeridos estén completos
  if (
    !parametros.ImporteTotal.value ||
    !parametros.LitrosPromedio.value ||
    !parametros.ImporteMin.value ||
    !parametros.ImporteMax.value ||
    !fechaDesde.value ||
    !fechaHasta.value ||
    !selectedCombustible.value ||
    !selectedEmpresa.value
  ) {
    error.value = "Por favor completa todos los parámetros";
    return;
  }

  const idComb =
    selectedCombustible.value?.idTipo ?? selectedCombustible.value?.id;
  console.log("ID combustible seleccionado:", idComb);

  const response = await generarTickets(selectedEmpresa.value.id, {
    importeTotal: parametros.ImporteTotal.value,
    litrosPromedio: parametros.LitrosPromedio.value,
    margenLitros: parametros.MargenLitros.value,
    importeMinimo: parametros.ImporteMin.value,
    importeMaximo: parametros.ImporteMax.value,
    fechaDesde: fechaDesde.value,
    fechaHasta: fechaHasta.value,
    idCombustible: idComb,
  });

  if (response.success && response.data) {
    resultado.value = response.data.comprobantes;
    resumen.value = response.data.resumen;
  }
};

// Funcion que llama al SP y guarda los datos
const obtenerDetalleImpuesto = async (ticket: any) => {
  if (!selectedEmpresa.value || !selectedCombustible.value) return;

  const litros = ticket.Litros;
  const idCombustible =
    selectedCombustible.value?.idTipo ?? selectedCombustible.value?.id;
  const totalFinal = ticket.Importe;

  const resp = await generarImpuestoTicket(
    litros,
    idCombustible,
    totalFinal,
    selectedEmpresa.value.id,
  );

  if (resp.success) {
    detalleImporteGeneral.value = resp.data.detalleImporteGeneral;
    detalleImpuestos.value = resp.data.detalleImpuestos || [];
    detalleFinal.value = resp.data.detalleFinal;

    // ✅ Guardar en el mapa por ticket
    detallesPorTicket.value.set(ticket.NroComprobante, {
      detalleImpuestos: resp.data.detalleImpuestos || [],
      detalleImporteGeneral: resp.data.detalleImporteGeneral,
      detalleFinal: resp.data.detalleFinal,
    });

    console.log("Detalle de impuestos obtenido:", resp.data);
  }
};

const descargarTicketPDF = () => {
  // Aquí irá la lógica para descargar PDF
  alert("Función de descargar PDF en desarrollo");
};

const mostrarTicketIndividual = ref(false);
const comprobanteSelecionado = ref<any>(null);

// ✅ IMPRIMIR UN COMPROBANTE
const imprimirComprobante = (index: number) => {
  comprobanteSelecionado.value = resultado.value[index];
  mostrarTicketIndividual.value = true;
};

// ✅ IMPRIMIR TODOS - MEJORADO
const imprimirTodos = async () => {
  for (const t of resultado.value) {
    await obtenerDetalleImpuesto(t);
  }
  mostrarTicket.value = true;
};

// Helper para obtener el detalle de un ticket específico
const obtenerDetalleDelTicket = (nroComprobante: number) => {
  return (
    detallesPorTicket.value.get(nroComprobante) || {
      detalleImpuestos: [],
      detalleImporteGeneral: null,
      detalleFinal: null,
    }
  );
};

// ✅ AGREGAR ESTA FUNCIÓN PARA DETERMINAR QUÉ TICKET USAR POR ID
const obtenerComponenteTicket = () => {
  if (!selectedEmpresa.value) return TicketPETRORAFAELA;

  const idEmpresa = selectedEmpresa.value.id;

  // if por ID
  if (idEmpresa === 50) {
    return TicketPETRORAFAELA;
  } else if (idEmpresa === 52) {
    return TicketVALCARA;
  } else if (idEmpresa === 53 || idEmpresa === 54) {
    return TicketYPF;
  } else if (idEmpresa === 55) {
    return TicketOperadora;
  }

  // Por defecto
  return TicketPETRORAFAELA;
};

const verTodosTickets = async () => {
  for (const t of resultado.value) {
    if (!detallesPorTicket.value.has(t.NroComprobante)) {
      await obtenerDetalleImpuesto(t);
    }
  }

  mostrarTicket.value = true;
};
</script>

<style scoped>
input[type="date"]::-webkit-calendar-picker-indicator {
  filter: invert(0);
}
</style>
