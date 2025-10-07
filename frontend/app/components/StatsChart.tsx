import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line } from 'recharts';
import { format } from 'date-fns';

interface ChartDataPoint {
  bucket: string;
  count: number;
}

interface StatsChartProps {
  data: ChartDataPoint[];
}

export default function StatsChart({ data }: StatsChartProps) {
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