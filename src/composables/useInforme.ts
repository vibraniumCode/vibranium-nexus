import { ref } from "vue";
import axios from "axios";
import type { resumen } from "@/types/resumen"

const apiUrl = "https://vibranium-nexus-backend.onrender.com/api";

export const useInforme = () => {
  const loading = ref(false);
  const error = ref<string | null>(null);
  const informes = ref<any[]>([]);
  const resumenRS = ref<resumen[]>([]);

  // ✅ RECIBE STRING EN FORMATO YYYY-MM-DD O DD/MM/YYYY
  const generarInformes = async (
    fechaDesde: string,
    fechaHasta: string
  ) => {
    try {
      loading.value = true;
      error.value = null;

      // ✅ VALIDAR QUE LAS FECHAS NO ESTÉN VACÍAS
      if (!fechaDesde || !fechaHasta) {
        error.value = "Por favor selecciona un rango de fechas";
        return { success: false, message: error.value, data: null };
      }

      // ✅ CONVERTIR FORMATO SI VIENE EN YYYY-MM-DD
      const formatoFechaDesde = formatearFecha(fechaDesde);
      const formatoFechaHasta = formatearFecha(fechaHasta);
      console.log("Fechas formateadas:", formatoFechaDesde, formatoFechaHasta);
      const { data } = await axios.post(`${apiUrl}/informes`, {
        fechaDesde: formatoFechaDesde,
        fechaHasta: formatoFechaHasta,
      });

      console.log("Informes generados:", data);
      informes.value = data || [];

      return {
        success: true,
        data: data,
        message: "Informes generados exitosamente",
      };
    } catch (err: any) {
      error.value =
        err.response?.data?.message ||
        err.message ||
        "Error al generar los informes";

      return { success: false, message: error.value, data: null };
    } finally {
      loading.value = false;
    }
  };

  // ✅ FUNCIÓN PARA FORMATEAR LA FECHA A YYYY-MM-DD
  const formatearFecha = (fecha: string): string => {
    if (!fecha) return "";

    // Si viene como YYYY-MM-DD, devolver igual
    if (fecha.includes("-") && fecha.length === 10) {
      return fecha;
    }

    // Si viene como DD/MM/YYYY, convertir a YYYY-MM-DD
    if (fecha.includes("/")) {
      const [day, month, year] = fecha.split("/");
      return `${year}-${month}-${day}`;
    }

    return fecha;
  };

  const limpiar = () => {
    error.value = null;
  };

  // Función para descargar PDF
  const descargarPDF = async () => {
    if (!informes.value || informes.value.length === 0) {
      error.value = "No hay datos para descargar";
      return;
    }

    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // Título
      doc.setFontSize(16);
      doc.text("Informe de Comprobantes", doc.internal.pageSize.getWidth() / 2, 20, {
        align: "center",
      });

      // Fecha de generación
      doc.setFontSize(10);
      doc.text(
        `Generado el: ${new Date().toLocaleDateString("es-ES")}`,
        doc.internal.pageSize.getWidth() / 2,
        30,
        { align: "center" }
      );

      // Datos de la tabla
      const columns = ["Fecha", "Hora", "Ticket", "Litros", "Importe"];
      const rows = informes.value.map((row) => [
        row.FECHA || "",
        row.HORA || "",
        row.N_FACTURA || "",
        String(row.N_LITROS || ""),
        String(row.IMPORTE || ""),
      ]);

      // Usar autoTable para generar la tabla
      const { autoTable } = await import("jspdf-autotable");
      autoTable(doc, {
        head: [columns],
        body: rows,
        startY: 40,
        margin: { top: 40, left: 10, right: 10, bottom: 10 },
        styles: {
          fontSize: 10,
          cellPadding: 5,
        },
        headStyles: {
          fillColor: [79, 70, 229], // indigo
          textColor: 255,
          fontStyle: "bold",
          align: "center",
        },
        bodyStyles: {
          align: "left",
        },
        columnStyles: {
          3: { align: "right" }, // Litros
          4: { align: "right" }, // Importe
        },
      });

      // Descargar
      doc.save(`Informes_${new Date().toISOString().split("T")[0]}.pdf`);
    } catch (err) {
      error.value = "Error al descargar PDF";
      console.error("Error descargando PDF:", err);
    }
  };

  const getResumen = async () => {
    try {
      loading.value = true;
      error.value = null;

      const { data } = await axios.get<resumen[]>(
        `${apiUrl}/informes`
      );

      if (Array.isArray(data)) {
        resumenRS.value = data;
        return data;
      } else {
        throw new Error("La respuesta no es un array válido");
      }
    } catch (err: any) {
      error.value = err.message || "Error al obtener el resumen";
      console.error("Error al obtener el resumen:", err);
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    error,
    informes,
    generarInformes,
    limpiar,
    descargarPDF,
    getResumen,
  };
};