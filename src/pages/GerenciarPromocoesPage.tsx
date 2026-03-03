import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProdutos, saveProduto, deleteProduto } from '../services/promocoesService';
import type { Produto } from '../types';

const MAX_PROMOCOES = 8;

interface ProdutoFormData {
  id: string;
  titulo: string;
  preco: string;
  precoPromocional: string;
  imagem: string;
  categoria: string;
  destaque: boolean;
}

const initialFormData: ProdutoFormData = {
  id: '',
  titulo: '',
  preco: '',
  precoPromocional: '',
  imagem: '',
  categoria: '',
  destaque: false,
};

export default function GerenciarPromocoesPage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<ProdutoFormData>(initialFormData);
  const [editando, setEditando] = useState(false);
  const [mensagem, setMensagem] = useState('');

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
    const precoPromocional = formData.precoPromocional ? parseFloat(formData.precoPromocional) : undefined;

    if (precoPromocional && precoPromocional >= preco) {
      setMensagem('O preço promocional deve ser menor que o preço original');
      return;
    }

    if (!editando && produtos.length >= MAX_PROMOCOES) {
      setMensagem(`Máximo de ${MAX_PROMOCOES} promoções permitido`);
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
      };

      await saveProduto(produto);
      setMensagem(editando ? 'Promoção atualizada com sucesso!' : 'Promoção adicionada com sucesso!');
      setFormData(initialFormData);
      setEditando(false);
      fetchProdutos();
    } catch (error) {
      setMensagem('Erro ao salvar promoção');
      console.error(error);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Tem certeza que deseja excluir esta promoção?')) return;
    
    try {
      await deleteProduto(id);
      setMensagem('Promoção excluída com sucesso!');
      fetchProdutos();
    } catch (error) {
      setMensagem('Erro ao excluir promoção');
      console.error(error);
    }
  }

  function handleCancel() {
    setFormData(initialFormData);
    setEditando(false);
    setMensagem('');
  }

  if (loading) {
    return (
      <main className="relative max-w-120 mx-auto min-h-screen bg-container-radial border-x border-white/5 shadow-lateral flex flex-col items-center justify-center overflow-x-hidden pb-10 px-6">
        <div className="text-white">Carregando...</div>
      </main>
    );
  }

  return (
    <main className="relative max-w-120 mx-auto min-h-screen bg-container-radial border-x border-white/5 shadow-lateral flex flex-col items-center overflow-x-hidden pb-10 px-6">
      <h1 className="text-[1.8rem] font-roboto font-bold text-white mt-8 mb-4">
        Gerenciar Promoções
      </h1>

      <p className="text-white/70 text-sm mb-6">
        {produtos.length}/{MAX_PROMOCOES} promoções cadastradas
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

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-white text-sm mb-1">Preço Original *</label>
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
        </div>

        <div>
          <label className="block text-white text-sm mb-1">URL da Imagem *</label>
          <input
            type="text"
            name="imagem"
            value={formData.imagem}
            onChange={handleInputChange}
            className="w-full px-4 py-3 rounded-lg bg-[#1a2d4a] text-white border border-white/10 focus:border-[#1a5fa8] outline-none"
            placeholder="/assets/images/produtos/nome.webp"
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
            <option value="moveis" style={{ color: 'Black' }}>Móveis</option>
            <option value="calcados" style={{ color: 'Black' }}>Calçados</option>
            <option value="confeccao" style={{ color: 'Black' }}>Confecção</option>
            <option value="tecidos" style={{ color: 'Black' }}>Tecidos</option>
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
            {saving ? 'Salvando...' : editando ? 'Atualizar Promoção' : 'Adicionar Promoção'}
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
        <h2 className="text-white font-bold text-lg mb-4">Promoções Cadastradas</h2>
        
        {produtos.length === 0 ? (
          <p className="text-white/50 text-center py-4">Nenhuma promoção cadastrada</p>
        ) : (
          <div className="flex flex-col gap-3">
            {produtos.map((produto) => (
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
      </div>

      <Link
        to="/admin/dashboard"
        className="mt-8 px-6 py-3 bg-[linear-gradient(135deg,#082d5e,#1a5fa8)] text-white rounded-lg font-bold transition-all duration-300 hover:brightness-110"
      >
        Voltar ao Painel
      </Link>
    </main>
  );
}
