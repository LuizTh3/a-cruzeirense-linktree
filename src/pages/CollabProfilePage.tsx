import { useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { useColaborador } from '../hooks/useColaborador';

export default function CollabProfilePage() {
  const { slug, id } = useParams<{ slug: string; id: string }>();
  const { colaborador, setorSlug, setorTitle, loading, error } = useColaborador(slug, id);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (loading) {
    return (
      <main className="relative max-w-120 mx-auto min-h-screen bg-container-radial border-x border-white/5 shadow-lateral flex flex-col items-center justify-center overflow-x-hidden pb-10">
        <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
      </main>
    );
  }

  if (error || !colaborador) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="
      relative max-w-120 mx-auto min-h-screen
      bg-container-radial border-x border-white/5
      shadow-lateral flex flex-col items-center
      overflow-x-hidden pb-10 px-6
    ">
      <Link
        to={`/setor/${setorSlug}`}
        className="self-start mt-6 text-white/70 hover:text-white transition-colors flex items-center gap-2"
      >
        <i className="fa-solid fa-arrow-left"></i>
        Voltar
      </Link>

      <div className="flex flex-col items-center mt-6 w-full">
        <img
          src={colaborador.avatarSrc}
          alt={`Foto ${colaborador.nome}`}
          className="w-28 h-28 rounded-full object-cover border-4 border-white/20 shadow-lg"
          loading="eager"
          fetchPriority="high"
        />

        <h1 className="text-[1.8rem] font-roboto font-bold text-white mt-4 text-center">
          {colaborador.nome}
        </h1>
        <p className="text-[1.1rem] text-white/70 font-roboto">
          {colaborador.cargo}
        </p>
        {setorTitle && (
          <p className="text-[0.9rem] text-white/50 font-roboto mt-1">
            {setorTitle}
          </p>
        )}

        {colaborador.whatsappHref && colaborador.whatsappHref !== '#' && (
          <a
            href={colaborador.whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="
              flex items-center justify-center gap-2 w-full py-3.5 mt-4
              bg-whatsapp text-white no-underline rounded-xl
              font-roboto font-bold text-[0.9rem]
              transition-all duration-300
              hover:bg-[#1DA851]
            "
          >
            <i className="fa-brands fa-whatsapp text-xl"></i>
            Entrar em contato
          </a>
        )}
      </div>

      <div className="w-full mt-8">
        <h2 className="text-[1.3rem] font-roboto font-bold text-white text-center mb-6">
          Avalie este atendimento
        </h2>

        {submitted ? (
          <div className="bg-[#0d2137] rounded-2xl p-6 text-center">
            <i className="fa-solid fa-check-circle text-green-500 text-5xl mb-4"></i>
            <p className="text-white text-lg font-roboto">Obrigado pela sua avaliação!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="text-3xl transition-transform hover:scale-110 focus:outline-none"
                >
                  <i
                    className={`${
                      star <= (hoverRating || rating)
                        ? 'fa-solid fa-star text-yellow-400'
                        : 'fa-regular fa-star text-white/30'
                    }`}
                  ></i>
                </button>
              ))}
            </div>

            <div>
              <label
                htmlFor="feedback"
                className="block text-white/80 text-sm font-roboto mb-2"
              >
                Elogios ou reclamações
              </label>
              <textarea
                id="feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Conte sua experiência com este atendimento..."
                className="
                  w-full h-32 p-4 rounded-xl
                  bg-[#0d2137] text-white
                  border border-white/10
                  placeholder:text-white/30
                  focus:outline-none focus:border-white/30
                  resize-none font-roboto
                "
              />
            </div>

            <button
              type="submit"
              className="
                flex items-center justify-center w-full py-4.5
                bg-white text-blue-700 no-underline rounded-2xl
                font-roboto font-bold uppercase text-[0.85rem] tracking-[1px]
                border-none transition-all duration-300
                ease-[cubic-bezier(0.25,0.8,0.25,1)]
                hover:brightness-95 hover:-translate-y-0.75
                hover:shadow-[0_8px_25px_rgba(255,255,255,0.3)]
              "
            >
              Enviar Avaliação
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
