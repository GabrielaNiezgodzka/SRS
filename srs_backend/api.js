const express = require('express');
const nodemailer = require('nodemailer');
const { ObjectId } = require('mongodb');

const db = require("./db");

const api = express.Router();

api.get("/courses", async (req, res) => {
    res.send(await db.courses().find().toArray());
});

api.post("/addcourse", async (req, res) => {
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
    res.send({});
});

api.post("/editcourse", async (req, res) => {
    const courseId = req.body._id;
    const course = {
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
    };
    await db.courses().updateOne({ _id: ObjectId(courseId) }, { $set: course }, { upsert: true });
    res.send({});
});

// für später: const course = await db.courses().findOne({ students: { $all: [newStudent] }});

api.post("/addstudent", async (req, res) => {
    const courseId = req.body._id;
    const newStudent = req.body.student;
    const course = await db.courses().findOne({ _id: ObjectId(courseId), "students": { $all: [newStudent] }, });
    if (!course) {
        await db.courses().updateOne({ _id: ObjectId(courseId) }, { $push: { "students": newStudent } }, { upsert: true });
        res.send({});
    } else {
        res.status(409).send({});
    }
});

api.post("/deletecourse", async (req, res) => {
    const courseId = req.body._id;
    await db.courses().findOneAndDelete({ _id: ObjectId(courseId) });
    res.send({});
});

api.get("/getcoursesforuser", async (req, res) => {
    const studentMail = req.decodedJwt.email;
    res.send(await db.courses().find({ students: studentMail }).toArray());
});

api.post("/sendemail", async (req) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'srs.mtm.projekt@gmail.com',
            pass: 'xxjbcxdzvopqxnoh'
        }
    });

    const mailOptions = {
        from: 'srs.mtm.projekt@gmail.com',
        to: req.body.studentsMails,
        subject: req.body.subject,
        html: req.body.html
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
});

module.exports = api;