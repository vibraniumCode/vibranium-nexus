// composables/useEmpresaHandlers.ts
import { useEmpresas } from "./useEmpresas";
import type { Empresa } from "@/types/empresa";

export function useEmpresaHandlers() {
  const { updateEmpresa, error } = useEmpresas();

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

      // Llamar a la función updateEmpresa con todos los parámetros requeridos
      const success = await updateEmpresa(
        formData.nombre || empresa.nombre,
        formData.cuit || empresa.cuit,
        formData.ingBrutos || empresa.ingBrutos,
        formData.direccion || empresa.direccion,
        formData.cp || empresa.cp,
        formData.localidad || empresa.localidad,
        formData.provincia || empresa.provincia,
        formData.telefono || empresa.telefono,
        // actividadDate,
        formData.Actividad || empresa.actividad,
        1, // idUser - ajustar según tu lógica de autenticación
        empresa.id,
        "EDIT"
      );

      if (success) {
        console.log("Empresa actualizada correctamente");
        //hace una actualización inmutable del objeto en la posición index del array empresas
        empresas[index] = { ...empresas[index], ...formData };
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

      // Aquí necesitarías implementar la función deleteEmpresa en useEmpresas
      // const success = await deleteEmpresa(empresa.id, "CTA");

      // Por ahora, comentado hasta que implementes deleteEmpresa
      console.warn("Función deleteEmpresa no implementada aún");
      return false;

      // if (success) {
      //   console.log("Empresa eliminada correctamente");
      //   // Eliminar del array local
      //   empresas.splice(index, 1);
      //   return true;
      // } else {
      //   console.error("Error al eliminar empresa");
      //   alert("Error al eliminar la empresa. " + error.value);
      //   return false;
      // }
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