import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import type { ChartConfig } from '../types/chart.types';

interface ChartRendererProps {
  config: ChartConfig;
  data: any[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export function ChartRenderer({ config, data }: ChartRendererProps) {
  const { chartType, dimensions, styling } = config;
  const xAxisKey = dimensions.xAxis || 'name';
  const yAxisKey = dimensions.yAxis || 'value';

  const commonProps = {
    data,
    margin: { top: 5, right: 30, left: 20, bottom: 5 },
  };

  const renderChart = () => {
    switch (chartType) {
      case 'bar':
        return (
          <BarChart {...commonProps}>
            {styling?.grid && <CartesianGrid strokeDasharray="3 3" />}
            <XAxis dataKey={xAxisKey} />
            <YAxis />
            <Tooltip />
            {styling?.legend && <Legend />}
            <Bar dataKey={yAxisKey} fill="#8884d8" />
          </BarChart>
        );

      case 'line':
        return (
          <LineChart {...commonProps}>
            {styling?.grid && <CartesianGrid strokeDasharray="3 3" />}
            <XAxis dataKey={xAxisKey} />
            <YAxis />
            <Tooltip />
            {styling?.legend && <Legend />}
            <Line type="monotone" dataKey={yAxisKey} stroke="#8884d8" />
          </LineChart>
        );

      case 'area':
        return (
          <AreaChart {...commonProps}>
            {styling?.grid && <CartesianGrid strokeDasharray="3 3" />}
            <XAxis dataKey={xAxisKey} />
            <YAxis />
            <Tooltip />
            {styling?.legend && <Legend />}
            <Area type="monotone" dataKey={yAxisKey} stroke="#8884d8" fill="#8884d8" />
          </AreaChart>
        );

      case 'pie':
        return (
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={(entry) => entry[xAxisKey]}
              outerRadius={80}
              fill="#8884d8"
              dataKey={yAxisKey}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            {styling?.legend && <Legend />}
          </PieChart>
        );

      case 'scatter':
        return (
          <ScatterChart {...commonProps}>
            {styling?.grid && <CartesianGrid strokeDasharray="3 3" />}
            <XAxis dataKey={xAxisKey} />
            <YAxis dataKey={yAxisKey} />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
            {styling?.legend && <Legend />}
            <Scatter name="Data" data={data} fill="#8884d8" />
          </ScatterChart>
        );

      default:
        return <div>Unsupported chart type</div>;
    }
  };

  return (
    <ResponsiveContainer width="100%" height={400}>
      {renderChart()}
    </ResponsiveContainer>
  );
}
