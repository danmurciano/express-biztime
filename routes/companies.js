const express = require('express');
const router = new express.Router();
const db = require('../db');
const ExpressError = require('../expressError');


router.get("/", async (req, res, next) => {
  try {
    const results = await db.query("SELECT code, name FROM companies");
    return res.json({ companies: results.rows });
  } catch (err) {
    return next(err)
  }
});


router.get("/:code", async (req, res, next) => {
  try {
    const { code } = req.params;
    const company = await db.query(`SELECT * FROM companies WHERE code=$1`, [code]);
    if (!company.rows.length) throw new ExpressError("Item not found", 404);
    const invoices = await db.query(`SELECT id, amt FROM invoices WHERE comp_Code=$1`, [code]);
    return res.json({ company: company.rows[0], invoices: invoices.rows });
  } catch (err) {
    return next(err)
  }
});


router.post("/", async (req, res, next) => {
  try {
    const { name, description } = req.body;
    let code = name.split(" ")[0].slice(0,3).toLowerCase();
    const results = await db.query(
      "INSERT INTO companies (code, name, description) VALUES ($1,$2,$3) RETURNING *", [code, name, description]
    );
    return res.json({ company: results.rows[0] });
  } catch (err) {
    return next(err)
  }
});


router.patch("/:code", async (req, res, next) => {
  try {
    const { code } = req.params;
    const { name, description } = req.body;
    const results = await db.query(
      "UPDATE companies SET name=$2, description=$3 WHERE code=$1 RETURNING *", [code, name, description]
    );
    if (!results.rows.length) throw new ExpressError("Item not found", 404);
    return res.json({ company: results.rows[0] });
  } catch (err) {
    return next(err)
  }
});


router.delete("/:code", async (req, res, next) => {
  try {
    const { code } = req.params;
    const results = await db.query("DELETE FROM companies WHERE code=$1 RETURNING code", [code]);
    if (!results.rows.length) throw new ExpressError("Item not found", 404);
    return res.json({ msg: "Item deleted successfully" });
  } catch (err) {
    return next(err)
  }
});


module.exports = router;
