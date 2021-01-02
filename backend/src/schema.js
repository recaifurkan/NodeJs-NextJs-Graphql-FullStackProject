
const { withFilter, PubSub } = require("apollo-server");
const logger = require('./logger');
const { Event } = require("./model/event");;

const pubsub = new PubSub()
const typeDefs = [
  `

  

   input EventInput {
    leadId: String
    name: String
    value: Int
  }

  type Event {
    id: String
    leadId: String
    name: String
    value: Int
  }

  type Query {
    event(leadId: String): Event
    events: [Event]
  }

  type Mutation {
    createEvent(input: EventInput): Event
    updateEvent(leadId: String!, input: EventInput): Event
  }

  type Subscription {
    eventUpdated: Event
  }

  schema {
    query: Query
    mutation: Mutation
    subscription: Subscription
  }
`,
];

const resolvers = {
  Query: {
   
    event(parent, args) {
      // console.log(args);
      return Event.find(args).then((results) => Promise.resolve(results[0]));
    },
    events(parent, args) {
      return Event.find({});
    },
  },
  Mutation: {
   
    async createEvent(parent, { input }) {
      console.log("create");
      console.log(input);
      let data = await Event.findOne({
        leadId: input.leadId,
      });

      if (!data) {
        data = new Event(input);
      } else {
        data.value += input.value;
      }

      await data.save();
      pubsub.publish("eventUpdated", { eventUpdated: data });
      return data;
    },

    async updateEvent(parent, { leadId , input }) {
      console.log(input);
      let data = await Event.findOne({
        leadId,
      });

      data.value += input.value;

      await data.save();
      pubsub.publish("eventUpdated", { eventUpdated: data });
      return data;
    },
  },
  Subscription: {
    eventUpdated: {
      subscribe: withFilter(
        () => {
          logger.info("event subscribed!");
          return pubsub.asyncIterator(["eventUpdated"]);
        },
        (payload) => {
          logger.debug("new event", payload);
          return true;
        }
      ),
    },
  },
 
};

module.exports.schema = {
  typeDefs,
  resolvers,
};
