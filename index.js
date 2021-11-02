import express from "express";
import bcrypt from 'bcrypt';

const app = express();

app.use(express.json());

const database = {
  users: [
    {
      id: "123",
      name: "John",
      email: "john@gmail.com",
      entries: 0,
      joined: new Date(),
    },
    {
      id: "124",
      name: "Sally",
      email: "sally@gmail.com", 
      entries: 0,
      joined: new Date(),
    },
  ],
  login: [
    {
      id: '987',
      hash: 'ss',
      email: 'john@gmail.com',
    }
  ]
};

app.get("/", (req, res) => {
  res.json(database.users);
});

app.post("/signin", (req, res) => {
  if (
    req.body.email === database.users[0].email &&
    req.body.password === database.users[0].password
  ) {
    res.json("success");
  } else {
    res.status(400).json("error logging in");
  }
});

app.post("/register", async (req, res) => {
  const { email, name, password } = req.body;
  const saltRounds = 10;
  const hash = await new Promise((resolve, reject) => {
    bcrypt.hash(password, saltRounds, (err, hash) => {
      if (err) {
        reject(err);
      }

      resolve(hash);
    });
  });

  database.users.push({
    id: "125",
    name: name,
    email: email,
    passwordHash: hash,
    entries: 0,
    joined: new Date(),
  });

  res.json(database.users[database.users.length - 1]);
});

app.get("/profile/:id", (req, res) => {
  const { id } = req.params;
  let found = false;
  database.users.forEach((user) => {
    if (user.id === id) {
      found = true;
      res.json(user);
    }

    if (!found) {
      res.status(400).json("not found");
    }
  });
});

app.put("/image", (req, res) => {
  const { id } = req.params;
  let found = false;
  database.users.forEach((user) => {
    if (user.id === id) {
      found = true;
      user.entries++;
      res.json(user.entries);
    }

    if (!found) {
      res.status(400).json("not found");
    }
  });
});

app.listen(3000, () => {
  console.log("App is running on port 3000");
});

/**
 *  '/' --> this is working
 *  '/signin' --> POST => success/fail
 *  '/register' --> POST => user
 *  '/profile/:userId' --> GET => user
 *  '/image' --> PUT => user
 */
