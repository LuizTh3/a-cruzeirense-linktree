import { collection, addDoc, serverTimestamp, getDocs, query, orderBy, where } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface Acesso {
  id: string;
  ip: string;
  cookieId: string;
  data: Date;
}

export interface WhatsAppClick {
  id: string;
  ip: string;
  cookieId: string;
  setor: string;
  tipo: 'promocao' | 'oferta' | 'contato';
  data: Date;
}

async function getClientIp(): Promise<string> {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip || 'unknown';
  } catch {
    return 'unknown';
  }
}

export async function registrarAcesso(cookieId: string): Promise<void> {
  const ip = await getClientIp();
  
  await addDoc(collection(db, 'acessos'), {
    ip,
    cookieId,
    data: serverTimestamp(),
  });
}

export async function registrarClickWhatsApp(
  cookieId: string,
  setor: string,
  tipo: 'promocao' | 'oferta' | 'contato'
): Promise<void> {
  const ip = await getClientIp();
  
  await addDoc(collection(db, 'cliques_whatsapp'), {
    ip,
    cookieId,
    setor,
    tipo,
    data: serverTimestamp(),
  });
}

export async function getTotalAcessos(): Promise<number> {
  const snapshot = await getDocs(collection(db, 'acessos'));
  return snapshot.size;
}

export async function getAcessosSemana(): Promise<number> {
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const q = query(
    collection(db, 'acessos'),
    where('data', '>=', startOfWeek),
    orderBy('data', 'desc')
  );

  const snapshot = await getDocs(q);
  return snapshot.size;
}

export async function getAcessosPorDia(dias: number = 7): Promise<{ data: string; quantidade: number }[]> {
  const now = new Date();
  const results: { data: string; quantidade: number }[] = [];

  for (let i = dias - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(now.getDate() - i);
    date.setHours(0, 0, 0, 0);

    const nextDate = new Date(date);
    nextDate.setDate(date.getDate() + 1);

    const q = query(
      collection(db, 'acessos'),
      where('data', '>=', date),
      where('data', '<', nextDate)
    );

    const snapshot = await getDocs(q);
    
    const dateStr = date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    results.push({ data: dateStr, quantidade: snapshot.size });
  }

  return results;
}

export async function getAcessosRecentes(limite: number = 20): Promise<Acesso[]> {
  const q = query(
    collection(db, 'acessos'),
    orderBy('data', 'desc')
  );

  const snapshot = await getDocs(q);
  
  return snapshot.docs.slice(0, limite).map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ip: data.ip,
      cookieId: data.cookieId,
      data: data.data?.toDate() || new Date(),
    };
  });
}

export async function getTotalCliquesWhatsApp(): Promise<number> {
  const snapshot = await getDocs(collection(db, 'cliques_whatsapp'));
  return snapshot.size;
}

export async function getCliquesWhatsAppPorSetor(): Promise<{ setor: string; quantidade: number }[]> {
  const snapshot = await getDocs(collection(db, 'cliques_whatsapp'));
  
  const setores: Record<string, number> = {};
  
  snapshot.forEach((doc) => {
    const data = doc.data();
    const setor = data.setor || 'desconhecido';
    setores[setor] = (setores[setor] || 0) + 1;
  });
  
  return Object.entries(setores)
    .map(([setor, quantidade]) => ({ setor, quantidade }))
    .sort((a, b) => b.quantidade - a.quantidade);
}

export async function getCliquesWhatsAppPorTipo(): Promise<{ tipo: string; quantidade: number }[]> {
  const snapshot = await getDocs(collection(db, 'cliques_whatsapp'));
  
  const tipos: Record<string, number> = {
    promocao: 0,
    oferta: 0,
    contato: 0,
  };
  
  snapshot.forEach((doc) => {
    const data = doc.data();
    const tipo = data.tipo || 'contato';
    if (tipos[tipo] !== undefined) {
      tipos[tipo]++;
    }
  });
  
  return Object.entries(tipos)
    .map(([tipo, quantidade]) => ({ tipo, quantidade }))
    .sort((a, b) => b.quantidade - a.quantidade);
}

export async function getCliquesWhatsAppPorDia(dias: number = 7): Promise<{ data: string; quantidade: number }[]> {
  const now = new Date();
  const results: { data: string; quantidade: number }[] = [];

  for (let i = dias - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(now.getDate() - i);
    date.setHours(0, 0, 0, 0);

    const nextDate = new Date(date);
    nextDate.setDate(date.getDate() + 1);

    const q = query(
      collection(db, 'cliques_whatsapp'),
      where('data', '>=', date),
      where('data', '<', nextDate)
    );

    const snapshot = await getDocs(q);
    
    const dateStr = date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    results.push({ data: dateStr, quantidade: snapshot.size });
  }

  return results;
}
