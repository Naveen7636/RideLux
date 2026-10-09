package com.ridelux.controller;

import com.ridelux.entity.Booking;
import com.ridelux.service.BookingService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Booking createBooking(@RequestBody Booking booking) {
        return bookingService.createBooking(booking);
    }

    @GetMapping
    public List<Booking> getAllBookings() {
        return bookingService.getAllBookings();
    }

    @GetMapping("/{id}")
    public Booking getBookingById(@PathVariable Long id) {
        return bookingService.getBookingById(id);
    }

    @GetMapping("/passenger/{passengerId}")
    public List<Booking> getBookingsByPassenger(
            @PathVariable Long passengerId) {
        return bookingService.getBookingsByPassenger(passengerId);
    }

    @GetMapping("/ride/{rideId}")
    public List<Booking> getBookingsByRide(
            @PathVariable Long rideId) {
        return bookingService.getBookingsByRide(rideId);
    }

    @PutMapping("/{id}/cancel")
    public Booking cancelBooking(@PathVariable Long id) {
        return bookingService.cancelBooking(id);
    }
}