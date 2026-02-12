import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Legend,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Legend,
  Tooltip,
);
const BarChart = ({ data = [] }: any) => {
  const dailyTotals = data.reduce((acc: any, item: any) => {
    const date = item.date;
    const cost = item.totalCost;
    acc[date] = (acc[date] || 0) + Number(cost);
    return acc;
  }, {});

  const labels = Object.keys(dailyTotals);
  const values = Object.values(dailyTotals);

  let chartData = {
    labels: labels,
    datasets: [
      {
        label: "Daily Collections ",
        data: values,
        backgroundColor: "royalblue",
        barThickness: 20,
        
      },
    ],
  };

  return (
    <div className="main-chart">
      <Bar data={chartData}/>
    </div>
  );
};

export default BarChart;
