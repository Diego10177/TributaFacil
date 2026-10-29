import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, CheckCircle2, ChevronDown, Download, FileText, HelpCircle, Landmark, RotateCcw, ShieldCheck, Wallet, X } from 'lucide-react';
import { DEMO_DATE, DEMO_DNI, DEMO_MUNICIPALITY, initialDebts, money, outstanding, debtTotal, visibleDebts, confirmPayment, receiptHtml } from '../demo.mjs';
import '../../styles/demo.css';

type Debt = ReturnType<typeof initialDebts>[number];
type Receipt = ReturnType<typeof confirmPayment>['receipt'];
type Screen = 'home' | 'debts' | 'review' | 'success';
function Badge({ status }: { status: string }) {
  return <span className={`tf-badge tf-badge-${status.toLowerCase()}`}><span aria-hidden="true">●</span> {status}</span>;
}
export function DemoExperience() {
  const [screen, setScreen] = useState<Screen>('home');
  const [debts, setDebts] = useState<Debt[]>(initialDebts);
  const [dni, setDni] = useState('');
  const [municipality, setMunicipality] = useState('');
  const [searched, setSearched] = useState(false);
  const [filter, setFilter] = useState('Todos');
  const [selected, setSelected] = useState<string[]>([]);
  const [method, setMethod] = useState('');
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [sequence, setSequence] = useState(1);
  const [error, setError] = useState('');
  const [help, setHelp] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const resetDialog = useRef<HTMLDialogElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const pending = outstanding(debts);
  const chosen = debts.filter(d => selected.includes(d.id) && d.status !== 'Pagado');
  const total = debtTotal(chosen);
  const lateTotal = debtTotal(pending.filter(d => d.status === 'Vencido'));
  useEffect(() => { document.title = 'TributaFácil · Demostración'; }, []);
  useEffect(() => { window.scrollTo({ top: 0 }); title.current?.focus(); }, [screen, searched]);
  const go = (next: Screen) => { setError(''); setScreen(next); };
  const toggle = (id: string) => setSelected(previous => previous.includes(id) ? previous.filter(x => x !== id) : [...previous, id]);
  const search = (event: React.FormEvent) => {
    event.preventDefault();
    if (dni.trim() !== DEMO_DNI || municipality !== DEMO_MUNICIPALITY) {
      setError('Este prototipo solo consulta el caso ficticio. Usa los datos de prueba indicados abajo.'); setSearched(false); return;
    }
    setError(''); setSearched(true);
  };
  const reset = () => {
    setDebts(initialDebts()); setDni(''); setMunicipality(''); setSearched(false); setFilter('Todos');
    setSelected([]); setMethod(''); setReceipt(null); setSequence(1); setError(''); setDownloaded(false);
    setHelp(false); setScreen('home'); resetDialog.current?.close();
  };
  const pay = () => {
    try {
      const result = confirmPayment(debts, selected, method, sequence);
      setDebts(result.debts); setReceipt(result.receipt); setSelected([]); setSequence(n => n + 1);
      setDownloaded(false); setScreen('success');
    } catch (e) { setError((e as Error).message); }
  };
  const download = () => {
    if (!receipt) return;
    const url = URL.createObjectURL(new Blob([receiptHtml(receipt)], { type: 'text/html;charset=utf-8' }));
    const link = document.createElement('a'); link.href = url; link.download = `${receipt.reference}.html`; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000); setDownloaded(true);
  };
  return <div className="tf-app">
    <div className="tf-demo-bar"><span><span className="tf-demo-dot" /> Entorno de demostración <span className="tf-demo-description">· Datos ficticios. No se realizan cobros.</span></span><button onClick={() => resetDialog.current?.showModal()}><RotateCcw size={13} /> Reiniciar demo</button></div>
    <header className="tf-header"><div className="tf-wrap tf-header-inner">
      <button className="tf-logo" onClick={() => go('home')} aria-label="TributaFácil, ir al inicio"><span className="tf-logo-icon"><Landmark size={22} /></span><span>Tributa<span className="tf-gold">Fácil</span><small>TRIBUTOS MUNICIPALES</small></span></button>
      <nav aria-label="Navegación principal"><button className={screen === 'home' ? 'active' : ''} onClick={() => go('home')}>Inicio</button><button className={screen !== 'home' ? 'active' : ''} onClick={() => go('debts')}>Mis tributos</button><button onClick={() => setHelp(!help)} aria-expanded={help}><HelpCircle size={16} /> Ayuda</button></nav>
      <span className="tf-header-note"><ShieldCheck size={16} /> Sin pagos reales</span>
    </div></header>
    {help && <aside className="tf-help tf-wrap"><button className="tf-help-close" aria-label="Cerrar ayuda" onClick={() => setHelp(false)}><X size={18} /></button><strong>Acerca de esta demostración</strong><p>Solo se utiliza el contribuyente ficticio Carlos Ramírez, DNI {DEMO_DNI}, de {DEMO_MUNICIPALITY}. Los intereses del caso son S/ 0.00; no representan una regla municipal real. La fecha de referencia es {DEMO_DATE}. Los cambios duran mientras esta página siga abierta.</p></aside>}
    {screen === 'home' ? <main className="tf-wrap tf-home">
      <section className="tf-hero"><div className="tf-hero-copy"><div className="tf-eyebrow"><span /> TUS TRIBUTOS, CON CLARIDAD</div><h1 ref={title} tabIndex={-1}>Ponte al día.<br /><em>Sin dar vueltas.</em></h1><p>Revisa tus obligaciones municipales, conoce lo que tienes pendiente y decide qué pagar. Todo en un solo lugar.</p><button className="tf-button tf-primary" onClick={() => go('debts')}>Consultar mis tributos <ArrowRight size={19} /></button><div className="tf-hero-trust"><ShieldCheck size={17} /> Explora el recorrido con datos de prueba</div></div>
      <div className="tf-hero-visual"><div className="tf-orbit" /><div className="tf-account-preview"><div className="tf-preview-heading"><span className="tf-icon-soft"><Wallet size={22} /></span><span>Tu cuenta municipal<small>Una vista más clara de tus obligaciones</small></span></div><span className="tf-caption">TOTAL PENDIENTE · CASO DE EJEMPLO</span><div className="tf-preview-amount">{money(debtTotal(pending))}</div><div className="tf-preview-line"><span>Consulta tus obligaciones</span><CheckCircle2 size={19} /></div><div className="tf-preview-line"><span>Revisa los importes</span><CheckCircle2 size={19} /></div><div className="tf-preview-line"><span>Guarda tu constancia</span><CheckCircle2 size={19} /></div><div className="tf-preview-footer"><span className="tf-demo-dot" /> Demostración interactiva</div></div><div className="tf-floating-note"><FileText size={20} /><span>Más claridad.<strong>Menos incertidumbre.</strong></span></div></div></section>
      <section className="tf-home-bottom" aria-label="Cómo funciona"><p>Un recorrido sencillo,<br /><strong>de principio a fin.</strong></p>{[['01','Consulta','Encuentra tus tributos con los datos de prueba.'],['02','Decide','Elige obligaciones y revisa el importe exacto.'],['03','Confirma','Simula el pago y consulta tu saldo actualizado.']].map(([n,t,d]) => <div key={n}><span>{n}</span><h2>{t}</h2><p>{d}</p></div>)}</section>
    </main> : <main className="tf-wrap tf-workspace">
      <div className="tf-page-top"><button className="tf-back" onClick={() => go(screen === 'review' ? 'debts' : 'home')}><ArrowLeft size={16} /> {screen === 'review' ? 'Volver a mis tributos' : 'Volver al inicio'}</button><span>Fecha del caso: {DEMO_DATE}</span></div>
      <ol className="tf-steps" aria-label="Progreso">{['Consulta y selección', 'Revisión', 'Constancia'].map((label, i) => { const active = screen === 'debts' ? 0 : screen === 'review' ? 1 : 2; return <li key={label} aria-current={i === active ? 'step' : undefined} className={i <= active ? 'is-active' : ''}><span>{i < active ? <Check size={14} /> : i + 1}</span>{label}</li>; })}</ol>
      {screen === 'debts' && <>
        <div className="tf-title-row"><div><div className="tf-eyebrow">MI CUENTA MUNICIPAL</div><h1 ref={title} tabIndex={-1}>Tus tributos, a la vista.</h1><p>Consulta tu cuenta y elige las obligaciones que deseas pagar.</p></div><span className="tf-title-icon"><Landmark size={30} /></span></div>
        {!searched ? <div className="tf-query-layout"><section className="tf-panel tf-query"><h2>Consulta tus obligaciones</h2><p>Ingresa los datos del contribuyente de demostración.</p><form onSubmit={search}><label htmlFor="dni">DNI del contribuyente</label><input id="dni" inputMode="numeric" autoComplete="off" maxLength={8} value={dni} onChange={e => setDni(e.target.value)} placeholder="8 dígitos" required aria-describedby={error ? 'query-error' : 'demo-data'} /><label htmlFor="municipality">Municipalidad</label><div className="tf-select-wrap"><select id="municipality" value={municipality} onChange={e => setMunicipality(e.target.value)} required><option value="">Selecciona una municipalidad</option><option>{DEMO_MUNICIPALITY}</option></select><ChevronDown size={16} /></div>{error && <p id="query-error" className="tf-error" role="alert">{error}</p>}<button className="tf-button tf-primary" type="submit">Consultar tributos <ArrowRight size={18} /></button></form></section><aside className="tf-case-note" id="demo-data"><span className="tf-caption">TU CASO DE PRUEBA</span><div className="tf-avatar">CR</div><h2>Carlos Ramírez</h2><p>Propietario · 38 años · Lima</p><dl><div><dt>DNI ficticio</dt><dd>{DEMO_DNI}</dd></div><div><dt>Municipalidad</dt><dd>Miraflores</dd></div></dl><button className="tf-button tf-secondary" onClick={() => {setDni(DEMO_DNI); setMunicipality(DEMO_MUNICIPALITY); setError('');}}>Usar datos de prueba <ArrowRight size={16} /></button><small>No ingreses tus datos personales. Esta cuenta no corresponde a un contribuyente real.</small></aside></div> : <>
          <div className="tf-account-line"><div className="tf-avatar small">CR</div><div><strong>Carlos Ramírez</strong><span>DNI {DEMO_DNI} · {DEMO_MUNICIPALITY}</span></div></div>
          <section className="tf-metrics" aria-label="Resumen de cuenta"><div className="tf-metric-main"><span>Total pendiente</span><strong>{money(debtTotal(pending))}</strong><small>{pending.length} obligaciones por pagar</small></div><div><span>Monto vencido</span><strong className={lateTotal ? 'tf-red' : ''}>{money(lateTotal)}</strong><small>{lateTotal ? 'Con vencimiento anterior a la fecha del caso' : 'No tienes obligaciones vencidas'}</small></div><div><span>Ya pagado</span><strong>{money(debtTotal(debts.filter(d=>d.status==='Pagado')))}</strong><small>Incluye las simulaciones de esta sesión</small></div></section>
          <div className="tf-debts-layout"><section className="tf-panel tf-list-panel"><div className="tf-list-heading"><div><h2>Detalle de obligaciones</h2><p>Ordenadas por vencimiento. Las pagadas aparecen al final.</p></div></div><div className="tf-filters" aria-label="Filtrar obligaciones">{['Todos','Vencido','Pendiente','Pagado'].map(f=><button key={f} aria-pressed={filter===f} className={filter===f?'selected':''} onClick={()=>setFilter(f)}>{({Todos:'Todos',Vencido:'Vencidos',Pendiente:'Pendientes',Pagado:'Pagados'})[f]}</button>)}</div><div className="tf-debt-list">{visibleDebts(debts, filter).map(d=><label key={d.id} className={`tf-debt-row ${selected.includes(d.id) ? 'checked' : ''} ${d.status==='Pagado'?'paid':''}`}><input type="checkbox" checked={selected.includes(d.id)} disabled={d.status==='Pagado'} onChange={()=>toggle(d.id)} aria-label={`Seleccionar ${d.name}, ${d.period}`} /><div className="tf-debt-description"><strong>{d.name}</strong><span>{d.period}</span><small>Vence: {d.due.split('-').reverse().join('/')}</small></div><div className="tf-debt-value"><strong>{money(d.amount+d.interest)}</strong><Badge status={d.status} /></div></label>)}{visibleDebts(debts,filter).length===0 && <div className="tf-empty"><CheckCircle2 size={28}/><h3>No hay obligaciones {filter==='Vencido'?'vencidas':filter==='Pendiente'?'pendientes':'en este estado'}.</h3><button className="tf-link" onClick={()=>setFilter('Todos')}>Ver todas las obligaciones</button></div>}</div></section>
          <aside className="tf-panel tf-selection"><span className="tf-icon-soft"><Wallet size={22}/></span><h2>Tu selección</h2><p>Elige los periodos que deseas incluir en esta simulación.</p><div className="tf-selection-items">{chosen.length ? chosen.map(d=><div key={d.id}><span>{d.name}<small>{d.period}</small></span><strong>{money(d.amount+d.interest)}</strong></div>) : <p className="tf-selection-empty">Aún no has seleccionado obligaciones.</p>}</div><div className="tf-selection-total" aria-live="polite" aria-atomic="true"><span>Importe seleccionado</span><strong>{money(total)}</strong><small>{chosen.length} {chosen.length===1?'obligación seleccionada':'obligaciones seleccionadas'}</small></div><button className="tf-button tf-primary" disabled={!chosen.length} onClick={()=>go('review')}>Revisar selección <ArrowRight size={17}/></button><p className="tf-safe-note"><ShieldCheck size={14}/> No se realizará ningún cobro</p></aside></div>
        </>}
      </>}
      {screen === 'review' && <><div className="tf-title-row"><div><div className="tf-eyebrow">ANTES DE CONFIRMAR</div><h1 ref={title} tabIndex={-1}>Revisa. Decide. Confirma.</h1><p>Estos son los conceptos y el importe de tu simulación.</p></div></div><div className="tf-review-layout"><section className="tf-panel tf-review"><h2>Resumen de la operación</h2><p className="tf-review-person">Carlos Ramírez · Miraflores</p>{chosen.map(d=><div className="tf-review-item" key={d.id}><div><strong>{d.name}</strong><small>{d.period}</small></div><strong>{money(d.amount)}</strong></div>)}<dl className="tf-breakdown"><div><dt>Monto base</dt><dd>{money(chosen.reduce((s,d)=>s+d.amount,0))}</dd></div><div><dt>Intereses de demostración</dt><dd>{money(chosen.reduce((s,d)=>s+d.interest,0))}</dd></div><div className="tf-breakdown-total"><dt>Total a simular</dt><dd>{money(total)}</dd></div></dl><p className="tf-info-note">El caso de prueba utiliza intereses de S/ 0.00. No es una cotización ni una exoneración municipal.</p><button className="tf-link" onClick={()=>go('debts')}><ArrowLeft size={15}/> Modificar selección</button></section><section className="tf-panel tf-method"><fieldset><legend>Método de demostración</legend><p>Solo se registra tu elección; no pediremos datos financieros.</p>{[['Tarjeta','💳','Visa / Mastercard'],['Yape','📱','Billetera digital'],['Plin','📲','Billetera digital']].map(([name,emoji,desc])=><label key={name} className={`tf-method-option ${method===name?'checked':''}`}><input type="radio" name="method" value={name} checked={method===name} onChange={()=>setMethod(name)}/><span aria-hidden="true">{emoji}</span><div><strong>{name}</strong><small>{desc}</small></div>{method===name && <CheckCircle2 size={18}/>}</label>)}</fieldset>{error && <p role="alert" className="tf-error">{error}</p>}<button className="tf-button tf-primary" disabled={!method || !chosen.length} onClick={pay}>Confirmar simulación · {money(total)} <ArrowRight size={16}/></button><p className="tf-safe-note"><ShieldCheck size={14}/> Sin conexión a bancos ni municipalidades</p></section></div></>}
      {screen === 'success' && receipt && <div className="tf-success-layout"><section className="tf-panel tf-success"><div className="tf-success-icon"><CheckCircle2 size={36}/></div><div className="tf-eyebrow">OPERACIÓN DE DEMOSTRACIÓN</div><h1 ref={title} tabIndex={-1}>Simulación completada.</h1><p>Tu cuenta de prueba ya refleja esta operación.</p><div className="tf-receipt-total">{money(receipt.total)}<span>Importe simulado · {receipt.method}</span></div><div className="tf-receipt-meta"><span>Referencia<strong>{receipt.reference}</strong></span><span>Fecha del caso<strong>{receipt.date}</strong></span></div><div className="tf-receipt-items">{receipt.items.map(d=><div key={d.id}><span>{d.name}<small>{d.period}</small></span><CheckCircle2 size={18}/></div>)}</div><p className="tf-info-note">No se realizó ningún cobro ni se enviaron correos. Esta constancia no tiene validez tributaria.</p><button className="tf-button tf-primary" onClick={download}><Download size={17}/> Descargar constancia de demo</button><span className="tf-download-note" role="status">{downloaded?'Constancia HTML descargada. Puedes abrirla e imprimirla.':'Archivo HTML para guardar, abrir o imprimir.'}</span></section><aside className="tf-next-card"><span className="tf-icon-soft"><Wallet size={23}/></span><h2>Tu cuenta continúa aquí.</h2><p>Las obligaciones seleccionadas figuran como pagadas en esta sesión de prueba.</p><span className="tf-caption">SALDO PENDIENTE</span><strong className="tf-next-amount">{money(debtTotal(pending))}</strong><button className="tf-button tf-secondary" onClick={()=>{setFilter('Todos');setMethod('');go('debts');}}>Consultar saldo actualizado <ArrowRight size={17}/></button><small>Los cambios son locales y se borran al recargar o reiniciar la demostración.</small></aside></div>}
    </main>}
    <footer className="tf-footer tf-wrap"><span>TributaFácil <span>·</span> Tu tiempo también cuenta.</span><span>Prototipo académico · Grupo 4</span></footer>
    <dialog ref={resetDialog} className="tf-reset-dialog" aria-labelledby="reset-title"><div className="tf-icon-soft"><RotateCcw size={24}/></div><h2 id="reset-title">¿Empezamos de nuevo?</h2><p>Se restablecerán las deudas y se borrarán la selección y la constancia de esta sesión.</p><div><button className="tf-button tf-secondary" onClick={()=>resetDialog.current?.close()}>Conservar sesión</button><button className="tf-button tf-primary" onClick={reset}>Reiniciar demo</button></div></dialog>
  </div>;
}
