import { useEffect, useState } from "react";
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis,
  Tooltip, ResponsiveContainer, Legend,
  LineChart, Line,
} from "recharts";
import { BarChart3Icon, PieChartIcon } from "lucide-react";
import api from "../services/api";
import { format, parse } from "date-fns";
import { useUser } from "../context/UserContext";
import RequireAuthWrapper from "./RequireAuthWrapper";

const COLORS = ["#34d399", "#f87171"];
const RANGE_OPTIONS = [
  { label: "By Week", value: "week" },
  { label: "By Month", value: "month" },
  { label: "By Year", value: "year" },
];

function StatsPage() {
  const { user } = useUser();
  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState([]);
  const [range, setRange] = useState("month");
  const [loading, setLoading] = useState(false);

  const fetchStats = async () => {
    if (!user) return;
    const res = await api.getStats();
    setStats(res.data);
  };

  const fetchHistory = async () => {
    if (!user) return;
    const res = await api.getStatsHistory(range);
    setHistory(res.data);
  };

  const handleRefresh = async () => {
    setLoading(true);
    await fetchStats();
    await fetchHistory();
    setLoading(false);
  };

  useEffect(() => {
    handleRefresh();
  }, [range, user]);

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500 text-xl">
        🔒 Bạn cần đăng nhập để truy cập trang này.
      </div>
    );
  }

  if (!stats) {
    return <div className="text-center mt-20 text-gray-500 text-lg">📊 Đang tải dữ liệu thống kê...</div>;
  }

  const formattedHistory = history
    .filter((entry) => entry?.month || entry?.date || entry?.year)
    .map((entry) => {
      if (range === "month") {
        return {
          ...entry,
          label: entry.month
            ? format(parse(entry.month, "yyyy-MM", new Date()), "MMM yyyy")
            : "Unknown",
        };
      } else if (range === "week") {
        return {
          ...entry,
          label: entry.date ?? "Unknown",
        };
      } else if (range === "year") {
        return {
          ...entry,
          label: entry.year?.toString() ?? "Unknown",
        };
      }
      return entry;
    });

  return (
    <RequireAuthWrapper>
      <div className="w-full min-h-screen bg-gradient-to-br from-sky-50 to-white px-4 sm:px-6 py-10 text-[clamp(14px,1.5vw,18px)]">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <BarChart3Icon className="text-sky-700" size={28} />
              <h1 className="text-[clamp(1.5rem,3vw,2.25rem)] font-bold text-sky-800 leading-snug">
                Learning Progress Overview
              </h1>
            </div>
            <button
              onClick={handleRefresh}
              disabled={loading}
              className={`text-sm border px-4 py-2 rounded-full shadow ${loading
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "text-blue-600 border-blue-300 hover:bg-blue-50"}`}
            >
              {loading ? "Refreshing..." : "🔄 Refresh"}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <PieChartIcon className="text-green-500" size={20} /> Learned vs Unlearned
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={[
                      { name: "Learned", value: stats.learnedWords },
                      { name: "Unlearned", value: stats.unlearnedWords },
                    ]}
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    dataKey="value"
                    label
                  >
                    {COLORS.map((color, index) => (
                      <Cell key={`cell-${index}`} fill={color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">Words by Level</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.byLevel}>
                  <XAxis dataKey="level" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <h2 className="text-lg font-semibold text-gray-700">Words Learned Over Time</h2>
              <select
                value={range}
                onChange={(e) => setRange(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 text-sm"
              >
                {RANGE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={formattedHistory}>
                <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Words by Topic</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.byTopic}>
                <XAxis
                  dataKey="topic"
                  tick={{ fontSize: 12 }}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </RequireAuthWrapper>
  );
}

export default StatsPage;
