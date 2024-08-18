"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

interface Booking {
  id: number;
  service: string;
  doctor_name: string;
  start_time: string;
  end_time: string;
  date: string;
}

const BookingDetail: React.FC = () => {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    const fetchBookingDetail = async () => {
      if (id) {
        try {
          const res = await fetch(`http://localhost:5000/api/bookings/${id}`);
          if (res.ok) {
            const data = await res.json();
            setBooking(data);
          } else {
            console.error('Failed to fetch booking details');
          }
        } catch (error) {
          console.error('Error fetching booking details:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchBookingDetail();
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!booking) {
    return <p>Booking not found</p>;
  }

  return (
    <div>
      <h1>Booking Details</h1>
      <p>This Booking is with {booking.doctor_name} for {booking.service} and it ends on {booking.end_time}.</p>
      <Link href="/">
        <a>Back</a>
      </Link>
    </div>
  );
};

export default BookingDetail;
