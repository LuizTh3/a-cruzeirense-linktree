import { useEffect, useRef } from 'react';
import { registrarAcesso } from '../services/acessosService';

const COOKIE_NAME = 'visitante_id';
const COOKIE_DAYS = 365;

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : null;
}

function setCookie(name: string, value: string, days: number): void {
  if (typeof document === 'undefined') return;
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
}

function getOrCreateVisitanteId(): string {
  let visitanteId = getCookie(COOKIE_NAME);
  
  if (!visitanteId) {
    visitanteId = crypto.randomUUID();
    setCookie(COOKIE_NAME, visitanteId, COOKIE_DAYS);
  }
  
  return visitanteId;
}

export function useRastrearAcesso(pagina: string) {
  const registrado = useRef(false);

  useEffect(() => {
    if (registrado.current) return;
    registrado.current = true;

    const cookieId = getOrCreateVisitanteId();
    
    registrarAcesso({
      pagina,
      cookieId,
    }).catch(console.error);
  }, [pagina]);
}
