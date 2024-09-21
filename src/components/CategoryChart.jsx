import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import PropTypes from "prop-types";

const COLORS = ["#FF6961", "#FFB480", "#FFE552", "#42D6A4", "#08CAD1", "#59ADF6", "#9D94FF", "#C780E8"];

const CategoryChart = ({ categoryData }) => {
  const data = Object.keys(categoryData).map((key) => ({
    name: key,
    value: categoryData[key],
  }));

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

CategoryChart.propTypes = {
  categoryData: PropTypes.object.isRequired,
};

export default CategoryChart;
