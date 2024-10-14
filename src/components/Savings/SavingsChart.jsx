import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import PropTypes from "prop-types";
import { useContext } from "react";
import { AuthContext } from "../../utils/AuthContext";

const SavingsChart = ({ data }) => {
  const { isDarkMode } = useContext(AuthContext);

  const chartStyles = {
    backgroundColor: isDarkMode ? "#333" : "#fff",
    axisColor: isDarkMode ? "#ccc" : "#000",
    gridColor: isDarkMode ? "#888888" : "#D1D1D1",
    tooltipBackgroundColor: isDarkMode ? "#6D6D6D" : "#E7E7E7",
    barColor: "#FFC700",
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ left: -24 }}>
        <CartesianGrid stroke={chartStyles.gridColor} strokeDasharray="5 5" />
        <XAxis dataKey="name" stroke={chartStyles.axisColor} />
        <YAxis stroke={chartStyles.axisColor} />
        <Tooltip cursor={{ fill: chartStyles.tooltipBackgroundColor }} />
        <Bar type="monotone" dataKey="存款金額" fill={chartStyles.barColor} />
      </BarChart>
    </ResponsiveContainer>
  );
};

SavingsChart.propTypes = {
  data: PropTypes.array.isRequired,
};

export default SavingsChart;
