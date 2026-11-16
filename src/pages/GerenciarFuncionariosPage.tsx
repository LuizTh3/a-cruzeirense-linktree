import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  deleteColaborador,
  getTodosColaboradores,
  saveColaborador,
  setColaboradorAtivo,
} from '../services/colaboradoresService';
import { cloudinaryUrl } from '../services/cloudinaryService';
import { setores } from '../data/setores';
import type { Colaborador } from '../types';
import ImageUpload from '../components/ImageUpload';
import Footer from '../components/Footer';

interface FuncionarioFormData {
  id: string;
  nome: string;
  cargo: string;
  setorSlug: string;
  whatsapp: string;
  avatarSrc: string;
  avatarPublicId: string;
  ordem: string;
}

const initialFormData: FuncionarioFormData = {
  id: '',
  nome: '',
  cargo: 'Atendente',
  setorSlug: '',
  whatsapp: '',
  avatarSrc: '',
  avatarPublicId: '',
  ordem: '',
};

const inputClass =
  'w-full px-4 py-3 rounded-lg bg-[#1a2d4a] text-white border border-white/10 focus:border-[#1a5fa8] outline-none';

export default function GerenciarFuncionariosPage() {
  const [funcionarios, setFuncionarios] = useState<Colaborador[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [enviandoImagem, setEnviandoImagem] = useState(false);
  const [formData, setFormData] = useState<FuncionarioFormData>(initialFormData);
  const [editando, setEditando] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [filtroSetor, setFiltroSetor] = useState('');

  useEffect(() => {
    fetchFuncionarios();
  }, []);

  async function fetchFuncionarios() {
    try {
      setFuncionarios(await getTodosColaboradores());
    } catch (error) {
      console.error('Erro ao buscar funcionários:', error);
      setMensagem('Erro ao carregar funcionários');
    } finally {
      setLoading(false);
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleEdit(funcionario: Colaborador) {
    setFormData({
      id: funcionario.id,
      nome: funcionario.nome,
      cargo: funcionario.cargo,
      setorSlug: funcionario.setorSlug,
      whatsapp: funcionario.whatsapp,
      avatarSrc: funcionario.avatarSrc,
      avatarPublicId: '',
      ordem: String(funcionario.ordem),
    });
    setEditando(true);
    setMensagem('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleCancel() {
    setFormData(initialFormData);
    setEditando(false);
    setMensagem('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!formData.nome.trim() || !formData.setorSlug) {
      setMensagem('Preencha o nome e o setor');
      return;
    }

    const digitosWhatsapp = formData.whatsapp.replace(/\D/g, '');
    if (digitosWhatsapp && digitosWhatsapp.length < 10) {
      setMensagem('WhatsApp inválido: informe DDD + número');
      return;
    }

    const noSetor = funcionarios.filter((f) => f.setorSlug === formData.setorSlug);
    const proximaOrdem = noSetor.reduce((max, f) => Math.max(max, f.ordem), 0) + 1;
    const ordemInformada = parseInt(formData.ordem, 10);
    const atual = funcionarios.find((f) => f.id === formData.id);

    setSaving(true);
    try {
      await saveColaborador({
        id: editando ? formData.id : undefined,
        setorSlug: formData.setorSlug,
        nome: formData.nome,
        cargo: formData.cargo || 'Atendente',
        whatsapp: formData.whatsapp,
        avatarSrc: formData.avatarSrc,
        avatarPublicId: formData.avatarPublicId || undefined,
        ordem: Number.isNaN(ordemInformada) ? proximaOrdem : ordemInformada,
        ativo: atual?.ativo ?? true,
      });
      setMensagem(editando ? 'Funcionário atualizado com sucesso!' : 'Funcionário adicionado com sucesso!');
      setFormData(initialFormData);
      setEditando(false);
      fetchFuncionarios();
    } catch (error) {
      setMensagem('Erro ao salvar funcionário');
      console.error(error);
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleAtivo(funcionario: Colaborador) {
    try {
      await setColaboradorAtivo(funcionario.id, !funcionario.ativo);
      setMensagem(
        funcionario.ativo ? 'Funcionário ocultado com sucesso!' : 'Funcionário reativado com sucesso!'
      );
      fetchFuncionarios();
    } catch (error) {
      setMensagem('Erro ao atualizar funcionário');
      console.error(error);
    }
  }

  async function handleDelete(funcionario: Colaborador) {
    if (!confirm(`Tem certeza que deseja excluir ${funcionario.nome}? Esta ação não pode ser desfeita.`)) return;

    try {
      await deleteColaborador(funcionario.id);
      if (formData.id === funcionario.id) handleCancel();
      setMensagem('Funcionário excluído com sucesso!');
      fetchFuncionarios();
    } catch (error) {
      setMensagem('Erro ao excluir funcionário');
      console.error(error);
    }
  }

  const funcionariosFiltrados = useMemo(() => {
    if (!filtroSetor) return funcionarios;
    return funcionarios.filter((f) => f.setorSlug === filtroSetor);
  }, [funcionarios, filtroSetor]);

  function getSetorTitle(slug: string) {
    return setores.find((s) => s.slug === slug)?.title || slug;
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
          Gerenciar Funcionários
        </h1>

        <p className="text-white/70 text-sm mb-6">
          {funcionarios.length} {funcionarios.length === 1 ? 'funcionário cadastrado' : 'funcionários cadastrados'}
        </p>

        {mensagem && (
          <div
            className={`w-full max-w-md p-3 rounded-lg mb-4 text-center text-sm ${
              mensagem.includes('sucesso')
                ? 'bg-green-600/20 text-green-400 border border-green-600/30'
                : 'bg-red-600/20 text-red-400 border border-red-600/30'
            }`}
          >
            {mensagem}
          </div>
        )}

        <form onSubmit={handleSubmit} className="w-full max-w-md flex flex-col gap-4 mb-8">
          <div>
            <label className="block text-white text-sm mb-1">Nome *</label>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleInputChange}
              className={inputClass}
              placeholder="Nome do funcionário"
            />
          </div>

          <div>
            <label className="block text-white text-sm mb-1">Setor *</label>
            <select name="setorSlug" value={formData.setorSlug} onChange={handleInputChange} className={inputClass}>
              <option value="" disabled style={{ color: '#94a3b8' }}>
                Selecione um setor
              </option>
              {setores.map((setor) => (
                <option key={setor.slug} value={setor.slug} style={{ color: 'white' }}>
                  {setor.title}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-[1fr_6rem] gap-4">
            <div>
              <label className="block text-white text-sm mb-1">Cargo</label>
              <input
                type="text"
                name="cargo"
                value={formData.cargo}
                onChange={handleInputChange}
                className={inputClass}
                placeholder="Atendente"
              />
            </div>
            <div>
              <label className="block text-white text-sm mb-1">Posição</label>
              <input
                type="number"
                name="ordem"
                min="1"
                value={formData.ordem}
                onChange={handleInputChange}
                className={inputClass}
                placeholder="Auto"
              />
            </div>
          </div>

          <div>
            <label className="block text-white text-sm mb-1">WhatsApp (DDD + número)</label>
            <input
              type="tel"
              name="whatsapp"
              value={formData.whatsapp}
              onChange={handleInputChange}
              className={inputClass}
              placeholder="68999999999"
            />
          </div>

          <ImageUpload
            label="Foto"
            formato="circular"
            pasta="funcionarios"
            value={formData.avatarSrc}
            onUploadingChange={setEnviandoImagem}
            onChange={(imagem) =>
              setFormData((prev) => ({ ...prev, avatarSrc: imagem.url, avatarPublicId: imagem.publicId }))
            }
          />

          <div className="flex gap-3 mt-2">
            <button
              type="submit"
              disabled={saving || enviandoImagem}
              className="flex-1 py-3 bg-[linear-gradient(135deg,#082d5e,#1a5fa8)] text-white rounded-lg font-bold transition-all duration-300 hover:brightness-110 disabled:opacity-50"
            >
              {saving ? 'Salvando...' : editando ? 'Atualizar Funcionário' : 'Adicionar Funcionário'}
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
          <select
            value={filtroSetor}
            onChange={(e) => setFiltroSetor(e.target.value)}
            className="w-full px-4 py-2.5 mb-4 rounded-lg bg-[#1a2d4a] text-white border border-white/10 focus:border-[#1a5fa8] outline-none text-sm"
          >
            <option value="" style={{ color: '#94a3b8' }}>Todos os setores</option>
            {setores.map((setor) => (
              <option key={setor.slug} value={setor.slug} style={{ color: 'white' }}>
                {setor.title}
              </option>
            ))}
          </select>

          <h2 className="text-white font-bold text-lg mb-4">Funcionários Cadastrados</h2>

          {funcionariosFiltrados.length === 0 ? (
            <p className="text-white/50 text-center py-4">
              {filtroSetor ? 'Nenhum funcionário neste setor' : 'Nenhum funcionário cadastrado'}
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {funcionariosFiltrados.map((funcionario) => (
                <div
                  key={funcionario.id}
                  className={`flex items-center gap-3 p-3 bg-[#1a2d4a] rounded-lg border border-white/10 ${
                    funcionario.ativo ? '' : 'opacity-50'
                  }`}
                >
                  <img
                    src={cloudinaryUrl(funcionario.avatarSrc, 120)}
                    alt={funcionario.nome}
                    className="w-14 h-14 rounded-full object-cover border-2 border-white/20 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-white font-medium text-sm truncate">{funcionario.nome}</h3>
                      {!funcionario.ativo && (
                        <span className="bg-gray-500/30 text-gray-300 text-[0.65rem] px-1.5 py-0.5 rounded">
                          OCULTO
                        </span>
                      )}
                    </div>
                    <p className="text-white/50 text-xs truncate">
                      {funcionario.cargo} · {getSetorTitle(funcionario.setorSlug)}
                    </p>
                    <p className="text-white/40 text-xs truncate">
                      {funcionario.whatsapp ? `+${funcionario.whatsapp}` : 'Sem WhatsApp'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(funcionario)}
                      aria-label={`Editar ${funcionario.nome}`}
                      className="p-2 bg-bg-container-top text-white rounded hover:bg-[#2a7fc8] transition-colors"
                    >
                      <i className="fa-solid fa-pen"></i>
                    </button>
                    <button
                      onClick={() => handleToggleAtivo(funcionario)}
                      aria-label={funcionario.ativo ? `Ocultar ${funcionario.nome}` : `Reativar ${funcionario.nome}`}
                      title={funcionario.ativo ? 'Ocultar do site' : 'Mostrar no site'}
                      className="p-2 bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors"
                    >
                      <i className={`fa-solid ${funcionario.ativo ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                    </button>
                    <button
                      onClick={() => handleDelete(funcionario)}
                      aria-label={`Excluir ${funcionario.nome}`}
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
          className="inline-block mt-8 px-6 py-3 bg-[linear-gradient(135deg,#082d5e,#1a5fa8)] text-white rounded-lg font-bold transition-all duration-300 hover:brightness-110"
        >
          Voltar ao Painel
        </Link>
      </div>

      <Footer />
    </main>
  );
}
