
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({


  movieId: {
    type: String,

    // type: mongoose.Schema.Types.ObjectId,
    ref: "Movie",
    required: true,
  },
  userId: {
    type: String,
    ref: 'User', // Replace 'User' with your user model name
    required: true,
  },
  
  date: {
    type: Date,
    required: true,

  },
  seatNumbers: {
    type: [String],
    required: true,
  },
  ticketPrice: {
    type: Number,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  movieName: { // Add the movieName field
    type: String,
    required: true,
  },
  email:String,
  message:String,
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;