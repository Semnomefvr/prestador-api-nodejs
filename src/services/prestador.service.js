const AppError = require('../errors/AppError');
const cpfUtil = require('../utils/cpf');

// Camada de regras de negocio
class PrestadorService {
  constructor(repository) {
    this.repository = repository;
  }

  _validarNome(nome) {
    if (typeof nome !== 'string' || nome.trim().length < 3) {
      throw new AppError('nome_prestador e obrigatorio (minimo 3 caracteres)', 400);
    }
    return nome.trim();
  }

  _validarCpf(cpf) {
    if (!cpfUtil.validar(cpf)) {
      throw new AppError('cpf_prestador invalido', 400);
    }
    return cpfUtil.normalizar(cpf);
  }

  _validarCodigo(codigo) {
    const n = Number(codigo);
    if (!Number.isInteger(n) || n <= 0) {
      throw new AppError('codigo_prestador invalido', 400);
    }
    return n;
  }

  async _obterOuFalhar(codigo) {
    const prestador = await this.repository.findById(codigo);
    if (!prestador || !prestador.ativo) {
      throw new AppError('Prestador nao encontrado', 404);
    }
    return prestador;
  }

  async criar({ nome_prestador, cpf_prestador } = {}) {
    const nome = this._validarNome(nome_prestador);
    const cpf = this._validarCpf(cpf_prestador);

    if (await this.repository.findByCpf(cpf)) {
      throw new AppError('Ja existe prestador com este CPF', 409);
    }
    return this.repository.create({ nome_prestador: nome, cpf_prestador: cpf });
  }

  async listar({ incluirInativos = false } = {}) {
    return this.repository.findAll({ incluirInativos });
  }

  async buscarPorCodigo(codigo) {
    return this._obterOuFalhar(this._validarCodigo(codigo));
  }

  async buscarPorCpf(cpfInformado) {
    const cpf = this._validarCpf(cpfInformado);
    const prestador = await this.repository.findByCpf(cpf);
    if (!prestador) throw new AppError('Prestador nao encontrado para o CPF informado', 404);
    return prestador;
  }

  async atualizar(codigoInformado, { nome_prestador, cpf_prestador } = {}) {
    const codigo = this._validarCodigo(codigoInformado);
    await this._obterOuFalhar(codigo);

    const dados = {};
    if (nome_prestador === undefined && cpf_prestador === undefined) {
      throw new AppError('Informe nome_prestador e/ou cpf_prestador', 400);
    }
    if (nome_prestador !== undefined) dados.nome_prestador = this._validarNome(nome_prestador);
    if (cpf_prestador !== undefined) {
      const cpf = this._validarCpf(cpf_prestador);
      const existente = await this.repository.findByCpf(cpf);
      if (existente && existente.codigo_prestador !== codigo) {
        throw new AppError('Ja existe prestador com este CPF', 409);
      }
      dados.cpf_prestador = cpf;
    }
    return this.repository.update(codigo, dados);
  }

  // Regra de negocio: exclusao logica (padrao) ou definitiva
  async excluir(codigoInformado, tipo = 'logica') {
    const codigo = this._validarCodigo(codigoInformado);
    const modo = String(tipo).toLowerCase();

    if (!['logica', 'definitiva'].includes(modo)) {
      throw new AppError("tipo de exclusao invalido. Use 'logica' ou 'definitiva'", 400);
    }

    if (modo === 'definitiva') {
      // permite remover definitivamente inclusive registros ja excluidos logicamente
      const existe = await this.repository.findById(codigo);
      if (!existe) throw new AppError('Prestador nao encontrado', 404);
      await this.repository.hardDelete(codigo);
      return { mensagem: 'Prestador excluido definitivamente', tipo: modo };
    }

    await this._obterOuFalhar(codigo);
    await this.repository.softDelete(codigo);
    return { mensagem: 'Prestador excluido logicamente', tipo: modo };
  }
}

module.exports = PrestadorService;
