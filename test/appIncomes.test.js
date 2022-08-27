const app = require('../api');
const request = require('supertest');

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
                .get("/receitas/1")

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
                .put("/receitas/1")
                .send(payload);

            const response = await request(app)
                .get("/receitas/1");

            payload.date = response.body.income.date;
            payload.id = 1;
            
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
