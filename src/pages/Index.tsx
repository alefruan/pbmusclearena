import { RegistrationForm } from '@/components/RegistrationForm';
import heroImage from '@/assets/hero-bodybuilding.jpg';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { computeIsOpen } from '@/lib/scheduleUtils';

const TARGET_DATE = new Date('2026-05-29T00:00:00');

function useCountdown(target: Date) {
  const calc = () => {
    const diff = target.getTime() - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, done: true };
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
      done: false,
    };
  };
  const [time, setTime] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

function CountdownBox({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-b from-orange-500 to-orange-700 rounded-xl flex items-center justify-center shadow-lg shadow-orange-900/40 border border-orange-400/30">
          <span className="text-2xl sm:text-3xl md:text-4xl font-black text-white tabular-nums">
            {String(value).padStart(2, '0')}
          </span>
        </div>
        <div className="absolute inset-x-0 top-1/2 h-px bg-black/20" />
      </div>
      <span className="mt-2 text-[10px] sm:text-xs md:text-sm font-semibold uppercase tracking-widest text-orange-300">
        {label}
      </span>
    </div>
  );
}

const Index = () => {
  const [inscricoesAbertas, setInscricoesAbertas] = useState(true);
  const [loading, setLoading] = useState(true);
  const countdown = useCountdown(TARGET_DATE);

  useEffect(() => {
    fetchInscricoesStatus();
  }, []);

  const fetchInscricoesStatus = async () => {
    try {
      const keys = ['inscricoes_abertas', 'inscricoes_open_at', 'inscricoes_close_at'];
      const { data, error } = await supabase
        .from('settings')
        .select('key,value')
        .in('key', keys);

      if (error) {
        console.error('Error fetching inscricoes status:', error);
        setInscricoesAbertas(true);
      } else {
        const map = Object.fromEntries((data ?? []).map((r: { key: string; value: string }) => [r.key, r.value]));
        const manual = map['inscricoes_abertas'] === 'true';
        const isOpen = computeIsOpen(manual, map['inscricoes_open_at'], map['inscricoes_close_at']);
        setInscricoesAbertas(isOpen);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      setInscricoesAbertas(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4" />
          <p className="text-orange-300 font-medium tracking-wider uppercase text-sm">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">

      {/* ── Hero ── */}
      <div
        className="relative min-h-[520px] md:min-h-[600px] bg-cover bg-center flex flex-col items-center justify-center overflow-hidden"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        {/* dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-zinc-950" />

        {/* orange glow accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-orange-600/20 blur-3xl rounded-full pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center px-4 text-center">
          <img
            src="https://pbmusclearena.com/wp-content/uploads/2025/08/pbmusclearena-500-x-80-px.png"
            alt="PB Muscle Arena Logo"
            className="w-full h-auto max-w-xs md:max-w-sm mx-auto mb-4"
          />

          <div className="inline-block bg-orange-500 text-white text-xs font-black px-4 py-1 rounded-full tracking-widest uppercase mb-4">
            Edição 2026
          </div>

          
          <p className="text-sm md:text-base font-medium tracking-[0.2em] uppercase text-white/50 mb-8">
            Sistema de Inscrição Online
          </p>

          {/* action links */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
            <Link
              to="/verificar"
              className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white font-semibold px-5 py-2.5 rounded-full transition-all shadow-lg shadow-orange-900/40"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Verificar Inscrição
            </Link>

            <a
              href="https://chat.whatsapp.com/JnNyceV1FQO3zSldZWIw2o?mode=ems_wa_c"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white font-semibold px-5 py-2.5 rounded-full transition-all shadow-lg shadow-green-900/40"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
              </svg>
              Grupo do WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="container mx-auto px-4 py-14">
        <div className="max-w-4xl mx-auto">
          {inscricoesAbertas ? (
            <>
              {/* section header */}
              <div className="text-center mb-10">
                <span className="inline-block px-4 py-1 bg-orange-600/20 text-orange-400 text-xs font-bold uppercase tracking-widest rounded-full mb-4 border border-orange-600/30">
                  Formulário de Inscrição
                </span>
                <h2 className="text-3xl md:text-4xl font-black text-white mb-3">
                  Inscreva-se no Evento
                </h2>
                <p className="text-base text-white/50 mb-3">
                  Preencha o formulário abaixo e gere automaticamente seu PDF de inscrição para impressão.
                </p>
                <p className="text-sm text-white/40">
                  Já está inscrito?{' '}
                  <Link to="/verificar" className="text-orange-400 hover:text-orange-300 font-medium underline underline-offset-2">
                    Verifique sua inscrição aqui
                  </Link>
                </p>
              </div>

              {/* divider */}
              <div className="flex items-center gap-4 mb-10">
                <div className="flex-1 h-px bg-white/10" />
                <div className="w-2 h-2 rounded-full bg-orange-500" />
                <div className="flex-1 h-px bg-white/10" />
              </div>

              <RegistrationForm />
            </>
          ) : (
            <div className="text-center py-16">
              <div className="relative bg-zinc-900 border border-white/10 rounded-2xl p-6 sm:p-10 max-w-2xl mx-auto overflow-hidden">
                {/* glow */}
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent" />

                <div className="w-20 h-20 rounded-full bg-orange-600/15 flex items-center justify-center mx-auto mb-6 border border-orange-600/30">
                  <svg className="h-10 w-10 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.96-.833-2.73 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>

                <h2 className="text-3xl font-black text-white mb-3">Inscrições Fechadas</h2>
                <p className="text-white/50 mb-8 text-base">
                  O período de inscrições não está disponível no momento.
                </p>

                {!countdown.done && (
                  <div className="mb-8">
                    <p className="text-sm uppercase tracking-widest text-white/40 mb-4 font-medium">
                      Abertura em
                    </p>
                    <div className="flex items-start justify-center gap-1.5 sm:gap-3">
                      <CountdownBox value={countdown.days}    label="Dias" />
                      <span className="text-xl sm:text-2xl font-black text-orange-500 mt-3">:</span>
                      <CountdownBox value={countdown.hours}   label="Horas" />
                      <span className="text-xl sm:text-2xl font-black text-orange-500 mt-3">:</span>
                      <CountdownBox value={countdown.minutes} label="Min" />
                      <span className="text-xl sm:text-2xl font-black text-orange-500 mt-3">:</span>
                      <CountdownBox value={countdown.seconds} label="Seg" />
                    </div>
                    <p className="mt-4 text-sm font-semibold text-orange-400/80 tracking-wide">
                      29 de Maio de 2026
                    </p>
                  </div>
                )}

                <a
                  href="https://chat.whatsapp.com/JnNyceV1FQO3zSldZWIw2o?mode=ems_wa_c"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white font-semibold px-6 py-3 rounded-full transition-all shadow-lg shadow-green-900/40"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                  </svg>
                  Entrar no grupo do WhatsApp
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Footer ── */}
      <footer className="border-t border-white/10 bg-zinc-900 py-10 mt-16">
        <div className="container mx-auto px-4 text-center">
          <img
            src="https://pbmusclearena.com/wp-content/uploads/2025/08/pbmusclearena-500-x-80-px.png"
            alt="PB Muscle Arena Logo"
            className="w-full h-auto max-w-[180px] mx-auto mb-3 opacity-80"
          />
          <p className="text-white/40 text-sm">
            Sistema de Inscrição Online — Evento de Fisiculturismo
          </p>
          <p className="text-xs text-white/25 mt-3">
            © 2026 PB MUSCLE ARENA. Todos os direitos reservados.
          </p>
          <div className="mt-4 flex items-center justify-center gap-6">
            <Link to="/verificar" className="text-white/40 hover:text-orange-400 text-sm transition-colors">
              Verificar Inscrição
            </Link>
            <span className="text-white/15">|</span>
            <Link to="/admin" className="text-white/40 hover:text-orange-400 text-sm transition-colors">
              Admin
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
