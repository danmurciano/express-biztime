process.env.NODE_ENV = "test";
const request = require("supertest");
const app = require("../app");
const { createData } = require("../test-seed");
const db = require('../db');


beforeEach(createData);

afterAll(async () => {
  await db.end()
})


describe("GET /invoices", () => {
  test("Get all invoices in db", async () => {
    const res = await request(app).get("/invoices");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      invoices: [
        {id: 1, comp_code: "fen"},
        {id: 2, comp_code: "fen"},
        {id: 3, comp_code: "gld"}
      ]
    });
  });
});


describe("GET /invoices/:id", () => {
  test("Get one invoice", async () => {
    const res = await request(app).get("/invoices/1");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(
        {
          invoice: {
            id: 1,
            comp_code: "fen",
            amt: 799,
            add_date: '2022-01-01T08:00:00.000Z',
            paid: false,
            paid_date: null
          }
        }
    );
  });
  test("Responds with 404 for invalid item", async () => {
    const res = await request(app).get("/invoices/5");
    expect(res.statusCode).toBe(404);
  });
});


describe("POST /invoices/:id", () => {
  test("Create a new invoice", async () => {
    const res = await request(app).post("/invoices").send({ comp_Code: 'fen', amt: 250 });
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(
        {
          invoice: {
            id: 4,
            comp_code: "fen",
            amt: 250,
            add_date: expect.any(String),
            paid: false,
            paid_date: null
          }
        }
      );
    });
  });


describe("PATCH /comapnies/:id", () => {
  test("Update an invoice amount", async () => {
    const res = await request(app).patch("/invoices/1").send({ amt: 699, paid: false });
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(
        {
          invoice: {
            id: 1,
            comp_code: "fen",
            amt: 699,
            add_date: '2022-01-01T08:00:00.000Z',
            paid: false,
            paid_date: null
          }
        }
      );
    });
  test("Update a paid invoice to unpaid", async () => {
    const res = await request(app).patch("/invoices/2").send({ amt: 499, paid: false });
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(
        {
          invoice: {
            id: 2,
            comp_code: "fen",
            amt: 499,
            add_date: '2022-02-01T08:00:00.000Z',
            paid: false,
            paid_date: null
          }
        }
      );
    });
  test("Update an unpaid invoice to paid", async () => {
    const res = await request(app).patch("/invoices/3").send({ amt: 599, paid: true });
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(
        {
          invoice: {
            id: 3,
            comp_code: "gld",
            amt: 599,
            add_date: '2022-03-01T08:00:00.000Z',
            paid: true,
            paid_date: expect.any(String)
          }
        }
      );
    });

  test("Responds with 404 for invalid item", async () => {
    const res = await request(app).patch("/invoices/7");
    expect(res.statusCode).toBe(404);
  });
});


describe("DELETE /comapnies/:id", () => {
  test("Delete an invoice", async () => {
    const res = await request(app).delete("/invoices/1");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ msg: "Item deleted successfully" });
  });
  test("Responds with 404 for invalid item", async () => {
    const res = await request(app).delete("/invoices/9");
    expect(res.statusCode).toBe(404);
  });
});
