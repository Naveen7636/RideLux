package com.ridelux.service;

import com.ridelux.entity.Ride;
import java.util.List;

public interface RideService {

    Ride createRide(Ride ride);

    List<Ride> getAllRides();

    List<Ride> searchRides(String source, String destination);

    Ride getRideById(Long id);

    Ride updateRide(Long id, Ride ride);

    void deleteRide(Long id);
}