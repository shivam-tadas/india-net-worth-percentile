import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Sun, Moon, Info } from 'lucide-react';

const data = [
  { percentile: 10, netWorth: 10000, desc: "A modest amount of assets, often with offsetting debt." },
  { percentile: 20, netWorth: 50000, desc: "A positive net worth, starting to accumulate small cash reserves." },
  { percentile: 30, netWorth: 100000, desc: "Growing stability with some savings and basic assets." },
  { percentile: 40, netWorth: 200000, desc: "Approaching India's median wealth percentiles." },
  { percentile: 50, netWorth: 400000, desc: "The Median. Your assets value more than 50% of the Indian population." },
  { percentile: 60, netWorth: 800000, desc: "Above average. Building solid long-term value, perhaps minor real estate or investments." },
  { percentile: 70, netWorth: 1500000, desc: "Upper middle tier. Diversifying wealth via assets and investments." },
  { percentile: 80, netWorth: 3000000, desc: "Top 20%! A robust financial portfolio and strong underlying assets." },
  { percentile: 90, netWorth: 8000000, desc: "Top 10%. Highly secure position with considerable real estate and liquid wealth." },
  { percentile: 95, netWorth: 20000000, desc: "Top 5%. Outstanding portfolio equating to roughly 2 Crores." },
  { percentile: 99, netWorth: 80000000, desc: "The 1%. Elite wealth status in India with substantial diversified assets (8+ Crores)." },
];

const formatCurrency = (value) => {
  if (value >= 10000000) {
    return `₹${(value / 10000000).toFixed(1)}Cr`;
  }
  if (value >= 100000) {
    return `₹${(value / 100000).toFixed(1)}L`;
  }
  if (value >= 1000) {
    return `₹${(value / 1000).toFixed(0)}k`;
  }
  return `₹${value}`;
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="custom-tooltip">
        <div className="tooltip-title">{`Top ${100 - data.percentile}% (Percentile: ${data.percentile})`}</div>
        <div className="tooltip-value">{formatCurrency(data.netWorth)}</div>
        <div className="tooltip-desc">{data.desc}</div>
      </div>
    );
  }
  return null;
};

function App() {
  const [theme, setTheme] = useState('dark');
  const [hoveredNode, setHoveredNode] = useState(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
  };

  const chartColors = theme === 'dark' 
    ? { grid: 'rgba(255,255,255,0.05)', axis: '#a0a0ab', fillStart: '#00e676', fillEnd: '#00e676', stroke: '#00e676', dotStroke: '#0a0a0f' }
    : { grid: 'rgba(0,0,0,0.05)', axis: '#60606b', fillStart: '#00c853', fillEnd: '#00c853', stroke: '#00c853', dotStroke: '#f8f9fa' };

  return (
    <div className="app-container">
      <div className="top-bar">
        <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
        </button>
      </div>

      <div className="header">
        <h1>India Net Worth Distribution</h1>
        <p className="subtitle">Interactive visualization of net worth percentiles in India. Hover over the graph to explore.</p>
      </div>

      <div className="glass-card">
        <div className="chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              onMouseMove={(e) => {
                if (e.activeTooltipIndex !== undefined) {
                  setHoveredNode(e.activeTooltipIndex);
                }
              }}
              onMouseLeave={() => setHoveredNode(null)}
            >
              <defs>
                <linearGradient id="colorNetWorth" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartColors.fillStart} stopOpacity={theme === 'dark' ? 0.6 : 0.4}/>
                  <stop offset="95%" stopColor={chartColors.fillEnd} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} vertical={false} />
              <XAxis 
                dataKey="percentile" 
                stroke={chartColors.axis} 
                tick={{ fill: chartColors.axis, fontSize: 12 }}
                tickFormatter={(val) => `${val}%`}
                axisLine={false}
                tickLine={false}
                dy={10}
              />
              <YAxis 
                stroke={chartColors.axis} 
                tick={{ fill: chartColors.axis, fontSize: 12 }}
                tickFormatter={formatCurrency}
                axisLine={false}
                tickLine={false}
                dx={-10}
                scale="log"
                domain={['dataMin', 'dataMax']}
              />
              <Tooltip 
                content={<CustomTooltip />} 
                cursor={{ stroke: theme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)', strokeWidth: 2, strokeDasharray: '4 4' }}
              />
              <Area 
                type="monotone" 
                dataKey="netWorth" 
                stroke={chartColors.stroke} 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorNetWorth)" 
                activeDot={{ r: 8, fill: chartColors.stroke, stroke: chartColors.dotStroke, strokeWidth: 3 }}
                animationDuration={1500}
                animationEasing="ease-in-out"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default App;
