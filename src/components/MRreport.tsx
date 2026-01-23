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

const MRreport = () => {
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
  const [dataMonth, setDataMonth] = useState("");
  const [mrList, setMrList] = useState<MR[]>([]);
  const [filtered, setFiltered] = useState<MR[]>([]);
  const [totals, setTotals] = useState({
    paid: 0,
    due: 0,
    total: 0,
  });

  // ---- GET DATA ----
  useEffect(() => {
    const getMR = async () => {
      try {
        const res = await axios.get(`${URL}/mrlist`);
        setMrList(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    getMR();
  }, []);

  // ---- FILTER WHEN SUBMIT ----
  const handleSubmit = (e: any) => {
    e.preventDefault();

    if (!dataMonth) return;

    // input: 2026-01
    const [year, month] = dataMonth.split("-");
    const monthString = `${month}/${year}`; // 01/2026

    const result = mrList.filter((item) => item?.date?.includes(monthString));

    setFiltered(result);

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

  // ---- CHART DATA ----
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
  console.log(filtered)
  return (
    <div className="mr-report">
      <h2 style={{ textAlign: "center" }}>MR Report</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="month"
          value={dataMonth}
          onChange={(e) => setDataMonth(e.target.value)}
        />
        <button type="submit" style={{ marginLeft: "10px" }}>
          Submit
        </button>
        <button
          type="reset"
          style={{ marginLeft: "10px" }}
          onClick={() => {
            setDataMonth("");
            setFiltered([]);
            setTotals({ paid: 0, due: 0, total: 0 });
          }}
        >
          Clear
        </button>
      </form>

      {/* Chart */}
      <div className="chart">
        {dataMonth && <Bar data={chartData} />}
      </div>

      {/* Totals
      <div style={{ marginTop: "20px" }}>
        <h4>Summary</h4>
        <span>Paid: {totals.paid}</span>
        <span>Due: {totals.due}</span>
        <span>Total: {totals.total}</span>
      </div> */}
    </div>
  );
};

export default MRreport;
