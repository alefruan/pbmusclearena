import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { computeIsOpen } from '@/lib/scheduleUtils';
import { Link } from 'react-router-dom';

type CheckStatus = 'checking' | 'ok' | 'error';

interface ServiceCheck {
  label: string;
  status: CheckStatus;
  detail?: string;
}

interface FormStatus {
  label: string;
  isOpen: boolean;
}

const dot = (status: CheckStatus) => {
  if (status === 'checking') return 'bg-yellow-400 animate-pulse';
  if (status === 'ok') return 'bg-green-500';
  return 'bg-red-500';
};

const badge = (open: boolean) =>
  open
    ? 'bg-green-500/15 text-green-400 border border-green-500/30'
    : 'bg-red-500/15 text-red-400 border border-red-500/30';

export default function Status() {
  const [checks, setChecks] = useState<ServiceCheck[]>([
    { label: 'Banco de dados (Supabase)', status: 'checking' },
    { label: 'Configurações do sistema', status: 'checking' },
  ]);
  const [forms, setForms] = useState<FormStatus[]>([]);
  const [latency, setLatency] = useState<number | null>(null);
  const [checkedAt, setCheckedAt] = useState<string>('');

  const runChecks = async () => {
    setChecks([
      { label: 'Banco de dados (Supabase)', status: 'checking' },
      { label: 'Configurações do sistema', status: 'checking' },
    ]);
    setForms([]);
    setLatency(null);

    const start = Date.now();

    try {
      const { data, error } = await supabase
        .from('settings')
        .select('key,value')
        .in('key', [
          'inscricoes_abertas', 'inscricoes_open_at', 'inscricoes_close_at',
          'ingressos_abertos', 'ingressos_open_at', 'ingressos_close_at',
        ]);

      const elapsed = Date.now() - start;
      setLatency(elapsed);
      setCheckedAt(new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }));

      if (error) {
        setChecks([
          { label: 'Banco de dados (Supabase)', status: 'error', detail: error.message },
          { label: 'Configurações do sistema', status: 'error', detail: 'Não foi possível carregar' },
        ]);
        return;
      }

      const map = Object.fromEntries((data ?? []).map((r: { key: string; value: string }) => [r.key, r.value]));

      setChecks([
        { label: 'Banco de dados (Supabase)', status: 'ok', detail: `${elapsed}ms` },
        { label: 'Configurações do sistema', status: 'ok', detail: `${data?.length ?? 0} chaves carregadas` },
      ]);

      setForms([
        {
          label: 'Inscrições de atletas',
          isOpen: computeIsOpen(
            map['inscricoes_abertas'] === 'true',
            map['inscricoes_open_at'],
            map['inscricoes_close_at'],
          ),
        },
        {
          label: 'Venda de ingressos',
          isOpen: computeIsOpen(
            map['ingressos_abertos'] === 'true',
            map['ingressos_open_at'],
            map['ingressos_close_at'],
          ),
        },
      ]);
    } catch (err) {
      setLatency(Date.now() - start);
      setCheckedAt(new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }));
      setChecks([
        { label: 'Banco de dados (Supabase)', status: 'error', detail: 'Sem resposta' },
        { label: 'Configurações do sistema', status: 'error', detail: 'Falha na conexão' },
      ]);
    }
  };

  useEffect(() => { runChecks(); }, []);

  const allOk = checks.every(c => c.status === 'ok');
  const anyChecking = checks.some(c => c.status === 'checking');

  return (
    <div className="min-h-screen bg-zinc-950 text-white px-4 py-12">
      <div className="max-w-xl mx-auto space-y-8">

        {/* Header */}
        <div className="text-center space-y-3">
          <Link to="/">
            <img
              src="https://pbmusclearena.com/wp-content/uploads/2025/08/pbmusclearena-500-x-80-px.png"
              alt="PB Muscle Arena"
              className="h-8 w-auto mx-auto mb-6 opacity-80"
            />
          </Link>
          <h1 className="text-2xl font-black tracking-tight">Status do Sistema</h1>
          <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold border ${
            anyChecking
              ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'
              : allOk
              ? 'bg-green-500/10 text-green-400 border-green-500/30'
              : 'bg-red-500/10 text-red-400 border-red-500/30'
          }`}>
            <span className={`w-2 h-2 rounded-full ${anyChecking ? 'bg-yellow-400 animate-pulse' : allOk ? 'bg-green-500' : 'bg-red-500'}`} />
            {anyChecking ? 'Verificando...' : allOk ? 'Todos os sistemas operacionais' : 'Degradação detectada'}
          </div>
        </div>

        {/* Serviços */}
        <div className="bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/10">
            <h2 className="text-xs font-bold uppercase tracking-widest text-white/40">Infraestrutura</h2>
          </div>
          <div className="divide-y divide-white/5">
            {checks.map((c) => (
              <div key={c.label} className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-3">
                  <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${dot(c.status)}`} />
                  <span className="text-sm text-white/80">{c.label}</span>
                </div>
                <div className="text-right">
                  {c.status === 'checking' && <span className="text-xs text-yellow-400">verificando</span>}
                  {c.status === 'ok' && <span className="text-xs text-green-400">{c.detail ?? 'ok'}</span>}
                  {c.status === 'error' && <span className="text-xs text-red-400">{c.detail ?? 'erro'}</span>}
                </div>
              </div>
            ))}
            {latency !== null && (
              <div className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-3">
                  <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${latency < 500 ? 'bg-green-500' : latency < 1500 ? 'bg-yellow-400' : 'bg-red-500'}`} />
                  <span className="text-sm text-white/80">Latência da API</span>
                </div>
                <span className={`text-xs font-mono ${latency < 500 ? 'text-green-400' : latency < 1500 ? 'text-yellow-400' : 'text-red-400'}`}>
                  {latency}ms
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Status dos formulários */}
        {forms.length > 0 && (
          <div className="bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/10">
              <h2 className="text-xs font-bold uppercase tracking-widest text-white/40">Formulários públicos</h2>
            </div>
            <div className="divide-y divide-white/5">
              {forms.map((f) => (
                <div key={f.label} className="flex items-center justify-between px-6 py-4">
                  <span className="text-sm text-white/80">{f.label}</span>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${badge(f.isOpen)}`}>
                    {f.isOpen ? 'ABERTO' : 'FECHADO'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-white/25">
          <span>{checkedAt ? `Atualizado às ${checkedAt}` : ''}</span>
          <button
            onClick={runChecks}
            className="text-orange-400 hover:text-orange-300 transition-colors font-medium"
          >
            Verificar novamente
          </button>
        </div>

      </div>
    </div>
  );
}
