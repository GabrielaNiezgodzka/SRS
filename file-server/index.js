const express = require("express");
const cors = require("cors");
const fs = require("fs");
const fileUpload = require('express-fileupload');
const { MongoClient } = require('mongodb');
const { userInfo } = require("os");

const dotenv = require('dotenv');
dotenv.config();
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());
app.use(fileUpload());

// Connection URL
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

// Database Name
const dbName = 'myProject';


const FILE_STORAGE_ROOT = "db/";

app.post("/image/:userId", (req, res) => {
    const userId = req.params.userId;

    const userFolder = FILE_STORAGE_ROOT + userId;

    fs.mkdirSync(userFolder, { recursive: true });

    fs.readdir(userFolder, (err, files) => {
        const runningNumber = files.length;

        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).send("No files were uploaded.");
        }

        const file = req.files.file;
        imageId = userFolder + "/" + runningNumber + "_" + file.name;
        id = "image/" + userId + "/" + runningNumber + "_" + file.name;

        // Use the mv() method to place the file somewhere on your server
        file.mv(imageId, err => {
            if (err)
                return res.status(500).send(err);

            res.send({ id });
        });
    });
});

app.get("/image/:userId", (req, res) => {
    const userId = req.params.userId;

    const userFolder = FILE_STORAGE_ROOT + userId;

    fs.readdir(userFolder, (err, files) => {
        res.send({ imageIds: files });
    });
});

app.get("/image/:userId/:imageId", (req, res) => {
    const userId = req.params.userId;
    const imageId = req.params.imageId;

    res.sendFile(__dirname + "/" + FILE_STORAGE_ROOT + userId + "/" + imageId);
});

app.post("/user", async (req, res) => {
    req.body._id = req.body.email;
    await client.db(dbName).collection("users").insertOne(req.body);
    res.send({ text: "alles cool" });
});

app.patch("/user/:userId", async (req, res) => {
    await client.db(dbName).collection("users").updateOne({ _id: req.params.userId }, { $set: req.body });
    res.send({ text: "alles cool" });
});

app.get("/user/:userId", async (req, res) => {
    try {
        const user = (await client.db(dbName).collection("users").findOne({ _id: req.params.userId }));
        if (user) {
            res.status(200).send(user);
        }
    }
    catch (error) {
        res.status(404).send(`Unable to find matching document with id: ${req.params.id}`);
    }

});

app.get("/users", async (_req, res) => {
    try {
        const users = await client.db(dbName).collection("users").find().toArray();
        if (users) {
            res.status(200).send(users);
        }
    }
    catch (error) {
        res.status(404).send(`No user found`);
    }

});

app.get("/courses", async (_req, res) => {
    try {
        const courses = await client.db(dbName).collection("courses").find().toArray();
        if (courses) {
            res.status(200).send(courses);
        }
    }
    catch (error) {
        res.status(404).send(`No course found`);
    }

});

app.post("/user/generateToken/:userId", async (req, res) => {
    // Validate User Here
    // Then generate JWT Token
  
    let jwtSecretKey = process.env.JWT_SECRET_KEY;
    let userData = await client.db(dbName).collection("users").findOne({ _id: req.data.userId });

    if (userData.password !== req.data.password) {
        res.sendStatus(401);
        return;
    }

    let data = {
       ...userData
    }
  
    const token = jwt.sign(data, jwtSecretKey);
  
    res.send(token);
});


async function main() {
    // Use connect method to connect to the server
    await client.connect();
    console.log('Connected successfully to server');

    app.listen(3000, () => console.log("server running"));
}

main();