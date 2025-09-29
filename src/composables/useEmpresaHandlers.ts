// composables/useEmpresaHandlers.ts
import { useEmpresas } from "./useEmpresas";
import type { Empresa } from "@/types/empresa";

export function useEmpresaHandlers() {
  const { updateEmpresa, deleteEmpresa, error } = useEmpresas();

  const handleEmpresaUpdate = async (
    formData: any,
    index: number,
    empresas: Empresa[]
  ): Promise<boolean> => {
    try {
      console.log("Actualizando empresa:", formData, "en índice:", index);

      const empresa = empresas[index];
      if (!empresa?.id) {
        console.error("No se pudo encontrar la empresa o falta el ID");
        return false;
      }

      const success = await updateEmpresa(formData, empresa.id, "CTA");

      if (success) {
        console.log("Empresa actualizada correctamente");
        return true;
      } else {
        console.error("Error al actualizar empresa");
        alert("Error al actualizar la empresa. " + error.value);
        return false;
      }
    } catch (err) {
      console.error("Error inesperado al actualizar empresa:", err);
      alert("Error inesperado al actualizar la empresa");
      return false;
    }
  };

  const handleEmpresaDelete = async (
    index: number,
    empresas: Empresa[]
  ): Promise<boolean> => {
    try {
      console.log("Eliminando empresa en índice:", index);

      if (!confirm("¿Está seguro de que desea eliminar esta empresa?")) {
        return false;
      }

      const empresa = empresas[index];
      if (!empresa?.id) {
        console.error("No se pudo encontrar la empresa o falta el ID");
        return false;
      }

      const success = await deleteEmpresa(empresa.id, "CTA");

      if (success) {
        console.log("Empresa eliminada correctamente");
        return true;
      } else {
        console.error("Error al eliminar empresa");
        alert("Error al eliminar la empresa. " + error.value);
        return false;
      }
    } catch (err) {
      console.error("Error inesperado al eliminar empresa:", err);
      alert("Error inesperado al eliminar la empresa");
      return false;
    }
  };

  return {
    handleEmpresaUpdate,
    handleEmpresaDelete,
  };
}