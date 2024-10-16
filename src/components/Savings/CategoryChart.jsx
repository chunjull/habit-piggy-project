import PropTypes from "prop-types";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

const CategoryChart = ({ categoryData, habitCategories }) => {
  const data = Object.keys(categoryData).map((key) => ({
    name: habitCategories.find((category) => category.id === parseInt(key)).name,
    value: categoryData[key],
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie data={data} cx="50%" cy="50%" innerRadius={80} outerRadius={160} fill="#8884d8" dataKey="value" label>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={habitCategories.find((category) => category.name === entry.name).color} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
};

CategoryChart.propTypes = {
  categoryData: PropTypes.object.isRequired,
  habitCategories: PropTypes.array.isRequired,
};

export default CategoryChart;
