const Mongoose = require('mongoose');

const EventSchema = {
  leadId: String,
  name: String,
  value: Number,
};
const Event = Mongoose.model("Event", EventSchema);

module.exports = {
   Event 
}
