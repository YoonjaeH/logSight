import { format } from 'date-fns';

type EventTuple = [string, string, object];

interface EventsTableProps {
  events: EventTuple[];
}

export default function EventsTable({ events }: EventsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {events.map((event, index) => (
            <tr key={index}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {format(new Date(event[0]), 'yyyy-MM-dd HH:mm:ss')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{event[1]}</td>
              <td className="px-6 py-4 text-sm text-gray-500 font-mono">
                <pre>{JSON.stringify(event[2], null, 2)}</pre>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}