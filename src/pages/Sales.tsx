import axios from "axios";
import { useEffect, useState } from "react";
// import BarChart from "../assets/charts/BarChart";
import { MdFileDownload } from "react-icons/md";
import * as xlsx from "xlsx";
import PieChart from "../assets/charts/PieChart";
import MRreport from "../components/MRreport";
import ExpensesChart from "../components/ExpensesChart";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend);

const Sales = () => {
  const URL = import.meta.env.VITE_Backend_URL;
  const [presData, setPresData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [totals, setTotals] = useState({
    tretmentTotal: 0,
    productTotal: 0,
    consultTotal: 0,
    GrandTotal: 0,
  });
  const [formData, setFormData] = useState<any>({
    startDate: "",
    endDate: "",
  });
  const [filteredDates, setFilteredDates] = useState<string[]>([]);
  const [dataTotal, setDataTotal] = useState({
    mrTotal: 0,
    expencessTotal: 0,
  });

  const getData = async () => {
    try {
      let res = await axios.get(`${URL}/prescription`);
      setPresData(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  //  * --------------------------------------------------------
  const getDates = () => {
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);

    if (start > end) return;

    const dates: string[] = [];
    const current = new Date(start);

    while (current <= end) {
      dates.push(formatDate(current));
      current.setDate(current.getDate() + 1);
    }
    setFilteredDates(dates);
  };

  useEffect(() => {
    getDates();
  }, [formData.endDate]);

  const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear());
    return `${day}/${month}/${year}`;
  };

  // & Pie Chart Data of profit and loss _________________________________________________________________________________
  const PieData = {
    labels: ["Profit", "Loss"],
    datasets: [
      {
        // label:"Profit And Loss",
        data: [
          totals.GrandTotal,
          Number(Number(dataTotal.expencessTotal) + Number(dataTotal.mrTotal)),
        ],
        backgroundColor: ["#00FF7F", "#e25c5e"],
      },
    ],
  };
  useEffect(() => {
    let start: Date;
    let end: Date;

    // 👉 If user selected dates
    if (formData.startDate && formData.endDate) {
      start = new Date(formData.startDate);
      end = new Date(formData.endDate);
    } else {
      // 👉 Default = current month
      const now = new Date();
      start = new Date(now.getFullYear(), now.getMonth(), 1); // 1st day
      end = new Date(now.getFullYear(), now.getMonth() + 1, 0); // last day
    }

    const logs = presData.filter((item: any) => {
      if (!item.date) return false;

      const parts = item.date.split("/");
      if (parts.length !== 3) return false;

      const itemDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);

      return itemDate >= start && itemDate <= end;
    });

    setFilteredData(logs);
  }, [formData.startDate, formData.endDate, presData]);
  useEffect(() => {
    getData();
  }, []);

  const DownloadFile = () => {
    const table = document.getElementById("sales-table");
    const workScheet = xlsx.utils.table_to_sheet(table);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, workScheet, "sheet1");
    xlsx.writeFile(workbook, `sales Data.xlsx`);
  };
  useEffect(() => {
    let productTotalCost = filteredData.reduce(
      (acc: number, item: any) => (acc = acc + Number(item.productCost || 0)),
      0,
    );
    let treatmentTotalCost = filteredData.reduce(
      (acc: number, item: any) => (acc = acc + Number(item.treatmentCost || 0)),
      0,
    );
    let overallTotalCost = filteredData.reduce(
      (acc: number, item: any) => (acc = acc + Number(item.totalCost || 0)),
      0,
    );
    let consoultFeeTotal = filteredData.reduce(
      (acc: number, item: any) => (acc = acc + Number(item.consultFee || 0)),
      0,
    );

    setTotals({
      productTotal: productTotalCost,
      tretmentTotal: treatmentTotalCost,
      consultTotal: consoultFeeTotal,
      GrandTotal: overallTotalCost,
    });
  }, [filteredData]);

  const resetFun = () => {
    setFormData({
    startDate: "",
    endDate: "",
  });

  setFilteredDates([]);
  };
  return (
    <div className="sales-report">
      <h1>Sales Report</h1>
      <form>
        <label>Start Date:</label>
        <input
          type="date"
          onChange={(e: any) =>
            setFormData({ ...formData, startDate: e.target.value })
          }
        />
        <label>End Date:</label>
        <input
          type="date"
          onChange={(e: any) =>
            setFormData({ ...formData, endDate: e.target.value })
          }
        />
        <button type="reset" onClick={resetFun}>
          Clear
        </button>
      </form>
      
      {totals.GrandTotal > 0 && <PieChart chartdata={totals} />}

      <MRreport dates={filteredDates} setDataTotal={setDataTotal} />
      <ExpensesChart dates={filteredDates} setDataTotal={setDataTotal} />
      <div className="profits-chart">
        <Pie data={PieData} />
      </div>
      {filteredData.length > 0 && (
        <div className="table-wrapper">
          <table border={1} id="sales-table">
            <thead>
              <tr>
                <th>No.</th>
                <th>Date</th>
                <th>Patient Name</th>
                <th>Products</th>
                <th>Treatment</th>
                <th>Consult Fee</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item: any, index: number) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.date}</td>
                  <td>{item.patientname}</td>
                  <td>
                    <ol>
                      {item.products.map((e: any, num: number) => (
                        <li key={num}>
                          {e.name}: ₹{e.price}
                        </li>
                      ))}
                    </ol>
                  </td>
                  <td>
                    {item.treatments.length > 0 ? (
                      <ol>
                        {item.treatments.map((e: any, num: number) => (
                          <li key={num}>
                            {e.name}: ₹{e.price}
                          </li>
                        ))}
                      </ol>
                    ) : (
                      "No Treatment"
                    )}
                  </td>
                  <td>₹{item.consultFee}</td>
                  <td>₹{item.totalCost}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td>Product Total:₹ {totals.productTotal}</td>
                <td>Treatment Total:₹{totals.tretmentTotal}</td>
                <td>Consult Total:₹{totals.consultTotal}</td>
                <td>Grand Total:₹{totals.GrandTotal}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      {filteredData.length > 0 && (
        <button className="download-button" onClick={DownloadFile}>
          <MdFileDownload className="icon" />
          Download
        </button>
      )}
    </div>
  );
};

export default Sales;
