import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Props = {
  deputyMinistryCounts: Record<string, number>;
};

export default function DeputyMinistriesChart({ deputyMinistryCounts }: Props) {
  const data = Object.entries(deputyMinistryCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  return (
    <div className="relative overflow-hidden rounded-md p-5 shadow-none
     bg-transparent w-full lg:w-[800px] text-blue-400 mx-auto">
        <div className="text-center text-white text-2xl text-center">Deputy Ministries Distribution</div>

      <div className="flex items-center justify-between mb-4 text-blue-400">

        <div className="flex items-center gap-3 text-blue-400">
        </div>
      </div>
      <div className="w-full" style={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={data}
            margin={{ top: 5, right: 20, left: 50, bottom: 5 }}
          >
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#bbd5ffff" />
                <stop offset="100%" stopColor="#346de9ff" />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#3b82f6" />
            <XAxis type="number" tick={{ fontSize: 12, fill: 'blue' }} />
            <YAxis
              type="category"
              dataKey="name"
              width={140}
              tick={{ fontSize: 12, fontWeight: 'bold', fill: 'blue' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                borderRadius: "8px",
                border: "1px solid #ddd",
                fontSize: '12px',
              }}
            />
            <Bar dataKey="count" fill="url(#barGradient)" radius={[0, 6, 6, 0]} barSize={30} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
