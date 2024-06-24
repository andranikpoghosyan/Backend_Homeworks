const express = require("express");

const app = express();

const body_parser = require("body-parser");

const fs = require("fs");

app.use(body_parser.json());

app.get("/users", (req, res) => {
  try {
    const user_data = fs.readFileSync("users.json");
    const users = JSON.parse(user_data);
    res.json(users);
  } catch (err) {
    res.status(500).send("Data reading error");
  }

  res.send("Hello from server");
});

app.get("/users/:id", (req, res) => {
  try {
    const user_data = fs.readFileSync("users.json");
    const users = JSON.parse(user_data);
    const currentUser = users.find((user) => user.id == req.params.id);

    if (currentUser) {
      res.json(currentUser);
    } else {
      res.status(404).send("User not found");
    }
  } catch (err) {
    res.status(500).send("Bad request");
  }
});

app.get("/users/:id/profile", (req, res) => {
  try {
    const user_data = fs.readFileSync("users.json");
    const users = JSON.parse(user_data);
    const currentUser = users.find((user) => user.id == req.params.id);

    if (!currentUser) {
      return res.status(404).send("User not found");
    }

    const userProfile = {
      bio: currentUser.bio || "",
      profilePicture: currentUser.profilePicture || "",
    };

    res.json(userProfile);
  } catch (err) {
    res.status(500).send("Error retrieving user profile");
  }
});

app.put("/users/:id", (req, res) => {
  try {
    const user_data = fs.readFileSync("users.json");
    const users = JSON.parse(user_data);
    const currentUserIndex = users.findIndex(
      (user) => user.id == req.params.id
    );
    if (currentUserIndex === -1) {
      return res.status(404).send("User not found");
    }

    const updatedUser = {
      ...users[currentUserIndex],
      ...req.body,
    };

    users[currentUserIndex] = updatedUser;
    fs.writeFileSync("users.json", JSON.stringify(users));
    res.json(updatedUser);
  } catch (err) {
    res.status(500).send("User update goes something wrong");
  }
});

app.put("/users/:id/profile", (req, res) => {
  try {
    const user_data = fs.readFileSync("users.json");
    const users = JSON.parse(user_data);
    const currentUserIndex = users.findIndex(
      (user) => user.id == req.params.id
    );
    if (currentUserIndex === -1) {
      return res.status(404).send("User not found");
    }

    const updatedUser = {
      ...users[currentUserIndex],
      bio:
        req.body.bio !== undefined ? req.body.bio : users[currentUserIndex].bio,
      profilePicture:
        req.body.profilePicture !== undefined
          ? req.body.profilePicture
          : users[currentUserIndex].profilePicture,
    };

    users[currentUserIndex] = updatedUser;
    fs.writeFileSync("users.json", JSON.stringify(users));
    res.json(updatedUser);
    res.send("Profile PUT is success");
  } catch (err) {
    res.status(500).send("User update goes something wrong");
  }
});

app.put("/users/:id/profile/picture", (req, res) => {
  try {
    const user_data = fs.readFileSync("users.json");
    const users = JSON.parse(user_data);
    const currentUserIndex = users.findIndex(
      (user) => user.id == req.params.id
    );
    if (currentUserIndex === -1) {
      return res.status(404).send("User not found");
    }

    const updatedUser = {
      ...users[currentUserIndex],
      profilePicture:
        req.body.profilePicture !== undefined
          ? req.body.profilePicture
          : users[currentUserIndex].profilePicture,
    };

    users[currentUserIndex] = updatedUser;
    fs.writeFileSync("users.json", JSON.stringify(users));
    res.json(updatedUser);
    res.send("Profile picture is successfully change");
  } catch (err) {
    res.status(500).send("User update goes something wrong");
  }
});

app.delete("/users/:id", (req, res) => {
  const user_data = fs.readFileSync("users.json");
  const users = JSON.parse(user_data);
  const userIndex = users.findIndex((user) => user.id == req.params.id);

  if (userIndex == -1) {
    return res.status(404).send("User not found");
  }

  try {
    users.splice(userIndex, 1);
    fs.writeFileSync("users.json", JSON.stringify(users));
    res.send("User deleted successfully");
  } catch (err) {
    res.status(500).send("User not found for delete");
  }
});

app.delete("/users/:id/profile", (req, res) => {
  const user_data = fs.readFileSync("users.json");
  const users = JSON.parse(user_data);
  const userIndex = users.findIndex((user) => user.id == req.params.id);

  if (userIndex == -1) {
    return res.status(404).send("User not found");
  }

  try {
    delete users[userIndex].bio;
    delete users[userIndex].profilePicture;
    fs.writeFileSync("users.json", JSON.stringify(users));
    res.send("User profile deleted successfully");
  } catch (err) {
    res.status(500).send("User not found for delete");
  }
});

app.post("/users", (req, res) => {
  if (
    !req.body.name ||
    !req.body.age ||
    !req.body.email ||
    !req.body.password ||
    !req.body.id
  ) {
    return res.status(400).send("Missing any of required fields");
  }

  let single_user_data = {
    id: req.body.id,
    name: req.body.name,
    age: req.body.age,
    email: req.body.email,
    password: req.body.password,
    bio: "",
    profilePicture: "",
  };

  try {
    const user_data = fs.readFileSync("users.json");
    const users = JSON.parse(user_data);

    const findCurrentUser = users.find((user) => user.id === req.body.id);

    if (findCurrentUser) {
      return res.status(400).send("User with this id already exists");
    }
    users.push(single_user_data);
    fs.writeFileSync("users.json", JSON.stringify(users));

    res.send(single_user_data);
  } catch (err) {
    res.status(500).send("Error saving user data");
  }
});

app.post("/users/:id/profile", (req, res) => {
  try {
    const user_data = fs.readFileSync("users.json");
    const users = JSON.parse(user_data);
    const currentUserIndex = users.findIndex(
      (user) => user.id == req.params.id
    );

    if (currentUserIndex == -1) {
      return res.status(404).send("user not found");
    }

    const updatedUser = {
      ...users[currentUserIndex],
      bio: req.body.bio || "",
      profilePicture: req.body.profilePicture || "",
    };

    users[currentUserIndex] = updatedUser;

    fs.writeFileSync("users.json", JSON.stringify(users));
    res.json(updatedUser);
    res.send("Profile is successfully added");
  } catch (err) {
    res.status(500).send("Error creating user profile");
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
