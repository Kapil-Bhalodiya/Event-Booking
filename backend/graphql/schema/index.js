const { buildSchema } = require('graphql');

module.exports = buildSchema(`
    type Event{
        _id: ID!
        title: String!,
        description: String!,
        price: Float!,
        date: String!,
        creator: User!
    }

    type User{
        _id: ID!
        emailId: String!,
        password: String!,
        createdEvents: [Event!]
    }

    type Booking{
        _id: ID!
        user: User!
        event: Event!
        createdAt: String!
        updatedAt: String!
    }

    type AuthData{
        userId: ID!
        token: String!
        tokenExpiration: Int!
    }

    input userInput{
        username: String!
        emailId: String!,
        password: String!
    }
    
    input eventInput{
        title: String!,
        description: String!,
        price: Float!,
        date: String!
    }

    input bookingInput{
        event: ID!,
        user: ID
    }

    type rootQuery{
        getEvents: [Event!]!
        getBookings: [Booking!]!
        login(emailId: String, password: String): AuthData
    }

    type rootMutation{
        createEvent(eventInput: eventInput): Event
        createUser(userInput: userInput): User
        bookingEvent(bookingInput: bookingInput): Booking
        cancelBooking(bookingId: ID): Event
    }

    schema {
        query: rootQuery,
        mutation: rootMutation
    }
`)