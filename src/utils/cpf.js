function normalizar(cpf) {
  return String(cpf ?? '').replace(/\D/g, '');
}

function validar(cpf) {
  const c = normalizar(cpf);
  if (c.length !== 11 || /^(\d)\1{10}$/.test(c)) return false;

  const digito = (tamanho) => {
    let soma = 0;
    for (let i = 0; i < tamanho; i++) {
      soma += Number(c[i]) * (tamanho + 1 - i);
    }
    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
  };

  return digito(9) === Number(c[9]) && digito(10) === Number(c[10]);
}

module.exports = { normalizar, validar };
