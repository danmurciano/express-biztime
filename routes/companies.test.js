process.env.NODE_ENV = "test";
const request = require("supertest");
const app = require("../app");
const { createData } = require("../test-seed");
const db = require('../db');


beforeEach(createData);

afterAll(async () => {
  await db.end()
})



describe("GET /comapnies", () => {
  test("Get all companies in db", async () => {
    const res = await request(app).get("/companies");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      companies: [
        {code: "fen", name: "Fender"},
        {code: "gld", name: "Guild"},
      ]
    });
  });
});


describe("GET /comapnies/:code", () => {
  test("Get one company", async () => {
    const res = await request(app).get("/companies/fen");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(
      { company: {code: "fen", name: "Fender", description: "Electric Guitars"},
      invoices: [{id: 1, amt: 799}, {id: 2, amt: 499}] }
    );
  });
  test("Responds with 404 for invalid item", async () => {
    const res = await request(app).get("/companies/microsoft");
    expect(res.statusCode).toBe(404);
  });
});


describe("POST /comapnies/:code", () => {
  test("Create a new company", async () => {
    const res = await request(app).post("/companies").send({ name: 'Gibson', description: 'Electric Guitars' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ company: { code: 'gib', name: 'Gibson', description: 'Electric Guitars' } });
  });
});


describe("PATCH /comapnies/:code", () => {
  test("Update a company", async () => {
    const res = await request(app).patch("/companies/fen").send({ name: 'Fender', description: 'Musical Instruments & Gear' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ company: { code: 'fen', name: 'Fender', description: 'Musical Instruments & Gear' } });
  });
  test("Responds with 404 for invalid item", async () => {
    const res = await request(app).patch("/companies/microsoft");
    expect(res.statusCode).toBe(404);
  });
});


describe("DELETE /comapnies/:code", () => {
  test("Delete a company", async () => {
    const res = await request(app).delete("/companies/fen");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ msg: "Item deleted successfully" });
  });
  test("Responds with 404 for invalid item", async () => {
    const res = await request(app).delete("/companies/microsoft");
    expect(res.statusCode).toBe(404);
  });
});
