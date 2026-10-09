package com.ridelux.service;

import com.ridelux.entity.Booking;
import com.ridelux.entity.BookingStatus;
import com.ridelux.entity.Ride;
import com.ridelux.exception.BookingException;
import com.ridelux.repository.BookingRepository;
import com.ridelux.repository.RideRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final RideRepository rideRepository;

    public BookingServiceImpl(
            BookingRepository bookingRepository,
            RideRepository rideRepository) {
        this.bookingRepository = bookingRepository;
        this.rideRepository = rideRepository;
    }

    @Override
    public Booking createBooking(Booking booking) {

        if (booking.getRide() == null || booking.getRide().getId() == null) {
            throw new BookingException("Ride ID is required");
        }

        Ride ride = rideRepository.findById(booking.getRide().getId())
                .orElseThrow(() -> new BookingException("Ride not found"));

        if (booking.getSeatsBooked() == null || booking.getSeatsBooked() <= 0) {
            throw new BookingException("Seats booked must be greater than zero");
        }

        if (booking.getSeatsBooked() > ride.getAvailableSeats()) {
            throw new BookingException("Not enough seats available");
        }

        ride.setAvailableSeats(
                ride.getAvailableSeats() - booking.getSeatsBooked()
        );

        booking.setRide(ride);

        Booking savedBooking = bookingRepository.save(booking);
        rideRepository.save(ride);

        return savedBooking;
    }

    @Override
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    @Override
    public Booking getBookingById(Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new BookingException("Booking not found"));
    }

    @Override
    public Booking cancelBooking(Long id) {

        Booking booking = getBookingById(id);

        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new BookingException("Booking is already cancelled");
        }

        Ride ride = booking.getRide();

        ride.setAvailableSeats(
                ride.getAvailableSeats() + booking.getSeatsBooked()
        );

        booking.setStatus(BookingStatus.CANCELLED);

        rideRepository.save(ride);

        return bookingRepository.save(booking);
    }

    @Override
    public List<Booking> getBookingsByPassenger(Long passengerId) {
        return bookingRepository.findByPassengerId(passengerId);
    }

    @Override
    public List<Booking> getBookingsByRide(Long rideId) {
        return bookingRepository.findByRideId(rideId);
    }
}