import { useRef, useState } from 'react';
import { ImageIcon, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
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
      ? 'size-24 rounded-full border border-white/15 object-cover'
      : 'max-h-40 max-w-full rounded-lg border border-white/10 object-contain';

  return (
    <div className="grid gap-1.5">
      <Label>{label}</Label>

      <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-white/20 bg-input/30 p-4">
        {value ? (
          <img src={cloudinaryUrl(value, 600)} alt="Pré-visualização" className={previewClass} />
        ) : (
          <div className="flex flex-col items-center py-2 text-white/40">
            <ImageIcon className="mb-1 size-8" />
            <span className="text-xs">Nenhuma imagem selecionada</span>
          </div>
        )}

        {enviando && (
          <div className="w-full">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
              <div className="h-full bg-brand transition-all duration-200" style={{ width: `${progresso}%` }} />
            </div>
            <p className="mt-1 text-center text-xs text-white/60">Enviando... {progresso}%</p>
          </div>
        )}

        <Button
          type="button"
          variant="secondary"
          size="lg"
          disabled={enviando}
          onClick={() => inputRef.current?.click()}
        >
          <Upload />
          {value ? 'Trocar imagem' : 'Escolher imagem'}
        </Button>

        <input ref={inputRef} type="file" accept={ACCEPT_IMAGENS} onChange={handleFile} className="hidden" />

        <p className="text-xs text-white/40">JPG, PNG ou WEBP, até 5 MB</p>
      </div>

      {erro && <p className="text-xs text-red-400">{erro}</p>}
    </div>
  );
}
