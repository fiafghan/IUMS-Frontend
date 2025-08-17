import { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";
import { Gauge } from "lucide-react"; // فقط برای آیکون عنوان
import { route } from "../config";

type ApiRow = { group_type: string; total: number };
type ChartRow = { name: string; value: number };

const COLORS = [
  "#3B82F6", "#0e99bbff", "#1313f5ff", "#EF4444",
  "#8B5CF6", "#2121f8ff", "#84CC16", "#F472B6"
];

export default function GroupTypePieChart() {
  const [data, setData] = useState<ChartRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    const { token } = JSON.parse(localStorage.getItem("loggedInUser") || "{}");
    axios
      .get<ApiRow[]>(`${route}/group-count`, {
         headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then(res => {
        if (!mounted) return;
        const chartData = res.data.map(r => ({
          name: r.group_type || "Unknown",
          value: Number(r.total || 0),
        }));
        setData(chartData);
      })
      .catch(() => setError("Erorr in fetching the data!"))
      .finally(() => setLoading(false));
    return () => { mounted = false; };
  }, []);

  if (loading) return <div className="text-sm text-gray-500">Loading...</div>;
  if (error) return <div className="text-sm text-red-500">{error}</div>;
  if (!data.length) return <div className="text-sm text-gray-500">No Data!</div>;

  return (
    <div className="rounded-sm p-2 bg-gradient-to-b from-blue-500 via-blue-300 to-blue-200">
      <div className="flex items-center gap-2 mb-3">
        <Gauge className="w-5 h-5 text-white bg-blue-400 p-1 text-[10px] rounded-md" />
        <h3 className="text-[10px] font-semibold text-blue-500 bg-amber-400 rounded-full p-1">Group Type Analytics</h3>
      </div>

      <div className="h-64 text-[10px]">
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
