const nodemailer = require("nodemailer");
const express = require("express");
const router = express.Router();
const con = require("../lib/dbConnection");
const middleware = require("../middleware/auth");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const authController = require("../controller/Auth/index");
// get all
router.get("/", (req, res) => {
  try {
    con.query("SELECT * FROM users", (err, result) => {
      if (err) throw err;
      res.json(result);
    });
  } catch (error) {
    console.log(error);
  }
});

// Gets one users
router.get("/:id", middleware, (req, res) => {
  try {
    con.query(
      `SELECT * FROM users where user_id =${req.params.id} `,
      (err, result) => {
        if (err) throw err;
        res.send(result);
      }
    );
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});
// add new user
router.post("/", (req, res) => {
  if (req.user.user_type === "admin") {
    const {
      email,
      password,
      full_name,
      billing_address,
      default_shipping_address,
      country,
      phone,
      user_type,
    } = req.body;
    try {
      con.query(
        `INSERT into users (email, password,full_name,billing_address,default_shipping_address,country,phone, user_type) values ("${email}" , '${password}', '${full_name}', '${billing_address}', '${default_shipping_address}', '${country}' , '${phone}' , '   ${user_type}')`,
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
// edit user
router.put("/:id", (req, res) => {
  if (req.user.user_type === "admin") {
    const {
      email,
      password,
      full_name,
      billing_address,
      default_shipping_address,
      country,
      phone,
      user_type,
    } = req.body;
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    try {
      con.query(
        `UPDATE users SET email="${email}",password="${hash}",full_name="${full_name}",billing_address="${billing_address}",default_shipping_address="${default_shipping_address}",country="${country}",phone="${phone}",user_type="${user_type}" WHERE users.user_id="${req.params.id}"`,
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
// delete user
router.delete("/:id", (req, res) => {
  try {
    con.query(
      `DELETE FROM users  WHERE users.user_id="${req.params.id}"`,
      (err, result) => {
        if (err) throw err;
        res.send(result);
      }
    );
  } catch (error) {
    console.log(error);
  }
});

// Register Route
// The Route where Encryption starts
router.post("/register", (req, res) => {
  return authController.Register(req, res);
});

// Login
router.post("/login", (req, res) => {
  return authController.Login(req, res);
});

// Verify
router.get("/users/verify", (req, res) => {
  const token = req.header("x-auth-token");
  return authController.Verify(req, res);
});
// Importing the dependencies

router.post("/forgot-psw", (req, res) => {
  try {
    let sql = "SELECT * FROM users WHERE ?";
    let user = {
      email: req.body.email,
    };
    con.query(sql, user, (err, result) => {
      if (err) throw err;
      if (result === 0) {
        res.status(400), res.send("Email not found");
      } else {
        // Allows me to connect to the given email account || Your Email
        const transporter = nodemailer.createTransport({
          host: "smtp.ethereal.email",
          port: 587,
          auth: {
            user: "jasper.heidenreich0@ethereal.email",
            pass: "mFWbw71Rk5MTnzT4g9",
          },
        });

        // How the email should be sent out
        var mailData = {
          from: process.env.MAILERUSER,
          // Sending to the person who requested
          to: result[0].email,

          subject: "Password Reset",
          html: `<div>
            <h3>Hi ${result[0].full_name},</h3>
            <br>
            <h4>Click link below to reset your password</h4>

            <a href="https://nodeapi420.herokuapp.com/resetpsw.html">
              Click Here to Reset Password
              user_id = ${result[0].user_id}
            </a>

            <br>
            <p>For any queries feel free to contact us...</p>
            <div>
              Email: ${process.env.MAILERUSER}
              <br>
              Tel: If needed you can add this
            <div>
          </div>`,
        };

        // Check if email can be sent
        // Check password and email given in .env file
        transporter.verify((error, success) => {
          if (error) {
            console.log(error);
          } else {
            console.log("Email valid! ", success);
          }
        });

        transporter.sendMail(mailData, (error, info) => {
          if (error) {
            console.log(error);
          } else {
            res.send("Please Check your email", result[0].user_id);
          }
        });
      }
    });
  } catch (error) {
    console.log(error);
  }
});

// Rest Password Route

router.put("reset-psw/:id", (req, res) => {
  let sql = "SELECT * FROM users WHERE ?";
  let user = {
    user_id: req.params.id,
  };
  con.query(sql, user, (err, result) => {
    if (err) throw err;
    if (result === 0) {
      res.status(400), res.send("User not found");
    } else {
      let newPassword = `UPDATE users SET ? WHERE user_id = ${req.params.id}`;

      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(req.body.password, salt);

      const updatedPassword = {
        full_name: result[0].full_name,
        email: result[0].email,
        user_type: result[0].user_type,
        phone: result[0].phone,
        country: result[0].country,
        billing_address: result[0].billing_address,
        default_shipping_address: result[0].default_shipping_address,

        // Only thing im changing in table
        password: hash,
      };

      con.query(newPassword, updatedPassword, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send("Password Updated please login");
      });
    }
  });
});

module.exports = router;
