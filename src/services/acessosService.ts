import { collection, addDoc, serverTimestamp, getDocs, query, orderBy, where } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface AcessoData {
  pagina: string;
  cookieId: string;
}

export interface Acesso {
  id: string;
  ip: string;
  pagina: string;
  cookieId: string;
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

export async function registrarAcesso(data: AcessoData): Promise<void> {
  const ip = await getClientIp();
  
  await addDoc(collection(db, 'acessos'), {
    ip,
    pagina: data.pagina,
    cookieId: data.cookieId,
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
      pagina: data.pagina,
      cookieId: data.cookieId,
      data: data.data?.toDate() || new Date(),
    };
  });
}
