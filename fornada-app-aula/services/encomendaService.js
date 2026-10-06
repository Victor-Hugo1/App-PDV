export const SINAL_PERCENTUAL = 50;
export const HORAS_DEVOLUCAO_SINAL = 24;

export function validarEncomenda({
  clienteNome,
  horasAteRetirada,
  capacidadeUsada,
  capacidadeMaxima,
  itens,
}) {
  const erros = [];

  if (!clienteNome.trim()) {
    erros.push('Informe o nome do cliente.');
  }

  if (!Number.isFinite(horasAteRetirada) || horasAteRetirada <= 0) {
    erros.push('A retirada deve ser futura.');
  }

  if (itens.length === 0) {
    erros.push('A encomenda deve possuir pelo menos um item.');
  }

  let quantidadeTotal = 0;

  itens.forEach((item) => {
    if (!Number.isInteger(item.quantidade) || item.quantidade <= 0) {
      erros.push(`Quantidade inválida para ${item.produto.nome}.`);
      return;
    }

    quantidadeTotal += item.quantidade;

    if (horasAteRetirada < item.produto.antecedenciaHoras) {
      erros.push(
        `${item.produto.nome} exige ${item.produto.antecedenciaHoras}h de antecedência.`
      );
    }
  });

  if (capacidadeUsada + quantidadeTotal > capacidadeMaxima) {
    erros.push('CAPACIDADE_EXCEDIDA: capacidade diária insuficiente.');
  }

  return {
    valida: erros.length === 0,
    erros,
  };
}

export function calcularTotalEncomenda(itens) {
  if (itens.length === 0) {
    throw new Error('A encomenda precisa ter itens.');
  }

  return arredondar(
    itens.reduce((total, item) => total + item.produto.preco * item.quantidade, 0)
  );
}

export function calcularSinal(total, percentual = SINAL_PERCENTUAL) {
  if (total < 0 || percentual < 0 || percentual > 100) {
    throw new Error('Total e percentual devem ser válidos.');
  }

  return arredondar(total * (percentual / 100));
}

export function avaliarCancelamento(
  retirada,
  cancelamento,
  sinal,
  horasDevolucao = HORAS_DEVOLUCAO_SINAL
) {
  const horasAteRetirada =
    (retirada.getTime() - cancelamento.getTime()) / 3600000;

  if (horasAteRetirada < 0) {
    throw new Error('Já passou do horário de retirada.');
  }

  const sinalDevolvido = horasAteRetirada >= horasDevolucao;

  return {
    horasAteRetirada,
    sinalDevolvido,
    sinalRetido: !sinalDevolvido && sinal > 0,
  };
}

function arredondar(valor) {
  return Math.round((valor + Number.EPSILON) * 100) / 100;
}
