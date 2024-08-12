const authResolver = require('./auth'); 
const bookingResolver = require('./booking'); 
const eventResolver = require('./events'); 

const rootResolver = { 
    ...authResolver,
    ...bookingResolver,
    ...eventResolver
}

module.exports = rootResolver
// const bcryptjs = require('bcryptjs')

// const Event = require('../../model/event');
// const User = require('../../model/user');
// const Booking = require('../../model/booking');
// const { dateToString } = require('../../helper/date');

// const populatedUser = userId => {
//     return User.findById(userId)
//         .then(user => {
//             console.log(user);
//             return { ...user._doc, _id: user.id };
//         })
//         .catch(err => {
//             throw err;
//         })
// }

// const populatedSingleEvent = async eventId => {
//     try {
//         const event = await Event.findById(eventId)
//         return event
//     } catch (err) {
//         throw err
//     }
// }

// const trabsformBooking = booking => {
//     return {
//         ...booking._doc,
//         user: populatedUser.bind(this, booking._doc.user),
//         event: populatedSingleEvent.bind(this, booking._doc.event),
//         createdAt: dateToString(booking._doc.createdAt),
//         updatedAt: dateToString(booking._doc.createdAt)
//     }
// }

// const tansftormEvent = event => {
//     return {
//         ...event._doc,
//         _id: event.id,
//         date: dateToString(event._doc.date),
//         creator: populatedUser.bind(this, event._doc.creator)
//     }
// }

// module.exports = {
//     getEvents: () => {
//         return Event.find().then(events => {
//             return events.map(event => {
//                 return tansftormEvent(event);
//             })
//         }).catch(err => {
//             throw err;
//         });
//     },
//     getBookings: async () => {
//         try {
//             const bookings = await Booking.find();
//             return bookings.map(booking => {
//                 return trabsformBooking(booking);
//             })
//         } catch (err) {
//             throw err
//         }
//     },
//     createEvent: async (eventArg) => {
//         try {
//             const event = new Event({
//                 title: eventArg.eventInput.title,
//                 description: eventArg.eventInput.description,
//                 price: +eventArg.eventInput.price,
//                 date: new Date(eventArg.eventInput.date),
//                 creator: '66b4541d7e66c54e7d1649ac'
//             })
//             const result = await event.save();
//             createdEvents = tansftormEvent(result);
//             const creator = await User.findById('66b4541d7e66c54e7d1649ac');
//             if (!creator) {
//                 throw new Error("User Not Exist")
//             }
//             creator.createdEvents.push(event)
//             await creator.save();
//             return this.createdEvents;
//         }catch (err) {
//             console.log(err);
//             throw new Error("Unable to add new Event")
//         };
//     },
//     createUser: (userArgs) => {
//         return User.findOne({ emailId: userArgs.userInput.emailId }).then(user => {
//             if (user) {
//                 throw new Error("User Already Exist")
//             }
//             return bcryptjs.hash(userArgs.userInput.password, 12);
//         })
//             .then(hashedPassword => {
//                 const user = new User({
//                     emailId: userArgs.userInput.emailId,
//                     password: hashedPassword
//                 })
//                 user.save()
//                 return user;
//             }).catch(err => {
//                 throw err;
//             })
//     },
//     bookingEvent: async (bookingArgs) => {
//         const fetchedEvent = await Event.findOne({ _id: bookingArgs.bookingInput.event });
//         try {
//             const booking = new Booking({
//                 event: fetchedEvent,
//                 user: '66b4541d7e66c54e7d1649ac'
//             })
//             const result = await booking.save();
//             return trabsformBooking(result);
//         } catch (err) {
//             throw err;
//         }
//     },
//     cancelBooking: async bookingIdArgs => {
//         console.log(bookingIdArgs)
//         try {
//             const booking = await Booking.findById({ _id: bookingIdArgs.bookingId }).populate('event');
//             const event = {
//                 ...booking.event._doc
//             }
//             await Booking.deleteOne({ _id: bookingIdArgs.bookingId })
//             return event
//         } catch (error) {
//             throw error
//         }
//     }
// }