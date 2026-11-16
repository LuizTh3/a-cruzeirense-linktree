const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string | undefined;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string | undefined;

const TIPOS_ACEITOS = ['image/jpeg', 'image/png', 'image/webp'];
const TAMANHO_MAXIMO_MB = 5;

export const ACCEPT_IMAGENS = TIPOS_ACEITOS.join(',');

export type PastaUpload = 'promocoes' | 'carrossel' | 'funcionarios';

export interface ImagemEnviada {
  url: string;
  publicId: string;
}

export function validarImagem(file: File): string | null {
  if (!TIPOS_ACEITOS.includes(file.type)) {
    return 'Formato não suportado. Use JPG, PNG ou WEBP.';
  }
  if (file.size > TAMANHO_MAXIMO_MB * 1024 * 1024) {
    return `A imagem deve ter no máximo ${TAMANHO_MAXIMO_MB} MB.`;
  }
  return null;
}

export function uploadImagem(
  file: File,
  pasta: PastaUpload,
  onProgress?: (percentual: number) => void
): Promise<ImagemEnviada> {
  return new Promise((resolve, reject) => {
    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      reject(new Error('Cloudinary não configurado (variáveis VITE_CLOUDINARY_* ausentes).'));
      return;
    }

    const erro = validarImagem(file);
    if (erro) {
      reject(new Error(erro));
      return;
    }

    const body = new FormData();
    body.append('file', file);
    body.append('upload_preset', UPLOAD_PRESET);
    body.append('folder', pasta);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`);

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    };

    xhr.onload = () => {
      try {
        const resposta = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300 && resposta.secure_url) {
          resolve({ url: resposta.secure_url, publicId: resposta.public_id });
        } else {
          reject(new Error(resposta?.error?.message || 'Falha ao enviar a imagem.'));
        }
      } catch {
        reject(new Error('Resposta inválida do Cloudinary.'));
      }
    };

    xhr.onerror = () => reject(new Error('Erro de rede ao enviar a imagem.'));
    xhr.send(body);
  });
}

/**
 * Aplica formato/qualidade automáticos (e largura máxima) em URLs do Cloudinary.
 * Caminhos estáticos ou de outros domínios são devolvidos sem alteração.
 */
export function cloudinaryUrl(url: string, largura?: number): string {
  const marcador = '/image/upload/';
  if (!url || !url.includes('res.cloudinary.com') || !url.includes(marcador)) {
    return url;
  }
  const transformacoes = ['f_auto', 'q_auto'];
  if (largura) transformacoes.push(`w_${largura}`, 'c_limit');
  return url.replace(marcador, `${marcador}${transformacoes.join(',')}/`);
}
