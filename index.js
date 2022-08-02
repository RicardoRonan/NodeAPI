// Import needed libraries
const express = require("express"); // Used to set up a server
const cors = require("cors"); // Used to prevent errors when working locally
const bodyParser = require("body-parser");

// Import routes
const userRoute = require("./routes/userRoute");
const productsRoute = require("./routes/productsRoute");
const ordersRoute = require("./routes/orders");
const categoriesRoute = require("./routes/categories");

// Configure Server
const app = express(); // Initialize express as an app variable
app.set("port", process.env.PORT || 6969); // Set the port
app.use(express.json()); // Enable the server to handle JSON requests
app.use(cors()); // Dont let local development give errors
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// This is where we check URLs and Request methods to create functionality
// GET '/' is always what will be displayed on the home page of your application
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/" + "index.html");
});
// Use individual routes when visiting these URLS
app.use("/users", userRoute);
app.use("/products", productsRoute);
app.use("/orders", ordersRoute);
app.use("/categories", categoriesRoute);

// Set up server to start listening for requests
app.listen(app.get("port"), () => {
  console.log(`Listening for calls on port ${app.get("port")}`);
  console.log("Press Ctrl+C to exit server");
});
// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap";
app.use(express.static("public"));
