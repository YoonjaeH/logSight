import { formatISO } from 'date-fns';

const API_BASE_URL = 'http://localhost:8080/api';

export async function getStatsOverTime(projectId: string, startTime: Date, endTime: Date) {
  const params = new URLSearchParams({
    start_time: formatISO(startTime),
    end_time: formatISO(endTime),
  });
  const response = await fetch(`${API_BASE_URL}/projects/${projectId}/stats/over-time?${params}`);
  if (!response.ok) throw new Error('Failed to fetch stats');
  return response.json();
}

export async function getEvents(projectId: string, startTime: Date, endTime: Date) {
  const params = new URLSearchParams({
    start_time: formatISO(startTime),
    end_time: formatISO(endTime),
  });
  const response = await fetch(`${API_BASE_URL}/projects/${projectId}/events?${params}`);
  if (!response.ok) throw new Error('Failed to fetch events');
  return response.json();
}