const AnalyticsCard: React.FC<{ header: string; value: string | number; subheader?: string; description?: string }> = ({
  header,
  value,
  subheader,
  description,
}) => {
  const backgroundColors = [
    {
      from: '#42a5f5',
      to: '#90e0ef',
      label: '1',
    },
    {
      to: '#667eea',
      from: '#764ba2',
      label: '2',
    },
    {
      from: '#f5576c',
      to: '#f093fb',
      label: '3',
    },
    {
      from: '#4facfe',
      to: '#00f2fe',
      label: '4',
    },
    {
      from: '#52b69a',
      to: '#99d98c',
      label: '5',
    },
    {
      from: '#fa709a',
      to: '#fee140',
      label: '6',
    },
    {
      from: '#30cfd0',
      to: '#330867',
      label: '7',
    },
    {
      from: '#3dccc7',
      to: '#9ceaef',
      label: '8',
    },
  ];
  const randomBackgroundColor = backgroundColors[Math.floor(Math.random() * backgroundColors.length)];
  return (
    <div
      className={`rounded-lg text-left
         w-52 h-28 flex flex-col justify-center text-white relative group`}
      style={{
        background: `linear-gradient(135deg, ${randomBackgroundColor.from}, ${randomBackgroundColor.to})`,
      }}
    >
      <div className="px-6">
        <div className="text-xs mb-1">{header}</div>
        <div className={`text-2xl font-semibold ${subheader ? 'pb-2' : ''}`}>{value}</div>
      </div>
      {subheader && (
        <div className="border-t-2 border-white">
          <div className="px-6 ">
            <div className="text-xs text- mt-1">{subheader}</div>
          </div>
        </div>
      )}
      {description && (
        <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black bg-opacity-25 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-sm font-semibold">{description}</span>
        </div>
      )}
    </div>
  );
};

export default AnalyticsCard;
