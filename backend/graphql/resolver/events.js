const fs = require('fs');
const path = require('path');
const express = require('express');
const Event = require('../../model/event');
const User = require('../../model/user');
const { tansformEvent } = require('./populatehelper');

module.exports = {
    getEvents: () => {
        return Event.find().then(events => {
            return events.map(event => {
                return tansformEvent(event);
            })
        }).catch(err => {
            throw err;
        });
    },
    createEvent: async ({ eventInput, eventImage }, req) => {
        if (!req.isAuth) throw new Error('Unauthenticated!');
        let fileUrl = null;
        if (eventImage) {
            const { createReadStream, filename } = await eventImage.file;

            if (!filename) {
                throw new Error('No filename received');
            }

            const stream = createReadStream();
            const uploadPath = path.join(__dirname, '../../uploads', filename);
            console.log("uploadLog : ",uploadPath);
            if (!fs.existsSync(path.dirname(uploadPath))) {
                fs.mkdirSync(path.dirname(uploadPath), { recursive: true });
            }

            await new Promise((resolve, reject) => {
                stream
                    .pipe(fs.createWriteStream(uploadPath))
                    .on('finish', resolve)
                    .on('error', reject);
            });
            fileUrl = `/uploads/${filename}`;
        }

        try {
            const event = new Event({
                title: eventInput.title,
                description: eventInput.description,
                price: +eventInput.price,
                date: new Date(eventInput.date),
                image: fileUrl,
                creator: req.userId
            })
            const result = await event.save();
            createdEvents = tansformEvent(result);
            const creator = await User.findById(req.userId);
            if (!creator) {
                throw new Error("User Not Exist")
            }
            creator.createdEvents.push(event)
            console.log("creator : ", creator);
            await creator.save();
            return result;
        } catch (err) {
            console.log(err);
            throw new Error("Unable to add new Event")
        };
    }
}