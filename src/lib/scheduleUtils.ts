/** UTC-3 (Horário de Brasília) helpers */

/** Converte ISO UTC para string usada em input datetime-local (UTC-3) */
export function utcToBrazilInput(utcIso: string | null | undefined): string {
  if (!utcIso) return '';
  const d = new Date(utcIso);
  // Subtrai 3h para chegar no horário de Brasília
  const brazil = new Date(d.getTime() - 3 * 60 * 60 * 1000);
  return brazil.toISOString().slice(0, 16);
}

/** Converte valor de input datetime-local (interpretado como UTC-3) para ISO UTC */
export function brazilInputToUtc(localStr: string): string {
  if (!localStr) return '';
  // Trata o valor do input como horário de Brasília (UTC-3) e converte para UTC
  const d = new Date(localStr + ':00Z'); // parse como UTC
  const utc = new Date(d.getTime() + 3 * 60 * 60 * 1000); // adiciona 3h para obter UTC real
  return utc.toISOString();
}

/**
 * Computa se está aberto agora.
 * - Se openAt OU closeAt estiver definido, usa a agenda.
 * - Caso contrário, usa o toggle manual.
 */
export function computeIsOpen(
  manualValue: boolean,
  openAt: string | null | undefined,
  closeAt: string | null | undefined,
): boolean {
  if (openAt || closeAt) {
    const now = Date.now();
    const afterOpen  = openAt  ? now >= new Date(openAt).getTime()  : true;
    const beforeClose = closeAt ? now <  new Date(closeAt).getTime() : true;
    return afterOpen && beforeClose;
  }
  return manualValue;
}

/** Formata um ISO UTC para exibição no formato brasileiro */
export function formatBrazilDateTime(utcIso: string | null | undefined): string {
  if (!utcIso) return '—';
  return new Date(utcIso).toLocaleString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }) + ' (Brasília)';
}
