import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import PropTypes from "prop-types";

const TypeChart = ({ typeData, habitType }) => {
  const data = Object.keys(typeData)
    .map((key) => {
      const type = habitType.find((type) => type.id === key);
      if (type) {
        return {
          name: type.name,
          value: typeData[key],
        };
      }
      return null;
    })
    .filter((item) => item !== null);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie data={data} cx="50%" cy="50%" innerRadius={80} outerRadius={160} fill="#8884d8" dataKey="value" label>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={habitType.find((type) => type.name === entry.name).color} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
};

TypeChart.propTypes = {
  typeData: PropTypes.object.isRequired,
  habitType: PropTypes.array.isRequired,
};

export default TypeChart;
