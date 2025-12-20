<template>
  <div class="flex flex-col items-center gap-4">
    <!-- Vista previa del ticket -->
    <div
      ref="ticketRef"
      class="w-80 bg-white p-4 font-mono text-xs text-black mx-auto"
      style="
        font-family: 'Courier New', monospace;
        line-height: 1.4;
        width: 80mm;
        box-sizing: border-box;
      "
    >
      <!-- Encabezado -->
      <div
        class="text-sm text-left border-b border-dashed border-black pb-2 mb-2"
      >
        <p class="">{{ empresa.nombre }}</p>
        <p class="">C.U.I.T. Nro.: {{ empresa.cuit }}</p>
        <p class="">Ing. Brutos: {{ empresa.ingBrutos }}</p>
        <p class="">
          Domicilio: {{ empresa.direccion }} - C.P. {{ empresa.cp }}
        </p>
        <p>{{ empresa.localidad }} - PCIA DE {{ empresa.provincia }}</p>
        <p>Inicio de Actividades: {{ empresa.Actividad }}</p>
        <p>IVA RESPONSABLE INSCRIPTO</p>
      </div>

      <!-- Ticket nro -->
      <div class="border-b border-dashed border-black pb-2 mb-2">
        <div class="flex justify-between">
          <span class="">TIQUEL FACTURA {{ tipoComprobante }} (Cód. 081)</span>
          <span>N° {{ numeroComprobante }}</span>
        </div>
        <div class="">
          <p class="text-right">Fecha {{ fecha }}</p>
          <p class="text-right">Hora {{ hora }}</p>
        </div>
      </div>

      <!-- Datos cliente -->
      <div class="border-b border-dashed pb-2 mb-2">
        <p class="text-xs">{{ cliente.nombre }}</p>
        <p class="text-xs">C.U.I.T.: Nro.: {{ cliente.cuit }}</p>
        <p>IVA RESPONSABLE INSCRIPTO</p>
        <p class="text-xs">{{ cliente.direccion }}</p>
        <p>Cond. Vta: CONTADO</p>
        <p>COMPROBANTES ASOCIADOS:</p>
        <div class="flex justify-between">
          <span class="text-xs">Cód. 001</span>
          <span class="text-xs">00001-00000001</span>
        </div>
      </div>

      <!-- ✅ ARREGLADO #1: DETALLE DE LITROS - FORMATO EXACTO "50 X 122.34" -->
      <div>
        <div v-for="item in items" :key="item.id" class="mb-1">
          <div class="flex justify-between text-xs">
            <span>{{ DLitros }} x {{ pneto }}</span>
          </div>
          <span class="flex-1">{{ item.descripcion }}</span>
        </div>
        <div v-if="impuestoITC">
          <div
            v-for="(detalleFinal, indexFinal) in detalleFinalArray"
            :key="indexFinal"
          >
            <div class="flex justify-between">
              <p class="text-xs">
                Valor {{ impuestoITC.Tipo }} ${{
                  formatoMoneda(impuestoITC.ImportePorLitro)
                }}
                (21)[90,95]
              </p>
              <span>{{ formatoMoneda(detalleFinal.NetoTotal) }}</span>
            </div>
            &nbsp;
            <div class="flex justify-between">
              <p>SUBTOT. IMP. NETO GRAVADO</p>
              <p>{{ formatoMoneda(detalleFinal.NetoTotal) }}</p>
            </div>
            &nbsp;
            <div class="flex justify-between" v-if="impuestoIva">
              <p>ALICUOTA 21,00%</p>
              <p>{{ formatoMoneda(impuestoIva.ImporteTotal) }}</p>
            </div>
            &nbsp;
            <div v-for="impuesto in impuestosOtros" :key="impuesto.Tipo">
              <div class="flex justify-between">
                <p>{{ impuesto.Tipo }}</p>
                <p>{{ formatoMoneda(impuesto.ImporteTotal) }}</p>
              </div>
              <div class="flex justify-between">
                <p>IMPORTE TOTAL OTROS TRIBUTOS</p>
                <P>{{ formatoMoneda(impuesto.ImporteTotal) }}</P>
              </div>
              &nbsp;
              <div
                v-for="(detalle, index) in detalleImporteGeneralArray"
                :key="index"
              >
                <div class="flex justify-between">
                  <p>TOTAL</p>
                  <p>{{ formatoMoneda(detalle.TotalFinal) }}</p>
                </div>
                &nbsp;
                <p>RECIBI/MOS</p>
                <div class="flex justify-between">
                  <p>Efectivo</p>
                  <p>{{ formatoMoneda(detalle.TotalFinal) }}</p>
                </div>
                <div class="flex justify-between">
                  <p>Suma de sus pagos</p>
                  <p>{{ formatoMoneda(detalle.TotalFinal) }}</p>
                </div>
                <div class="flex justify-between">
                  <p>Su vuelto</p>
                  <p>0,00</p>
                </div>
                <p class="italic">CF</p>
                <p class="text-center">REGISTRO: EPEPAA0000032653</p>
                <p class="text-center">V: 1.02 Jano</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Botones de acción - FUERA DEL TICKET -->
    <div class="flex gap-2">
      <button
        @click="imprimirTicket"
        class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Imprimir
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

interface Empresa {
  nombre: string;
  cuit: string;
  direccion: string;
  cp: string;
  localidad: string;
  provincia: string;
  telefono: string;
  Actividad: Date;
  leyenda: string;
}

interface Cliente {
  nombre: string;
  cuit: string;
  direccion: string;
}

interface Item {
  id: number;
  idCombustible: number;
  descripcion: string;
  cantidad: number;
  precio: number;
  total: number;
}

interface DetalleImporte {
  Litros: number;
  TotalFinal: number;
  PrecioFinalPorLitro: number;
  NetoPorLitro: number;
}

interface DetalleImpuesto {
  Tipo: string;
  ImportePorLitro: number;
  ImporteTotal: number;
}

interface DetalleFinal {
  NetoTotal: number;
  ImpuestosTotales: number;
}

const props = withDefaults(
  defineProps<{
    empresa?: Empresa;
    cliente?: Cliente;
    items?: Item[];
    detalleImporteGeneral?: DetalleImporte[] | null;
    detalleImpuestos?: DetalleImpuesto[] | null;
    detalleFinal?: DetalleFinal[] | null;
    numeroComprobante?: string;
    tipoComprobante?: string;
    metodoPago?: string;
    descuento?: number;
    porcentajeIVA?: number;
    fecha?: Date;
  }>(),
  {
    numeroComprobante: "0001-00000001",
    tipoComprobante: "A",
    metodoPago: "Efectivo",
    descuento: 0,
    porcentajeIVA: 21,
    fecha: () => new Date(),
  }
);

const ticketRef = ref<HTMLElement>();
const fechaSistema = new Date();
const fecha =
  props.fecha?.toLocaleDateString() || fechaSistema.toLocaleDateString();
const hora = fechaSistema.toLocaleTimeString();
const DLitros = props.items?.reduce((sum, item) => sum + item.cantidad, 0) || 0;
const pneto =
  props.detalleImporteGeneral?.reduce(
    (sum, det) => det.PrecioFinalPorLitro,
    0
  ) || 0;

const detalleImporteGeneralArray = computed(() => {
  if (Array.isArray(props.detalleImporteGeneral)) {
    return props.detalleImporteGeneral;
  }
  return [];
});

const detalleImpuestosArray = computed(() => {
  if (Array.isArray(props.detalleImpuestos)) {
    return props.detalleImpuestos;
  }
  return [];
});

const detalleFinalArray = computed(() => {
  if (Array.isArray(props.detalleFinal)) {
    console.log("detalleFinalArray:", props.detalleFinal[0]);
    return props.detalleFinal;
  }
  return [];
});

// ✅ NUEVO: FILTRAR ITC
const impuestoITC = computed(() => {
  return detalleImpuestosArray.value.find((imp) => imp.Tipo === "ITC") || null;
});

const impuestoIva = computed(() => {
  return detalleImpuestosArray.value.find((imp) => imp.Tipo === "IVA") || null;
});

// ✅ NUEVO: TODOS LOS IMPUESTOS MENOS ITC
const impuestosOtros = computed(() => {
  return detalleImpuestosArray.value.filter(
    (imp) => imp.Tipo !== "ITC" && imp.Tipo !== "IVA"
  );
});

const subtotal = computed(() => {
  // Si hay detalleImporteGeneral, usar TotalFinal
  if (detalleImporteGeneralArray.value.length > 0) {
    return detalleImporteGeneralArray.value.reduce(
      (sum, item) => sum + item.TotalFinal,
      0
    );
  }
  // Si no, usar items
  return props.items?.reduce((sum, item) => sum + item.total, 0) || 0;
});

const descuentoCalculado = computed(() => props.descuento || 0);

const subtotalConDescuento = computed(() => {
  return subtotal.value - descuentoCalculado.value;
});

const iva = computed(() => {
  return (
    Math.round(
      ((subtotalConDescuento.value * props.porcentajeIVA) / 100) * 100
    ) / 100
  );
});

const total = computed(() => {
  return subtotalConDescuento.value + iva.value;
});

const formatoMoneda = (valor: number) => {
  return valor.toFixed(2);
};

const imprimirTicket = () => {
  if (!ticketRef.value) return;

  const printWindow = window.open("", "", "width=400,height=800");
  if (!printWindow) return;

  const styles = `
    <style>
      @media print {
        * {
          margin: 0;
          padding: 0;
        }
        body {
          width: 80mm;
          margin: 0;
          padding: 0;
        }
        .ticket {
          width: 80mm;
          margin: 0;
          padding: 0;
          page-break-after: auto;
        }
      }
      body {
        font-family: 'Courier New', monospace;
        margin: 0;
        padding: 0;
        background: white;
      }
      .ticket {
        width: 80mm;
        margin: 0;
        padding: 4mm;
        font-size: 11px;
        line-height: 1.4;
        box-sizing: border-box;
      }
      p { margin: 0; padding: 0; }
    </style>
  `;

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>Ticket</title>
        ${styles}
      </head>
      <body>
        <div class="ticket">
          ${ticketRef.value.innerHTML}
        </div>
      </body>
    </html>
  `);
  printWindow.document.close();

  setTimeout(() => {
    printWindow.print();
  }, 250);
};

const descargarPDF = async () => {
  try {
    const element = ticketRef.value;
    if (!element) return;

    const opt = {
      margin: 5,
      filename: `ticket-${props.numeroComprobante}.pdf`,
      image: { type: "png", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const html2pdf = (window as any).html2pdf;
    if (html2pdf) {
      html2pdf().set(opt).from(element).save();
    }
  } catch (err) {
    console.error("Error descargando PDF:", err);
  }
};
</script>

<style scoped>
* {
  box-sizing: border-box;
}
</style>
