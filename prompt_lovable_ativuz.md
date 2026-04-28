# Prompt para Lovable — Ativuz Veículos · Painel de Gestão

Cole este prompt no Lovable para recriar o design do dashboard.

---

## PROMPT PRINCIPAL

Crie um sistema de gestão para **Ativuz Veículos**, uma empresa de locação de veículos B2B. O sistema deve ser um painel web completo, moderno e profissional, conectado ao Supabase.

---

## DESIGN SYSTEM

### Paleta de Cores
- **Primária (azul-marinho):** `#15192A` — fundo da sidebar escura, textos principais
- **Primária variante:** `#1F243A` (hover), `#2A3050`
- **Laranja (brand):** `#FF4713` — botões primários, item ativo na sidebar, destaques
- **Laranja hover:** `#E63A08`
- **Laranja suave:** `#FFE7DE` — backgrounds de ícones
- **Cinza-azulado:** `#7B8499`

**Neutros:**
- Fundo da página: `#F7F8FA`
- Superfície (cards): `#FFFFFF`
- Superfície-2: `#FBFBFD`
- Borda: `#E7E9EF`
- Borda-2: `#EFF1F6`
- Texto principal: `#15192A`
- Texto secundário: `#3A4159`
- Texto terciário: `#6C7388`
- Texto sutil: `#9BA1B3`

**Status:**
- Sucesso: `#0FAA6E` / fundo `#E5F7EF`
- Aviso: `#F59E0B` / fundo `#FFF5E0`
- Perigo: `#E5484D` / fundo `#FEE8E9`
- Info: `#2E6BE6` / fundo `#E6EEFE`

### Tipografia
- **Fonte:** Satoshi (Google Fonts / Fontshare) — fallback: ui-sans-serif, system-ui
- Tamanho base: 14px
- Títulos de página: 26px, peso 700, letter-spacing -0.02em
- Títulos de card: 15px, peso 600
- Labels: 12.5px, peso 600
- Texto de navegação: 13.5px, peso 500
- KPI valores: 28px, peso 700

### Espaçamentos (densidade padrão: espaçosa)
- Gutter da página: 36px
- Padding de cards: 30px
- Altura das linhas de input: 52px
- Gap entre elementos: 22px
- Border-radius padrão: 12px

---

## LAYOUT ESTRUTURAL

### Shell Principal
- Grid de 2 colunas: `sidebar (264px) | conteúdo principal`
- Sidebar fixa (sticky), altura 100vh
- Sidebar pode ser recolhida (collapsed: 76px de largura, exibe só ícones)

### Sidebar
Três variantes de cor:
1. **Escura** (padrão): fundo `#15192A`, textos brancos
2. **Clara**: fundo branco, textos escuros
3. **Laranja**: fundo `#FF4713`, textos brancos

**Estrutura da sidebar:**
- Topo: logo Ativuz Veículos (altura 40px), botão de recolher à direita
- Navegação em accordion com 4 grupos (labels em uppercase, 11px, letra-spacing 0.08em):
  1. **PRINCIPAL** → Página Inicial (ícone: grid 2x2)
  2. **CONTRATOS** → Templates | Criar Contratos | Hist. de Contratos
  3. **LOCAÇÃO & VISTORIA** → Contrato Locação | Hist. Ct. Locação | Vistoria | Hist. Vistorias
  4. **FINANCEIRO** → Inadimplência
- Item ativo: fundo `#FF4713`, texto branco, sombra laranja `0 2px 6px -2px rgba(255,71,19,.4)`
- Item hover: fundo sutil `rgba(255,255,255,.06)` (dark) ou `#EFF1F6` (light)
- Rodapé: avatar circular com gradiente laranja + nome + cargo + botão logout

### Topbar (64px de altura)
- Fundo branco, borda inferior `#E7E9EF`, sticky no topo
- Breadcrumbs: `Grupo / Página Atual` (atual em negrito)
- Barra de busca centralizada (max 420px): placeholder "Buscar contratos, clientes, placas…" + atalho `⌘K`
- Botões de ação à direita: Ajuda | Notificações (com ponto laranja) | Configurações

---

## COMPONENTES PRINCIPAIS

### Botões
- **Primário:** fundo `#FF4713`, texto branco, sombra laranja, hover `#E63A08`
- **Escuro:** fundo `#15192A`, texto branco
- **Ghost:** fundo branco, borda `#E7E9EF`, texto cinza
- **Tamanho padrão:** altura 38px, padding 14px, border-radius 10px, font-weight 600
- **Pequeno:** altura 32px, padding 11px, border-radius 8px

### Cards
- Fundo branco, borda `#E7E9EF`, border-radius 12px, padding 30px
- Card-head: título 15px 600 + subtítulo cinza na mesma linha

### KPI Cards
Grid responsivo (min 220px por coluna). Cada card contém:
- Ícone 36x36 com fundo colorido (laranja, sucesso, aviso, perigo, info)
- Label pequeno cinza
- Valor grande (28px, 700)
- Tendência (seta + porcentagem)

### Badges
- Altura 22px, padding 0 8px, border-radius 6px, font-size 11.5px, peso 600
- Variantes: padrão (cinza) | success (verde) | warning (amarelo) | danger (vermelho) | info (azul)
- Com ponto colorido à esquerda

### Tabelas
- Header: fundo `#FBFBFD`, texto 11px uppercase cinza, sticky
- Linhas: hover muda fundo para `#FBFBFD`
- Última linha sem border-bottom
- Células numéricas: tabular-nums, peso 600

### Inputs
- Altura 44px, border-radius 10px, borda `#E7E9EF`
- Foco: borda `#FF4713` + sombra `0 0 0 3px rgba(255,71,19,.12)`
- Input-group: ícone SVG à esquerda (14px da borda)

### Controle Segmentado (Tabs)
- Fundo `#EFF1F6` com borda, padding 3px, border-radius 10px
- Botão ativo: fundo branco + sombra sutil
- Altura 30px, fonte 12.5px 600

### Avatares
- Circular, gradientes: laranja `135deg #FF4713→#FF7A4D`, azul, verde, roxo
- Tamanho no rodapé da sidebar: 34px

### Progress Bar
- Altura 6px, border-radius 3px, fundo `#EFF1F6`
- Preenchimento laranja `#FF4713`

### Empty State (estado vazio)
- Ícone 64x64 com fundo `#FBFBFD` e borda tracejada
- Título 15px + descrição cinza 13px + CTA opcional

---

## PÁGINAS

### 1. Login
- Tela centralizada, fundo `#F7F8FA` com gradiente radial sutil laranja no canto superior esquerdo
- Card branco (max-width 420px), border-radius 20px, sombra grande, padding 40px 36px 32px
- Logo Ativuz no topo do card (altura 42px, centralizada)
- Título "Acesse sua conta" + subtítulo "Página de Gestão e Controle."
- Campo Login (ícone de envelope) + Campo Senha (ícone de cadeado + toggle mostrar/ocultar)
- Botão "Entrar" largura 100% laranja
- Link "Solicitar acesso" abaixo em laranja
- Rodapé: "© 2026 Ativuz Veículos · Gestão de frotas B2B"

### 2. Dashboard (Página Inicial)
**Cabeçalho:** "Página Inicial" + subtítulo "Resumo operacional da frota." + botões Exportar (ghost) e Novo contrato (primary)

**KPI Grid (4 cards):**
- Contratos ativos (ícone documento, laranja)
- Vencendo em 30 dias (ícone relógio, amarelo)
- Inadimplentes (ícone alerta, vermelho)
- Receita do mês (ícone cifrão, verde)

**Atalhos Rápidos (card com grid horizontal, sem padding):**
- Criar contrato | Nova vistoria | Cadastrar veículo | Novo cliente
- Cada atalho: ícone 38x38 laranja-suave + título + descrição + seta à direita

**Layout 2 colunas abaixo:**
- Esquerda: "Alertas de inadimplência" com badge de contagem + empty state quando vazio
- Direita: "Contratos recentes" (últimos 7 dias) + filtros segmentados (Todos/Ativos/Pendentes)

### 3. Histórico de Contratos
**Cabeçalho:** título + botões Filtros (ghost) | Exportar (ghost) | Novo contrato (primary)

**Filtros:** controle segmentado (Todos/Ativos/Pendentes/Inadimplentes) + busca por cliente/código/CNPJ

**Tabela:** colunas Contrato | Cliente | Tipo | Frota | Início | Vencimento | Status | Valor/mês | Ações

Quando vazio: empty state com botão "Criar contrato"

### 4. Vistoria
**Cabeçalho:** "Nova Vistoria" + botões Cancelar (ghost) | Salvar rascunho (dark) | Finalizar vistoria (primary)

**Card de veículo:** placeholder de imagem 120x80 + campo "Selecione um veículo" + info (Placa, Renavam, KM, Cor) + botão selecionar

**Card de progresso:** label + contagem "X / 17 itens" + barra de progresso laranja

**Checklist em grid 2 colunas (4 categorias):**
- Exterior: Lataria sem avarias | Para-choques | Faróis e lanternas | Retrovisores | Pneus (incluindo estepe)
- Interior: Bancos e cintos | Painel e multimídia | Ar-condicionado | Tapetes e forração
- Mecânica: Óleo e fluidos | Sistema de freios | Suspensão | Nível de combustível
- Documentação: CRLV em dia | Manual do proprietário | Chave reserva | Triângulo e macaco

Cada item: checkbox quadrado (border-radius 6px) + label + botão "Foto" pequeno à direita

**Observações gerais:** textarea redimensionável

### 5. Inadimplência
**Cabeçalho:** "Inadimplência" + botões Filtros | Relatório | Notificar selecionados (primary com ícone envelope)

**KPI Grid (4 cards):**
- Valor em aberto (vermelho, tag "Total")
- Atraso > 15 dias (amarelo, tag "Crítico")
- Corporativos (azul, tag "B2B")
- Veículos afetados (laranja, tag "Frota")

**Tabela com filtros:** segmentado (Todos/Notificados/Em acordo/Protesto) + busca
Colunas: checkbox seleção | Cliente | Contrato | Parcela | Atraso | Responsável | Status | Valor | Ações

---

## BANCO DE DADOS (Supabase — tabelas já criadas)

```sql
-- vistorias
id (uuid), cliente, telefone, endereco, preenchido_por, veiculo, placa, cor, ano,
chassi, numero_motor, data_hora, hodometro_entrega, hodometro_retorno, combustivel,
obs_gerais, desc_sintomas, criado_em, arquivo_path, deletado, acessorios (jsonb)

-- contratos_locacao
id (uuid), locatario_nome, locatario_rg, locatario_cpf, locatario_endereco,
locatario_cep, locatario_telefone, avalista_nome, avalista_cpf, avalista_endereco,
avalista_telefone, veiculo_descricao, veiculo_marca, veiculo_modelo, veiculo_ano,
veiculo_motor, veiculo_chassi, veiculo_cor, veiculo_placa, contrato_inicio,
contrato_duracao, valor_semanal, data_dia, data_mes, data_ano, testemunha1_nome,
testemunha1_rg, testemunha1_cpf, testemunha2_nome, testemunha2_rg, testemunha2_cpf,
arquivo_path, criado_em, deletado

-- historico_docs
id (uuid), locatario_nome, template, arquivo, data_hora, deletado, criado_em

-- usuarios
id (uuid), nome (unique), senha_hash, ativo, criado_em
```

---

## FUNCIONALIDADES ESPERADAS

1. **Autenticação** via tabela `usuarios` (login + senha)
2. **Dashboard** com KPIs buscados do Supabase (contagem de contratos, inadimplentes, receita)
3. **Contratos de Locação**: listar, criar, visualizar e soft-delete (campo `deletado`)
4. **Vistoria**: preencher checklist, salvar na tabela `vistorias`
5. **Histórico**: filtrar por cliente, período, status
6. **Inadimplência**: contratos com pagamento em atraso
7. **Soft delete** em todas as tabelas (campo `deletado = true`)

---

## OBSERVAÇÕES FINAIS

- Usar Tailwind CSS ou styled-components seguindo os tokens acima
- Sidebar totalmente responsiva com modo recolhido
- Animações suaves: `fadeIn 0.2s ease` nas trocas de página
- Barra de scroll personalizada (cinza suave, thin)
- Focus visible com outline laranja `2px solid #FF4713`
- Toda numeração com `font-variant-numeric: tabular-nums`
- Ícones estilo Lucide (stroke 1.75, stroke-linecap round)
