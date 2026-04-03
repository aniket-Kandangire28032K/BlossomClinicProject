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
  Legend,
);

const MRreport = ({ dates, setDataTotal }: any) => {
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
  if (mrList.length === 0) return;

  let result = [];

  // ✅ If dates selected → use them
  if (dates && dates.length > 0) {
    result = mrList.filter((item) => dates.includes(item.date));
  } else {
    // ✅ Default → current month
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    result = mrList.filter((item) => {
      if (!item.date) return false;

      const parts = item.date.split("/");
      if (parts.length !== 3) return false;

      const itemDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);

      return (
        itemDate.getMonth() === currentMonth &&
        itemDate.getFullYear() === currentYear
      );
    });
  }

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

  //   ---- CHART DATA ----
  const chartData = {
    labels: ["MR Report"],
    datasets: [
      {
        label: "Paid",
        data: [totals.paid],
        backgroundColor: "#4ade80",
      },
      {
        label: "Due",
        data: [totals.due],
        backgroundColor: "#f87171",
      },
      {
        label: "Total",
        data: [totals.total],
        backgroundColor: "#60a5fa",
      },
    ],
  };
  useEffect(() => {
    setDataTotal((prev: any) => ({
      ...prev,
      mrTotal: totals.paid,
    }));
  }, [totals.paid]);
  return (
    <div className="mr-report">
      {
        <div className="chart">
          <h3 style={{ textAlign: "center" }}>MR Report</h3>
          <Bar data={chartData} />
        </div>
      }
    </div>
  );
};

export default MRreport;
