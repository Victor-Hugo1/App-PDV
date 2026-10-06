export const XEPA_HORA = 18;
export const XEPA_DESCONTO = 0.30;

export function precoVigente(produto, agora, xepaHora = XEPA_HORA, desconto = XEPA_DESCONTO) {
  const emXepa =
    produto.perecivel &&
    produto.estoque > 0 &&
    agora.getHours() >= xepaHora;

  return {
    preco: emXepa ? arredondar(produto.preco * (1 - desconto)) : produto.preco,
    emXepa,
  };
}

export function validarItensVenda(itens) {
  if (itens.length === 0) {
    throw new Error('Adicione pelo menos um produto.');
  }

  itens.forEach((item) => {
    if (!Number.isInteger(item.quantidade) || item.quantidade <= 0) {
      throw new Error(`Quantidade inválida para ${item.produto.nome}.`);
    }

    if (item.quantidade > item.produto.estoque) {
      throw new Error(
        `Estoque insuficiente para ${item.produto.nome}. Disponível: ${item.produto.estoque}.`
      );
    }
  });
}

export function calcularTotalVenda(itens, agora) {
  validarItensVenda(itens);

  return arredondar(
    itens.reduce((total, item) => {
      const resultado = precoVigente(item.produto, agora);
      return total + resultado.preco * item.quantidade;
    }, 0)
  );
}

export function validarPagamento(total, formaPagamento, valorRecebido) {
  if (total < 0) {
    throw new Error('Total não pode ser negativo.');
  }

  if (formaPagamento === 'DINHEIRO') {
    if (valorRecebido === undefined || valorRecebido < total) {
      throw new Error('Valor recebido insuficiente.');
    }

    return {
      valorRecebido: arredondar(valorRecebido),
      troco: arredondar(valorRecebido - total),
    };
  }

  return {
    valorRecebido: arredondar(total),
    troco: 0,
  };
}

function arredondar(valor) {
  return Math.round((valor + Number.EPSILON) * 100) / 100;
}
