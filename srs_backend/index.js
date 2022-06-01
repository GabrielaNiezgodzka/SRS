const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
require('dotenv').config();

const db = require("./db");


const app = express();
app.use(cors());
app.use(express.json());

app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await db.users().findOne({ email });
    if (!user) {
        res.status(401).send("Invalid email or password");
    } else {
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            res.status(401).send("Invalid email or password");
        } else {
            delete user.password;
            delete user._id;
            const token = jwt.sign(user, process.env.JWT_SECRET_KEY);
            res.send({ token });
        }
    }
});

app.post("/register", async (req, res) => {
    const user = await db.users().findOne({ email: req.body.email });
    if (user) {
        res.status(409).send("Email already in use");
    } else {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = {
            password: hashedPassword,
            email: req.body.email,
            name: req.body.name,
            surname: req.body.surname,
            role: req.body.role,
            activated: false,
        };
        await db.users().insertOne(newUser);
        delete newUser.password;
        const token = jwt.sign(newUser, process.env.JWT_SECRET_KEY);
        res.send({ token });
    }
});

function authenticate(req, res, next) {
    let token = req.headers['authorization'];
    if (!token || !token.startsWith('Bearer ')) {
        res.sendStatus(401);
    } else {
        token = token.substring(7);
        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
            if (err) {
                res.sendStatus(401);
            } else {
                req.decodedJwt = decoded;
                next();
            }
        });
    }
}

app.use("/api", authenticate, require("./api"));

async function main() {
    console.log('Connecting to mongodb...');
    await db.connect();

    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log("Server running on port " + port));
}

main();