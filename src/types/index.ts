export interface ContractFormData {
  // Locador
  locadorNome: string;
  locadorDoc: string;
  locadorEndereco: string;

  // Locatário
  locatarioNome: string;
  locatarioCpf: string;
  locatarioRg: string;
  locatarioEndereco: string;

  // Imóvel
  imovelEndereco: string;
  imovelDescricao: string;

  // Contrato
  valorAluguel: string;
  prazoMeses: string;
  dataInicio: string; // YYYY-MM-DD
  diaVencimento: string;
}

export interface GeneratedContract {
  id: string;
  data: ContractFormData;
  outputFileBase64: string;
  generatedAt: string;
}
