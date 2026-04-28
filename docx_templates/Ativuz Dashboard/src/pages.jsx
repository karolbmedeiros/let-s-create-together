// pages.jsx — Layouts vazios (shell + estados vazios).
// Nenhum dado fake: apenas a estrutura dos cards, tabelas e formulários.

// ──────────────── empty state helper ────────────────
function EmptyState({ icon: I = IconFileText, title = 'Sem dados para exibir', desc = 'Assim que houver registros, eles aparecerão aqui.', cta }) {
  return (
    <div style={{padding:'64px 24px', textAlign:'center'}}>
      <div style={{
        width:64, height:64, borderRadius:16,
        background:'var(--surface-2)', color:'var(--ink-3)',
        display:'grid', placeItems:'center', margin:'0 auto 16px',
        border:'1px dashed var(--line)'
      }}>
        <I size={28}/>
      </div>
      <h3 style={{fontSize:15, marginBottom:4}}>{title}</h3>
      <p style={{color:'var(--ink-3)', fontSize:13, maxWidth:360, margin:'0 auto'}}>{desc}</p>
      {cta && <div style={{marginTop:18}}>{cta}</div>}
    </div>
  );
}

// ──────────────── DASHBOARD (layout vazio) ────────────────
function DashboardPage() {
  const kpis = [
    { label: 'Contratos ativos',    icon: IconFileText, color: 'orange' },
    { label: 'Vencendo em 30 dias', icon: IconClock,    color: 'warning' },
    { label: 'Inadimplentes',       icon: IconAlert,    color: 'danger' },
    { label: 'Receita do mês',      icon: IconDollar,   color: 'success' },
  ];

  return (
    <div className="page fade-in">
      <div className="page-head">
        <div>
          <h1>Página Inicial</h1>
          <p className="sub">Resumo operacional da frota.</p>
        </div>
        <div className="actions">
          <button className="btn btn-ghost"><IconDownload size={16}/>Exportar</button>
          <button className="btn btn-primary"><IconPlus size={16}/>Novo contrato</button>
        </div>
      </div>

      {/* KPIs vazios */}
      <div className="kpi-grid">
        {kpis.map((k) => {
          const I = k.icon;
          return (
            <div className="kpi" key={k.label}>
              <div className="kpi-top">
                <div className={`kpi-icon ${k.color}`}><I size={18}/></div>
                <span style={{fontSize:11.5, color:'var(--ink-4)'}}>—</span>
              </div>
              <div>
                <div className="kpi-label">{k.label}</div>
                <div className="kpi-value" style={{color:'var(--ink-4)'}}>—</div>
                <div className="kpi-trend" style={{fontSize:11.5, marginTop:6, color:'var(--ink-4)'}}>sem dados</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Atalhos rápidos */}
      <div className="card" style={{padding:0, overflow:'hidden'}}>
        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))'}}>
          <QuickAction icon={IconFilePlus} title="Criar contrato" desc="Novo contrato a partir de template"/>
          <QuickAction icon={IconCheck}    title="Nova vistoria"  desc="Iniciar checklist de entrada ou devolução" border/>
          <QuickAction icon={IconCar}      title="Cadastrar veículo" desc="Adicionar à frota disponível" border/>
          <QuickAction icon={IconUsers}    title="Novo cliente"   desc="Cadastrar empresa, órgão ou motorista" border/>
        </div>
      </div>

      {/* Alertas + Contratos recentes — layout vazio */}
      <div style={{display:'grid', gridTemplateColumns:'minmax(0,1fr) minmax(0,1.4fr)', gap:'var(--d-gap)'}}>
        <div className="card" style={{padding:0}}>
          <div style={{padding:'18px 22px', borderBottom:'1px solid var(--line)', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <div>
              <h3 style={{fontSize:15, fontWeight:600}}>Alertas de inadimplência</h3>
              <p style={{fontSize:12.5, color:'var(--ink-3)', marginTop:2}}>Casos que exigem ação</p>
            </div>
            <span className="badge"><span className="dot"/>0</span>
          </div>
          <EmptyState icon={IconAlert} title="Nenhum alerta" desc="Clientes em atraso aparecerão aqui automaticamente."/>
        </div>

        <div className="card" style={{padding:0}}>
          <div style={{padding:'18px 22px', borderBottom:'1px solid var(--line)', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <div>
              <h3 style={{fontSize:15, fontWeight:600}}>Contratos recentes</h3>
              <p style={{fontSize:12.5, color:'var(--ink-3)', marginTop:2}}>Últimos 7 dias</p>
            </div>
            <div className="seg">
              <button data-active="true">Todos</button>
              <button>Ativos</button>
              <button>Pendentes</button>
            </div>
          </div>
          <EmptyState
            icon={IconFileText}
            title="Nenhum contrato recente"
            desc="Crie um novo contrato para começar a ver o histórico aqui."
            cta={<button className="btn btn-primary btn-sm"><IconPlus size={14}/>Criar contrato</button>}
          />
        </div>
      </div>
    </div>
  );
}

function QuickAction({ icon: I, title, desc, border }) {
  return (
    <button style={{
      display:'flex', alignItems:'flex-start', gap:14, padding:'20px 22px',
      border:0, borderLeft: border ? '1px solid var(--line)' : 0,
      background:'transparent', textAlign:'left', transition:'background .12s',
    }} onMouseOver={(e)=>e.currentTarget.style.background='var(--surface-2)'}
       onMouseOut={(e)=>e.currentTarget.style.background='transparent'}>
      <div style={{width:38,height:38,borderRadius:10,background:'var(--brand-orange-soft)',color:'var(--brand-orange-2)',display:'grid',placeItems:'center',flexShrink:0}}>
        <I size={18}/>
      </div>
      <div style={{flex:1, minWidth:0}}>
        <div style={{fontWeight:600, fontSize:14}}>{title}</div>
        <div style={{fontSize:12.5, color:'var(--ink-3)', marginTop:2, lineHeight:1.4}}>{desc}</div>
      </div>
      <IconArrowRight size={16} style={{color:'var(--ink-4)', marginTop:10}}/>
    </button>
  );
}

// ──────────────── CONTRATOS (layout vazio) ────────────────
function ContratosPage() {
  return (
    <div className="page fade-in">
      <div className="page-head">
        <div>
          <h1>Histórico de Contratos</h1>
          <p className="sub">Acompanhamento de todos os contratos.</p>
        </div>
        <div className="actions">
          <button className="btn btn-ghost"><IconFilter size={16}/>Filtros</button>
          <button className="btn btn-ghost"><IconDownload size={16}/>Exportar</button>
          <button className="btn btn-primary"><IconPlus size={16}/>Novo contrato</button>
        </div>
      </div>

      <div style={{display:'flex', gap:12, alignItems:'center', flexWrap:'wrap'}}>
        <div className="seg">
          <button data-active="true">Todos</button>
          <button>Ativos</button>
          <button>Pendentes</button>
          <button>Inadimplentes</button>
        </div>
        <div style={{flex:1, minWidth:240, position:'relative'}}>
          <input className="input" placeholder="Buscar por cliente, código, CNPJ…" style={{paddingLeft:40}}/>
          <IconSearch size={16} style={{position:'absolute',left:14,top:14,color:'var(--ink-3)'}}/>
        </div>
      </div>

      <div className="card" style={{padding:0, overflow:'hidden'}}>
        <table className="table">
          <thead>
            <tr>
              <th>Contrato</th><th>Cliente</th><th>Tipo</th>
              <th style={{textAlign:'center'}}>Frota</th>
              <th>Início</th><th>Vencimento</th><th>Status</th>
              <th style={{textAlign:'right'}}>Valor/mês</th>
              <th style={{width:40}}></th>
            </tr>
          </thead>
        </table>
        <EmptyState
          icon={IconFileText}
          title="Nenhum contrato cadastrado"
          desc="Seus contratos aparecerão aqui. Comece criando o primeiro."
          cta={<button className="btn btn-primary btn-sm"><IconPlus size={14}/>Criar contrato</button>}
        />
      </div>
    </div>
  );
}

// ──────────────── VISTORIA (layout vazio) ────────────────
function VistoriaPage() {
  const checklist = [
    { cat: 'Exterior',       items: ['Lataria sem avarias', 'Para-choques', 'Faróis e lanternas', 'Retrovisores', 'Pneus (incluindo estepe)'] },
    { cat: 'Interior',       items: ['Bancos e cintos', 'Painel e multimídia', 'Ar-condicionado', 'Tapetes e forração'] },
    { cat: 'Mecânica',       items: ['Óleo e fluidos', 'Sistema de freios', 'Suspensão', 'Nível de combustível'] },
    { cat: 'Documentação',   items: ['CRLV em dia', 'Manual do proprietário', 'Chave reserva', 'Triângulo e macaco'] },
  ];

  return (
    <div className="page fade-in">
      <div className="page-head">
        <div>
          <h1>Nova Vistoria</h1>
          <p className="sub">Checklist de entrada ou devolução de veículo.</p>
        </div>
        <div className="actions">
          <button className="btn btn-ghost">Cancelar</button>
          <button className="btn btn-dark">Salvar rascunho</button>
          <button className="btn btn-primary"><IconCheck size={16}/>Finalizar vistoria</button>
        </div>
      </div>

      {/* Veículo em vistoria — vazio */}
      <div className="card" style={{display:'grid', gridTemplateColumns:'auto 1fr auto', gap:20, alignItems:'center'}}>
        <div style={{width:120, height:80, background:'linear-gradient(135deg,#F0F2F7,#E7E9EF)', borderRadius:10, display:'grid', placeItems:'center', color:'var(--ink-3)'}}>
          <IconCar size={36}/>
        </div>
        <div>
          <div style={{fontSize:11, fontWeight:600, color:'var(--ink-3)', textTransform:'uppercase', letterSpacing:'.08em'}}>Veículo em vistoria</div>
          <div style={{fontSize:20, fontWeight:700, letterSpacing:'-.01em', marginTop:4, color:'var(--ink-4)'}}>Selecione um veículo</div>
          <div style={{fontSize:13, color:'var(--ink-3)', marginTop:4, display:'flex', gap:14, flexWrap:'wrap'}}>
            <span><strong style={{color:'var(--ink)'}}>Placa:</strong> —</span>
            <span><strong style={{color:'var(--ink)'}}>Renavam:</strong> —</span>
            <span><strong style={{color:'var(--ink)'}}>KM atual:</strong> —</span>
            <span><strong style={{color:'var(--ink)'}}>Cor:</strong> —</span>
          </div>
        </div>
        <div style={{textAlign:'right'}}>
          <button className="btn btn-ghost btn-sm"><IconPlus size={14}/>Selecionar veículo</button>
        </div>
      </div>

      {/* Progresso */}
      <div className="card">
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10}}>
          <h3 style={{fontSize:14, fontWeight:600}}>Progresso da vistoria</h3>
          <span className="num" style={{fontSize:13, fontWeight:600, color:'var(--ink-4)'}}>0 / {checklist.reduce((s,c)=>s+c.items.length,0)} itens</span>
        </div>
        <div className="progress"><div style={{width:'0%'}}/></div>
      </div>

      {/* Checklist — template sem marcações */}
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(320px,1fr))', gap:'var(--d-gap)'}}>
        {checklist.map((sec) => (
          <div className="card" key={sec.cat}>
            <div className="card-head">
              <h3>{sec.cat}</h3>
              <span className="badge">{sec.items.length} itens</span>
            </div>
            <div style={{display:'flex', flexDirection:'column', gap:4}}>
              {sec.items.map((item) => (
                <label key={item} style={{display:'flex', alignItems:'center', gap:12, padding:'10px 10px', borderRadius:8, cursor:'pointer', transition:'background .1s'}}
                  onMouseOver={(e)=>e.currentTarget.style.background='var(--surface-2)'}
                  onMouseOut={(e)=>e.currentTarget.style.background='transparent'}>
                  <span style={{
                    width:20,height:20,borderRadius:6,
                    border:'1.5px solid var(--line)',
                    background:'#fff',
                    display:'grid', placeItems:'center', flexShrink:0,
                  }}/>
                  <span style={{flex:1, fontSize:13.5, color:'var(--ink-2)'}}>{item}</span>
                  <button className="btn btn-ghost btn-sm" style={{height:26, padding:'0 8px', fontSize:11.5}} onClick={(e)=>e.preventDefault()}>Foto</button>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Observações */}
      <div className="card">
        <div className="card-head"><h3>Observações gerais</h3></div>
        <textarea className="input" rows={3} style={{height:'auto',padding:'12px 14px',resize:'vertical'}}
                  placeholder="Descreva qualquer detalhe relevante — riscos leves, pendências, observações do cliente…"/>
      </div>
    </div>
  );
}

// ──────────────── INADIMPLÊNCIA (layout vazio) ────────────────
function InadimplenciaPage() {
  const kpis = [
    { label: 'Valor em aberto',   sub: 'sem casos', icon: IconAlert, color: 'danger', tag: 'Total' },
    { label: 'Atraso > 15 dias',  sub: 'sem casos', icon: IconClock, color: 'warning', tag: 'Crítico' },
    { label: 'Corporativos',      sub: 'empresas / órgãos', icon: IconUsers, color: 'info', tag: 'B2B' },
    { label: 'Veículos afetados', sub: '% da frota',  icon: IconCar,   color: 'orange', tag: 'Frota' },
  ];

  return (
    <div className="page fade-in">
      <div className="page-head">
        <div>
          <h1>Inadimplência</h1>
          <p className="sub">Casos em aberto e ações de cobrança.</p>
        </div>
        <div className="actions">
          <button className="btn btn-ghost"><IconFilter size={16}/>Filtros</button>
          <button className="btn btn-ghost"><IconDownload size={16}/>Relatório</button>
          <button className="btn btn-primary"><IconMail size={16}/>Notificar selecionados</button>
        </div>
      </div>

      <div className="kpi-grid">
        {kpis.map((k) => {
          const I = k.icon;
          return (
            <div className="kpi" key={k.label}>
              <div className="kpi-top">
                <div className={`kpi-icon ${k.color}`}><I size={18}/></div>
                <span className="badge">{k.tag}</span>
              </div>
              <div>
                <div className="kpi-label">{k.label}</div>
                <div className="kpi-value" style={{color:'var(--ink-4)'}}>—</div>
                <div className="kpi-trend" style={{fontSize:11.5, marginTop:6, color:'var(--ink-4)'}}>{k.sub}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="card" style={{padding:0, overflow:'hidden'}}>
        <div style={{padding:'16px 22px', borderBottom:'1px solid var(--line)', display:'flex', justifyContent:'space-between', alignItems:'center', gap:12, flexWrap:'wrap'}}>
          <div className="seg">
            <button data-active="true">Todos</button>
            <button>Notificados</button>
            <button>Em acordo</button>
            <button>Protesto</button>
          </div>
          <div style={{flex:1, minWidth:200, position:'relative', maxWidth:320}}>
            <input className="input" placeholder="Buscar cliente ou CNPJ…" style={{paddingLeft:40, height:38}}/>
            <IconSearch size={16} style={{position:'absolute',left:14,top:11,color:'var(--ink-3)'}}/>
          </div>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th style={{width:34}}><input type="checkbox"/></th>
              <th>Cliente</th><th>Contrato</th><th>Parcela</th>
              <th style={{textAlign:'center'}}>Atraso</th>
              <th>Responsável</th><th>Status</th>
              <th style={{textAlign:'right'}}>Valor</th>
              <th style={{width:120}}></th>
            </tr>
          </thead>
        </table>
        <EmptyState
          icon={IconAlert}
          title="Nenhum caso de inadimplência"
          desc="Quando houver pagamentos em atraso, eles aparecerão aqui para cobrança."
        />
      </div>
    </div>
  );
}

// ──────────────── GENERIC EMPTY (pages not fully built) ────────────────
function EmptyPage({ title, desc, icon: I = IconFileText }) {
  return (
    <div className="page fade-in">
      <div className="page-head">
        <div><h1>{title}</h1><p className="sub">{desc}</p></div>
      </div>
      <div className="card" style={{padding:0}}>
        <EmptyState
          icon={I}
          title="Em construção"
          desc="Esta tela vai ser integrada ao fluxo existente do projeto. O layout e tokens já estão prontos para reutilização."
          cta={<button className="btn btn-ghost"><IconPlus size={16}/>Começar agora</button>}
        />
      </div>
    </div>
  );
}

Object.assign(window, { DashboardPage, ContratosPage, VistoriaPage, InadimplenciaPage, EmptyPage });
