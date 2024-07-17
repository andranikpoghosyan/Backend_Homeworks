require("dotenv").config();

const express = require("express");
const app = express();
const path = require("path");
const authRouter = require("./routers/auth");
const { tokenValidation } = require("./config/validation");

const PORT = process.env.PORT || 3001;

app.set("view engine", "ejs");
app.set(path.join(__dirname, "views"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "publics")));

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/users", tokenValidation, (req, res) => {
  const user = JSON.stringify(req.user.username);
  const nameOfUser = user.substring(1, user.length - 1);
  res.render("users", { user: nameOfUser });
});

app.get("/", (req, res) => {
  res.send("THIS IS BACKEND");
});

app.use("/api", authRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
