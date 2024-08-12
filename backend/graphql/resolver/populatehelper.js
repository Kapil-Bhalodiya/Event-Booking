const Event = require('../../model/event');
const User = require('../../model/user');
const { dateToString } = require('../../helper/date');

const populatedUser = userId => {
    return User.findById(userId)
        .then(user => {
            console.log(user);
            return { ...user._doc, _id: user.id };
        })
        .catch(err => {
            throw err;
        })
}

const populatedSingleEvent = async eventId => {
    try {
        const event = await Event.findById(eventId)
        return event
    } catch (err) {
        throw err
    }
}

const transformBooking = booking => {
    return {
        ...booking._doc,
        user: populatedUser.bind(this, booking._doc.user),
        event: populatedSingleEvent.bind(this, booking._doc.event),
        createdAt: dateToString(booking._doc.createdAt),
        updatedAt: dateToString(booking._doc.createdAt)
    }
}

const tansformEvent = event => {
    return {
        ...event._doc,
        _id: event.id,
        date: dateToString(event._doc.date),
        creator: populatedUser.bind(this, event._doc.creator)
    }
}

module.exports = { populatedSingleEvent, populatedUser, transformBooking, tansformEvent }