// Camada de persistencia (em memoria). Todos os metodos sao assincronos
// para que possam ser trocados por um banco de dados sem afetar o service.
class PrestadorRepository {
  constructor() {
    this.items = new Map();
    this.sequence = 1;
  }

  async create({ nome_prestador, cpf_prestador }) {
    const codigo_prestador = this.sequence++;
    const prestador = {
      codigo_prestador,
      nome_prestador,
      cpf_prestador,
      ativo: true,
      excluido_em: null,
    };
    this.items.set(codigo_prestador, prestador);
    return { ...prestador };
  }

  async findAll({ incluirInativos = false } = {}) {
    return [...this.items.values()]
      .filter((p) => incluirInativos || p.ativo)
      .map((p) => ({ ...p }));
  }

  async findById(codigo) {
    const p = this.items.get(codigo);
    return p ? { ...p } : null;
  }

  async findByCpf(cpf, { incluirInativos = false } = {}) {
    const p = [...this.items.values()].find(
      (x) => x.cpf_prestador === cpf && (incluirInativos || x.ativo)
    );
    return p ? { ...p } : null;
  }

  async update(codigo, dados) {
    const atual = this.items.get(codigo);
    if (!atual) return null;
    const atualizado = { ...atual, ...dados };
    this.items.set(codigo, atualizado);
    return { ...atualizado };
  }

  async softDelete(codigo) {
    return this.update(codigo, { ativo: false, excluido_em: new Date().toISOString() });
  }

  async hardDelete(codigo) {
    return this.items.delete(codigo);
  }
}

module.exports = PrestadorRepository;
