import { useEffect, useState, useRef } from 'react';
import { GripVertical } from 'lucide-react';
import { getSlides, saveSlide, deleteSlide, reorderSlides } from '../services/carouselService';
import { setores } from '../data/setores';
import type { CarouselSlide } from '../types';
import ImageUpload from '../components/ImageUpload';
import { cloudinaryUrl } from '../services/cloudinaryService';
import AdminShell from '../components/layout/AdminShell';
import { PageLoading } from '../components/layout/PageShell';
import Notice from '../components/admin/Notice';
import { AdminEmpty, AdminField, AdminRow, AdminSplit } from '../components/admin/AdminList';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select';

const MAX_SLIDES = 5;

interface SlideFormData {
  id: string;
  src: string;
  srcPublicId: string;
  href: string;
}

const initialFormData: SlideFormData = {
  id: '',
  src: '',
  srcPublicId: '',
  href: '',
};

export default function GerenciarCarrosselPage() {
  const [slides, setSlides] = useState<CarouselSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [enviandoImagem, setEnviandoImagem] = useState(false);
  const [formData, setFormData] = useState<SlideFormData>(initialFormData);
  const [editando, setEditando] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [ordemAlterada, setOrdemAlterada] = useState(false);
  const dragOverIndex = useRef<number | null>(null);

  useEffect(() => {
    fetchSlides();
  }, []);

  async function fetchSlides() {
    try {
      const data = await getSlides();
      setSlides(data);
      setOrdemAlterada(false);
    } catch (error) {
      console.error('Erro ao buscar slides:', error);
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(slide: CarouselSlide) {
    setFormData({
      id: slide.id,
      src: slide.src,
      srcPublicId: '',
      href: slide.href,
    });
    setEditando(true);
    setMensagem('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!formData.src) {
      setMensagem('Envie a imagem do slide');
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
        srcPublicId: formData.srcPublicId || undefined,
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

  function handleDragOver(e: React.DragEvent, index: number) {
    e.preventDefault();
    dragOverIndex.current = index;
  }

  function handleDragEnd() {
    const origem = draggedIndex;
    const destino = dragOverIndex.current;
    setDraggedIndex(null);
    dragOverIndex.current = null;
    if (origem === null || destino === null || origem === destino) return;

    const newSlides = [...slides];
    const [draggedSlide] = newSlides.splice(origem, 1);
    newSlides.splice(destino, 0, draggedSlide);

    setSlides(newSlides);
    setOrdemAlterada(true);
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
    return <PageLoading />;
  }

  const form = (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <h2 className="font-semibold text-white">{editando ? 'Editar slide' : 'Novo slide'}</h2>

      <ImageUpload
        label="Imagem *"
        pasta="carrossel"
        value={formData.src}
        onUploadingChange={setEnviandoImagem}
        onChange={(imagem) =>
          setFormData(prev => ({ ...prev, src: imagem.url, srcPublicId: imagem.publicId }))
        }
      />

      <AdminField>
        <Label htmlFor="href">Setor de destino</Label>
        <NativeSelect
          id="href"
          name="href"
          value={formData.href}
          onChange={(e) => setFormData(prev => ({ ...prev, href: e.target.value }))}
          className="w-full"
        >
          <NativeSelectOption value="">Sem redirecionamento</NativeSelectOption>
          {setores.map((setor) => (
            <NativeSelectOption key={setor.slug} value={`/setor/${setor.slug}`}>
              {setor.title}
            </NativeSelectOption>
          ))}
        </NativeSelect>
      </AdminField>

      <div className="mt-1 flex gap-2">
        <Button type="submit" variant="secondary" size="xl" disabled={saving || enviandoImagem} className="flex-1">
          {saving ? 'Salvando...' : editando ? 'Atualizar slide' : 'Adicionar slide'}
        </Button>
        {editando && (
          <Button type="button" variant="outline" size="xl" onClick={handleCancel}>
            Cancelar
          </Button>
        )}
      </div>
    </form>
  );

  return (
    <AdminShell title="Carrossel" description={`${slides.length}/${MAX_SLIDES} slides cadastrados`}>
      <Notice mensagem={mensagem} />

      <AdminSplit form={form}>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-white/60">Arraste os slides para reordenar e depois salve a ordem.</p>
          {slides.length > 1 && (
            <Button size="lg" onClick={handleSaveOrder} disabled={!ordemAlterada}>
              Salvar ordem
            </Button>
          )}
        </div>

        {slides.length === 0 ? (
          <AdminEmpty>Nenhum slide cadastrado</AdminEmpty>
        ) : (
          <div className="flex flex-col gap-3">
            {slides.map((slide, index) => (
              <AdminRow
                key={slide.id}
                nome={`slide ${index + 1}`}
                draggable
                onDragStart={() => setDraggedIndex(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={`cursor-move ${draggedIndex === index ? 'opacity-50' : ''}`}
                media={
                  <>
                    <GripVertical className="size-4 shrink-0 text-white/35" />
                    <span className="w-4 shrink-0 text-center text-sm tabular-nums text-white/50">{index + 1}</span>
                    <img
                      src={cloudinaryUrl(slide.src, 240)}
                      alt=""
                      className="h-14 w-24 shrink-0 rounded-md object-cover sm:h-16 sm:w-28"
                    />
                  </>
                }
                onEdit={() => handleEdit(slide)}
                onDelete={() => handleDelete(slide.id)}
              >
                <p className="truncate text-sm font-medium text-white">{getSetorTitle(slide.href)}</p>
                {slide.href && <p className="truncate text-xs text-white/50">{slide.href}</p>}
              </AdminRow>
            ))}
          </div>
        )}
      </AdminSplit>
    </AdminShell>
  );
}
