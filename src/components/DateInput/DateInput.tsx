type Props = {
  value: string;
  onChange: (value: string) => void;
};

const DateInput = ({ value, onChange }: Props) => {
  const max = new Date().toISOString().split("T")[0];

  return (
    <div className="mt-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Выберите дату
      </label>
      <input
        type="date"
        max={max}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full max-w-xs shadow-md transition-all duration-200 hover:shadow-lg"
      />
    </div>
  );
};

export default DateInput;
