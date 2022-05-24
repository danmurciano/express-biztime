const db = require("./db");


async function createData() {
  await db.query("DELETE FROM invoices");
  await db.query("DELETE FROM companies");
  await db.query("SELECT setval('invoices_id_seq', 1, false)");

  await db.query(`INSERT INTO companies (code, name, description)
                    VALUES ('fen', 'Fender', 'Electric Guitars'),
                           ('gld', 'Guild', 'Acoustic Guitars')`);

  const inv = await db.query(
        `INSERT INTO invoices (comp_code, amt, paid, add_date, paid_date)
           VALUES ('fen', 799, false, '2022-01-01', null),
                  ('fen', 499, true, '2022-02-01', '2022-02-02'),
                  ('gld', 599, false, '2022-03-01', null)
           RETURNING id`);
}


module.exports = { createData };
