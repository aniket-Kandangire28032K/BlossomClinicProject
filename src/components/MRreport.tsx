import axios from "axios";
import { useState, useEffect } from "react";
import "./Components.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const MRreport = ({dates}:any) => {
  const URL = import.meta.env.VITE_Backend_URL;
  type MR = {
    companyname: string;
    mrname: string;
    contact: string;
    email: string;
    productlist: string;
    paidamount: number;
    dueamount: number;
    totalamount: number;
    date: string;
  };
  // const datadates = dates;
  const [mrList, setMrList] = useState<MR[]>([]);
  const [totals, setTotals] = useState({
    paid: 0,
    due: 0,
    total: 0,
  });
  const getMR = async () => {
    try {
      const res = await axios.get(`${URL}/mrlist`);
      setMrList(res.data);
    } catch (err) {
      console.log(err);
    }
  };  
  // ---- GET DATA ----
  useEffect(() => {
    getMR();
    // handleSubmit();
  }, [dates]);

  useEffect(() => {
  if (!dates || mrList.length === 0) return;

  const result = mrList.filter((item) =>
    dates.includes(item.date)
  );

  const sums = result.reduce(
    (acc, item) => {
      acc.paid += Number(item?.paidamount || 0);
      acc.due += Number(item?.dueamount || 0);
      acc.total += Number(item?.totalamount || 0);
      return acc;
    },
    { paid: 0, due: 0, total: 0 }
  );

  setTotals(sums);
}, [dates, mrList]);

  // ---- FILTER WHEN SUBMIT ----
  // const handleSubmit = () => {
  //   // e.preventDefault();
  //   if (!datadates) return;
  //   const result = mrList.filter((item) => dates.includes(item.date));

  //   // setFiltered(result);

  //   // totals
  //   const sums = result.reduce(
  //     (acc, item) => {
  //       acc.paid += Number(item?.paidamount || 0);
  //       acc.due += Number(item?.dueamount || 0);
  //       acc.total += Number(item?.totalamount || 0);
  //       return acc;
  //     },
  //     { paid: 0, due: 0, total: 0 }
  //   );

  //   setTotals(sums);
  // };

  //   ---- CHART DATA ----
  const chartData = {
    labels: ["Paid", "Due", "Total"],
    datasets: [
      {
        label: "Monthly Report",
        data: [totals.paid, totals.due, totals.total],
        backgroundColor: ["#4ade80", "#f87171", "#60a5fa"],
      },
    ],
  };
  return (
    <div className="mr-report">
      {
      <div className="chart">
          <h3 style={{ textAlign: "center"}}>MR Report</h3>
         <Bar data={chartData} />
      </div>}
    </div>
  );
};

export default MRreport;
