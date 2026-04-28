// login.jsx — Minimalist login screen
// fundo branco, logo grande no topo, formulário simples + solicitar acesso

function Login({ onLogin }) {
  const [email, setEmail] = React.useState('');
  const [pass, setPass] = React.useState('');
  const [showPass, setShowPass] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [err, setErr] = React.useState(null);

  const submit = (e) => {
    e.preventDefault();
    setErr(null);
    if (!email || !pass) { setErr('Preencha login e senha para continuar.'); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); onLogin(); }, 650);
  };

  return (
    <div className="login-wrap">
      <form className="login-card fade-in" onSubmit={submit}>
        <img src="assets/ativuz-logo.png" alt="Ativuz Veículos" className="login-logo" />
        <h1 className="login-title">Acesse sua conta</h1>
        <p className="login-sub">Página de Gestão e Controle.</p>

        <div className="login-fields">
          <div className="field">
            <label htmlFor="email">Login</label>
            <div className="input-group">
              <IconMail size={18} />
              <input id="email" className="input" type="text" autoComplete="username"
                     placeholder="Digite seu login"
                     value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          </div>

          <div className="field">
            <label htmlFor="pass">Senha</label>
            <div className="input-group">
              <IconLock size={18} />
              <input id="pass" className="input" type={showPass ? 'text' : 'password'}
                     autoComplete="current-password" placeholder="••••••••••"
                     value={pass} onChange={(e) => setPass(e.target.value)} />
              <button type="button" className="suffix icon-btn" style={{width:32,height:32,border:0,background:'transparent'}}
                      onClick={() => setShowPass(s => !s)} aria-label="Mostrar senha">
                {showPass ? <IconEyeOff size={16} /> : <IconEye size={16} />}
              </button>
            </div>
          </div>

          {err && <div className="badge badge-danger" style={{height:'auto',padding:'8px 10px',alignSelf:'flex-start'}}>{err}</div>}

          <button type="submit" className="btn btn-primary login-btn" disabled={loading}>
            {loading ? 'Entrando…' : 'Entrar'}
            {!loading && <IconArrowRight size={16} />}
          </button>
        </div>

        <div className="login-foot">
          Ainda não tem acesso?{' '}
          <a href="#" className="link" onClick={(e) => { e.preventDefault(); alert('Entre em contato com o administrador para solicitar acesso.'); }}>
            Solicitar acesso
          </a>
        </div>
      </form>
      <div className="login-copy">© 2026 Ativuz Veículos · Gestão de frotas B2B</div>
    </div>
  );
}

Object.assign(window, { Login });
