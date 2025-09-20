'use client';

import { useState, useEffect } from 'react';
import { subHours, subDays } from 'date-fns';
import { getStatsOverTime, getEvents } from '../lib/api';
import StatsChart from './components/StatsChart';
import EventsTable from './components/EventsTable';
import TimeRangeFilter from './components/TimeRangeFilter';
import { UserButton } from "@clerk/nextjs";

// Define interfaces for our data shapes
interface TimeRange {
  label: string;
  start: Date;
  end: Date;
}

export default function Dashboard() {
  const [projectId] = useState('your_project_id'); // Use a test project ID
  const [timeRange, setTimeRange] = useState<TimeRange>({
    label: 'Last 24 Hours',
    start: subDays(new Date(), 1),
    end: new Date(),
  });
  const [stats, setStats] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data whenever the time range changes
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const statsData = await getStatsOverTime(projectId, timeRange.start, timeRange.end);
        const eventsData = await getEvents(projectId, timeRange.start, timeRange.end);
        setStats(statsData.stats || []);
        setEvents(eventsData.events || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [timeRange, projectId]);

  return (
    <main className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Analytics Dashboard</h1>
          <UserButton afterSignOutUrl="/sign-in" /> {/* Add the user button */}
        </div>
        <h1 className="text-2xl font-semibold text-gray-900">Analytics Dashboard</h1>
        <TimeRangeFilter selectedRange={timeRange.label} onTimeChange={setTimeRange} />

        <div className="mt-6">
          <h2 className="text-lg font-medium text-gray-800 mb-2">Events Over Time</h2>
          <div className="bg-white p-4 rounded-lg shadow h-96">
            {loading ? <p>Loading chart...</p> : <StatsChart data={stats} />}
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-800 mb-2">Recent Events</h2>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {loading ? <p>Loading events...</p> : <EventsTable events={events} />}
          </div>
        </div>
      </div>
    </main>
  );
}