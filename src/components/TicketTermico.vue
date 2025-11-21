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
      <div class="text-center border-b border-black pb-2 mb-2">
        <p class="font-bold text-sm">{{ empresa.nombre }}</p>
        <p class="text-xs">{{ empresa.cuit }}</p>
        <p class="text-xs">{{ empresa.direccion }}</p>
        <p class="text-xs">{{ empresa.telefono }}</p>
      </div>

      <!-- Tipo de comprobante -->
      <div class="text-center border-b border-black pb-2 mb-2">
        <p class="font-bold text-sm">FACTURA {{ tipoComprobante }}</p>
        <p class="text-xs">Nº {{ numeroComprobante }}</p>
      </div>

      <!-- Datos cliente -->
      <div class="border-b border-black pb-2 mb-2">
        <p class="font-bold text-xs">CLIENTE:</p>
        <p class="text-xs">{{ cliente.nombre }}</p>
        <p class="text-xs">CUIT/CUIL: {{ cliente.cuit }}</p>
        <p class="text-xs">{{ cliente.direccion }}</p>
      </div>

      <!-- Fecha y hora -->
      <div class="border-b border-black pb-2 mb-2">
        <p class="text-xs">Fecha: {{ formatoFecha }}</p>
        <p class="text-xs">Hora: {{ formatoHora }}</p>
      </div>

      <!-- Detalles de productos -->
      <div class="border-b border-black pb-2 mb-2">
        <div
          class="flex justify-between font-bold text-xs mb-1 border-b border-dashed pb-1"
        >
          <span class="flex-1">DESCRIPCIÓN</span>
          <span class="w-16 text-right">CANTIDAD</span>
          <span class="w-20 text-right">TOTAL</span>
        </div>
        <div v-for="item in items" :key="item.id" class="mb-1">
          <div class="flex justify-between text-xs">
            <span class="flex-1">{{ item.descripcion }}</span>
            <span class="w-16 text-right">{{ item.cantidad }}</span>
            <span class="w-20 text-right"
              >${{ formatoMoneda(item.total) }}</span
            >
          </div>
          <div class="text-xs text-gray-600">
            {{ item.cantidad }} x ${{ formatoMoneda(item.precio) }}
          </div>
        </div>
      </div>

      <!-- Totales -->
      <div class="border-b border-black pb-2 mb-2">
        <div class="flex justify-between text-xs mb-1">
          <span>Subtotal:</span>
          <span>${{ formatoMoneda(subtotal) }}</span>
        </div>
        <div v-if="descuento > 0" class="flex justify-between text-xs mb-1">
          <span>Descuento:</span>
          <span>-${{ formatoMoneda(descuento) }}</span>
        </div>
        <div class="flex justify-between text-xs mb-1">
          <span>IVA ({{ porcentajeIVA }}%):</span>
          <span>${{ formatoMoneda(iva) }}</span>
        </div>
        <div
          class="flex justify-between font-bold text-sm border-t border-black pt-1"
        >
          <span>TOTAL:</span>
          <span>${{ formatoMoneda(total) }}</span>
        </div>
      </div>

      <!-- Método de pago -->
      <div class="text-center border-b border-black pb-2 mb-2">
        <p class="font-bold text-xs">MÉTODO DE PAGO</p>
        <p class="text-xs">{{ metodoPago }}</p>
      </div>

      <!-- Pie -->
      <div class="text-center text-xs">
        <p class="text-xs">Gracias por su compra</p>
        <p class="text-xs">{{ empresa.leyenda }}</p>
        <p class="text-xs mt-2">{{ new Date().toLocaleString() }}</p>
      </div>

      <!-- Líneas de corte -->
      <div class="text-center text-xs mt-2 text-gray-600">
        - - - - - - - - - - - - - - - - - - - - - -
      </div>
    </div>

    <!-- Botones de acción -->
    <div class="flex gap-2">
      <button
        @click="imprimirTicket"
        class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Imprimir
      </button>
      <button
        @click="descargarPDF"
        class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Descargar PDF
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
  telefono: string;
  leyenda: string;
}

interface Cliente {
  nombre: string;
  cuit: string;
  direccion: string;
}

interface Item {
  id: number;
  descripcion: string;
  cantidad: number;
  precio: number;
  total: number;
}

const props = withDefaults(
  defineProps<{
    empresa?: Empresa;
    cliente?: Cliente;
    items?: Item[];
    numeroComprobante?: string;
    tipoComprobante?: string;
    metodoPago?: string;
    descuento?: number;
    porcentajeIVA?: number;
    fecha?: Date;
  }>(),
  {
    empresa: () => ({
      nombre: "ESTACIÓN DE SERVICIO",
      cuit: "30-12345678-9",
      direccion: "Av. Principal 123",
      telefono: "(011) 1234-5678",
      leyenda: "Ley de IVA 23.349",
    }),
    cliente: () => ({
      nombre: "CLIENTE FINAL",
      cuit: "S/D",
      direccion: "S/D",
    }),
    items: () => [
      {
        id: 1,
        descripcion: "Nafta Premium",
        cantidad: 50,
        precio: 100,
        total: 5000,
      },
    ],
    numeroComprobante: "0001-00000001",
    tipoComprobante: "B",
    metodoPago: "Efectivo",
    descuento: 0,
    porcentajeIVA: 21,
    fecha: () => new Date(),
  }
);

const ticketRef = ref<HTMLElement>();

const formatoFecha = computed(() => {
  return props.fecha?.toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
});

const formatoHora = computed(() => {
  return props.fecha?.toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
});

const subtotal = computed(() => {
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

  // Esperar a que cargue y luego imprimir
  setTimeout(() => {
    printWindow.print();
  }, 250);
};

const descargarPDF = async () => {
  // Nota: Requiere instalar html2pdf
  // npm install html2pdf.js
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
