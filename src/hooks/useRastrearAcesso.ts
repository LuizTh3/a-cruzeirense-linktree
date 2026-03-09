import { useEffect, useRef } from 'react';
import { registrarAcesso } from '../services/acessosService';

const COOKIE_NAME = 'visitante_id';
const COOKIE_DAYS = 365;
const INTERVALO_MINUTOS = 30;

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

function podeRegistrarAcesso(): boolean {
  const chave = 'ultimo_acesso_usuario';
  const ultimoAcesso = localStorage.getItem(chave);
  
  if (!ultimoAcesso) return true;
  
  const tempoDecorrido = Date.now() - parseInt(ultimoAcesso, 10);
  const intervaloMinutos = INTERVALO_MINUTOS * 60 * 1000;
  
  if (tempoDecorrido < intervaloMinutos) return false;
  
  return true;
}

function registrarNovoAcesso(): void {
  const chave = 'ultimo_acesso_usuario';
  localStorage.setItem(chave, Date.now().toString());
}

function getOrCreateVisitanteId(): string {
  let visitanteId = getCookie(COOKIE_NAME);
  
  if (!visitanteId) {
    visitanteId = crypto.randomUUID();
    setCookie(COOKIE_NAME, visitanteId, COOKIE_DAYS);
  }
  
  return visitanteId;
}

export function useRastrearAcesso() {
  const registrado = useRef(false);

  useEffect(() => {
    if (registrado.current) return;
    
    if (!podeRegistrarAcesso()) return;
    
    registrado.current = true;
    registrarNovoAcesso();

    const cookieId = getOrCreateVisitanteId();
    
    registrarAcesso(cookieId).catch(console.error);
  });
}
