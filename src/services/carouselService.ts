import { collection, getDocs, query, doc, setDoc, deleteDoc, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { CarouselSlide } from '../types';

export async function getSlides(): Promise<CarouselSlide[]> {
  const q = query(collection(db, 'carousel'), orderBy('ordem', 'asc'));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: data.id || doc.id,
      src: data.src || '',
      href: data.href || '',
      alt: data.alt || '',
      ordem: data.ordem ?? 0,
    };
  });
}

export async function getSlideDocId(id: string): Promise<string | null> {
  const q = query(collection(db, 'carousel'));
  const snapshot = await getDocs(q);
  
  const docFound = snapshot.docs.find((d) => {
    const data = d.data();
    return (data.id || d.id) === id;
  });
  
  return docFound ? docFound.id : null;
}

export async function saveSlide(slide: CarouselSlide): Promise<void> {
  const docRef = doc(db, 'carousel', slide.id);
  await setDoc(docRef, {
    id: slide.id,
    src: slide.src,
    href: slide.href,
    alt: slide.alt || '',
    ordem: slide.ordem,
  }, { merge: true });
}

export async function deleteSlide(id: string): Promise<void> {
  const docId = await getSlideDocId(id);
  if (docId) {
    const docRef = doc(db, 'carousel', docId);
    await deleteDoc(docRef);
  }
}

export async function reorderSlides(slides: CarouselSlide[]): Promise<void> {
  for (let i = 0; i < slides.length; i++) {
    const docRef = doc(db, 'carousel', slides[i].id);
    await setDoc(docRef, {
      ...slides[i],
      ordem: i,
    }, { merge: true });
  }
}
