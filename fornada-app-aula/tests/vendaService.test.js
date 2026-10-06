import {
  calcularTotalVenda,
  precoVigente,
  validarItensVenda,
  validarPagamento,
} from '../services/vendaService';

const produto = {
  id: 1,
  nome: 'Pão francês',
  preco: 1,
  estoque: 10,
  perecivel: true,
};

const naoPerecivel = {
  id: 2,
  nome: 'Brigadeiro',
  preco: 3,
  estoque: 10,
  perecivel: false,
};

const hora = (valor) => new Date(2026, 9, 6, valor, 0);

describe('Venda de balcão', () => {
  test('não aplica Xepa antes das 18h', () => {
    expect(precoVigente(produto, hora(17))).toEqual({
      preco: 1,
      emXepa: false,
    });
  });

  test('aplica 30% de desconto às 18h', () => {
    expect(precoVigente(produto, hora(18))).toEqual({
      preco: 0.7,
      emXepa: true,
    });
  });

  test('não aplica Xepa em produto não perecível', () => {
    expect(precoVigente(naoPerecivel, hora(19))).toEqual({
      preco: 3,
      emXepa: false,
    });
  });

  test('não aplica Xepa sem estoque', () => {
    expect(precoVigente({ ...produto, estoque: 0 }, hora(19)).emXepa).toBe(false);
  });

  test('calcula venda válida', () => {
    expect(
      calcularTotalVenda([{ produto, quantidade: 2 }], hora(14))
    ).toBe(2);
  });

  test('calcula venda com Xepa', () => {
    expect(
      calcularTotalVenda([{ produto, quantidade: 5 }], hora(18))
    ).toBe(3.5);
  });

  test('permite vender exatamente o estoque', () => {
    expect(
      calcularTotalVenda([{ produto, quantidade: 10 }], hora(14))
    ).toBe(10);
  });

  test('rejeita carrinho vazio', () => {
    expect(() => validarItensVenda([])).toThrow(
      'Adicione pelo menos um produto.'
    );
  });

  test('rejeita quantidade zero', () => {
    expect(() =>
      validarItensVenda([{ produto, quantidade: 0 }])
    ).toThrow('Quantidade inválida');
  });

  test('rejeita quantidade negativa', () => {
    expect(() =>
      validarItensVenda([{ produto, quantidade: -1 }])
    ).toThrow('Quantidade inválida');
  });

  test('rejeita quantidade decimal', () => {
    expect(() =>
      validarItensVenda([{ produto, quantidade: 1.5 }])
    ).toThrow('Quantidade inválida');
  });

  test('rejeita estoque insuficiente', () => {
    expect(() =>
      validarItensVenda([{ produto, quantidade: 11 }])
    ).toThrow('Estoque insuficiente');
  });

  test('calcula troco', () => {
    expect(validarPagamento(17.5, 'DINHEIRO', 20)).toEqual({
      valorRecebido: 20,
      troco: 2.5,
    });
  });

  test('aceita pagamento exato', () => {
    expect(validarPagamento(17.5, 'DINHEIRO', 17.5).troco).toBe(0);
  });

  test('rejeita dinheiro insuficiente', () => {
    expect(() => validarPagamento(17.5, 'DINHEIRO', 15)).toThrow(
      'Valor recebido insuficiente.'
    );
  });

  test('cartão recebe o valor total', () => {
    expect(validarPagamento(25, 'CARTAO')).toEqual({
      valorRecebido: 25,
      troco: 0,
    });
  });

  test('PIX recebe o valor total', () => {
    expect(validarPagamento(25, 'PIX')).toEqual({
      valorRecebido: 25,
      troco: 0,
    });
  });

  test('rejeita total negativo', () => {
    expect(() => validarPagamento(-1, 'PIX')).toThrow(
      'Total não pode ser negativo.'
    );
  });
});
