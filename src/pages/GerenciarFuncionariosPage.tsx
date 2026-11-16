import { useEffect, useMemo, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
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
import AdminShell from '../components/layout/AdminShell';
import { PageLoading } from '../components/layout/PageShell';
import Notice from '../components/admin/Notice';
import { AdminEmpty, AdminField, AdminRow, AdminSplit } from '../components/admin/AdminList';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select';

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
    return <PageLoading />;
  }

  const form = (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <h2 className="font-semibold text-white">{editando ? 'Editar funcionário' : 'Novo funcionário'}</h2>

      <AdminField>
        <Label htmlFor="nome">Nome *</Label>
        <Input
          id="nome"
          name="nome"
          value={formData.nome}
          onChange={handleInputChange}
          placeholder="Nome do funcionário"
        />
      </AdminField>

      <AdminField>
        <Label htmlFor="setorSlug">Setor *</Label>
        <NativeSelect
          id="setorSlug"
          name="setorSlug"
          value={formData.setorSlug}
          onChange={handleInputChange}
          className="w-full"
        >
          <NativeSelectOption value="" disabled>
            Selecione um setor
          </NativeSelectOption>
          {setores.map((setor) => (
            <NativeSelectOption key={setor.slug} value={setor.slug}>
              {setor.title}
            </NativeSelectOption>
          ))}
        </NativeSelect>
      </AdminField>

      <div className="grid grid-cols-[1fr_6rem] gap-3">
        <AdminField>
          <Label htmlFor="cargo">Cargo</Label>
          <Input id="cargo" name="cargo" value={formData.cargo} onChange={handleInputChange} placeholder="Atendente" />
        </AdminField>
        <AdminField>
          <Label htmlFor="ordem">Posição</Label>
          <Input
            id="ordem"
            name="ordem"
            type="number"
            min="1"
            value={formData.ordem}
            onChange={handleInputChange}
            placeholder="Auto"
          />
        </AdminField>
      </div>

      <AdminField>
        <Label htmlFor="whatsapp">WhatsApp (DDD + número)</Label>
        <Input
          id="whatsapp"
          name="whatsapp"
          type="tel"
          value={formData.whatsapp}
          onChange={handleInputChange}
          placeholder="68999999999"
        />
      </AdminField>

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
      title="Funcionários"
      description={`${funcionarios.length} ${
        funcionarios.length === 1 ? 'funcionário cadastrado' : 'funcionários cadastrados'
      }`}
    >
      <Notice mensagem={mensagem} />

      <AdminSplit form={form}>
        <NativeSelect
          aria-label="Filtrar por setor"
          value={filtroSetor}
          onChange={(e) => setFiltroSetor(e.target.value)}
          className="mb-4 w-full sm:w-72"
        >
          <NativeSelectOption value="">Todos os setores</NativeSelectOption>
          {setores.map((setor) => (
            <NativeSelectOption key={setor.slug} value={setor.slug}>
              {setor.title}
            </NativeSelectOption>
          ))}
        </NativeSelect>

        {funcionariosFiltrados.length === 0 ? (
          <AdminEmpty>
            {filtroSetor ? 'Nenhum funcionário neste setor' : 'Nenhum funcionário cadastrado'}
          </AdminEmpty>
        ) : (
          <div className="grid gap-3 xl:grid-cols-2">
            {funcionariosFiltrados.map((funcionario) => (
              <AdminRow
                key={funcionario.id}
                nome={funcionario.nome}
                className={funcionario.ativo ? '' : 'opacity-60'}
                media={
                  <img
                    src={cloudinaryUrl(funcionario.avatarSrc, 120)}
                    alt=""
                    className="size-14 shrink-0 rounded-full border border-white/15 object-cover"
                  />
                }
                onEdit={() => handleEdit(funcionario)}
                onDelete={() => handleDelete(funcionario)}
                actions={
                  <Button
                    variant="outline"
                    size="icon-lg"
                    onClick={() => handleToggleAtivo(funcionario)}
                    aria-label={funcionario.ativo ? `Ocultar ${funcionario.nome}` : `Reativar ${funcionario.nome}`}
                    title={funcionario.ativo ? 'Ocultar do site' : 'Mostrar no site'}
                  >
                    {funcionario.ativo ? <EyeOff /> : <Eye />}
                  </Button>
                }
              >
                <div className="flex items-center gap-2">
                  <h3 className="truncate text-sm font-medium text-white">{funcionario.nome}</h3>
                  {!funcionario.ativo && <Badge variant="outline">Oculto</Badge>}
                </div>
                <p className="truncate text-xs text-white/60">
                  {funcionario.cargo} · {getSetorTitle(funcionario.setorSlug)}
                </p>
                <p className="truncate text-xs text-white/45">
                  {funcionario.whatsapp ? `+${funcionario.whatsapp}` : 'Sem WhatsApp'}
                </p>
              </AdminRow>
            ))}
          </div>
        )}
      </AdminSplit>
    </AdminShell>
  );
}
