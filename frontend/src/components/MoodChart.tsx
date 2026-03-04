import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/lib/api";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, TooltipProps } from "recharts";
import { Loader2 } from "lucide-react";

interface MoodData {
  date: string;
  moodScore: number;
  mood: string;
  energyLevel: number;
}

export default function MoodChart() {
  const [moodData, setMoodData] = useState<MoodData[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("week");
  const { toast } = useToast();

  useEffect(() => {
    fetchMoodData(timeRange);
  }, [timeRange]);

  useEffect(() => {
    console.log("Fetched moodData:", moodData);
  }, [moodData]);

  const fetchMoodData = async (range: string) => {
    try {
      setLoading(true);
      const response = await api.get(`/mood/history?range=${range}`);
      
      // map createdAt to date
      const formatted = response.data.map((item: any) => ({
        ...item,
        date: item.createdAt,   // 👈 recharts expects this
      }));
      
      setMoodData(formatted);
    } catch (error) {
      console.error('Error fetching mood data:', error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Helper to format date as DD.MM.YY
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // month is 0-based
    const year = String(date.getFullYear()).slice(-2);
    return `${day}.${month}.${year}`;
  };

const getMoodCategory = (score: number) => {
  if (score <= 3) return "Low";
  if (score <= 6) return "Neutral";
  return "Positive";
};

  // Custom tooltip for the chart
const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as MoodData;
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-md shadow-md">
        <p className="font-semibold">{formatDate(data.date)}</p>
        <p className="text-wellness-green">
          Mood: {getMoodCategory(data.moodScore)}
        </p>
        <p className="text-wellness-blue">
          Score: {data.moodScore}/10
        </p>
        <p className="text-wellness-purple">
          Energy: {data.energyLevel}/10
        </p>
      </div>
    );
  }
  return null;
};

  // ✅ Format X axis tick
  const formatXAxis = (tickItem: string) => {
    return formatDate(tickItem);
  };

  // Get gradient colors based on mood score
  const getLineColor = (data: MoodData[]) => {
    if (data.length === 0) return "#4CAF50"; // Default green
    
    const latestMood = data[data.length - 1].moodScore;
    
    if (latestMood >= 7) return "#4CAF50"; // Good mood - green
    if (latestMood >= 4) return "#FFC107"; // Neutral mood - yellow
    return "#F44336"; // Low mood - red
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Mood History</CardTitle>
            <CardDescription>Tracking your emotional journey</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-[300px] flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-wellness-green" />
          </div>
        ) : moodData.length === 0 ? (
          <div className="h-[300px] flex items-center justify-center">
            <p className="text-center text-muted-foreground">
              No mood data available for this time period.<br />
              Complete check-ins to see your mood trends.
            </p>
          </div>
        ) : (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={moodData}
                margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={formatXAxis} 
                  tick={{ fontSize: 12 }}
                  stroke="#9e9e9e"
                />
                <YAxis 
                  domain={[0, 10]} 
                  tick={{ fontSize: 12 }} 
                  tickCount={6}
                  stroke="#9e9e9e"
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="moodScore"
                  stroke={getLineColor(moodData)}
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 2, fill: "white" }}
                  activeDot={{ r: 6, stroke: "#FFF", strokeWidth: 2 }}
                />
                <Line
                  type="monotone"
                  dataKey="energyLevel"
                  stroke="#03A9F4"
                  strokeWidth={2}
                  dot={{ r: 3, strokeWidth: 2, fill: "white" }}
                  activeDot={{ r: 5, stroke: "#FFF", strokeWidth: 2 }}
                  strokeDasharray="5 5"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
