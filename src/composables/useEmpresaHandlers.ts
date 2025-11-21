// composables/useEmpresaHandlers.ts
import { useEmpresas } from "./useEmpresas";
import { useToast } from "vue-toast-notification";
import type { Empresa } from "@/types/empresa";
import Swal from "sweetalert2";

export function useEmpresaHandlers() {
  const { updateEmpresa, deleteEmpresa, createEmpresa, fetchEmpresas, error } = useEmpresas();
  const $toast = useToast();

  const handleEmpresaUpdate = async (
    formData: any,
    index: number,
    empresas: Empresa[]
  ): Promise<boolean> => {
    try {
      const empresa = empresas[index];
      if (!empresa?.id) {
        ($toast as any).error("Error", { description: "No se pudo encontrar la empresa" });
        return false;
      }

      // ✅ AHORA RETORNA UN OBJETO
      const resultado = await updateEmpresa(
        formData.nombre || empresa.nombre,
        formData.cuit || empresa.cuit,
        formData.ingBrutos || empresa.ingBrutos,
        formData.direccion || empresa.direccion,
        formData.cp || empresa.cp,
        formData.localidad || empresa.localidad,
        formData.provincia || empresa.provincia,
        formData.telefono || empresa.telefono,
        formData.Actividad || empresa.actividad,
        1,
        empresa.id,
        "EDIT"
      );

      // ✅ VERIFICAR EL OBJETO RESULTADO
      if (resultado.success) {
        ($toast as any).success("Se actualizó correctamente", { description: resultado.message });
        empresas[index] = { ...empresas[index], ...formData };
        return true;
      } else {
        ($toast as any).error("Error", { description: resultado.message });
        return false;
      }
    } catch (err: any) {
      ($toast as any).error("Error", { description: err.message || "Error inesperado" });
      return false;
    }
  };

  const handleEmpresaDelete = async (index: number, empresas: Empresa[]) => {
    try {
      const empresa = empresas[index];
      if (!empresa?.id) {
        ($toast as any).error("Error", { description: "No se pudo encontrar la empresa" });  // ✅ CAMBIAR
        return false;
      }

      const result = await Swal.fire({
        title: "¿Está seguro de que desea eliminar esta empresa?",
        showDenyButton: true,
        confirmButtonText: "Sí",
        denyButtonText: "No",
      });

      if (!result.isConfirmed) {
        ($toast as any).info("Eliminación cancelada");  // ✅ CAMBIAR
        return false;
      }

      const success = await deleteEmpresa("DLET", empresa.id);
      if (success) {
        ($toast as any).success("¡Éxito!", { description: "Empresa eliminada correctamente" });  // ✅ CAMBIAR
        await fetchEmpresas("CTA");
        return true;
      } else {
        ($toast as any).error("Error", { description: error.value || "No se pudo eliminar la empresa" });  // ✅ CAMBIAR
        return false;
      }
    } catch (err: any) {
      ($toast as any).error("Error", { description: err.message || "Error inesperado" });  // ✅ CAMBIAR
      return false;
    }
  };

  const handleEmpresaCreate = async (formData: any): Promise<boolean> => {
    try {
      console.log("Creando empresa con datos:", formData);
      const resultado = await createEmpresa(
        formData.nombre,
        formData.cuit,
        formData.ingBrutos,
        formData.direccion,
        formData.cp,
        formData.localidad,
        formData.provincia,
        formData.telefono,
        formData.actividad,
        1,
        "NEW"
      );
      if (resultado.success) {
        ($toast as any).success(resultado.message);  // ✅ SOLO UN PARÁMETRO
        return true;
      } else {
        ($toast as any).error(resultado.message);  // ✅ SOLO UN PARÁMETRO
        return false;
      }
    } catch (err: any) {
      ($toast as any).error(err.message || "Error inesperado");  // ✅ SOLO UN PARÁMETRO
      return false;
    }
  };

  return {
    handleEmpresaUpdate,
    handleEmpresaDelete,
    handleEmpresaCreate,
  };
}