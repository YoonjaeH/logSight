import { subHours, subDays } from 'date-fns';

interface TimeRangeOption {
  label: string;
  start: Date;
  end: Date;
}

interface TimeRangeFilterProps {
  selectedRange: string;
  onTimeChange: (range: TimeRangeOption) => void;
}

const ranges: TimeRangeOption[] = [
  { label: 'Last Hour', start: subHours(new Date(), 1), end: new Date() },
  { label: 'Last 24 Hours', start: subDays(new Date(), 1), end: new Date() },
  { label: 'Last 7 Days', start: subDays(new Date(), 7), end: new Date() },
];

export default function TimeRangeFilter({ selectedRange, onTimeChange }: TimeRangeFilterProps) {
  return (
    <div className="mt-4 flex space-x-2">
      {ranges.map((range) => (
        <button
          key={range.label}
          onClick={() => onTimeChange(range)}
          className={`px-3 py-1 text-sm font-medium rounded-md ${
            selectedRange === range.label
              ? 'bg-indigo-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          {range.label}
        </button>
      ))}
    </div>
  );
}