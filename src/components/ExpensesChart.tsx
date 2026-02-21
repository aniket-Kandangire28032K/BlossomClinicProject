import axios from "axios";
import "./Components.css"
import { useEffect, useState } from "react"
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

interface StaffMember {
  name: string;
  salary: number;
}

interface ExpenseItem {
  date: string;
  rent: number;
  electricity: number;
  staff: StaffMember[];
  otherExpenses: { amount: number }[];
  total: number;
}

const ExpensesChart = ({ dates }: any) => {
  const URL = import.meta.env.VITE_Backend_URL;
  const [reports, setReports] = useState<ExpenseItem[]>([]);
  const [chartValues, setChartValues] = useState({
    rent: 0,
    electricity: 0,
    staff: 0,
    other: 0,
    total: 0
  });

  // Fetch all expenses
  useEffect(() => {
    const getExpenses = async () => {
      try {
        const res = await axios.get(`${URL}/expenses`);
        setReports(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getExpenses();
  }, []);

  // Compute chart data when month or reports change
  useEffect(() => {
    if (!dates || reports.length === 0) return;

    // Filter by month: convert "YYYY-MM" -> "MM/YYYY"
    
    const filtered = reports.filter(item => dates.includes(item.date));

    // Sum all expenses safely
    let rentSum = 0;
    let electricitySum = 0;
    let staffSum = 0;
    let otherSum = 0;

    filtered.forEach(item => {
      rentSum += item.rent || 0;
      electricitySum += item.electricity || 0;
      staffSum += item.staff?.reduce((acc, s) => acc + (s.salary || 0), 0) || 0;
      otherSum += item.otherExpenses?.reduce((acc, o) => acc + (o.amount || 0), 0) || 0;
    });

    setChartValues({
      rent: rentSum,
      electricity: electricitySum,
      staff: staffSum,
      other: otherSum,
      total: rentSum + electricitySum + staffSum + otherSum
    });
  }, [dates, reports]);

  // Chart configuration
  const data = {
    labels: ["Rent", "Electricity", "Staff", "Other", "Total"],
    datasets: [{
      label: "Monthly Expenses",
      data: [
        chartValues.rent,
        chartValues.electricity,
        chartValues.staff,
        chartValues.other,
        chartValues.total
      ],
      backgroundColor: ["#008fff", "#008f8f", "#ff5500", "#ffaa00", "#ff00aa"]
    }]
  };

  return (
    <div className="expenses-chart">
      {dates && <>
      <h3>Monthly Expenses</h3>
      <Bar data={data} />
      </>}
    </div>
  );
};

export default ExpensesChart;
