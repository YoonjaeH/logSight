import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line } from 'recharts';
import { format } from 'date-fns';

// Define the shape of a single data point
interface ChartDataPoint {
  bucket: string;
  count: number;
  // Add other properties if they exist
}

// Define the props for the component
interface StatsChartProps {
  data: ChartDataPoint[];
}

export default function StatsChart({ data }: StatsChartProps) {
  // Process data to be suitable for the chart
  const processedData = data.map(item => ({
    ...item,
    bucket: format(new Date(item.bucket), 'MMM d, HH:mm'),
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={processedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="bucket" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="count" stroke="#8884d8" activeDot={{ r: 8 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}