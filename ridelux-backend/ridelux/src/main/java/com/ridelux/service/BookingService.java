package com.ridelux.service;

import com.ridelux.entity.Booking;
import java.util.List;

public interface BookingService {

    Booking createBooking(Booking booking);

    List<Booking> getAllBookings();

    Booking getBookingById(Long id);

    Booking cancelBooking(Long id);

    List<Booking> getBookingsByPassenger(Long passengerId);

    List<Booking> getBookingsByRide(Long rideId);
}