const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const ObjectId = require('mongodb').ObjectID;
require('dotenv').config();

const db = require("./db");
const { ObjectID } = require("bson");

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

app.post("/addcourse", async (req, res) => {
    const newCourse = {
        startTime: {
            hour: req.body.startTime.hour,
            minutes: req.body.startTime.minutes
        },
        endTime: {
            hour: req.body.endTime.hour,
            minutes: req.body.endTime.minutes
        },
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        day: req.body.day,
        course: req.body.course,
        location: req.body.location,
        lecturer: req.body.lecturer,
        students: []
    };
    await db.courses().insertOne(newCourse);
    res.sendStatus(200);
});

// für später: const course = await db.courses().findOne({ students: { $all: [newStudent] }});

app.post("/addstudent", async (req, res) => {
    const courseId = req.body._id;
    const newStudent = req.body.student;
    const course = await db.courses().findOne({ _id: ObjectID(courseId), "students": { $all: [newStudent] }, });
    if (!course) {
        await db.courses().updateOne({ _id: ObjectID(courseId) }, { $push: { "students": newStudent } }, { upsert: true });
        res.sendStatus(200).send("Added Student to Course");
    } else {
        res.status(409).send("Student already in Course");
    }
});

app.post("/deletecourse", async (req, res) => {
    const courseId = req.body._id;
    await db.courses().findOneAndDelete({ _id: ObjectID(courseId) });
    res.sendStatus(200).send("Course with the ID: " + courseId + " deleted");
});

app.post("/sendemail", async (req, res) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'srs.mtm.projekt@gmail.com',
            pass: 'xxjbcxdzvopqxnoh'
        }
    });

    const mailOptions = {
        from: 'srs.mtm.projekt@gmail.com',
        to: 'niezgodzka.g@hotmail.de',
        subject: 'Sending Email using Node.js',
        text: 'That was easy!'
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
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