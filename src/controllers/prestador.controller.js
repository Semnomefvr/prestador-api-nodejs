const asyncHandler = require('../utils/asyncHandler');

// Camada HTTP: traduz requisicao/resposta e delega ao service
class PrestadorController {
  constructor(service) {
    this.service = service;

    this.criar = asyncHandler(async (req, res) => {
      const prestador = await this.service.criar(req.body);
      res.status(201).json(prestador);
    });

    this.listar = asyncHandler(async (req, res) => {
      const incluirInativos = req.query.incluirInativos === 'true';
      res.json(await this.service.listar({ incluirInativos }));
    });

    this.buscarPorCodigo = asyncHandler(async (req, res) => {
      res.json(await this.service.buscarPorCodigo(req.params.codigo));
    });

    this.buscarPorCpf = asyncHandler(async (req, res) => {
      res.json(await this.service.buscarPorCpf(req.params.cpf));
    });

    this.atualizar = asyncHandler(async (req, res) => {
      res.json(await this.service.atualizar(req.params.codigo, req.body));
    });

    this.excluir = asyncHandler(async (req, res) => {
      res.json(await this.service.excluir(req.params.codigo, req.query.tipo));
    });
  }
}

module.exports = PrestadorController;
