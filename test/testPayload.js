const incomesPayloads = [{
    description: 'Teste1',
    value: 100
},{
    description: 'Teste2',
    value: 80
},{
    description: 'Teste3',
    value: 95.50
},{
    description: 'Teste4',
    value: 110
},{
    description: 'Teste5',
    value: 105
}];

const expensesPayloads = [{
    description: 'teste6',
    value: 50,
    type: 'Alimentacao'
},{
    description: 'teste7',
    value: 150
},{
    description: 'teste8',
    value: 68.55,
    type: 'Lazer'
},{
    description: 'teste9',
    value: 35,
    type: 'Lazer'
},{
    description: 'teste10',
    value: 100.90
}];

module.exports = { expensesPayloads, incomesPayloads }
