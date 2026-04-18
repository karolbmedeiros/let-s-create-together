-- Execute no SQL Editor do Supabase (https://supabase.com/dashboard/project/btcwgwrajgsqndnpjman/sql)

create table if not exists public.vistorias (
  id              uuid primary key default gen_random_uuid(),
  cliente         text,
  telefone        text,
  endereco        text,
  preenchido_por  text,
  veiculo         text,
  placa           text,
  cor             text,
  ano             text,
  chassi          text,
  numero_motor    text,
  data_hora       text,
  hodometro_entrega text,
  hodometro_retorno text,
  combustivel     text,
  obs_gerais      text,
  desc_sintomas   text,
  criado_em       timestamptz default now(),
  arquivo_path    text
);

-- RLS desativado (acesso via service role key)
alter table public.vistorias disable row level security;
