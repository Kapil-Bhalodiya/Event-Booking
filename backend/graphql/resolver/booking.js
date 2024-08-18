const Booking = require('../../model/booking');
const Event = require('../../model/event');
const { transformBooking } = require('./populatehelper');

module.exports = {
    getBookings: async () => {
        try {
            const bookings = await Booking.find();
            return bookings.map(booking => {
                return transformBooking(booking);
            })
        } catch (err) {
            throw err
        }
    },
    bookingEvent: async (bookingArgs, req) => {
        if(!req.isAuth) throw new Error('Unauthenticated!');
        const fetchedEvent = await Event.findOne({ _id: bookingArgs.bookingInput.event });
        try {
            const booking = new Booking({
                event: fetchedEvent,
                user: req._id
            })
            const result = await booking.save();
            return transformBooking(result);
        } catch (err) {
            throw err;
        }
    },
    cancelBooking: async (bookingIdArgs, req) => {
        if(!req.isAuth) throw new Error('Unauthenticated!');
        try {
            const booking = await Booking.findById({ _id: bookingIdArgs.bookingId }).populate('event');
            const event = {
                ...booking.event._doc
            }
            await Booking.deleteOne({ _id: bookingIdArgs.bookingId })
            return event
        } catch (error) {
            throw error
        }
    }
}