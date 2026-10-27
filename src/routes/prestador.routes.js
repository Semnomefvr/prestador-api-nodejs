const { Router } = require('express');
const PrestadorRepository = require('../repositories/prestador.repository');
const PrestadorService = require('../services/prestador.service');
const PrestadorController = require('../controllers/prestador.controller');

const repository = new PrestadorRepository();
const service = new PrestadorService(repository);
const controller = new PrestadorController(service);

const router = Router();

router.post('/', controller.criar);
router.get('/', controller.listar);
router.get('/cpf/:cpf', controller.buscarPorCpf); // antes de /:codigo
router.get('/:codigo', controller.buscarPorCodigo);
router.put('/:codigo', controller.atualizar);
router.delete('/:codigo', controller.excluir); // ?tipo=logica | definitiva

module.exports = router;
