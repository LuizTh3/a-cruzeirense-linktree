import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getSlides, saveSlide, deleteSlide, reorderSlides } from '../services/carouselService';
import { setores } from '../data/setores';
import type { CarouselSlide } from '../types';
import Footer from '../components/Footer';

const MAX_SLIDES = 5;

interface SlideFormData {
  id: string;
  src: string;
  href: string;
}

const initialFormData: SlideFormData = {
  id: '',
  src: '',
  href: '',
};

export default function GerenciarCarrosselPage() {
  const [slides, setSlides] = useState<CarouselSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<SlideFormData>(initialFormData);
  const [editando, setEditando] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const dragOverIndex = useRef<number | null>(null);

  useEffect(() => {
    fetchSlides();
  }, []);

  async function fetchSlides() {
    try {
      const data = await getSlides();
      setSlides(data);
    } catch (error) {
      console.error('Erro ao buscar slides:', error);
    } finally {
      setLoading(false);
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  function handleEdit(slide: CarouselSlide) {
    setFormData({
      id: slide.id,
      src: slide.src,
      href: slide.href,
    });
    setEditando(true);
    setMensagem('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!formData.src) {
      setMensagem('Preencha a URL da imagem');
      return;
    }

    if (!editando && slides.length >= MAX_SLIDES) {
      setMensagem(`Máximo de ${MAX_SLIDES} slides permitido`);
      return;
    }

    setSaving(true);
    try {
      const slide: CarouselSlide = {
        id: editando ? formData.id : Date.now().toString(),
        src: formData.src,
        href: formData.href,
        alt: '',
        ordem: editando ? slides.find(s => s.id === formData.id)?.ordem ?? slides.length : slides.length,
      };

      await saveSlide(slide);
      setMensagem(editando ? 'Slide atualizado com sucesso!' : 'Slide adicionado com sucesso!');
      setFormData(initialFormData);
      setEditando(false);
      fetchSlides();
    } catch (error) {
      setMensagem('Erro ao salvar slide');
      console.error(error);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Tem certeza que deseja excluir este slide?')) return;
    
    try {
      await deleteSlide(id);
      setMensagem('Slide excluído com sucesso!');
      fetchSlides();
    } catch (error) {
      setMensagem('Erro ao excluir slide');
      console.error(error);
    }
  }

  function handleCancel() {
    setFormData(initialFormData);
    setEditando(false);
    setMensagem('');
  }

  function handleDragStart(index: number) {
    setDraggedIndex(index);
  }

  function handleDragOver(e: React.DragEvent, index: number) {
    e.preventDefault();
    dragOverIndex.current = index;
  }

  function handleDragEnd() {
    if (draggedIndex === null || dragOverIndex.current === null) return;
    if (draggedIndex === dragOverIndex.current) return;

    const newSlides = [...slides];
    const draggedSlide = newSlides[draggedIndex];
    newSlides.splice(draggedIndex, 1);
    newSlides.splice(dragOverIndex.current, 0, draggedSlide);

    setSlides(newSlides);
    setDraggedIndex(null);
    dragOverIndex.current = null;
  }

  async function handleSaveOrder() {
    try {
      const reorderedSlides = slides.map((slide, index) => ({
        ...slide,
        ordem: index,
      }));
      await reorderSlides(reorderedSlides);
      setMensagem('Ordenação salva com sucesso!');
      fetchSlides();
    } catch (error) {
      setMensagem('Erro ao salvar ordenação');
      console.error(error);
    }
  }

  function getSetorTitle(href: string) {
    if (!href) return 'Sem redirecionamento';
    const slug = href.replace('/setor/', '');
    const setor = setores.find(s => s.slug === slug);
    return setor?.title || href;
  }

  if (loading) {
    return (
      <main className="relative max-w-120 mx-auto min-h-screen bg-container-radial border-x border-white/5 shadow-lateral flex flex-col overflow-x-hidden pb-10 px-6">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-white">Carregando...</div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative max-w-120 mx-auto min-h-screen bg-container-radial border-x border-white/5 shadow-lateral flex flex-col overflow-x-hidden">
      <div className="flex-1 px-6 pb-10">
      <h1 className="text-[1.8rem] font-roboto font-bold text-white mt-8 mb-4">
        Gerenciar Carrossel
      </h1>

      <p className="text-white/70 text-sm mb-6">
        {slides.length}/{MAX_SLIDES} slides cadastrados
      </p>

      <p className="text-white/50 text-xs mb-4 text-center max-w-md">
        Arraste os cards para reordenar. Clique em "Salvar Ordem" após reordenar.
      </p>

      {mensagem && (
        <div className={`w-full max-w-md p-3 rounded-lg mb-4 text-center text-sm ${
          mensagem.includes('sucesso') 
            ? 'bg-green-600/20 text-green-400 border border-green-600/30' 
            : 'bg-red-600/20 text-red-400 border border-red-600/30'
        }`}>
          {mensagem}
        </div>
      )}

      <form onSubmit={handleSubmit} className="w-full max-w-md flex flex-col gap-4 mb-8">
        <div>
          <label className="block text-white text-sm mb-1">URL da Imagem *</label>
          <input
            type="text"
            name="src"
            value={formData.src}
            onChange={handleInputChange}
            className="w-full px-4 py-3 rounded-lg bg-[#1a2d4a] text-white border border-white/10 focus:border-[#1a5fa8] outline-none"
            placeholder="/assets/images/promocoes/banner1.webp"
          />
        </div>

        <div>
          <label className="block text-white text-sm mb-1">Setor de Destino</label>
          <select
            name="href"
            value={formData.href}
            onChange={handleInputChange}
            className="w-full px-4 py-3 rounded-lg bg-[#1a2d4a] text-white border border-white/10 focus:border-[#1a5fa8] outline-none"
          >
            <option value="" style={{ color: 'White' }}>Sem redirecionamento</option>
            {setores.map((setor) => (
              <option key={setor.slug} value={`/setor/${setor.slug}`} style={{ color: 'White' }}>
                {setor.title}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-3 mt-2">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 py-3 bg-[linear-gradient(135deg,#082d5e,#1a5fa8)] text-white rounded-lg font-bold transition-all duration-300 hover:brightness-110 disabled:opacity-50"
          >
            {saving ? 'Salvando...' : editando ? 'Atualizar Slide' : 'Adicionar Slide'}
          </button>
          
          {editando && (
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg font-bold transition-all duration-300 hover:bg-gray-500"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      {slides.length > 1 && (
        <button
          onClick={handleSaveOrder}
          className="mb-4 px-6 py-2 bg-green-600 text-white rounded-lg font-bold transition-all duration-300 hover:bg-green-500"
        >
          Salvar Ordem
        </button>
      )}

      <div className="w-full max-w-md">
        <h2 className="text-white font-bold text-lg mb-4">Slides Cadastrados</h2>
        
        {slides.length === 0 ? (
          <p className="text-white/50 text-center py-4">Nenhum slide cadastrado</p>
        ) : (
          <div className="flex flex-col gap-3">
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={`flex items-center gap-3 p-3 bg-[#1a2d4a] rounded-lg border border-white/10 cursor-move ${
                  draggedIndex === index ? 'opacity-50' : ''
                }`}
              >
                <span className="text-white/50 text-sm w-6">{index + 1}</span>
                <img
                  src={slide.src}
                  alt={slide.alt}
                  className="w-24 h-14 object-cover rounded"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm truncate">{getSetorTitle(slide.href)}</p>
                  <p className="text-white/50 text-xs truncate">{slide.href}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(slide)}
                    className="p-2 bg-bg-container-top text-white rounded hover:bg-[#2a7fc8] transition-colors"
                  >
                    <i className="fa-solid fa-pen"></i>
                  </button>
                  <button
                    onClick={() => handleDelete(slide.id)}
                    className="p-2 bg-red-600 text-white rounded hover:bg-red-500 transition-colors"
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Link
        to="/admin/dashboard"
        className="mt-8 px-6 py-3 bg-[linear-gradient(135deg,#082d5e,#1a5fa8)] text-white rounded-lg font-bold transition-all duration-300 hover:brightness-110"
      >
        Voltar ao Painel
      </Link>
      </div>

      <Footer />
    </main>
  );
}
