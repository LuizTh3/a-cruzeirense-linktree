import { useEffect, useState, useMemo } from 'react';
import { Star } from 'lucide-react';
import { getProdutos, saveProduto, deleteProduto } from '../services/promocoesService';
import type { Produto } from '../types';
import ImageUpload from '../components/ImageUpload';
import { cloudinaryUrl } from '../services/cloudinaryService';
import { formatarPreco } from '@/lib/format';
import AdminShell from '../components/layout/AdminShell';
import { PageLoading } from '../components/layout/PageShell';
import Notice from '../components/admin/Notice';
import Pagination from '../components/admin/Pagination';
import { AdminEmpty, AdminField, AdminRow, AdminSplit } from '../components/admin/AdminList';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select';

const ITENS_POR_PAGINA = 10;
const MAX_PROMOCOES = 30;

const categorias = [
  { value: 'moveis', label: 'Móveis' },
  { value: 'calcados', label: 'Calçados' },
  { value: 'confeccao', label: 'Confecção' },
  { value: 'tecidos', label: 'Tecidos' },
];

interface ProdutoFormData {
  id: string;
  titulo: string;
  preco: string;
  precoPromocional: string;
  imagem: string;
  imagemPublicId: string;
  categoria: string;
  destaque: boolean;
  tipo: 'promocao' | 'oferta';
}

const initialFormData: ProdutoFormData = {
  id: '',
  titulo: '',
  preco: '',
  precoPromocional: '',
  imagem: '',
  imagemPublicId: '',
  categoria: '',
  destaque: false,
  tipo: 'promocao',
};

export default function GerenciarPromocoesPage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [enviandoImagem, setEnviandoImagem] = useState(false);
  const [formData, setFormData] = useState<ProdutoFormData>(initialFormData);
  const [editando, setEditando] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [filtroSetor, setFiltroSetor] = useState<string>('');

  useEffect(() => {
    fetchProdutos();
  }, []);

  async function fetchProdutos() {
    try {
      const data = await getProdutos();
      setProdutos(data);
    } catch (error) {
      console.error('Erro ao buscar promoções:', error);
    } finally {
      setLoading(false);
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  }

  function handleEdit(produto: Produto) {
    setFormData({
      id: produto.id,
      titulo: produto.titulo,
      preco: produto.preco.toString(),
      precoPromocional: produto.precoPromocional?.toString() || '',
      imagem: produto.imagem,
      imagemPublicId: '',
      categoria: produto.categoria || 'moveis',
      destaque: produto.destaque || false,
      tipo: produto.tipo || 'promocao',
    });
    setEditando(true);
    setMensagem('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!formData.titulo || !formData.preco || !formData.imagem) {
      setMensagem('Preencha todos os campos obrigatórios');
      return;
    }

    const preco = parseFloat(formData.preco);
    const precoPromocional = formData.tipo === 'promocao' && formData.precoPromocional ? parseFloat(formData.precoPromocional) : undefined;

    if (precoPromocional && precoPromocional >= preco) {
      setMensagem('O preço promocional deve ser menor que o preço original');
      return;
    }

    if (!editando && produtos.length >= MAX_PROMOCOES) {
      setMensagem(`Máximo de ${MAX_PROMOCOES} promoções/ofertas permitido`);
      return;
    }

    setSaving(true);
    try {
      const produto: Produto = {
        id: editando ? formData.id : Date.now().toString(),
        titulo: formData.titulo,
        preco,
        precoPromocional,
        imagem: formData.imagem,
        imagemPublicId: formData.imagemPublicId || undefined,
        categoria: formData.categoria,
        destaque: formData.destaque,
        tipo: formData.tipo,
      };

      await saveProduto(produto);
      const labelTipo = formData.tipo === 'promocao' ? 'Promoção' : 'Oferta';
      setMensagem(editando ? `${labelTipo} atualizada com sucesso!` : `${labelTipo} adicionada com sucesso!`);
      setFormData(initialFormData);
      setEditando(false);
      fetchProdutos();
    } catch (error) {
      setMensagem('Erro ao salvar');
      console.error(error);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Tem certeza que deseja excluir esta promoção/oferta?')) return;

    try {
      await deleteProduto(id);
      setMensagem('Promoção/Oferta excluída com sucesso!');
      fetchProdutos();
    } catch (error) {
      setMensagem('Erro ao excluir');
      console.error(error);
    }
  }

  function handleCancel() {
    setFormData(initialFormData);
    setEditando(false);
    setMensagem('');
  }

  const produtosFiltrados = useMemo(() => {
    if (!filtroSetor) return produtos;
    return produtos.filter(p => p.categoria === filtroSetor);
  }, [produtos, filtroSetor]);

  const totalPaginas = Math.ceil(produtosFiltrados.length / ITENS_POR_PAGINA);

  const produtosPagina = useMemo(() => {
    const inicio = (paginaAtual - 1) * ITENS_POR_PAGINA;
    return produtosFiltrados.slice(inicio, inicio + ITENS_POR_PAGINA);
  }, [produtosFiltrados, paginaAtual]);

  if (loading) {
    return <PageLoading />;
  }

  const labelTipo = formData.tipo === 'promocao' ? 'promoção' : 'oferta';

  const form = (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <h2 className="font-semibold text-white">{editando ? `Editar ${labelTipo}` : `Nova ${labelTipo}`}</h2>

      <AdminField>
        <Label htmlFor="titulo">Título *</Label>
        <Input
          id="titulo"
          name="titulo"
          value={formData.titulo}
          onChange={handleInputChange}
          placeholder="Nome do produto"
        />
      </AdminField>

      <AdminField>
        <Label htmlFor="tipo">Tipo</Label>
        <NativeSelect id="tipo" name="tipo" value={formData.tipo} onChange={handleInputChange} className="w-full">
          <NativeSelectOption value="promocao">Promoção (com dois preços)</NativeSelectOption>
          <NativeSelectOption value="oferta">Oferta (com um preço)</NativeSelectOption>
        </NativeSelect>
      </AdminField>

      <div className="grid grid-cols-2 gap-3">
        <AdminField>
          <Label htmlFor="preco">{formData.tipo === 'promocao' ? 'Preço original' : 'Preço'} *</Label>
          <Input
            id="preco"
            name="preco"
            type="number"
            step="0.01"
            min="0"
            value={formData.preco}
            onChange={handleInputChange}
            placeholder="0,00"
          />
        </AdminField>
        {formData.tipo === 'promocao' && (
          <AdminField>
            <Label htmlFor="precoPromocional">Preço promocional</Label>
            <Input
              id="precoPromocional"
              name="precoPromocional"
              type="number"
              step="0.01"
              min="0"
              value={formData.precoPromocional}
              onChange={handleInputChange}
              placeholder="0,00"
            />
          </AdminField>
        )}
      </div>

      <ImageUpload
        label="Imagem *"
        pasta="promocoes"
        value={formData.imagem}
        onUploadingChange={setEnviandoImagem}
        onChange={(imagem) =>
          setFormData(prev => ({ ...prev, imagem: imagem.url, imagemPublicId: imagem.publicId }))
        }
      />

      <AdminField>
        <Label htmlFor="categoria">Categoria</Label>
        <NativeSelect
          id="categoria"
          name="categoria"
          value={formData.categoria}
          onChange={handleInputChange}
          className="w-full"
        >
          <NativeSelectOption value="" disabled>
            Selecione uma categoria
          </NativeSelectOption>
          {categorias.map((categoria) => (
            <NativeSelectOption key={categoria.value} value={categoria.value}>
              {categoria.label}
            </NativeSelectOption>
          ))}
        </NativeSelect>
      </AdminField>

      <label htmlFor="destaque" className="flex items-start gap-2.5 text-sm text-white">
        <input
          type="checkbox"
          name="destaque"
          id="destaque"
          checked={formData.destaque}
          onChange={handleInputChange}
          className="mt-0.5 size-4 accent-brand"
        />
        <span>
          Marcar como destaque
          <span className="block text-xs text-white/55">Aparece entre os 2 destaques da página inicial</span>
        </span>
      </label>

      <div className="mt-1 flex gap-2">
        <Button type="submit" variant="secondary" size="xl" disabled={saving || enviandoImagem} className="flex-1">
          {saving ? 'Salvando...' : editando ? 'Atualizar' : 'Adicionar'}
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
    <AdminShell
      title="Promoções e ofertas"
      description={`${produtos.length}/${MAX_PROMOCOES} promoções/ofertas cadastradas`}
    >
      <Notice mensagem={mensagem} />

      <AdminSplit form={form}>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <NativeSelect
            aria-label="Filtrar por setor"
            value={filtroSetor}
            onChange={(e) => {
              setFiltroSetor(e.target.value);
              setPaginaAtual(1);
            }}
            className="w-full sm:w-72"
          >
            <NativeSelectOption value="">Todos os setores</NativeSelectOption>
            {categorias.map((categoria) => (
              <NativeSelectOption key={categoria.value} value={categoria.value}>
                {categoria.label}
              </NativeSelectOption>
            ))}
          </NativeSelect>
          {filtroSetor && (
            <span className="text-sm text-white/55">
              {produtosFiltrados.length} {produtosFiltrados.length === 1 ? 'item' : 'itens'}
            </span>
          )}
        </div>

        {produtosFiltrados.length === 0 ? (
          <AdminEmpty>
            {filtroSetor ? 'Nenhuma promoção/oferta neste setor' : 'Nenhuma promoção/oferta cadastrada'}
          </AdminEmpty>
        ) : (
          <div className="grid gap-3 xl:grid-cols-2">
            {produtosPagina.map((produto) => (
              <AdminRow
                key={produto.id}
                nome={produto.titulo}
                media={
                  <img
                    src={cloudinaryUrl(produto.imagem, 160)}
                    alt=""
                    className="size-16 shrink-0 rounded-md object-cover"
                  />
                }
                onEdit={() => handleEdit(produto)}
                onDelete={() => handleDelete(produto.id)}
              >
                <div className="flex items-center gap-1.5">
                  <h3 className="truncate text-sm font-medium text-white">{produto.titulo}</h3>
                  {produto.destaque && (
                    <Star className="size-3.5 shrink-0 fill-yellow-400 text-yellow-400" aria-label="Destaque" />
                  )}
                </div>
                <p className="text-sm font-semibold text-price">
                  {formatarPreco(produto.precoPromocional || produto.preco)}
                </p>
                {produto.tipo && (
                  <Badge variant="outline" className="mt-1">
                    {produto.tipo === 'oferta' ? 'Oferta' : 'Promoção'}
                  </Badge>
                )}
              </AdminRow>
            ))}
          </div>
        )}

        <Pagination paginaAtual={paginaAtual} totalPaginas={totalPaginas} onChange={setPaginaAtual} />
      </AdminSplit>
    </AdminShell>
  );
}
