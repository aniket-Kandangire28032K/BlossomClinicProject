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

const MRreport = ({month}:any) => {
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
  // const [dataMonth, setDataMonth] = useState(month);
  const dataMonth = month;
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
  // useEffect(()=>{
  //   setDataMonth(month.split("-").reverse().join("/"))
  //   console.log(month)
  // },[month])
  
  // ---- GET DATA ----
  useEffect(() => {
    getMR();
    handleSubmit();
  }, [month]);

  // ---- FILTER WHEN SUBMIT ----
  const handleSubmit = () => {
    // e.preventDefault();
    if (!dataMonth) return;
    // input: 2026-01
    // const [month, year] = dataMonth.split("-");
    // const monthString = `${month}/${year}`; // 01/2026
    const result = mrList.filter((item) => item?.date?.includes(dataMonth));

    // setFiltered(result);

    // totals
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
  };

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
      {dataMonth  &&
      <div className="chart">
          <h3 style={{ textAlign: "center"}}>MR Report</h3>
         <Bar data={chartData} />
      </div>}
    </div>
  );
};

export default MRreport;
