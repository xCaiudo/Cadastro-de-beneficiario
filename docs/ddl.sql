-- =============================================================
-- DDL - Cadastro de Beneficiário
-- Banco: PostgreSQL
-- Gerado em: 2026-03-31
-- =============================================================

-- =============================================================
-- RESET (permite re-execução limpa)
-- =============================================================
DROP TABLE IF EXISTS modalidade_convenio  CASCADE;
DROP TABLE IF EXISTS modalidade           CASCADE;
DROP TABLE IF EXISTS pagador_convenio     CASCADE;
DROP TABLE IF EXISTS convenio             CASCADE;
DROP TABLE IF EXISTS beneficiario         CASCADE;
DROP TABLE IF EXISTS conta_corrente       CASCADE;
DROP TABLE IF EXISTS cliente              CASCADE;
DROP TABLE IF EXISTS agencia              CASCADE;
DROP TABLE IF EXISTS banco                CASCADE;

DROP TYPE IF EXISTS tipo_negativacao_enum CASCADE;
DROP TYPE IF EXISTS tipo_multa_enum       CASCADE;
DROP TYPE IF EXISTS tipo_carteira_enum    CASCADE;
DROP TYPE IF EXISTS status_beneficiario_enum CASCADE;
DROP TYPE IF EXISTS status_convenio_enum  CASCADE;
DROP TYPE IF EXISTS status_conta_enum     CASCADE;
DROP TYPE IF EXISTS tipo_conta_enum       CASCADE;
DROP TYPE IF EXISTS status_cliente_enum   CASCADE;
DROP TYPE IF EXISTS tipo_pessoa_enum      CASCADE;

-- =============================================================
-- EXTENSÃO
-- =============================================================
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================
-- BANCO
-- =============================================================
CREATE TABLE banco (
    id            UUID          NOT NULL DEFAULT gen_random_uuid(),
    nome          VARCHAR(255)  NOT NULL,
    ispb          VARCHAR(8)    NOT NULL,
    codigo        VARCHAR(10)   NOT NULL,
    logradouro    VARCHAR(255)  NOT NULL,
    numero        VARCHAR(20)   NOT NULL,
    complemento   VARCHAR(100),
    bairro        VARCHAR(100)  NOT NULL,
    cidade        VARCHAR(100)  NOT NULL,
    uf            CHAR(2)       NOT NULL,
    cep           VARCHAR(8)    NOT NULL,
    criado_em     TIMESTAMP     NOT NULL DEFAULT NOW(),
    atualizado_em TIMESTAMP     NOT NULL DEFAULT NOW(),

    CONSTRAINT pk_banco         PRIMARY KEY (id),
    CONSTRAINT uq_banco_ispb    UNIQUE (ispb),
    CONSTRAINT uq_banco_codigo  UNIQUE (codigo)
);

-- =============================================================
-- AGENCIA
-- =============================================================
CREATE TABLE agencia (
    id                UUID         NOT NULL DEFAULT gen_random_uuid(),
    banco_id          UUID         NOT NULL,
    codigo            VARCHAR(10)  NOT NULL,
    digito            VARCHAR(2)   NOT NULL,
    nome              VARCHAR(255) NOT NULL,
    logradouro        VARCHAR(255) NOT NULL,
    numero            VARCHAR(20)  NOT NULL,
    complemento       VARCHAR(100),
    bairro            VARCHAR(100) NOT NULL,
    cidade            VARCHAR(100) NOT NULL,
    uf                CHAR(2)      NOT NULL,
    cep               VARCHAR(8)   NOT NULL,
    faixa_cep_inicial VARCHAR(8)   NOT NULL,
    faixa_cep_final   VARCHAR(8)   NOT NULL,
    criado_em         TIMESTAMP    NOT NULL DEFAULT NOW(),
    atualizado_em     TIMESTAMP    NOT NULL DEFAULT NOW(),

    CONSTRAINT pk_agencia                       PRIMARY KEY (id),
    CONSTRAINT fk_agencia_banco                 FOREIGN KEY (banco_id) REFERENCES banco(id),
    CONSTRAINT uq_agencia_banco_codigo          UNIQUE (banco_id, codigo)
);

-- =============================================================
-- CLIENTE
-- =============================================================
CREATE TYPE tipo_pessoa_enum AS ENUM ('PF', 'PJ');
CREATE TYPE status_cliente_enum AS ENUM ('ATIVO', 'INATIVO');

CREATE TABLE cliente (
    id            UUID                NOT NULL DEFAULT gen_random_uuid(),
    nome          VARCHAR(255)        NOT NULL,
    cpf_cnpj      VARCHAR(14)         NOT NULL,
    tipo_pessoa   tipo_pessoa_enum    NOT NULL,
    logradouro    VARCHAR(255)        NOT NULL,
    numero        VARCHAR(20)         NOT NULL,
    complemento   VARCHAR(100),
    bairro        VARCHAR(100)        NOT NULL,
    cidade        VARCHAR(100)        NOT NULL,
    uf            CHAR(2)             NOT NULL,
    cep           VARCHAR(8)          NOT NULL,
    email         VARCHAR(255),
    telefone      VARCHAR(20),
    status        status_cliente_enum NOT NULL DEFAULT 'ATIVO',
    criado_em     TIMESTAMP           NOT NULL DEFAULT NOW(),
    atualizado_em TIMESTAMP           NOT NULL DEFAULT NOW(),

    CONSTRAINT pk_cliente           PRIMARY KEY (id),
    CONSTRAINT uq_cliente_cpf_cnpj  UNIQUE (cpf_cnpj)
);

-- =============================================================
-- CONTA CORRENTE
-- =============================================================
CREATE TYPE tipo_conta_enum AS ENUM ('CC', 'POUPANCA');
CREATE TYPE status_conta_enum AS ENUM ('ATIVA', 'INATIVA', 'BLOQUEADA');

CREATE TABLE conta_corrente (
    id            UUID               NOT NULL DEFAULT gen_random_uuid(),
    cliente_id    UUID               NOT NULL,
    banco_id      UUID               NOT NULL,
    agencia_id    UUID               NOT NULL,
    numero        VARCHAR(20)        NOT NULL,
    digito        VARCHAR(2)         NOT NULL,
    tipo          tipo_conta_enum    NOT NULL DEFAULT 'CC',
    status        status_conta_enum  NOT NULL DEFAULT 'ATIVA',
    criado_em     TIMESTAMP          NOT NULL DEFAULT NOW(),
    atualizado_em TIMESTAMP          NOT NULL DEFAULT NOW(),

    CONSTRAINT pk_conta_corrente                    PRIMARY KEY (id),
    CONSTRAINT fk_conta_corrente_cliente            FOREIGN KEY (cliente_id)  REFERENCES cliente(id),
    CONSTRAINT fk_conta_corrente_banco              FOREIGN KEY (banco_id)    REFERENCES banco(id),
    CONSTRAINT fk_conta_corrente_agencia            FOREIGN KEY (agencia_id)  REFERENCES agencia(id),
    CONSTRAINT uq_conta_corrente_banco_agencia_num  UNIQUE (banco_id, agencia_id, numero, digito)
);

-- =============================================================
-- BENEFICIARIO
-- =============================================================
CREATE TYPE status_beneficiario_enum AS ENUM ('ATIVO', 'INATIVO');

CREATE TABLE beneficiario (
    id            UUID                       NOT NULL DEFAULT gen_random_uuid(),
    cliente_id    UUID                       NOT NULL,
    correntista   CHAR(1)                    NOT NULL DEFAULT 'N',
    data_inicio   DATE                       NOT NULL,
    status        status_beneficiario_enum   NOT NULL DEFAULT 'ATIVO',
    criado_em     TIMESTAMP                  NOT NULL DEFAULT NOW(),
    atualizado_em TIMESTAMP                  NOT NULL DEFAULT NOW(),

    CONSTRAINT pk_beneficiario              PRIMARY KEY (id),
    CONSTRAINT fk_beneficiario_cliente      FOREIGN KEY (cliente_id) REFERENCES cliente(id),
    CONSTRAINT uq_beneficiario_cliente      UNIQUE (cliente_id),
    CONSTRAINT ck_beneficiario_correntista  CHECK (correntista IN ('S', 'N'))
);

-- =============================================================
-- CONVENIO
-- =============================================================
CREATE TYPE status_convenio_enum AS ENUM ('ATIVO', 'INATIVO');

CREATE TABLE convenio (
    id                UUID                  NOT NULL DEFAULT gen_random_uuid(),
    beneficiario_id   UUID                  NOT NULL,
    agencia_id        UUID                  NOT NULL,
    conta_corrente_id UUID                  NOT NULL,
    nome              VARCHAR(255)          NOT NULL,
    codigo            VARCHAR(50)           NOT NULL,
    descricao         VARCHAR(500),
    data_inicio       DATE                  NOT NULL,
    data_fim          DATE,
    status            status_convenio_enum  NOT NULL DEFAULT 'ATIVO',
    criado_em         TIMESTAMP             NOT NULL DEFAULT NOW(),
    atualizado_em     TIMESTAMP             NOT NULL DEFAULT NOW(),

    CONSTRAINT pk_convenio                  PRIMARY KEY (id),
    CONSTRAINT fk_convenio_beneficiario     FOREIGN KEY (beneficiario_id)   REFERENCES beneficiario(id),
    CONSTRAINT fk_convenio_agencia          FOREIGN KEY (agencia_id)        REFERENCES agencia(id),
    CONSTRAINT fk_convenio_conta_corrente   FOREIGN KEY (conta_corrente_id) REFERENCES conta_corrente(id),
    CONSTRAINT uq_convenio_codigo           UNIQUE (codigo)
);

-- =============================================================
-- PAGADOR CONVENIO
-- =============================================================
CREATE TABLE pagador_convenio (
    id            UUID              NOT NULL DEFAULT gen_random_uuid(),
    convenio_id   UUID              NOT NULL,
    nome          VARCHAR(255)      NOT NULL,
    tipo_pessoa   tipo_pessoa_enum  NOT NULL,
    cpf_cnpj      VARCHAR(14)       NOT NULL,
    email         VARCHAR(255),
    logradouro    VARCHAR(255)      NOT NULL,
    numero        VARCHAR(20)       NOT NULL,
    complemento   VARCHAR(100),
    bairro        VARCHAR(100)      NOT NULL,
    cidade        VARCHAR(100)      NOT NULL,
    uf            CHAR(2)           NOT NULL,
    cep           VARCHAR(8)        NOT NULL,
    criado_em     TIMESTAMP         NOT NULL DEFAULT NOW(),
    atualizado_em TIMESTAMP         NOT NULL DEFAULT NOW(),

    CONSTRAINT pk_pagador_convenio          PRIMARY KEY (id),
    CONSTRAINT fk_pagador_convenio_convenio FOREIGN KEY (convenio_id) REFERENCES convenio(id)
);

-- =============================================================
-- MODALIDADE
-- =============================================================
CREATE TYPE tipo_carteira_enum AS ENUM ('CS', 'CV', 'D', 'CC');

CREATE TABLE modalidade (
    id            UUID                NOT NULL DEFAULT gen_random_uuid(),
    codigo        VARCHAR(20)         NOT NULL,
    codigo_banco  VARCHAR(10)         NOT NULL,
    tipo_carteira tipo_carteira_enum  NOT NULL,
    cobra_iof     CHAR(1)             NOT NULL DEFAULT 'N',
    nome          VARCHAR(255)        NOT NULL,
    criado_em     TIMESTAMP           NOT NULL DEFAULT NOW(),
    atualizado_em TIMESTAMP           NOT NULL DEFAULT NOW(),

    CONSTRAINT pk_modalidade            PRIMARY KEY (id),
    CONSTRAINT uq_modalidade_codigo     UNIQUE (codigo),
    CONSTRAINT ck_modalidade_cobra_iof  CHECK (cobra_iof IN ('S', 'N'))
);

-- =============================================================
-- MODALIDADE CONVENIO
-- =============================================================
CREATE TYPE tipo_multa_enum AS ENUM ('ISENTO', 'VALOR_FIXO', 'PERCENTUAL');
CREATE TYPE tipo_negativacao_enum AS ENUM ('NEGATIVAR', 'PROTESTAR', 'NAO_NEGATIVAR_NAO_PROTESTAR');

CREATE TABLE modalidade_convenio (
    id               UUID                   NOT NULL DEFAULT gen_random_uuid(),
    convenio_id      UUID                   NOT NULL,
    modalidade_id    UUID                   NOT NULL,
    valor_multa      NUMERIC(15, 2),
    tipo_multa       tipo_multa_enum        NOT NULL DEFAULT 'ISENTO',
    valor_mora       NUMERIC(15, 2),
    valor_float      NUMERIC(15, 2),
    tipo_negativacao tipo_negativacao_enum  NOT NULL DEFAULT 'NAO_NEGATIVAR_NAO_PROTESTAR',
    mensagem1        VARCHAR(500),
    mensagem2        VARCHAR(500),
    mensagem3        VARCHAR(500),
    criado_em        TIMESTAMP              NOT NULL DEFAULT NOW(),
    atualizado_em    TIMESTAMP              NOT NULL DEFAULT NOW(),

    CONSTRAINT pk_modalidade_convenio               PRIMARY KEY (id),
    CONSTRAINT fk_modalidade_convenio_convenio      FOREIGN KEY (convenio_id)   REFERENCES convenio(id),
    CONSTRAINT fk_modalidade_convenio_modalidade    FOREIGN KEY (modalidade_id) REFERENCES modalidade(id)
);

-- =============================================================
-- INDEXES
-- =============================================================
-- Financeiro
CREATE INDEX idx_agencia_banco_id        ON agencia(banco_id);
CREATE INDEX idx_conta_corrente_cliente  ON conta_corrente(cliente_id);
CREATE INDEX idx_conta_corrente_banco    ON conta_corrente(banco_id);
CREATE INDEX idx_conta_corrente_agencia  ON conta_corrente(agencia_id);
CREATE INDEX idx_cliente_cpf_cnpj        ON cliente(cpf_cnpj);

-- Beneficiário
CREATE INDEX idx_beneficiario_cliente    ON beneficiario(cliente_id);
CREATE INDEX idx_convenio_beneficiario   ON convenio(beneficiario_id);
CREATE INDEX idx_convenio_agencia        ON convenio(agencia_id);
CREATE INDEX idx_convenio_conta          ON convenio(conta_corrente_id);
CREATE INDEX idx_pagador_convenio        ON pagador_convenio(convenio_id);
CREATE INDEX idx_modalidade_convenio_conv ON modalidade_convenio(convenio_id);
CREATE INDEX idx_modalidade_convenio_mod  ON modalidade_convenio(modalidade_id);
