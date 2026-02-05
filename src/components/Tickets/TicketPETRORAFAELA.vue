<template>
  <div class="w-full flex justify-center mb-10">
    <div
      ref="ticketRef"
      class="bg-white p-4 font-mono text-xs text-black"
      style="width: 80mm; max-width: 80mm"
    >
      <!-- Encabezado -->
      <div
        class="text-sm text-left border-b border-dashed border-black pb-2 mb-2"
      >
        <p class="">{{ empresa.nombre }}</p>
        <p class="">C.U.I.T. Nro.: {{ empresa.cuit }}</p>
        <p class="">Domicilio: {{ empresa.direccion }} CP: {{ empresa.cp }}</p>
        <p class="">{{ empresa.localidad }} - {{ empresa.provincia }}</p>
        <p class="">TEL.: {{ empresa.telefono }}</p>
        <p>Inicio de Actividades: {{ empresa.Actividad }}</p>
        <p class="text-center font-bold text-lg">{{ empresa.nombre }}</p>
      </div>

      <!-- Ticket nro -->
      <div class="border-b border-dashed border-black pb-2 mb-2">
        <p class="text-sm">
          <span class="font-bold"
            >TIQUEL FACTURA "{{ tipoComprobante }}" &lcub;Cod.081&rcub; N°</span
          >{{ numeroComprobante }}
        </p>
        <p class="text-right">Fecha {{ fecha }}</p>
        <p class="text-right">Hora {{ hora }}</p>
      </div>

      <!-- Datos cliente -->
      <div class="border-b border-dashed pb-2 mb-2">
        <p class="text-xs">{{ cliente.nombre }}</p>
        <p class="text-xs">C.U.I.T.: Nro.: {{ cliente.cuit }}</p>
        <p>IVA RESPONSABLE INSCRIPTO</p>
        <p class="text-xs">{{ cliente.direccion }}</p>
        <p>CONTADO</p>
        <p>COMPROBANTE ASOCIADOS:</p>
        <p class="flex justify-between items-center">
          <span>Cód. 001</span>
          <span>00001-00000001</span>
        </p>
        <p class="text-center font-bold text-lg">{{ empresa.nombre }}</p>
      </div>
      <h1>asdkanskdn</h1>
      <!-- ✅ ARREGLADO #1: DETALLE DE LITROS - FORMATO EXACTO "50 X 122.34" -->
      <div v-if="detalleImporteGeneralArray.length > 0" class="">
        <div v-if="detalleImporteGeneralArray.length > 0" class="">
          <div
            v-for="(detalle, index) in detalleImporteGeneralArray"
            :key="index"
            class=""
          >
            <span class="text-xs"
              >{{ detalle.Litros }} X
              {{ formatoMoneda(detalle.NetoPorLitro) }}</span
            >
          </div>
        </div>
        <div v-for="item in items" :key="item.id" class="mb-1">
          <div class="flex justify-between text-xs">
            <span class="flex-1"
              >({{ item.idCombustible }}){{ item.descripcion }}</span
            >
          </div>

          <div v-if="impuestoITC" class="pb-2 mb-2">
            <p class="text-xs">
              ITC Unit. x Lt: {{ formatoMoneda(impuestoITC.ImportePorLitro) }}
            </p>
            <!-- ✅ NETO TOTAL EN LA MISMA LÍNEA -->
            <div
              v-if="detalleFinalArray && detalleFinalArray.length > 0"
              class="flex justify-between text-xs"
            >
              <span>{{ DLitros }} x {{ pneto }} (21)[83,88]</span>
              <span>{{ formatoMoneda(detalleFinalArray[0].NetoTotal) }}</span>
            </div>
            <div class="flex justify-between text-xs">
              <span>Ajuste por redondeo</span>
              <span>(21)</span>
              <span>0,00</span>
            </div>
            &nbsp;
            <div class="flex justify-between text-xs">
              <span>SUBTOTAL. IMP. NETO GRAVADO</span>
              <span>{{ formatoMoneda(detalleFinalArray[0].NetoTotal) }}</span>
            </div>
            &nbsp;
            <div v-if="impuestoIva" class="flex justify-between text-xs">
              <span>ALICUOTA 21,00%</span>
              <span>{{ formatoMoneda(impuestoIva.ImporteTotal) }}</span>
            </div>
            &nbsp;
            <div
              v-for="impuesto in impuestosOtros"
              :key="impuesto.Tipo"
              class="flex justify-between text-xs"
            >
              <span>{{ impuesto.Tipo }}</span>
              <span>{{ formatoMoneda(impuesto.ImporteTotal) }}</span>
            </div>
            <div
              v-if="detalleFinalArray && detalleFinalArray.length > 0"
              class="flex justify-between text-xs"
            >
              <span>IMPORTE TOTAL OTROS TRIBUTOS </span>
              <span>{{
                formatoMoneda(detalleFinalArray[0].ImpuestosTotales)
              }}</span>
            </div>
            &nbsp;
            <div class="flex justify-between text-sm">
              <span>TOTAL</span>
              <span>{{ formatoMoneda(subtotal) }}</span>
            </div>
            &nbsp;
            <div class="flex flex-col text-xs">
              <span>RECIBI/MOS</span>
              <span>Cant. Cuota: 1</span>
              <span>Efectivo</span>
              <span class="ml-4 italic">CF</span>
            </div>
          </div>
        </div>
      </div>
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
  },
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
    0,
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
    (imp) => imp.Tipo !== "ITC" && imp.Tipo !== "IVA",
  );
});

const subtotal = computed(() => {
  // Si hay detalleImporteGeneral, usar TotalFinal
  if (detalleImporteGeneralArray.value.length > 0) {
    return detalleImporteGeneralArray.value.reduce(
      (sum, item) => sum + item.TotalFinal,
      0,
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
      ((subtotalConDescuento.value * props.porcentajeIVA) / 100) * 100,
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

  // Obtener solo el HTML del ticket
  const ticketHTML = ticketRef.value.innerHTML;

  // Crear el documento HTML completo para imprimir
  const htmlCompleto = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>Ticket</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          html, body {
            width: 80mm;
            height: auto;
            margin: 0;
            padding: 0;
            background: white;
          }
          
          body {
            font-family: 'Courier New', monospace;
            font-size: 10px;
            line-height: 1.3;
            width: 80mm;
            text-align: left;
          }
          
          .ticket {
            width: 80mm;
            padding: 3mm;
            margin: 0;
            background: white;
            font-size: 10px;
            text-align: left;
          }
          
          p {
            margin: 0;
            padding: 0;
            line-height: 1.3;
          }
          
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
              padding: 3mm;
            }
          }
        </style>
      </head>
      <body>
        <div class="ticket">
          ${ticketHTML}
        </div>
      </body>
    </html>
  `;

  // Abrir ventana de impresión
  const printWindow = window.open("", "", "width=400,height=600");
  if (!printWindow) {
    console.error("No se pudo abrir la ventana de impresión");
    return;
  }

  // Escribir el HTML en la ventana
  printWindow.document.write(htmlCompleto);
  printWindow.document.close();

  // Esperar a que se renderice y luego abrir el diálogo de impresión
  setTimeout(() => {
    printWindow.focus();
    printWindow.print();

    // Cerrar la ventana después de imprimir
    setTimeout(() => {
      printWindow.close();
    }, 500);
  }, 300);
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
