import { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";
import { Gauge } from "lucide-react"; // فقط برای آیکون عنوان
import { route } from "../config";

type ApiRow = { group_type: string; total: number };
type ChartRow = { name: string; value: number };

const COLORS = [
  "#3B82F6", "#16d0ffff", "#3df4faff", "#EF4444",
  "#8B5CF6", "#06B6D4", "#84CC16", "#F472B6"
];

export default function GroupTypePieChart() {
  const [data, setData] = useState<ChartRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    axios
      .get<ApiRow[]>(`${route}/group-type-counts`)
      .then(res => {
        if (!mounted) return;
        const chartData = res.data.map(r => ({
          name: r.group_type || "Unknown",
          value: Number(r.total || 0),
        }));
        setData(chartData);
      })
      .catch(() => setError("خطا در گرفتن دیتای گروه‌ها"))
      .finally(() => setLoading(false));
    return () => { mounted = false; };
  }, []);

  if (loading) return <div className="text-sm text-gray-500">در حال لود...</div>;
  if (error) return <div className="text-sm text-red-500">{error}</div>;
  if (!data.length) return <div className="text-sm text-gray-500">داده‌ای موجود نیست.</div>;

  return (
    <div className="rounded-sm p-2 bg-white">
      <div className="flex items-center gap-2 mb-3">
        <Gauge className="w-5 h-5 text-blue-500" />
        <h3 className="text-sm font-semibold text-blue-400">Group Type Analytics</h3>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={90}
              paddingAngle={2}
            >
              {data.map((_, idx) => (
                <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" height={24} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
