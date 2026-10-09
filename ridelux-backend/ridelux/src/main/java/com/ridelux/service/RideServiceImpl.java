package com.ridelux.service;

import com.ridelux.entity.Ride;
import com.ridelux.exception.BookingException;
import com.ridelux.repository.RideRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RideServiceImpl implements RideService {

    private final RideRepository rideRepository;

    public RideServiceImpl(RideRepository rideRepository) {
        this.rideRepository = rideRepository;
    }

    @Override
    public Ride createRide(Ride ride) {
        return rideRepository.save(ride);
    }

    @Override
    public List<Ride> getAllRides() {
        return rideRepository.findAll();
    }

    @Override
    public List<Ride> searchRides(String source, String destination) {
        return rideRepository.findBySourceIgnoreCaseAndDestinationIgnoreCase(
                source,
                destination
        );
    }

    @Override
    public Ride getRideById(Long id) {
        return rideRepository.findById(id)
                .orElseThrow(() -> new BookingException("Ride not found"));
    }

    @Override
    public Ride updateRide(Long id, Ride ride) {

        Ride existingRide = rideRepository.findById(id)
                .orElseThrow(() -> new BookingException("Ride not found"));

        existingRide.setSource(ride.getSource());
        existingRide.setDestination(ride.getDestination());
        existingRide.setRideDate(ride.getRideDate());
        existingRide.setRideTime(ride.getRideTime());
        existingRide.setAvailableSeats(ride.getAvailableSeats());
        existingRide.setPrice(ride.getPrice());
        existingRide.setStatus(ride.getStatus());

        return rideRepository.save(existingRide);
    }

    @Override
    public void deleteRide(Long id) {

        Ride ride = rideRepository.findById(id)
                .orElseThrow(() -> new BookingException("Ride not found"));

        rideRepository.delete(ride);
    }
}