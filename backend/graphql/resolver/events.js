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
    createEvent: async (eventArg, req) => {
        if(!req.isAuth) throw new Error('Unauthenticated!');
        try {
            const event = new Event({
                title: eventArg.eventInput.title,
                description: eventArg.eventInput.description,
                price: +eventArg.eventInput.price,
                date: new Date(eventArg.eventInput.date),
                creator: req._id
            })
            const result = await event.save();
            createdEvents = tansformEvent(result);
            const creator = await User.findById(req._id);
            if (!creator) {
                throw new Error("User Not Exist")
            }
            console.log("creator : ",creator);
            creator.createdEvets.push(event)
            console.log("creator : ",creator);
            await creator.save();
            return this.createdEvents;
        }catch (err) {
            console.log(err);
            throw new Error("Unable to add new Event")
        };
    }
}