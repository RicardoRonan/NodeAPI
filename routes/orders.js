const express = require("express");
const router = express.Router();
const con = require("../lib/dbConnection");

router.get("/", (req, res) => {
  try {
    con.query("SELECT * FROM orders", (err, result) => {
      if (err) throw err;
      res.send(result);
    });
  } catch (error) {
    console.log(error);
  }
});

// Gets one orders
router.get("/:id", (req, res) => {
  try {
    res.send({ id: req.params.id });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});
router.post("/", (req, res) => {
  const {
    order_id,
    user_id,
    amount,
    shipping_address,
    order_email,
    order_date,
    order_status,
  } = req.body;
  try {
    con.query(
      `INSERT into orders (order_id,user_id,amount,shipping_address,order_email,order_date,order_status) values ('${order_id}','${user_id}','${amount}', '${shipping_address}', '${order_email}', '${order_date}', '${order_status}')`,
      (err, result) => {
        if (err) throw err;
        res.send(result);
      }
    );
  } catch (error) {
    console.log(error);
  }
});
// edit product
router.put("/:id", (req, res) => {
  const {
    order_id,
    user_id,
    amount,
    shipping_address,
    order_email,
    order_date,
    order_status,
  } = req.body;
  try {
    con.query(
      `UPDATE orders SET  order_id="${order_id}",user_id="${user_id}",amount="${amount}",shipping_address="${shipping_address}",order_email="${order_email}",order_date="${order_date}",order_status="${order_status}" WHERE order_id="${req.params.id}"`,
      (err, result) => {
        if (err) throw err;
        res.send(result);
      }
    );
  } catch (error) {
    console.log(error);
  }
});
// delete orders
router.delete("/:id", (req, res) => {
  try {
    con.query(
      `DELETE FROM orders  WHERE order_id="${req.params.id}"`,
      (err, result) => {
        if (err) throw err;
        res.send(result);
      }
    );
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
