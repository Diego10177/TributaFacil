export const DEMO_DATE = '29/10/2026';
export const DEMO_DNI = '00000001';
export const DEMO_MUNICIPALITY = 'Municipalidad de Miraflores';
export const money = (amount) => `S/ ${amount.toFixed(2)}`;
export const initialDebts = () => [
  { id: 'predial', name: 'Impuesto predial', period: 'Anual 2026', due: '2026-10-15', amount: 420, interest: 0, status: 'Vencido' },
  { id: 'arbitrios-1', name: 'Arbitrios municipales', period: 'Noviembre 2026', due: '2026-11-15', amount: 187.5, interest: 0, status: 'Pendiente' },
  { id: 'arbitrios-2', name: 'Arbitrios municipales', period: 'Diciembre 2026', due: '2026-12-15', amount: 240, interest: 0, status: 'Pendiente' },
  { id: 'licencia', name: 'Licencia de funcionamiento', period: 'Anual 2026', due: '2026-09-30', amount: 350, interest: 0, status: 'Pagado' },
];
export const debtTotal = (debts) => debts.reduce((sum, d) => sum + d.amount + d.interest, 0);
export const outstanding = (debts) => debts.filter(d => d.status !== 'Pagado');
export function visibleDebts(debts, filter = 'Todos') {
  return debts.filter(d => filter === 'Todos' || d.status === filter)
    .sort((a, b) => Number(a.status === 'Pagado') - Number(b.status === 'Pagado') || a.due.localeCompare(b.due));
}
export function confirmPayment(debts, ids, method, sequence = 1) {
  if (!['Tarjeta', 'Yape', 'Plin'].includes(method)) throw new Error('Elige un método de demostración.');
  if (!ids.length || new Set(ids).size !== ids.length || ids.some(id => !debts.some(d => d.id === id && d.status !== 'Pagado'))) {
    throw new Error('Selecciona al menos una obligación pendiente.');
  }
  const items = debts.filter(d => ids.includes(d.id));
  return {
    debts: debts.map(d => ids.includes(d.id) ? { ...d, status: 'Pagado' } : d),
    receipt: { reference: `DEMO-2026-${String(sequence).padStart(4, '0')}`, date: DEMO_DATE, items, method, total: debtTotal(items) },
  };
}
export function receiptHtml(receipt) {
  // Fields come only from the fixed dataset and validated demonstration methods.
  return `<!doctype html><html lang="es"><meta charset="utf-8"><title>Constancia ${receipt.reference}</title><style>body{font:16px Arial;color:#14234b;background:#f4f6fc;margin:0;padding:40px}main{max-width:650px;margin:auto;background:white;padding:48px;border-top:6px solid #c9a227}h1{font-family:Georgia;font-size:36px}small{color:#656c7b}table{width:100%;border-collapse:collapse;margin:32px 0}td,th{padding:14px 0;text-align:left;border-bottom:1px solid #e4e8ef}td:last-child,th:last-child{text-align:right}.total{font-size:28px;font-weight:bold}.notice{padding:16px;background:#fff5d8;line-height:1.6}@media print{body{background:white;padding:0}main{padding:24px}}</style><main><small>TRIBUTAFÁCIL · CONSTANCIA DE DEMOSTRACIÓN</small><h1>Simulación completada</h1><p>${receipt.reference} · ${receipt.date}</p><p>Carlos Ramírez · DNI ${DEMO_DNI}<br>${DEMO_MUNICIPALITY}<br>Método simulado: ${receipt.method}</p><table><tr><th>Obligación</th><th>Importe</th></tr>${receipt.items.map(d => `<tr><td>${d.name}<br><small>${d.period}</small></td><td>${money(d.amount + d.interest)}</td></tr>`).join('')}</table><p>Intereses de demostración: ${money(receipt.items.reduce((s,d)=>s+d.interest,0))}</p><p class="total">Total simulado: ${money(receipt.total)}</p><p class="notice">No se realizó ningún cobro. Este documento no tiene validez tributaria y no acredita pagos ante una municipalidad. Los datos son ficticios.</p></main></html>`;
}
