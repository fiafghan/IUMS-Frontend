import { Building2 } from "lucide-react";
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
    <div className="relative overflow-hidden rounded-md p-6 shadow-none
     border-blue-100 group w-100 lg:w-[600px] bg-transparent to-from-gray-500 text-blue-400">
      <div className="flex items-center justify-between mb-4 text-blue-400">
        <div className="flex items-center gap-3 text-blue-400">
          <Building2 className="w-6 h-6 text-white bg-blue-400 rounded-md p-1" />
          <span className="text-white text-[11px] font-semibold">Deputy Ministries</span>
        </div>
        <div className="text-blue-400 text-xs uppercase tracking-wider bg-white rounded-full p-2 scale-70">
          Groups
        </div>
      </div>

      <div style={{ width: "100%", height: 220 }}>
        <ResponsiveContainer>
          <BarChart
            layout="vertical"
            data={data}
            margin={{ top: 5, right: 20, left: 50, bottom: 5 }}
          >
            {/* تعریف گرادیانت */}
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#ffffffff" />
                <stop offset="100%" stopColor="#979797ff" />
              </linearGradient>
            </defs>

            {/* خطوط شبکه با رنگ آبی */}
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffffff" />

            <XAxis type="number" />
            <YAxis type="category" dataKey="name" width={140} tick={{ fontSize: 12, fontWeight: 'bold', fill:'white' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                borderRadius: "8px",
                border: "1px solid #ffffffff",
                fontSize: '12px',
              }}
            />

            {/* استفاده از گرادیانت */}
            <Bar dataKey="count" fill="url(#barGradient)" radius={[0, 6, 6, 0]} barSize={30} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
