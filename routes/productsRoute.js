const express = require("express");
const router = express.Router();
const con = require("../lib/dbConnection");
const middleware = require("../middleware/auth");
const jwt = require("jsonwebtoken");

router.get("/", (req, res) => {
  try {
    con.query("SELECT * FROM products", (err, result) => {
      if (err) throw err;
      res.send(result);
    });
  } catch (error) {
    console.log(error);
  }
});

// Gets one products
router.get("/:id", (req, res) => {
  try {
    res.send({ id: req.params.id });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});
router.post("/", middleware, (req, res) => {
  console.log(req.user.user_type);
  if (req.user.user_type === "admin") {
    const {
      sku,
      name,
      price,
      weight,
      descriptions,
      thumbnail,
      image,
      category,
      stock,
    } = req.body;
    let create_date = new Date().toISOString().slice(0, 19).replace("T", " ");
    try {
      con.query(
        `INSERT into products (sku,name,price,weight,descriptions,thumbnail,image,category,create_date,stock) values ('${sku}', '${name}', '${price}', '${weight}', '${descriptions}' , '${thumbnail}', '${image}' , '   ${category}' , '${create_date}' , '${stock}')`,
        (err, result) => {
          if (err) throw err;
          res.send(result);
        }
      );
    } catch (error) {
      console.log(error);
    }
  } else {
    res.send("Access Denied");
  }
});
// edit product
router.put("/:id", middleware, (req, res) => {
  if (req.user.user_type === "admin") {
    const {
      sku,
      name,
      price,
      weight,
      descriptions,
      thumbnail,
      image,
      category,
      create_date,
      stock,
    } = req.body;
    try {
      con.query(
        `UPDATE products SET sku="${sku}",name="${name}",price="${price}",weight="${weight}}",descriptions="${descriptions}",thumbnail="${thumbnail}",image="${image}",category="${category}",create_date="${create_date},stock="${stock}" WHERE product_id="${req.params.id}"`,
        (err, result) => {
          if (err) throw err;
          res.send(result);
        }
      );
    } catch (error) {
      console.log(error);
    }
  } else {
    res.send("Access Denied");
  }
});
// delete products
router.delete("/:id", middleware, (req, res) => {
  if (req.user.user_type === "admin") {
    try {
      con.query(
        `DELETE FROM products  WHERE product_id="${req.params.id}"`,
        (err, result) => {
          if (err) throw err;
          res.send(result);
        }
      );
    } catch (error) {
      console.log(error);
    }
  } else {
    res.send("Access Denied");
  }
});

module.exports = router;
