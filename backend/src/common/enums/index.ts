export enum TipoPessoa {
  PessoaFisica = 'PF',
  PessoaJuridica = 'PJ',
}

export enum StatusCliente {
  Ativo = 'Ativo',
  Inativo = 'Inativo',
}

export enum TipoConta {
  ContaCorrente = 'CC',
  Poupanca = 'Poupanca',
}

export enum StatusConta {
  Ativa = 'Ativa',
  Inativa = 'Inativa',
  Bloqueada = 'Bloqueada',
}

export enum StatusBeneficiario {
  Ativo = 'Ativo',
  Inativo = 'Inativo',
}

export enum StatusConvenio {
  Ativo = 'Ativo',
  Inativo = 'Inativo',
}

export enum TipoCarteira {
  CobrancaSimples = 1,
  CobrancaVinculada = 2,
  Desconto = 3,
  CessaoCredito = 4,
}

export enum TipoMulta {
  Isento = 'Isento',
  ValorFixo = 'ValorFixo',
  Percentual = 'Percentual',
}

export enum TipoNegativacao {
  Negativar = 1,
  Protestar = 2,
  NaoNegativarNaoProtestar = 3,
}

export enum Correntista {
  Sim = 'S',
  Nao = 'N',
}

export enum CobraIof {
  Sim = 'S',
  Nao = 'N',
}
