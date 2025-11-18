const AnalyticsCard: React.FC<{ title: string; value: string | number; wide?: boolean }> = ({ title, value, wide }) => (
  <div
    className={`bg-gray-200 rounded-lg px-6 py-5 text-center ${
      wide ? 'w-56 h-32' : 'w-44 h-28'
    } flex flex-col justify-center`}
  >
    <div className="text-xs text-gray-600 mb-2">{title}</div>
    <div className="text-2xl font-semibold">{value}</div>
  </div>
);

export default AnalyticsCard;
