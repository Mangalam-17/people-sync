import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity } from 'lucide-react';

const AttendanceTrendChart = ({ data = [] }) => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
          <Activity className="h-3.5 w-3.5 text-indigo-500" />
          Attendance Trend (Last 7 Days)
        </h3>
        <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-success/10 border border-success/20">
          <span className="h-1 w-1 rounded-full bg-success animate-pulse"></span>
          <span className="text-[9px] text-success font-bold tracking-wider uppercase">Live</span>
        </span>
      </div>
      
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data}>
            <XAxis 
              dataKey="date" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={10}
              tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={10}
              domain={[0, 100]}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '0.5rem',
                fontSize: '0.75rem',
              }}
              formatter={(value) => [`${value}%`, 'Attendance']}
              labelFormatter={(date) => new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            />
            <Line 
              type="monotone" 
              dataKey="percentage" 
              stroke="#10b981" 
              strokeWidth={2}
              dot={{ fill: '#10b981', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center py-8 bg-card rounded-xl border border-border border-dashed">
          <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center mb-2">
            <Activity className="h-5 w-5 text-muted-foreground" />
          </div>
          <p className="text-sm font-bold text-foreground mb-1">No trend data yet</p>
          <p className="text-xs text-muted-foreground font-medium text-center max-w-[200px]">
            Attendance trends will appear here as data accumulates.
          </p>
        </div>
      )}
    </div>
  );
};

export default AttendanceTrendChart;
