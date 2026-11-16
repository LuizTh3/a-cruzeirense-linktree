import { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { CircleCheck, Star } from 'lucide-react';
import PageShell, { PageLoading } from '../components/layout/PageShell';
import SiteHeader from '../components/layout/SiteHeader';
import Container from '../components/layout/Container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useColaborador } from '../hooks/useColaborador';
import { enviarAvaliacao } from '../services/avaliacoesService';
import { useRastrearAcesso } from '../hooks/useRastrearAcesso';
import { useRastrearWhatsApp } from '../hooks/useRastrearWhatsApp';
import { cloudinaryUrl } from '../services/cloudinaryService';

export default function CollabProfilePage() {
  const { slug, id } = useParams<{ slug: string; id: string }>();
  const { colaborador, setorSlug, setorTitle, loading, error } = useColaborador(slug, id);

  useRastrearAcesso();
  const { rastrearClique } = useRastrearWhatsApp();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [telefone, setTelefone] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const formatTelefone = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 2) return digits;
    if (digits.length <= 3) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 11)}`;
  };

  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatTelefone(e.target.value);
    setTelefone(formatted);
  };

  if (loading) {
    return <PageLoading />;
  }

  if (error || !colaborador) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    if (rating === 0) {
      setSubmitError('Por favor, selecione uma avaliação');
      return;
    }

    const digits = telefone.replace(/\D/g, '');
    if (digits.length !== 11) {
      setSubmitError('Por favor, insira um telefone válido (DDD + 9 dígitos)');
      return;
    }

    setSending(true);

    try {
      if (!setorSlug) {
        setSubmitError('Erro ao identificar setor. Tente novamente.');
        return;
      }
      await enviarAvaliacao({
        colaboradorId: String(colaborador.id),
        setorSlug,
        rating,
        feedback,
        telefone: digits,
      });
      setSubmitted(true);
    } catch (err) {
      console.error('Erro ao enviar avaliação:', err);
      setSubmitError('Erro ao enviar avaliação. Tente novamente.');
    } finally {
      setSending(false);
    }
  };

  const getWhatsAppMessage = () => {
    if (setorSlug === 'pagamento') {
      return 'Olá, gostaria de realizar o pagamento de uma fatura, poderia me ajudar?';
    }
    if (setorSlug === 'negociacao') {
      return 'Olá, gostaria de saber mais sobre um crediario, poderia me ajudar?';
    }
    return 'Olá, gostaria de saber mais sobre um produto da loja, poderia me ajudar?';
  };

  const temWhatsApp = !!colaborador.whatsappHref && colaborador.whatsappHref !== '#';
  const whatsappUrl = (() => {
    if (!temWhatsApp) return '';
    const mensagem = encodeURIComponent(getWhatsAppMessage());
    const baseUrl = colaborador.whatsappHref!;
    return baseUrl.includes('wa.me')
      ? `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}text=${mensagem}`
      : `https://wa.me/${baseUrl}?text=${mensagem}`;
  })();

  return (
    <PageShell>
      <SiteHeader back={{ to: `/setor/${setorSlug}`, label: 'Voltar para o setor' }} />

      <Container className="mt-6 grid gap-5 lg:mt-10 lg:grid-cols-[22rem_1fr] lg:items-start lg:gap-8">
        <section className="flex flex-col items-center rounded-xl border border-white/10 bg-surface-card p-6 text-center">
          <img
            src={cloudinaryUrl(colaborador.avatarSrc, 280)}
            alt={`Foto ${colaborador.nome}`}
            className="size-28 rounded-full border border-white/15 object-cover md:size-32"
            loading="eager"
            fetchPriority="high"
          />

          <h1 className="mt-4 text-2xl font-semibold tracking-tight text-white">{colaborador.nome}</h1>
          <p className="text-white/70">{colaborador.cargo}</p>
          {setorTitle && <p className="mt-1 text-sm text-white/50">{setorTitle}</p>}

          {temWhatsApp && (
            <Button asChild size="xl" className="mt-5 w-full bg-whatsapp text-white hover:bg-whatsapp-hover">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => rastrearClique(setorSlug || 'contato', 'contato')}
              >
                <i className="fa-brands fa-whatsapp text-xl" aria-hidden="true"></i>
                Entrar em contato
              </a>
            </Button>
          )}
        </section>

        <section className="rounded-xl border border-white/10 bg-surface-card p-5 md:p-8">
          <h2 className="text-xl font-semibold tracking-tight text-white">Avalie seu atendimento com {colaborador.nome}</h2>
          <p className="mt-1 text-sm text-white/65">Sua opinião ajuda a melhorar nosso atendimento.</p>

          {submitted ? (
            <div className="mt-6 flex flex-col items-center rounded-lg bg-surface-raised p-8 text-center">
              <CircleCheck className="size-12 text-green-500" />
              <p className="mt-3 text-lg text-white">Obrigado pela sua avaliação!</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-5">
              <div>
                <Label className="mb-2">Sua nota</Label>
                <div className="flex gap-1" onMouseLeave={() => setHoverRating(0)}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      aria-label={`${star} ${star === 1 ? 'estrela' : 'estrelas'}`}
                      aria-pressed={rating === star}
                      className="rounded-md p-1 transition-transform hover:scale-110 focus-visible:outline-2 focus-visible:outline-action"
                    >
                      <Star
                        className={`size-8 ${
                          star <= (hoverRating || rating) ? 'fill-yellow-400 text-yellow-400' : 'text-white/30'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="telefone" className="mb-2">
                  Seu telefone (para contato)
                </Label>
                <Input
                  type="tel"
                  id="telefone"
                  value={telefone}
                  onChange={handleTelefoneChange}
                  placeholder="(XX) 99999-9999"
                  required
                  className="max-w-xs"
                />
              </div>

              <div>
                <Label htmlFor="feedback" className="mb-2">
                  Elogios ou reclamações
                </Label>
                <Textarea
                  id="feedback"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Conte sua experiência com este atendimento..."
                  className="min-h-32 resize-none"
                />
              </div>

              {submitError && <p className="text-sm text-red-400">{submitError}</p>}

              <Button type="submit" size="xl" disabled={sending} className="w-full sm:w-fit">
                {sending ? 'Enviando...' : 'Enviar avaliação'}
              </Button>
            </form>
          )}
        </section>
      </Container>
    </PageShell>
  );
}
