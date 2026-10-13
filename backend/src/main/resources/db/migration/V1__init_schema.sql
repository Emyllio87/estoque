CREATE TABLE IF NOT EXISTS produto (
    id BIGSERIAL PRIMARY KEY,
    codigo VARCHAR(50) NOT NULL UNIQUE,
    nome VARCHAR(200) NOT NULL,
    descricao TEXT,
    unidade VARCHAR(20) NOT NULL DEFAULT 'UN',
    quantidade_atual NUMERIC(12,3) NOT NULL DEFAULT 0,
    quantidade_minima NUMERIC(12,3) NOT NULL DEFAULT 0,
    preco_custo NUMERIC(12,2) NOT NULL DEFAULT 0,
    preco_venda NUMERIC(12,2) NOT NULL DEFAULT 0,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_produto_codigo ON produto(codigo);
CREATE INDEX IF NOT EXISTS idx_produto_nome ON produto(nome);
CREATE INDEX IF NOT EXISTS idx_produto_ativo ON produto(ativo);

CREATE TABLE IF NOT EXISTS movimentacao (
    id BIGSERIAL PRIMARY KEY,
    produto_id BIGINT NOT NULL REFERENCES produto(id) ON DELETE RESTRICT,
    tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('ENTRADA','SAIDA','AJUSTE')),
    quantidade NUMERIC(12,3) NOT NULL,
    valor_unitario NUMERIC(12,2),
    observacao TEXT,
    usuario VARCHAR(200),
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_movimentacao_produto ON movimentacao(produto_id);
CREATE INDEX IF NOT EXISTS idx_movimentacao_tipo ON movimentacao(tipo);
CREATE INDEX IF NOT EXISTS idx_movimentacao_criado_em ON movimentacao(criado_em);