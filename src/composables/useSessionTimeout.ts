// composables/useSessionTimeout.ts

import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';

export const useSessionTimeout = () => {
  const router = useRouter();
  const SESSION_TIMEOUT = 1 * 60 * 1000; // 1 minuto para pruebas
  const WARNING_TIME = 10 * 1000; // Advertencia a los 10 segundos

  let timeoutId: NodeJS.Timeout | null = null;
  let warningTimeoutId: NodeJS.Timeout | null = null;
  let countdownIntervalId: NodeJS.Timeout | null = null;

  const showWarning = ref(false);
  const timeRemaining = ref(0);

  const closeSession = () => {
    console.log('🔴 CERRANDO SESIÓN');

    // Limpiar timers
    if (timeoutId) clearTimeout(timeoutId);
    if (warningTimeoutId) clearTimeout(warningTimeoutId);
    if (countdownIntervalId) clearInterval(countdownIntervalId);

    // Limpiar localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.clear();

    // Redirigir a login
    router.push('/auth/login').catch(() => {
      window.location.href = '/auth/login';
    });
  };

  const continueSession = () => {
    console.log('✅ CONTINUANDO SESIÓN');
    showWarning.value = false;
    resetSessionTimer();
  };

  const startCountdown = () => {
    let remaining = 10; // 10 segundos para cerrar después de mostrar advertencia
    timeRemaining.value = remaining;

    if (countdownIntervalId) clearInterval(countdownIntervalId);

    countdownIntervalId = setInterval(() => {
      remaining--;
      timeRemaining.value = remaining;

      if (remaining <= 0) {
        clearInterval(countdownIntervalId!);
        closeSession();
      }
    }, 1000);
  };

  const resetSessionTimer = () => {
    console.log('🔄 RESETEAR TIMER DE SESIÓN');

    // Limpiar timers anteriores
    if (timeoutId) clearTimeout(timeoutId);
    if (warningTimeoutId) clearTimeout(warningTimeoutId);
    if (countdownIntervalId) clearInterval(countdownIntervalId);

    showWarning.value = false;

    // Mostrar advertencia a los 50 segundos
    warningTimeoutId = setTimeout(() => {
      console.log('⚠️ MOSTRANDO ADVERTENCIA');
      showWarning.value = true;
      startCountdown();
    }, WARNING_TIME);

    // Cerrar sesión a 1 minuto si no hace nada
    timeoutId = setTimeout(() => {
      console.log('⏰ TIEMPO AGOTADO');
      closeSession();
    }, SESSION_TIMEOUT);
  };

  const setupActivityListeners = () => {
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];

    const handleActivity = () => {
      // Solo resetear si NO está mostrando la advertencia
      if (!showWarning.value) {
        console.log('👤 ACTIVIDAD DETECTADA');
        resetSessionTimer();
      }
    };

    events.forEach(event => {
      document.addEventListener(event, handleActivity);
    });

    console.log('✅ ACTIVITY LISTENERS CONFIGURADOS');

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
    };
  };

  onMounted(() => {
    console.log('🚀 USESESSIONTIMEOUT MONTADO');
    resetSessionTimer();
    setupActivityListeners();
  });

  onUnmounted(() => {
    console.log('🛑 USESESSIONTIMEOUT DESMONTADO');
    if (timeoutId) clearTimeout(timeoutId);
    if (warningTimeoutId) clearTimeout(warningTimeoutId);
    if (countdownIntervalId) clearInterval(countdownIntervalId);
  });

  return {
    showWarning,
    timeRemaining,
    continueSession,
    closeSession,
  };
};