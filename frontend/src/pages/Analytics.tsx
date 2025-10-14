import { useEffect, useState } from 'react';
import { getDailyActiveUsers, getFeatureUsage, getChatEngagement, getUserRetention, getUserActivityHeatmap, getMoodInsights, getMoodPrediction } from '@/services/analyticsService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DauData {
  success: boolean;
  data: Array<{ date: string; users: number }>;
}

interface FeatureUsageData {
  success: boolean;
  data: {
    mood_logged: number;
    journal_created: number;
    message_sent: number;
    community_joined: number;
  };
}

interface ChatEngagementData {
  success: boolean;
  data: {
    totalMessages: number;
    avgMessageLength: number;
    uniqueUsers: number;
    messagesPerUser: number;
  };
}

interface RetentionData {
  success: boolean;
  data: {
    totalUsers: number;
    day1Retention: number;
    day7Retention: number;
    day30Retention: number;
  };
}

interface HeatmapData {
  success: boolean;
  data: Array<{ day: number; hour: number; count: number }>;
}

interface MoodInsightsData {
  success: boolean;
  data: {
    insights: string[];
  };
}

interface MoodPredictionData {
  success: boolean;
  data: {
    predictedMood: number | null;
    message?: string;
  };
}

export function Analytics() {
  const [loading, setLoading] = useState(true);
  const [dauData, setDauData] = useState<DauData | null>(null);
  const [featureUsage, setFeatureUsage] = useState<FeatureUsageData | null>(null);
  const [chatEngagement, setChatEngagement] = useState<ChatEngagementData | null>(null);
  const [retentionData, setRetentionData] = useState<RetentionData | null>(null);
  const [heatmapData, setHeatmapData] = useState<HeatmapData | null>(null);
  const [moodInsights, setMoodInsights] = useState<MoodInsightsData | null>(null);
  const [moodPrediction, setMoodPrediction] = useState<MoodPredictionData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all analytics datasets in parallel
        const [dau, features, chat, retention, heatmap, insights, prediction] = await Promise.all([
          getDailyActiveUsers(30),
          getFeatureUsage(30),
          getChatEngagement(30),
          getUserRetention(),
          getUserActivityHeatmap(30),
          getMoodInsights(),
          getMoodPrediction()
        ]);

        setDauData(dau);
        setFeatureUsage(features);
        setChatEngagement(chat);
        setRetentionData(retention);
        setHeatmapData(heatmap);
        setMoodInsights(insights);
        setMoodPrediction(prediction);
      } catch (err) {
        console.error('Error fetching analytics:', err);
        setError('Failed to load analytics data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-wellness-green" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      </div>
    );
  }

  const latestDauUsers = dauData?.data ? dauData.data[dauData.data.length - 1]?.users || 0 : 0;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="text-gray-600 mt-1">Last 30 days performance metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Daily Active Users */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Daily Active Users</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {dauData?.data && dauData.data.length > 0 ? (
              <>
                <div className="flex items-baseline space-x-2">
                  <span className="text-4xl font-bold text-wellness-green">
                    {latestDauUsers}
                  </span>
                  <span className="text-gray-600">users today</span>
                </div>
                <div className="pt-4">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={dauData.data}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fontSize: 12 }}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis 
                        tick={{ fontSize: 12 }}
                        label={{ value: 'Users', angle: -90, position: 'insideLeft' }}
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#f3f4f6', border: '1px solid #d1d5db' }}
                        formatter={(value) => [value, 'Users']}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="users" 
                        stroke="#10b981" 
                        strokeWidth={2}
                        dot={{ fill: '#10b981', r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </>
            ) : (
              <p className="text-gray-500">No data available</p>
            )}
          </CardContent>
        </Card>

        {/* Feature Usage */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Feature Usage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {featureUsage?.data ? (
              <>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Mood Logged</span>
                    <span className="font-semibold">{featureUsage.data.mood_logged}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Journal Entries</span>
                    <span className="font-semibold">{featureUsage.data.journal_created}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Messages Sent</span>
                    <span className="font-semibold">{featureUsage.data.message_sent}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Communities Joined</span>
                    <span className="font-semibold">{featureUsage.data.community_joined}</span>
                  </div>
                </div>
                <div className="pt-4">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart 
                      data={[
                        { feature: 'Mood Logs', count: featureUsage.data.mood_logged },
                        { feature: 'Journal Entries', count: featureUsage.data.journal_created },
                        { feature: 'Messages', count: featureUsage.data.message_sent },
                        { feature: 'Communities', count: featureUsage.data.community_joined }
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="feature" 
                        tick={{ fontSize: 12 }}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis 
                        tick={{ fontSize: 12 }}
                        label={{ value: 'Count', angle: -90, position: 'insideLeft' }}
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#f3f4f6', border: '1px solid #d1d5db' }}
                        formatter={(value) => [value, 'Count']}
                      />
                      <Bar dataKey="count" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </>
            ) : (
              <p className="text-gray-500">No data available</p>
            )}
          </CardContent>
        </Card>

        {/* Chat Engagement */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Chat Engagement</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {chatEngagement?.data ? (
              <>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Total Messages</span>
                    <span className="font-semibold">{chatEngagement.data.totalMessages}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Avg Message Length</span>
                    <span className="font-semibold">{chatEngagement.data.avgMessageLength} chars</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Unique Users</span>
                    <span className="font-semibold">{chatEngagement.data.uniqueUsers}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Msgs per User</span>
                    <span className="font-semibold">{chatEngagement.data.messagesPerUser}</span>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-gray-500">No data available</p>
            )}
          </CardContent>
        </Card>

        {/* User Retention */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">User Retention</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {retentionData?.data ? (
              <>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Day-1 Retention</span>
                    <span className="font-semibold text-wellness-green">{retentionData.data.day1Retention}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Day-7 Retention</span>
                    <span className="font-semibold text-blue-600">{retentionData.data.day7Retention}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Day-30 Retention</span>
                    <span className="font-semibold text-purple-600">{retentionData.data.day30Retention}%</span>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-gray-500">No data available</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* User Activity Heatmap */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">User Activity Heatmap</CardTitle>
          <p className="text-sm text-gray-600 mt-1">Activity by day of week and hour (darker = more active)</p>
        </CardHeader>
        <CardContent>
          {heatmapData?.data && heatmapData.data.length > 0 ? (
            <div className="space-y-4">
              {/* Heatmap Grid */}
              <div className="overflow-x-auto">
                <div className="inline-block">
                  {/* Hour labels */}
                  <div className="flex">
                    <div className="w-16" /> {/* Space for day labels */}
                    <div className="flex gap-0.5">
                      {Array.from({ length: 24 }, (_, i) => (
                        <div
                          key={`hour-${i}`}
                          className="w-6 text-center text-xs text-gray-600"
                        >
                          {i}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Heatmap rows */}
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, dayIndex) => {
                    const dayNum = dayIndex === 0 ? 1 : dayIndex + 1; // 1 = Sunday, 7 = Saturday
                    return (
                      <div key={`day-${dayNum}`} className="flex gap-0.5">
                        {/* Day label */}
                        <div className="w-16 text-sm font-medium text-gray-700 flex items-center justify-center">
                          {day}
                        </div>

                        {/* Hour cells */}
                        <div className="flex gap-0.5">
                          {Array.from({ length: 24 }, (_, hourIndex) => {
                            const cellData = heatmapData.data.find(
                              (d) => d.day === dayNum && d.hour === hourIndex
                            );
                            const count = cellData?.count || 0;

                            // Determine color based on count
                            let bgColor = 'bg-gray-200'; // 0
                            if (count >= 1 && count <= 5) {
                              bgColor = 'bg-green-200';
                            } else if (count >= 6 && count <= 15) {
                              bgColor = 'bg-green-400';
                            } else if (count >= 16) {
                              bgColor = 'bg-green-600';
                            }

                            return (
                              <div
                                key={`cell-${dayNum}-${hourIndex}`}
                                className={`w-6 h-6 ${bgColor} rounded-sm cursor-pointer hover:ring-2 hover:ring-offset-1 hover:ring-gray-400 transition-all`}
                                title={`${day} ${hourIndex}:00 - ${count} events`}
                              />
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-4 pt-4 border-t">
                <span className="text-sm font-medium text-gray-700">Activity Level:</span>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-200 rounded-sm" />
                  <span className="text-xs text-gray-600">None</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-200 rounded-sm" />
                  <span className="text-xs text-gray-600">Low (1-5)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-400 rounded-sm" />
                  <span className="text-xs text-gray-600">Medium (6-15)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-600 rounded-sm" />
                  <span className="text-xs text-gray-600">High (16+)</span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No heatmap data available</p>
          )}
        </CardContent>
      </Card>

      {/* AI Mood Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">AI Mood Insights</CardTitle>
          <p className="text-sm text-gray-600 mt-1">Behavioral patterns based on your activity</p>
        </CardHeader>
        <CardContent>
          {moodInsights?.data?.insights && moodInsights.data.insights.length > 0 ? (
            <ul className="space-y-3">
              {moodInsights.data.insights.map((insight, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-wellness-green font-bold mt-0.5">•</span>
                  <span className="text-gray-700">{insight}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No patterns detected yet.</p>
          )}
        </CardContent>
      </Card>

      {/* AI Mood Prediction */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">AI Mood Prediction</CardTitle>
          <p className="text-sm text-gray-600 mt-1">Predicted mood for tomorrow based on patterns</p>
        </CardHeader>
        <CardContent>
          {moodPrediction?.data?.predictedMood !== null ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-sm text-gray-700 mb-2">Predicted Mood Tomorrow</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-blue-600">
                      {moodPrediction.data.predictedMood}
                    </span>
                    <span className="text-gray-600">/10</span>
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t">
                <div className="flex items-center h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-600 h-full"
                    style={{
                      width: `${((moodPrediction.data.predictedMood || 0) / 10) * 100}%`
                    }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">{moodPrediction?.data?.message || 'Not enough data for prediction.'}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
