import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";

const data = [
  { name: "Page A", uv: 400 },
  { name: "Page B", uv: 300 },
  { name: "Page C", uv: 200 },
  { name: "Page D", uv: 278 },
  { name: "Page E", uv: 189 },
  { name: "Page F", uv: 239 },
  { name: "Page G", uv: 349 },
];

const SavingsChart = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid stroke="#E7E7E7" strokeDasharray="5 5" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip cursor={{ fill: "#E7E7E7" }} />
        <Bar type="monotone" dataKey="uv" fill="#FFC700" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default SavingsChart;
