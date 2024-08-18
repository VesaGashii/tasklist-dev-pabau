'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

interface Booking {
  id: number;
  service: string;
  doctor_name: string;
  date: string;
  start_time: string;
  end_time: string;
}

async function fetchBooking(id: number): Promise<Booking | null> {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
    const res = await fetch(`${backendUrl}/api/booking/${id}`);
    
    if (!res.ok) {
      console.error('Failed to fetch booking:', res.statusText);
      return null;
    }

    const booking: Booking = await res.json();
    return booking;
  } catch (error) {
    console.error('Error fetching booking:', error);
    return null;
  }
}

export default function BookingDetail() {
  const router = useRouter();
  const { id } = router.query;

  // Parse id as an integer
  const bookingId = id ? parseInt(id as string, 10) : NaN;

  if (isNaN(bookingId)) {
    console.error('ID parameter is missing or invalid');
    return <p>ID parameter is missing or invalid. Please check the URL.</p>; 
  }

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadBooking() {
      const fetchedBooking = await fetchBooking(bookingId);
      if (fetchedBooking) {
        setBooking(fetchedBooking);
      } else {
        setError('Booking not found.'); // Set an error message if the booking isn't found
      }
      setLoading(false);
    }

    loadBooking();
  }, [bookingId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>; 
  }

  return (
    <div>
      <h1>Booking Details</h1>
      {booking ? (
        <p>
          This Booking is with {booking.doctor_name} for {booking.service} on {new Date(booking.date).toLocaleDateString()}.
          It starts at {booking.start_time} and ends at {booking.end_time}.
        </p>
      ) : (
        <p>Booking details could not be loaded.</p> // Fallback message if booking is null
      )}
      <a href="/">Back to Home</a>
    </div>
  );
}
