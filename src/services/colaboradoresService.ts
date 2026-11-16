import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
} from 'firebase/firestore';
import type { DocumentData } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Colaborador } from '../types';

const COLECAO = 'colaboradores';

export const AVATAR_PADRAO = '/assets/images/funcionarios/agente.webp';

export interface ColaboradorInput {
  id?: string;
  setorSlug: string;
  nome: string;
  cargo: string;
  whatsapp: string;
  avatarSrc: string;
  avatarPublicId?: string;
  ordem: number;
  ativo: boolean;
}

/** Mantém só os dígitos e garante o código do país (55). */
export function normalizarWhatsapp(valor: string): string {
  const digitos = valor.replace(/\D/g, '');
  if (!digitos) return '';
  if (digitos.startsWith('55') && digitos.length >= 12) return digitos;
  return `55${digitos}`;
}

function mapear(id: string, data: DocumentData): Colaborador {
  const whatsapp: string = data.whatsapp || '';
  const setorSlug: string = data.setorSlug || '';
  return {
    id,
    setorSlug,
    nome: data.nome || '',
    cargo: data.cargo || '',
    avatarSrc: data.avatarSrc || AVATAR_PADRAO,
    whatsapp,
    ordem: data.ordem ?? 0,
    ativo: data.ativo ?? true,
    profileHref: `/colaborador/${setorSlug}/${id}`,
    whatsappHref: whatsapp ? `https://wa.me/${whatsapp}` : undefined,
  };
}

function ordenar(lista: Colaborador[]): Colaborador[] {
  return lista.sort((a, b) => a.ordem - b.ordem || a.nome.localeCompare(b.nome, 'pt-BR'));
}

/** Todos os funcionários, inclusive ocultos (uso no admin). */
export async function getTodosColaboradores(): Promise<Colaborador[]> {
  const snapshot = await getDocs(collection(db, COLECAO));
  return ordenar(snapshot.docs.map((d) => mapear(d.id, d.data())));
}

/** Funcionários visíveis de um setor (uso no site público). */
export async function getColaboradoresDoSetor(setorSlug: string): Promise<Colaborador[]> {
  const q = query(collection(db, COLECAO), where('setorSlug', '==', setorSlug));
  const snapshot = await getDocs(q);
  return ordenar(snapshot.docs.map((d) => mapear(d.id, d.data())).filter((c) => c.ativo));
}

export async function getColaboradorById(id: string): Promise<Colaborador | undefined> {
  const snapshot = await getDoc(doc(db, COLECAO, id));
  return snapshot.exists() ? mapear(snapshot.id, snapshot.data()) : undefined;
}

export async function saveColaborador(input: ColaboradorInput): Promise<void> {
  const ref = input.id ? doc(db, COLECAO, input.id) : doc(collection(db, COLECAO));
  await setDoc(
    ref,
    {
      setorSlug: input.setorSlug,
      nome: input.nome.trim(),
      cargo: input.cargo.trim(),
      whatsapp: normalizarWhatsapp(input.whatsapp),
      avatarSrc: input.avatarSrc,
      ...(input.avatarPublicId ? { avatarPublicId: input.avatarPublicId } : {}),
      ordem: input.ordem,
      ativo: input.ativo,
      ...(input.id ? {} : { createdAt: serverTimestamp() }),
    },
    { merge: true }
  );
}

export async function setColaboradorAtivo(id: string, ativo: boolean): Promise<void> {
  await setDoc(doc(db, COLECAO, id), { ativo }, { merge: true });
}

export async function deleteColaborador(id: string): Promise<void> {
  await deleteDoc(doc(db, COLECAO, id));
}
