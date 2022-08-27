const app = require('../api');
const request = require('supertest');

describe("Integration tests (EXPENSES)", () => {

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
                .put("/despesas/1")
                .send(payload);

            const response = await request(app)
                .get("/despesas/1");

            payload.date = response.body.expense.date;
            payload.id = 1;
            
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
