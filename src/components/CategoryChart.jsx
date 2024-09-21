import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const data = [
  { name: "Group A", value: 400 },
  { name: "Group B", value: 300 },
  { name: "Group C", value: 300 },
  { name: "Group D", value: 200 },
  { name: "Group E", value: 200 },
  { name: "Group F", value: 100 },
  { name: "Group G", value: 250 },
  { name: "Group H", value: 200 },
];

const COLORS = ["#FF6961", "#FFB480", "#FFE552", "#42D6A4", "#08CAD1", "#59ADF6", "#9D94FF", "#C780E8"];

const CategoryChart = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie data={data} cx="50%" cy="50%" innerRadius={80} outerRadius={160} fill="#8884d8" dataKey="value" label>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
};
export default CategoryChart;
