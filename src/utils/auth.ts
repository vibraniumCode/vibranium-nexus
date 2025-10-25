export function setAuthToken(token: string, tokenExpiration: number) {
  const expirationTime = tokenExpiration * 1000;
  // Guardar el token y la fecha de expiración en el localStorage
  localStorage.setItem('token', token);
  localStorage.setItem('token_expiration', expirationTime.toString());
}

export function getAuthToken() {
  const token = localStorage.getItem('token');
  const expiration = localStorage.getItem('token_expiration');
  if (!token || !expiration) {
    return null;
  }

  const now = new Date().getTime(); // Obtener el tiempo actual en milisegundos
  if (now > parseInt(expiration)) {
    logoutUser(); // Si el token está vencido, cerrar sesión automáticamente
    return null;
  }

  return token;
}

export function logoutUser() {
  localStorage.removeItem('token');
  localStorage.removeItem('token_expiration');
  window.location.href = "/login";  // Redirige al login
  return; // Detiene cualquier ejecución posterior
}

// Chequea cada 1 minuto si el token expiró
setInterval(() => {
  getAuthToken();
}, 60000); // 60,000ms = 1 minuto
