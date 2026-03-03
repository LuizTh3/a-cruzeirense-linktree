import { collection, getDocs, query, where, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Produto } from '../types';

export async function getProdutos(): Promise<Produto[]> {
  const q = query(collection(db, 'promocoes'));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: data.id || doc.id,
      titulo: data.titulo || '',
      preco: data.preco || 0,
      precoPromocional: data.precoPromocional,
      imagem: data.imagem || '',
      descricao: data.descricao || '',
      categoria: data.categoria,
    };
  });
}

export async function getProdutoById(id: string): Promise<Produto | undefined> {
  const q = query(collection(db, 'promocoes'));
  const snapshot = await getDocs(q);
  
  const doc = snapshot.docs.find((d) => {
    const data = d.data();
    return (data.id || d.id) === id;
  });
  
  if (!doc) return undefined;
  
  const data = doc.data();
  return {
    id: data.id || doc.id,
    titulo: data.titulo || '',
    preco: data.preco || 0,
    precoPromocional: data.precoPromocional,
    imagem: data.imagem || '',
    descricao: data.descricao || '',
    categoria: data.categoria,
  };
}

export async function getProdutosRelacionados(categoria: string | undefined, excludeId: string): Promise<Produto[]> {
  if (!categoria) return [];
  
  const q = query(
    collection(db, 'promocoes'),
    where('categoria', '==', categoria)
  );
  
  const snapshot = await getDocs(q);
  
  return snapshot.docs
    .map((doc) => {
      const data = doc.data();
      return {
        id: data.id || doc.id,
        titulo: data.titulo || '',
        preco: data.preco || 0,
        precoPromocional: data.precoPromocional,
        imagem: data.imagem || '',
        descricao: data.descricao || '',
        categoria: data.categoria,
      };
    })
    .filter((produto) => produto.id !== excludeId)
    .slice(0, 4);
}

export async function getProdutoDocId(id: string): Promise<string | null> {
  const q = query(collection(db, 'promocoes'));
  const snapshot = await getDocs(q);
  
  const docFound = snapshot.docs.find((d) => {
    const data = d.data();
    return (data.id || d.id) === id;
  });
  
  return docFound ? docFound.id : null;
}

export async function saveProduto(produto: Produto): Promise<void> {
  const docRef = doc(db, 'promocoes', produto.id);
  await setDoc(docRef, {
    id: produto.id,
    titulo: produto.titulo,
    preco: produto.preco,
    precoPromocional: produto.precoPromocional ?? null,
    imagem: produto.imagem,
    descricao: produto.descricao,
    categoria: produto.categoria ?? null,
  }, { merge: true });
}

export async function deleteProduto(id: string): Promise<void> {
  const docId = await getProdutoDocId(id);
  if (docId) {
    const docRef = doc(db, 'promocoes', docId);
    await deleteDoc(docRef);
  }
}
