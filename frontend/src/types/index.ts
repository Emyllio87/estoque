export interface Produto {
  id: number;
  codigo: string;
  nome: string;
  descricao?: string;
  unidade: string;
  quantidadeAtual: string;
  quantidadeMinima: string;
  precoCusto: string;
  precoVenda: string;
  ativo: boolean;
  estoqueBaixo?: boolean;
}

export interface Movimentacao {
  id: number;
  produtoId: number;
  produtoCodigo: string;
  produtoNome: string;
  tipo: 'ENTRADA' | 'SAIDA' | 'AJUSTE';
  quantidade: string;
  valorUnitario?: string;
  observacao?: string;
  usuario?: string;
  criadoEm: string;
}

export interface ProdutoFormData {
  codigo: string;
  nome: string;
  descricao?: string;
  unidade: string;
  quantidadeAtual: string;
  quantidadeMinima: string;
  precoCusto: string;
  precoVenda: string;
  ativo: boolean;
}

export interface MovimentacaoFormData {
  produtoId: number;
  tipo: 'ENTRADA' | 'SAIDA' | 'AJUSTE';
  quantidade: string;
  valorUnitario?: string;
  observacao?: string;
  usuario?: string;
}