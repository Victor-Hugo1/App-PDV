# Fornada — React Native

Projeto desenvolvido com uma estrutura alinhada ao padrão das aulas fornecido no projeto de referência:

- `App.js`
- `index.js`
- `components/`
- arquivos `.js`
- componentes importados diretamente pelo `App.js`
- serviços separados em `services/`
- testes separados em `tests/`

## Funcionalidades da atividade

### 1. Venda de balcão

Regras:
- valida estoque;
- Xepa a partir de 18h;
- 30% de desconto para perecíveis;
- pagamento em dinheiro com validação e troco;
- cartão e PIX usam o valor total.

### 2. Encomenda

Regras:
- antecedência mínima;
- capacidade diária;
- sinal de 50%;
- validação de cliente e itens;
- cancelamento com devolução/retenção do sinal conforme 24h.

## Executar

```bash
npm install
npm start
```

Testes:

```bash
npm test
npm run test:coverage
```

O relatório fica em:

```text
coverage/lcov-report/index.html
```

## Estrutura

```text
fornada-app/
├── App.js
├── index.js
├── app.json
├── package.json
├── components/
│   ├── Venda.js
│   └── Encomenda.js
├── services/
│   ├── vendaService.js
│   └── encomendaService.js
└── tests/
    ├── vendaService.test.js
    └── encomendaService.test.js
```

A pasta `services` concentra as regras de negócio para que possam ser testadas sem depender da interface.
