import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Legend,
  Tooltip,
} from "chart.js";
import { useEffect } from "react";
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
        label: "Prescriptions Chart",
        data: values,
        backgroundColor: "#005fff",
        barThickness: 20,
        
      },
    ],
  };
  const option = {
    responsive:true,
    maintainAspectRatio:false
  }
  useEffect(()=>{
    if(!data) return
},[data])

return (
    <div className="main-chart">
      <Bar data={chartData} options={option}/>
    </div>
  );
};

export default BarChart;
