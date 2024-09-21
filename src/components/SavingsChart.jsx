import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import PropTypes from "prop-types";

const SavingsChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid stroke="#E7E7E7" strokeDasharray="5 5" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip cursor={{ fill: "#E7E7E7" }} />
        <Bar type="monotone" dataKey="存款金額" fill="#FFC700" />
      </BarChart>
    </ResponsiveContainer>
  );
};

SavingsChart.propTypes = {
  data: PropTypes.array.isRequired,
};

export default SavingsChart;
