/**
 * Formatea una fecha ISO a dd/mm/yyyy
 */
export function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const [year, month, day] = dateStr.split("T")[0].split("-");
  return `${day}/${month}/${year}`;
}


/**
 * Formatea un CUIT a la forma XX-XXXXXXXX-X
 */
export function formatCuit(cuit: string): string {
  if (!cuit) return "";
  // eliminamos todo lo que no sea número
  const digits = cuit.replace(/\D/g, "");
  if (digits.length !== 11) return cuit; // si no tiene 11 dígitos lo devuelvo tal cual

  return `${digits.substring(0, 2)}-${digits.substring(2, 10)}-${digits.substring(10)}`;
}

/**
 * Valida si un CUIT es correcto según su dígito verificador.
 * Retorna true si es válido, false en caso contrario.
 */
export function validarCuit(cuit: string): boolean {
  if (!cuit) return false;

  // eliminamos todo lo que no sea número
  const digits = cuit.replace(/\D/g, "");
  if (digits.length !== 11) return false;

  const coeficientes = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
  let suma = 0;

  for (let i = 0; i < 10; i++) {
    suma += parseInt(digits[i]) * coeficientes[i];
  }

  const resto = suma % 11;
  let digitoVerificador = 11 - resto;

  if (digitoVerificador === 11) digitoVerificador = 0;
  if (digitoVerificador === 10) digitoVerificador = 9;

  return digitoVerificador === parseInt(digits[10]);
}


/**
 * Capitaliza la primera letra de cada palabra
 * ej: "buenos aires" -> "Buenos Aires"
 */
export function capitalizeWords(text: string): string {
  if (!text) return "";
  return text
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}
