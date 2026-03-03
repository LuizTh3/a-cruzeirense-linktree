import { collection, addDoc, serverTimestamp, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface AvaliacaoData {
  colaboradorId: string;
  setorSlug: string;
  rating: number;
  feedback: string;
  telefone?: string;
}

export interface AvaliacaoFirestore {
  id: string;
  colaboradorId: string;
  setorSlug: string;
  rating: number;
  feedback: string;
  telefone?: string;
  ipAvaliador: string;
  createdAt: Date;
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

export async function enviarAvaliacao(data: AvaliacaoData): Promise<void> {
  const ipAvaliador = await getClientIp();
  
  await addDoc(collection(db, 'avaliacoes'), {
    colaboradorId: data.colaboradorId,
    setorSlug: data.setorSlug,
    rating: data.rating,
    feedback: data.feedback,
    telefone: data.telefone || null,
    ipAvaliador,
    createdAt: serverTimestamp(),
  });
}

export async function buscarAvaliacoes(): Promise<AvaliacaoFirestore[]> {
  const q = query(collection(db, 'avaliacoes'), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      colaboradorId: data.colaboradorId,
      setorSlug: data.setorSlug,
      rating: data.rating,
      feedback: data.feedback,
      telefone: data.telefone,
      ipAvaliador: data.ipAvaliador,
      createdAt: data.createdAt?.toDate() || new Date(),
    };
  });
}
