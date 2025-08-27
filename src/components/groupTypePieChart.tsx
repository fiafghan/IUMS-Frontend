import { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";
import { BarChart3, TrendingUp, Users } from "lucide-react";
import { route } from "../config";
import { motion } from "framer-motion";

type ApiRow = { group_type: string; total: number };
type ChartRow = { name: string; value: number };

const COLORS = [
  "#CBD5E1", // slate-200 (light)
  "#64748B", // slate-500 (medium)
  "#1E293B", // slate-800 (dark)
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-xl shadow-2xl border border-slate-200">
        <p className="font-semibold text-slate-900">{label}</p>
        <p className="text-blue-600 font-bold">
          {payload[0].value} users
        </p>
      </div>
    );
  }
  return null;
};

const CustomLegend = ({ payload }: any) => {
  return (
    <div className="flex flex-wrap justify-center gap-3 mt-4">
      {payload?.map((entry: any, index: number) => (
        <div key={index} className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-xs font-medium text-slate-700">
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};

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
      .catch(() => setError("Error in fetching the data!"))
      .finally(() => setLoading(false));
    return () => { mounted = false; };
  }, []);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-slate-500 text-sm">Loading chart...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center p-4">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-red-500 text-xl">!</span>
          </div>
          <p className="text-red-600 text-sm font-medium">{error}</p>
        </div>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center p-4">
          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Users className="w-6 h-6 text-slate-400" />
          </div>
          <p className="text-slate-500 text-sm font-medium">No group data available</p>
        </div>
      </div>
    );
  }

  const totalUsers = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full h-full"
    >
      {/* Chart Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-slate-800 to-slate-500 rounded-lg">
            <BarChart3 className="w-3 h-3 text-blue-300" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Group Distribution</h3>
            <p className="text-sm text-slate-500">Total: {totalUsers} users</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <TrendingUp className="w-4 h-4 text-green-500" />
          <span className="font-medium">{data.length} groups</span>
        </div>
      </div>

      {/* Chart Container */}
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={45}
              outerRadius={80}
              paddingAngle={3}
              stroke="#ffffff"
              strokeWidth={2}
            >
              {data.map((_, idx) => (
                <Cell
                  key={`cell-${idx}`}
                  fill={COLORS[idx % COLORS.length]}
                  className="hover:opacity-80 transition-opacity duration-200"
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Stats */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        {data.slice(0, 4).map((item, index) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors duration-200"
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-slate-700 truncate">{item.name}</p>
              <p className="text-xs text-slate-500">{item.value} users</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
