// sidebar.jsx — Accordion sidebar with 4 groups
// Groups: Principal · Contratos · Locação & Vistoria · Financeiro

const NAV_GROUPS = [
{
  id: 'principal',
  label: 'Principal',
  items: [
  { id: 'home', label: 'Página Inicial', icon: IconHome, page: 'dashboard' }]

},
{
  id: 'contratos',
  label: 'Contratos',
  items: [
  { id: 'templates', label: 'Templates', icon: IconTemplates, page: 'templates' },
  { id: 'criar', label: 'Criar Contratos', icon: IconFilePlus, page: 'criar' },
  { id: 'hist', label: 'Hist. de Contratos', icon: IconActivity, page: 'contratos' }]

},
{
  id: 'locacao',
  label: 'Locação & Vistoria',
  items: [
  { id: 'loc', label: 'Contrato Locação', icon: IconFile, page: 'loc' },
  { id: 'histloc', label: 'Hist. Ct. Locação', icon: IconFileText, page: 'histloc' },
  { id: 'vistoria', label: 'Vistoria', icon: IconCheck, page: 'vistoria' },
  { id: 'histvist', label: 'Hist. Vistorias', icon: IconArchive, page: 'histvist' }]

},
{
  id: 'financeiro',
  label: 'Financeiro',
  items: [
  { id: 'inadimp', label: 'Inadimplência', icon: IconAlert, page: 'inadimplencia' }]

}];


function Sidebar({ active, onNavigate, variant, collapsed, onToggleCollapse, onLogout }) {
  const [openGroups, setOpenGroups] = React.useState({
    principal: true, contratos: true, locacao: true, financeiro: true
  });
  const toggleGroup = (id) => setOpenGroups((g) => ({ ...g, [id]: !g[id] }));

  return (
    <aside className="sidebar" data-variant={variant}>
      <div className="sb-brand">
        <img src="assets/ativuz-logo-white.png" alt="Ativuz Veículos" className="sb-brand-logo" />
      </div>

      <nav className="sb-nav">
        {NAV_GROUPS.map((group) =>
        <div key={group.id} className="sb-group" data-open={openGroups[group.id]}>
            <button className="sb-group-head" onClick={() => toggleGroup(group.id)}>
              <span>{group.label}</span>
              <span className="chev"><IconChev size={12} /></span>
            </button>
            <div className="sb-group-body">
              <div>
                {group.items.map((item) => {
                const I = item.icon;
                return (
                  <button
                    key={item.id}
                    className="sb-item"
                    data-active={active === item.page}
                    onClick={() => onNavigate(item.page)}
                    title={collapsed ? item.label : undefined}>
                    
                      <span className="sb-item-icon"><I size={18} /></span>
                      <span className="sb-item-label">{item.label}</span>
                      {item.badge && <span className="sb-item-badge">{item.badge}</span>}
                    </button>);

              })}
              </div>
            </div>
          </div>
        )}
      </nav>

      <div className="sb-user">
        <div className="avatar">—</div>
        <div className="info">
          <div className="name">Usuário</div>
          <div className="role">Perfil</div>
        </div>
        <button className="sb-collapse-btn" onClick={onLogout} aria-label="Sair" title="Sair">
          <IconLogOut size={14} />
        </button>
      </div>
    </aside>);

}

Object.assign(window, { Sidebar, NAV_GROUPS });