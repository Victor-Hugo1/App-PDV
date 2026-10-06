import {
  avaliarCancelamento,
  calcularSinal,
  calcularTotalEncomenda,
  validarEncomenda,
} from '../services/encomendaService';

const bolo = {
  id: 1,
  nome: 'Bolo de cenoura',
  preco: 60,
  antecedenciaHoras: 48,
};

const brigadeiro = {
  id: 2,
  nome: 'Brigadeiro',
  preco: 3,
  antecedenciaHoras: 24,
};

const base = {
  clienteNome: 'Ana',
  horasAteRetirada: 72,
  capacidadeUsada: 10,
  capacidadeMaxima: 40,
  itens: [{ produto: bolo, quantidade: 1 }],
};

describe('Encomendas', () => {
  test('aceita encomenda válida', () => {
    expect(validarEncomenda(base)).toEqual({
      valida: true,
      erros: [],
    });
  });

  test('aceita antecedência exatamente no mínimo', () => {
    expect(
      validarEncomenda({ ...base, horasAteRetirada: 48 }).valida
    ).toBe(true);
  });

  test('rejeita cliente vazio', () => {
    const resultado = validarEncomenda({
      ...base,
      clienteNome: '   ',
    });

    expect(resultado.erros).toContain('Informe o nome do cliente.');
  });

  test('rejeita retirada não futura', () => {
    expect(
      validarEncomenda({ ...base, horasAteRetirada: 0 }).erros
    ).toContain('A retirada deve ser futura.');
  });

  test('rejeita itens vazios', () => {
    expect(
      validarEncomenda({ ...base, itens: [] }).erros
    ).toContain('A encomenda deve possuir pelo menos um item.');
  });

  test('rejeita quantidade inválida', () => {
    expect(
      validarEncomenda({
        ...base,
        itens: [{ produto: bolo, quantidade: 0 }],
      }).valida
    ).toBe(false);
  });

  test('rejeita antecedência menor que o mínimo', () => {
    const resultado = validarEncomenda({
      ...base,
      horasAteRetirada: 24,
    });

    expect(resultado.erros.join(' ')).toContain('exige 48h');
  });

  test('aceita múltiplos produtos', () => {
    expect(
      validarEncomenda({
        ...base,
        itens: [
          { produto: bolo, quantidade: 1 },
          { produto: brigadeiro, quantidade: 2 },
        ],
      }).valida
    ).toBe(true);
  });

  test('aceita capacidade exatamente no limite', () => {
    expect(
      validarEncomenda({
        ...base,
        capacidadeUsada: 39,
        itens: [{ produto: brigadeiro, quantidade: 1 }],
      }).valida
    ).toBe(true);
  });

  test('rejeita capacidade excedida', () => {
    const resultado = validarEncomenda({
      ...base,
      capacidadeUsada: 38,
      itens: [{ produto: brigadeiro, quantidade: 3 }],
    });

    expect(resultado.erros).toContain(
      'CAPACIDADE_EXCEDIDA: capacidade diária insuficiente.'
    );
  });

  test('calcula total da encomenda', () => {
    expect(
      calcularTotalEncomenda([{ produto: bolo, quantidade: 2 }])
    ).toBe(120);
  });

  test('calcula total com vários produtos', () => {
    expect(
      calcularTotalEncomenda([
        { produto: bolo, quantidade: 1 },
        { produto: brigadeiro, quantidade: 2 },
      ])
    ).toBe(66);
  });

  test('calcula sinal de 50%', () => {
    expect(calcularSinal(120, 50)).toBe(60);
  });

  test('calcula sinal de 0%', () => {
    expect(calcularSinal(120, 0)).toBe(0);
  });

  test('rejeita percentual inválido', () => {
    expect(() => calcularSinal(120, 101)).toThrow(
      'Total e percentual devem ser válidos.'
    );
  });

  test('devolve sinal com mais de 24h', () => {
    const retirada = new Date('2026-10-10T10:00:00');
    const cancelamento = new Date('2026-10-09T09:00:00');

    expect(
      avaliarCancelamento(retirada, cancelamento, 60).sinalDevolvido
    ).toBe(true);
  });

  test('devolve sinal exatamente com 24h', () => {
    const retirada = new Date('2026-10-10T10:00:00');
    const cancelamento = new Date('2026-10-09T10:00:00');

    expect(
      avaliarCancelamento(retirada, cancelamento, 60).sinalDevolvido
    ).toBe(true);
  });

  test('retém sinal com menos de 24h', () => {
    const retirada = new Date('2026-10-10T10:00:00');
    const cancelamento = new Date('2026-10-09T11:00:00');

    expect(
      avaliarCancelamento(retirada, cancelamento, 60).sinalRetido
    ).toBe(true);
  });

  test('bloqueia cancelamento depois da retirada', () => {
    const retirada = new Date('2026-10-10T10:00:00');
    const cancelamento = new Date('2026-10-10T11:00:00');

    expect(() =>
      avaliarCancelamento(retirada, cancelamento, 60)
    ).toThrow('Já passou do horário de retirada.');
  });
});
