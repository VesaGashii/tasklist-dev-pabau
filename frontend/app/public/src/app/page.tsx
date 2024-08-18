'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Booking {
  id: number;
  service: string;
  doctorName: string;
  date: string;
  start_time: string;
  endTime: string;
}

export default function Page() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
        const res = await fetch(`${backendUrl}/api/bookings`);
        if (!res.ok) {
          throw new Error('Failed to fetch bookings');
        }
        const data = await res.json();
        setBookings(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <h1 className="heading">Booking List</h1>
      <p className="subheading">Current booking count: {bookings.length}</p>
      <ul className="list">
        {bookings.map((booking) => (
          <li key={booking.id} className="listItem">
            <Link href={`/booking/${booking.id}`} className="link">
              A Booking on {new Date(booking.date).toLocaleDateString()} starting at {booking.start_time}
            </Link>
          </li>
        ))}
      </ul>
      <br />
      <Link href="/booking/create" className="createLink">
        Create New Booking
      </Link>

      <style jsx>{`
        .container {
          padding: 20px;
          max-width: 600px;
          margin: 0 auto;
          background-color: #f4f4f4;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        .heading {
          font-size: 24px;
          font-weight: bold;
          color: #333;
          text-align: center;
        }
        .subheading {
          font-size: 18px;
          color: #666;
          text-align: center;
          margin-bottom: 20px;
        }
        .list {
          list-style-type: none;
          padding: 0;
        }
        .listItem {
          margin-bottom: 15px;
          background-color: #fff;
          padding: 10px;
          border-radius: 4px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .link {
          text-decoration: none;
          color: #007bff;
          font-weight: bold;
          display: block;
          padding: 10px;
          border-radius: 4px;
          transition: background-color 0.3s ease;
        }
        .link:hover {
          background-color: #e2e6ea;
        }
          .createLink {
          display: inline-block;
          padding: 10px 20px;
          background-color: #28a745;
          color: #fff;
          text-decoration: none;
          border-radius: 4px;
          text-align: center;
          transition: background-color 0.3s ease;
          border: 2px solid #28a745;
        }
        .createLink:hover {
          background-color: #218838;
          border-color: #218838;
        }
      `}</style>
    </div>
  );
}
