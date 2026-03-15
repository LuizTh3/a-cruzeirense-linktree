import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getProdutos, saveProduto, deleteProduto } from '../services/promocoesService';
import type { Produto } from '../types';
import Footer from '../components/Footer';

const ITENS_POR_PAGINA = 10;
const MAX_PROMOCOES = 30;

interface ProdutoFormData {
  id: string;
  titulo: string;
  preco: string;
  precoPromocional: string;
  imagem: string;
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
  categoria: '',
  destaque: false,
  tipo: 'promocao',
};

export default function GerenciarPromocoesPage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
      categoria: produto.categoria || 'moveis',
      destaque: produto.destaque || false,
      tipo: produto.tipo || 'promocao',
    });
    setEditando(true);
    setMensagem('');
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
    const fim = inicio + ITENS_POR_PAGINA;
    return produtosFiltrados.slice(inicio, fim);
  }, [produtosFiltrados, paginaAtual]);

  const irParaPagina = (pagina: number) => {
    if (pagina >= 1 && pagina <= totalPaginas) {
      setPaginaAtual(pagina);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const getIntervaloPaginas = () => {
    const paginas: (number | string)[] = [];
    const maxVisiveis = 5;

    if (totalPaginas <= maxVisiveis) {
      for (let i = 1; i <= totalPaginas; i++) {
        paginas.push(i);
      }
    } else {
      if (paginaAtual <= 3) {
        for (let i = 1; i <= 4; i++) paginas.push(i);
        paginas.push('...');
        paginas.push(totalPaginas);
      } else if (paginaAtual >= totalPaginas - 2) {
        paginas.push(1);
        paginas.push('...');
        for (let i = totalPaginas - 3; i <= totalPaginas; i++) paginas.push(i);
      } else {
        paginas.push(1);
        paginas.push('...');
        for (let i = paginaAtual - 1; i <= paginaAtual + 1; i++) paginas.push(i);
        paginas.push('...');
        paginas.push(totalPaginas);
      }
    }

    return paginas;
  };

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
        Gerenciar Promoções/Ofertas
      </h1>

      <p className="text-white/70 text-sm mb-6">
        {produtos.length}/{MAX_PROMOCOES} promoções/ofertas cadastradas
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
          <label className="block text-white text-sm mb-1">Título *</label>
          <input
            type="text"
            name="titulo"
            value={formData.titulo}
            onChange={handleInputChange}
            className="w-full px-4 py-3 rounded-lg bg-[#1a2d4a] text-white border border-white/10 focus:border-[#1a5fa8] outline-none"
            placeholder="Nome do produto"
          />
        </div>

        <div>
          <label className="block text-white text-sm mb-1">Tipo</label>
          <select
            name="tipo"
            value={formData.tipo}
            onChange={handleInputChange}
            className="w-full px-4 py-3 rounded-lg bg-[#1a2d4a] text-white border border-white/10 focus:border-[#1a5fa8] outline-none"
          >
            <option value="promocao" style={{ color: 'White' }}>Promoção (com dois preços)</option>
            <option value="oferta" style={{ color: 'White' }}>Oferta (com um preço)</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-white text-sm mb-1">
              {formData.tipo === 'promocao' ? 'Preço Original' : 'Preço'} *
            </label>
            <input
              type="number"
              name="preco"
              step="0.01"
              min="0"
              value={formData.preco}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg bg-[#1a2d4a] text-white border border-white/10 focus:border-[#1a5fa8] outline-none"
              placeholder="0.00"
            />
          </div>
          {formData.tipo === 'promocao' && (
          <div>
            <label className="block text-white text-sm mb-1">Preço Promocional</label>
            <input
              type="number"
              name="precoPromocional"
              step="0.01"
              min="0"
              value={formData.precoPromocional}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg bg-[#1a2d4a] text-white border border-white/10 focus:border-[#1a5fa8] outline-none"
              placeholder="0.00"
            />
          </div>
          )}
        </div>

        <div>
          <label className="block text-white text-sm mb-1">URL da Imagem *</label>
          <input
            type="text"
            name="imagem"
            value={formData.imagem}
            onChange={handleInputChange}
            className="w-full px-4 py-3 rounded-lg bg-[#1a2d4a] text-white border border-white/10 focus:border-[#1a5fa8] outline-none"
            placeholder="/assets/images/produtos/setor/nome.webp"
          />
        </div>

        <div>
          <label className="block text-white text-sm mb-1">Categoria</label>
          <select
            name="categoria"
            value={formData.categoria}
            onChange={handleInputChange}
            className="w-full px-4 py-3 rounded-lg bg-[#1a2d4a] text-black border border-white/10 focus:border-bg-container-top outline-none"
            style={{ color: 'white' }}
          >
            <option value="" disabled style={{ color: '#94a3b8' }}>Selecione uma categoria</option>
            <option value="moveis" style={{ color: 'White' }}>Móveis</option>
            <option value="calcados" style={{ color: 'White' }}>Calçados</option>
            <option value="confeccao" style={{ color: 'White' }}>Confecção</option>
            <option value="tecidos" style={{ color: 'White' }}>Tecidos</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            name="destaque"
            id="destaque"
            checked={formData.destaque}
            onChange={handleInputChange}
            className="w-5 h-5 rounded bg-[#1a2d4a] border-white/20 text-[#1a5fa8] focus:ring-[#1a5fa8]"
          />
          <label htmlFor="destaque" className="text-white text-sm">
            Marcar como Destaque (aparece nos 2 primeiros cards)
          </label>
        </div>

        <div className="flex gap-3 mt-2">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 py-3 bg-[linear-gradient(135deg,#082d5e,#1a5fa8)] text-white rounded-lg font-bold transition-all duration-300 hover:brightness-110 disabled:opacity-50"
          >
            {saving ? 'Salvando...' : editando 
              ? `Atualizar ${formData.tipo === 'promocao' ? 'Promoção' : 'Oferta'}` 
              : `Adicionar ${formData.tipo === 'promocao' ? 'Promoção' : 'Oferta'}`}
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

      <div className="w-full max-w-md">
        <div className="flex flex-col sm:flex-row gap-3 w-full mb-4">
          <select
            value={filtroSetor}
            onChange={(e) => {
              setFiltroSetor(e.target.value);
              setPaginaAtual(1);
            }}
            className="flex-1 px-4 py-2.5 rounded-lg bg-[#1a2d4a] text-white border border-white/10 focus:border-[#1a5fa8] outline-none text-sm"
          >
            <option value="" style={{ color: '#94a3b8' }}>Todos os setores</option>
            <option value="moveis" style={{ color: 'white' }}>Móveis</option>
            <option value="calcados" style={{ color: 'white' }}>Calçados</option>
            <option value="confeccao" style={{ color: 'white' }}>Confecção</option>
            <option value="tecidos" style={{ color: 'white' }}>Tecidos</option>
          </select>
        </div>

        <h2 className="text-white font-bold text-lg mb-4">
          Promoções/Ofertas Cadastradas
          {filtroSetor && (
            <span className="text-white/50 text-sm font-normal ml-2">
              ({produtosFiltrados.length} {produtosFiltrados.length === 1 ? 'item' : 'itens'})
            </span>
          )}
        </h2>
        
        {produtosFiltrados.length === 0 ? (
          <p className="text-white/50 text-center py-4">
            {filtroSetor ? 'Nenhuma promoção/oferta neste setor' : 'Nenhuma promoção/oferta cadastrada'}
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {produtosPagina.map((produto) => (
              <div
                key={produto.id}
                className="flex items-center gap-3 p-3 bg-[#1a2d4a] rounded-lg border border-white/10"
              >
                <img
                  src={produto.imagem}
                  alt={produto.titulo}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-white font-medium text-sm truncate">{produto.titulo}</h3>
                    {produto.destaque && (
                      <span className="text-yellow-400 text-xs">
                        <i className="fa-solid fa-star"></i>
                      </span>
                    )}
                    {produto.tipo === 'oferta' && (
                      <span className="bg-orange-500/20 text-orange-400 text-[0.65rem] px-1.5 py-0.5 rounded">
                        OFERTA
                      </span>
                    )}
                    {produto.tipo === 'promocao' && (
                      <span className="bg-blue-500/20 text-blue-400 text-[0.65rem] px-1.5 py-0.5 rounded">
                        PROMO
                      </span>
                    )}
                  </div>
                  <p className="text-[#4caf50] font-bold text-sm">
                    R$ {produto.precoPromocional?.toFixed(2).replace('.', ',') || produto.preco.toFixed(2).replace('.', ',')}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(produto)}
                    className="p-2 bg-bg-container-top text-white rounded hover:bg-[#2a7fc8] transition-colors"
                  >
                    <i className="fa-solid fa-pen"></i>
                  </button>
                  <button
                    onClick={() => handleDelete(produto.id)}
                    className="p-2 bg-red-600 text-white rounded hover:bg-red-500 transition-colors"
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {totalPaginas > 1 && (
          <div className="flex flex-col items-center gap-4 mt-8 pb-8">
            <p className="text-white/60 text-sm">
              Página {paginaAtual} de {totalPaginas}
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => irParaPagina(paginaAtual - 1)}
                disabled={paginaAtual === 1}
                className="px-3 py-2 bg-[#1a2d4a] text-white rounded-lg font-medium text-sm disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#2a4d7a] transition-colors"
              >
                <i className="fa-solid fa-chevron-left"></i>
              </button>

              {getIntervaloPaginas().map((pagina, index) => (
                typeof pagina === 'number' ? (
                  <button
                    key={index}
                    onClick={() => irParaPagina(pagina)}
                    className={`px-3 py-2 rounded-lg font-medium text-sm transition-colors ${
                      pagina === paginaAtual
                        ? 'bg-[#1a5fa8] text-white'
                        : 'bg-[#1a2d4a] text-white hover:bg-[#2a4d7a]'
                    }`}
                  >
                    {pagina}
                  </button>
                ) : (
                  <span key={index} className="px-2 text-white/40">
                    {pagina}
                  </span>
                )
              ))}

              <button
                onClick={() => irParaPagina(paginaAtual + 1)}
                disabled={paginaAtual === totalPaginas}
                className="px-3 py-2 bg-[#1a2d4a] text-white rounded-lg font-medium text-sm disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#2a4d7a] transition-colors"
              >
                <i className="fa-solid fa-chevron-right"></i>
              </button>
            </div>
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
