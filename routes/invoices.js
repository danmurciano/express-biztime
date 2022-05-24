const express = require('express');
const router = new express.Router();
const db = require('../db');
const ExpressError = require('../expressError');


router.get("/", async (req, res, next) => {
  try {
    const results = await db.query("SELECT id, comp_code FROM invoices");
    return res.json({ invoices: results.rows });
  } catch (err) {
    return next(err)
  }
});


router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const results = await db.query(`SELECT * FROM invoices WHERE id=$1`, [id]);
    if (!results.rows.length) throw new ExpressError("Item not found", 404);
    return res.json({ invoice: results.rows[0] });
  } catch (err) {
    return next(err)
  }
});


router.post("/", async (req, res, next) => {
  try {
    const { comp_Code, amt } = req.body;
    const results = await db.query(
      "INSERT INTO invoices (comp_Code, amt) VALUES ($1,$2) RETURNING *", [comp_Code, amt]
    );
    return res.json({ invoice: results.rows[0] });
  } catch (err) {
    return next(err)
  }
});


router.patch("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { amt, paid } = req.body;
    const invoice = await db.query(`SELECT * FROM invoices WHERE id=$1`, [id]);
    if (!invoice.rows.length) throw new ExpressError("Item not found", 404);

    let paid_date;
    if (invoice.rows[0].paid !== paid) {
      paid === true ? paid_date = new Date().toISOString().slice(0,10) : paid_date = null;
    }

    const results = await db.query(
      "UPDATE invoices SET amt=$2, paid=$3, paid_date=$4 WHERE id=$1 RETURNING *", [id, amt, paid, paid_date]
    );

    return res.json({ invoice: results.rows[0] });
  } catch (err) {
    return next(err)
  }
});


router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const results = await db.query("DELETE FROM invoices WHERE id=$1 RETURNING id", [id]);
    if (!results.rows.length) throw new ExpressError("Item not found", 404);
    return res.json({ msg: "Item deleted successfully" });
  } catch (err) {
    return next(err)
  }
});


module.exports = router;
