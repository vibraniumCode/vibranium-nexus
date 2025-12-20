import { useCombustibles } from "./useCombustible";
import type { Combustible } from "@/types/combustible";
import Swal from "sweetalert2";

export function useCombustibleHandlers() {
  const { updateCombustiblePrice, error } = useCombustibles();

  const handleCombustiblePriceUpdate = async (
    id: number,
    newPrice: number,
    combustibles: Combustible[]
  ): Promise<boolean> => {
    try {
      console.log("Actualizando precio de combustible ID:", id, "a nuevo precio:", newPrice);

      const combustible = combustibles[id];
      if (!combustible?.id) {
        console.error("No se pudo encontrar el combustible o falta el ID");
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Error al actualizar el precio del combustible.",
          text: "No se pudo encontrar el combustible o falta el ID",
          showConfirmButton: false,
          timer: 2500,
        });
        return false;
      }

      const success = await updateCombustiblePrice(
        id,
        newPrice
      );

      if (success) {
        console.log("Precio de combustible actualizado correctamente");
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Precio de combustible actualizado correctamente.",
          showConfirmButton: false,
          timer: 1500
        });
        return success;
      } else {
        console.error("Error al actualizar el precio del combustible");
        const errorMessagge = error.value ? `Detalles: ${error.value}` : "";

        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Error al actualizar el precio del combustible.",
          text: errorMessagge,
          showConfirmButton: false,
          timer: 2500,
        });

        return false;
      }
    } catch (e) {
      console.error("Error inesperado actualizando el precio del combustible:", e);
      const errorMessagge = e instanceof Error ? e.message : String(e);
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Error inesperado actualizando el precio del combustible.",
        text: errorMessagge,
        showConfirmButton: false,
        timer: 2500,
      });
      return false;
    }
  }
  return {
    handleCombustiblePriceUpdate
  }
}