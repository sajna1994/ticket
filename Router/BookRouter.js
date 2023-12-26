
const express = require('express')
const router = require('express').Router();
router.use(express.json());
router.use(express.urlencoded({ extended: true }))
const jwt = require('jsonwebtoken')

const Booking = require('../models/Booking');
const movieDATA = require('../models/Movie')
const nodemailer = require('nodemailer');
const Review = require('../models/Review');

const UserDATA = require('../models/User')
const mongoose = require('mongoose');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: "magicalfoodie123@gmail.com",
    pass: "zqopyrgplmuzllwn"
  }
});
router.post('/booking', async (req, res) => {
  try {
    const {
      movieId,
      seatNumbers,
      date,
      userId,
      ticketPrice,
      totalPrice,
      movieName,
    } = req.body;

    // Check if the seat is already booked for the same movie and date
    const isSeatsAlreadyBooked = await Booking.exists({
      movieId,
      date,
      seatNumbers: { $in: seatNumbers },
    });
    if (isSeatsAlreadyBooked) {
      // Seats are already booked, send an alert
      return res.status(400).json({ message: 'Selected seats are already booked' });
    }

    // If validation passes, create and save the booking
    const newBooking = new Booking({
      movieId,
      seatNumbers,
      date,
      userId,
      ticketPrice,
      totalPrice,
      movieName,
    });

    await newBooking.save();

    res.status(201).json({ message: 'Booking created successfully', booking: newBooking })  } 
    catch (error) {
    console.error(error);
    res.json({ error: 'Internal server error.' });
  }
});


router.delete('/cancelbooking/:Id', async (req, res) => {
  try {
    const bookingId = req.params.Id;
    console.log(bookingId)

    const deletedBooking = await Booking.findByIdAndRemove(bookingId);// use mongoose's findbyidandremove to remove booking

    if (!deletedBooking) {
      return res.status(404).json({ message: 'Booking not found' });
    }


    res.status(200).json({ message: 'Booking canceled successfully' });// If the booking is successfully deleted, send a success response
  } catch (error) {
    console.error('Error canceling booking by ID', error);
    res.status(500).json({ error: 'Unable to cancel booking', details: error.message });
  }
});


// Get all bookings
router.get('/booking/:movieId/:date', async (req, res) => {
  try {
    const { movieId, date } = req.params;
    console.log('Received movieId:', movieId);
    console.log('Received date:', date);

    // Assuming you want to match bookings for the entire day, you can use a range query
    const startOfDay = new Date(date);
    startOfDay.setUTCHours(0, 0, 0, 0); // Set the time to 00:00:00.000
    const endOfDay = new Date(date);
    endOfDay.setUTCHours(23, 59, 59, 999); // Set the time to 23:59:59.999

    const bookings = await Booking.find({
      movieId,
      date: { $gte: startOfDay, $lte: endOfDay }, // Match bookings within the specified day
    });

    const bookedSeats = bookings.flatMap((booking) => booking.seatNumbers);
    res.status(200).json(bookedSeats);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});


router.get('/booking/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    // Fetch booking details for the given userId from your database
    // Replace 'YourBookingModel' with your actual booking model
    const bookings = await Booking.find({ userId });

    if (!bookings) {
      return res.status(404).json({ message: 'No booking details found for this user.' });
    }

    res.json({ bookings });
  } catch (error) {
    console.error('Error fetching booking details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/bookingdetails/:bookingId', async (req, res) => {
  try {
    const { bookingId } = req.params; // Correctly destructure 'bookingId'
    console.log(bookingId);
    const bookingDetails = await Booking.findById(bookingId);
    if (!bookingDetails) {
      return res.status(404).json({ message: 'No Booking Details' });
    }
    res.json({ bookingDetails });
  } catch (error) {
    console.error('Error fetching booking details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
})
// POST endpoint for sending confirmation email
router.post('/sendconfirmationemail', async (req, res) => {
  try {
    const { email, message} = req.body;

    // Create email data
    const mailOptions = {
      from: "magicalfoodie123@gmail.com",
      to: email,
      subject: 'Booking Confirmation',
      text: message,
      
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    // Respond with a success message
    res.status(200).json({ message: 'Confirmation email sent successfully.' });
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    res.status(500).json({ error: 'Error sending confirmation email.' });
  }
});
// Add this route to fetch booking data for a specific user
router.get('/userbookings/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    // Fetch booking details for the user from the database
    const userBookings = await Booking.find({ userId });

    if (!userBookings) {
      return res.status(404).json({ message: 'No booking details found for this user.' });
    }

    res.json(userBookings);
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
router.get('/bookings-by-movie/:movieId', async (req, res) => {
  try {
    const movieId = req.params.movieId;

    const bookings = await Booking.find({ movieId });

    if (!bookings) {
      return res.status(404).json({ message: 'No bookings found for this movie.' });
    }

    res.json({ bookings });
  } catch (error) {
    console.error('Error fetching bookings by movie:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
