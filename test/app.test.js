const app = require('../api');
const request = require('supertest');
const { expensesPayloads, incomesPayloads } = require('./testPayload.js'); 

async function addPayload(incomes, expenses) {
    for(let i in incomes) {
        await request(app).post('/receitas').send(incomes[i]);
    }

    for(let j in expenses) {
        await request(app).post('/despesas').send(expenses[j]);
    }
}

describe("Integration tests (EXPENSES)", () => {
    beforeAll(() => {
        addPayload(incomesPayloads, expensesPayloads);
    })    

    describe("Success tests", () => {
        it("Create New Expense", async () => {
            const response = await request(app)
                .post("/despesas")
                .send({
                    description: "teste",
                    type: "Outros",
                    value: 100
                });

            expect(response.status).toBe(200);

            expect(response.body.success).toBe(true);

            expect(response.body.expense).toHaveProperty("id");
            expect(response.body.expense).toHaveProperty("description");
            expect(response.body.expense).toHaveProperty("type");
            expect(response.body.expense).toHaveProperty("value");
            expect(response.body.expense).toHaveProperty("date");
        });

        it("List all Expenses", async () => {
            const response = await request(app)
                .get("/despesas")

            expect(response.status).toBe(200);

            expect(response.body.success).toBe(true);

            for(let i in response.body.expenses) {
                expect(response.body.expenses[i]).toHaveProperty("id");
                expect(response.body.expenses[i]).toHaveProperty("description");
                expect(response.body.expenses[i]).toHaveProperty("type");
                expect(response.body.expenses[i]).toHaveProperty("value");
                expect(response.body.expenses[i]).toHaveProperty("date");
            }
        });

        it("List Expense by ID", async () => {
            const response = await request(app)
                .get("/despesas/1")

            expect(response.status).toBe(200);
            
            expect(response.body.success).toBe(true);

            expect(response.body.expense).toHaveProperty("id");
            expect(response.body.expense).toHaveProperty("description");
            expect(response.body.expense).toHaveProperty("type");
            expect(response.body.expense).toHaveProperty("value");
            expect(response.body.expense).toHaveProperty("date");
        });

        it("List Expenses by Description", async () => {
            const response = await request(app)
                .get("/despesas?description=teste")

            expect(response.status).toBe(200);

            expect(response.body.success).toBe(true);

            for(let i in response.body.expenses) {
                expect(response.body.expenses[i]).toHaveProperty("id");
                expect(response.body.expenses[i]).toHaveProperty("description");
                expect(response.body.expenses[i]).toHaveProperty("type");
                expect(response.body.expenses[i]).toHaveProperty("value");
                expect(response.body.expenses[i]).toHaveProperty("date");
            }
        });

        it("List Expenses by Month and Year", async () => {
            const date = new Date();
            const month = date.getMonth() + 1;
            const year = date.getFullYear();

            const response = await request(app)
                .get(`/despesas/${month}/${year}`)

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);

            for(let i in response.body.expenses) {
                let responseDate = new Date(response.body.expenses[i].date);
                let responseMonth = responseDate.getMonth() + 1;
                let responseYear = responseDate.getFullYear();
                
                expect(response.body.expenses[i]).toHaveProperty("description");
                expect(response.body.expenses[i]).toHaveProperty("type");
                expect(response.body.expenses[i]).toHaveProperty("value");
                expect(response.body.expenses[i]).toHaveProperty("date");
                expect(month).toBe(responseMonth);
                expect(year).toBe(responseYear);
            }
        });
/*
        it("List Expenses with a Date Without registers", async () => {
            const month = '01';
            const year = '2022';
            const response = await request(app)
                .get(`/despesas/${month}/${year}`);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe(`Não foram encontrados registros para o mes ${month} do ano de ${year}`);
        });
*/
        it("Update Expense", async () => {
            const payload = {
                    description: "test",
                    type: "Outros",
                    value: 50
                }

            await request(app)
                .put("/despesas/2")
                .send(payload);

            const response = await request(app)
                .get("/despesas/2");

            payload.date = response.body.expense.date;
            payload.id = 2;
            
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);

            expect(response.body.expense).toHaveProperty("id");
            expect(response.body.expense).toHaveProperty("description");
            expect(response.body.expense).toHaveProperty("type");
            expect(response.body.expense).toHaveProperty("value");
            expect(response.body.expense).toHaveProperty("date");
            expect(response.body.expense).toMatchObject(payload);
        });

        it("Delete Expense by ID", async () => {
            const response = await request(app)
                .delete("/despesas/1");
            
            const confirm = await request(app)
                .get("/despesas/1");

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);

            expect(response.body.message).toBe("ok");
            expect(confirm.body.expense).toBe(null);
        });
    });

    describe("Error tests", () => {
        it("Create new Expense with Incorrect Type", async () => {
            const response = await request(app)
                .post("/despesas")
                .send({
                    description: "descrição teste",
                    type: "Teste",
                    value: 100
                });
            
            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe("Incorrect Type");
        });

        it("List Expenses with Incorrect Month", async () => {
            const response = await request(app)
                .get('/despesas/13/2022');

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe("Incorrect Date");
        });

        it("List Expenses with Incorrect Year", async () => {
            const response = await request(app)
                .get('/despesas/10/20277');

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe("Incorrect Date");
        });

    });
});

describe("Integration tests (INCOMES)", () => {

    describe("Success tests", () => {
        it("Create New income", async () => {
            const response = await request(app)
                .post("/receitas")
                .send({
                    description: "teste",
                    value: 100
                });

            expect(response.status).toBe(200);

            expect(response.body.success).toBe(true);

            expect(response.body.income).toHaveProperty("id");
            expect(response.body.income).toHaveProperty("description");
            expect(response.body.income).toHaveProperty("value");
            expect(response.body.income).toHaveProperty("date");
        });

        it("List all Incomes", async () => {
            const response = await request(app)
                .get("/receitas")

            expect(response.status).toBe(200);

            expect(response.body.success).toBe(true);

            for(let i in response.body.incomes) {
                expect(response.body.incomes[i]).toHaveProperty("id");
                expect(response.body.incomes[i]).toHaveProperty("description");
                expect(response.body.incomes[i]).toHaveProperty("value");
                expect(response.body.incomes[i]).toHaveProperty("date");
            }
        });

        it("List income by ID", async () => {
            const response = await request(app)
                .get("/receitas/2")

            expect(response.status).toBe(200);
            
            expect(response.body.success).toBe(true);

            expect(response.body.income).toHaveProperty("id");
            expect(response.body.income).toHaveProperty("description");
            expect(response.body.income).toHaveProperty("value");
            expect(response.body.income).toHaveProperty("date");
        });

        it("List Incomes by Month and Year", async () => {
            const date = new Date();
            const month = date.getMonth() + 1;
            const year = date.getFullYear();

            const response = await request(app)
                .get(`/receitas/${month}/${year}`)

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);

            for(let i in response.body.incomes) {
                let responseDate = new Date(response.body.incomes[i].date);
                let responseMonth = responseDate.getMonth() + 1;
                let responseYear = responseDate.getFullYear();
                
                expect(response.body.incomes[i]).toHaveProperty("description");
                expect(response.body.incomes[i]).toHaveProperty("value");
                expect(response.body.incomes[i]).toHaveProperty("date");
                expect(month).toBe(responseMonth);
                expect(year).toBe(responseYear);
            }
        });
/*
        it("List Incomes with a Date Without registers", async () => {
            const month = '01';
            const year = '2022';
            const response = await request(app)
                .get(`/receitas/${month}/${year}`);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe(`Não foram encontrados registros para o mes ${month} do ano de ${year}`);
        });
*/
        it("Update income", async () => {
            const payload = {
                    description: "test",
                    value: 50
                }

            await request(app)
                .put("/receitas/2")
                .send(payload);

            const response = await request(app)
                .get("/receitas/2");

            payload.date = response.body.income.date;
            payload.id = 2;
            
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);

            expect(response.body.income).toHaveProperty("id");
            expect(response.body.income).toHaveProperty("description");
            expect(response.body.income).toHaveProperty("value");
            expect(response.body.income).toHaveProperty("date");
            expect(response.body.income).toMatchObject(payload);
        });

        it("Delete income by ID", async () => {
            const response = await request(app)
                .delete("/receitas/1");
            
            const confirm = await request(app)
                .get("/receitas/1");

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);

            expect(response.body.message).toBe("ok");
            expect(confirm.body.income).toBe(null);
        });
    });

    describe("Error tests", () => {
        it("List Incomes with Incorrect Month", async () => {
            const response = await request(app)
                .get('/receitas/13/2022');

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe("Incorrect Date");
        });

        it("List Incomes with Incorrect Year", async () => {
            const response = await request(app)
                .get('/receitas/10/20277');

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe("Incorrect Date");
        });

    });
});

describe("Integration tests (MONTHLY REVIEW)", () => {
    it("Show correct monthly review", async () => {
        const date = new Date();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        
        const response = await request(app)
            .get(`/resumo/${month}/${year}`);

        const confirmIncomes = await request(app)
            .get(`/receitas/${month}/${year}`);

        const confirmExpenses = await request(app)
            .get(`/despesas/${month}/${year}`);

        const {expenses} = confirmExpenses.body;
        const {incomes} = confirmIncomes.body;

        let sumExpenses = 0;
        expenses.forEach(obj => {
            let valueExpense = obj.value;
            sumExpenses += valueExpense
            console.log()
        });

        let sumIncomes = 0;
        incomes.forEach(obj => {
            let valueIncome = obj.value;
            sumIncomes += valueIncome
        });
        console.log(sumIncomes, sumExpenses)
        console.log(response.body.incomes, response.body.expenses)
        
        const review = sumIncomes - sumExpenses;

        expect(review.toFixed(2)).toBe(response.body.receita)
    });
});

