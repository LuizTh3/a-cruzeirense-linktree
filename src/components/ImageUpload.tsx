import { useRef, useState } from 'react';
import {
  ACCEPT_IMAGENS,
  cloudinaryUrl,
  uploadImagem,
  validarImagem,
} from '../services/cloudinaryService';
import type { ImagemEnviada, PastaUpload } from '../services/cloudinaryService';

interface ImageUploadProps {
  label: string;
  value: string;
  pasta: PastaUpload;
  onChange: (imagem: ImagemEnviada) => void;
  onUploadingChange?: (enviando: boolean) => void;
  formato?: 'retangular' | 'circular';
}

export default function ImageUpload({
  label,
  value,
  pasta,
  onChange,
  onUploadingChange,
  formato = 'retangular',
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [enviando, setEnviando] = useState(false);
  const [progresso, setProgresso] = useState(0);
  const [erro, setErro] = useState('');

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    const erroValidacao = validarImagem(file);
    if (erroValidacao) {
      setErro(erroValidacao);
      return;
    }

    setErro('');
    setProgresso(0);
    setEnviando(true);
    onUploadingChange?.(true);
    try {
      const imagem = await uploadImagem(file, pasta, setProgresso);
      onChange(imagem);
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Falha ao enviar a imagem.');
    } finally {
      setEnviando(false);
      onUploadingChange?.(false);
    }
  }

  const previewClass =
    formato === 'circular'
      ? 'w-24 h-24 rounded-full object-cover border-2 border-white/20'
      : 'max-h-40 max-w-full rounded-lg object-contain border border-white/10';

  return (
    <div>
      <label className="block text-white text-sm mb-1">{label}</label>

      <div className="flex flex-col items-center gap-3 p-4 rounded-lg bg-[#1a2d4a] border border-dashed border-white/20">
        {value ? (
          <img src={cloudinaryUrl(value, 600)} alt="Pré-visualização" className={previewClass} />
        ) : (
          <div className="flex flex-col items-center text-white/40 py-2">
            <i className="fa-solid fa-image text-3xl mb-1"></i>
            <span className="text-xs">Nenhuma imagem selecionada</span>
          </div>
        )}

        {enviando && (
          <div className="w-full">
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#1a5fa8] transition-all duration-200"
                style={{ width: `${progresso}%` }}
              />
            </div>
            <p className="text-white/60 text-xs text-center mt-1">Enviando... {progresso}%</p>
          </div>
        )}

        <button
          type="button"
          disabled={enviando}
          onClick={() => inputRef.current?.click()}
          className="px-4 py-2 bg-[#1a5fa8] text-white rounded-lg text-sm font-bold transition-all duration-300 hover:brightness-110 disabled:opacity-50"
        >
          <i className="fa-solid fa-upload mr-2"></i>
          {value ? 'Trocar imagem' : 'Escolher imagem'}
        </button>

        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT_IMAGENS}
          onChange={handleFile}
          className="hidden"
        />

        <p className="text-white/40 text-xs">JPG, PNG ou WEBP, até 5 MB</p>
      </div>

      {erro && <p className="text-red-400 text-xs mt-1">{erro}</p>}
    </div>
  );
}
