import { Bar } from "react-chartjs-2";
import {
  Chart,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const PieChart = ({ chartdata }: any) => {
  if (!chartdata) return <p>Loading...</p>;
  const data: any = {
    labels: [
      "Product Total",
      "Treatment Total",
      "Consultation Total",
      "Grand Total",
    ],
    datasets: [
      {
        data: Object.values(chartdata),
        backgroundColor: [
          "#ff6384",
          "#36A2EB",
          "#FFCE56",
          "#4CAF50",
          "#9C27B0",
        ],
      },
    ],
  };
  const options = {
  plugins: {
    legend: {
      display: false,
    },
     responsive:true,
    maintainAspectRatio:false
  },
};
  return (
    <div className="pie-chart">
      <Bar data={data} options={options}/>
    </div>
  );
};

export default PieChart;
