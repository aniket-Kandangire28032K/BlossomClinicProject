import axios from "axios";
import { useEffect, useState } from "react";
import BarChart from "../assets/charts/BarChart";
import { MdFileDownload } from "react-icons/md";
import * as xlsx from "xlsx";
import PieChart from "../assets/charts/PieChart";
import MRreport from "../components/MRreport";

const Sales = () => {
  const URL = import.meta.env.VITE_Backend_URL;
  const [presData, setPresData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [day, setDay] = useState<number>(0);
  const [month, setMonth] = useState("");
  const [totals, setTotals] = useState({
    tretmentTotal: 0,
    productTotal: 0,
    consultTotal: 0,
    GrandTotal: 0,
  });
  const getData = async () => {
    // Get Prescription Data from Backend
    try {
      let res = await axios.get(`${URL}/prescription`);
      setPresData(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const filterMointh = (e: any) => {
    e.preventDefault();
    // let month = e.target.value;
    // console.log(month)
    let date = month.split("-").reverse().join("/");
    if (day) {
      let newDate = `${String(day).padStart(2,"0")}/${date}`;
      date = newDate;
    }
    console.log(date)
    setMonth(date);
    let filteredData = presData.filter((item: any) => item.date.includes(date));
    setFilteredData(filteredData);
  };
  useEffect(() => {
    getData();
    // getMRData();
  }, []);

  const DownloadFile = () => {
    const table = document.getElementById("sales-table");
    const workScheet = xlsx.utils.table_to_sheet(table);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, workScheet, "sheet1");
    xlsx.writeFile(workbook, `${month} sales Data.xlsx`);
  };
  useEffect(() => {
    let productTotalCost = filteredData.reduce(
      (acc: number, item: any) => (acc = acc + Number(item.productCost || 0)),
      0
    );
    let treatmentTotalCost = filteredData.reduce(
      (acc: number, item: any) => (acc = acc + Number(item.treatmentCost || 0)),
      0
    );
    let overallTotalCost = filteredData.reduce(
      (acc: number, item: any) => (acc = acc + Number(item.totalCost || 0)),
      0
    );
    let consoultFeeTotal = filteredData.reduce(
      (acc: number, item: any) => (acc = acc + Number(item.consultFee || 0)),
      0
    );

    setTotals({
      productTotal: productTotalCost,
      tretmentTotal: treatmentTotalCost,
      consultTotal: consoultFeeTotal,
      GrandTotal: overallTotalCost,
    });
  }, [filteredData]);
  return (
    <div className="sales-report">
      <h1>Sales Report</h1>
      
      <form onSubmit={filterMointh}>
        <label>Day:</label>
        <input type="number" max={31} min={0} placeholder="Select Day" value={day} onChange={(e) =>{setDay(Number(e.target.value))} }/>
        <label>Select Month: </label>
        <input type="month" value={month} onChange={(e:any)=> setMonth(e.target.value)}/>
        <button type="submit">Filter</button>
        <button type="reset" onClick={() => {setFilteredData([]); setDay(0)}}>
          Clear
        </button>
      </form>
      {filteredData.length > 0 && <BarChart data={filteredData} />}
      {totals.GrandTotal > 0 && <PieChart chartdata={totals} />}

      {filteredData.length > 0 && (
        <table border={1} id="sales-table">
          <thead>
            <tr>
              <th>No.</th>
              <th>Date</th>
              <th>Patient Name</th>
              <th>Products</th>
              <th>Treatment</th>
              <th>consult Fee</th>
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
                  <ol>
                    {item.treatments.map((e: any, num: number) => (
                      <li key={num}>
                        {e.name}: ₹{e.price}
                      </li>
                    ))}
                  </ol>
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
              <td>Consolt Total:₹{totals.consultTotal}</td>
              <td>Grand Total:₹{totals.GrandTotal}</td>
            </tr>
          </tfoot>
        </table>
      )}
      {filteredData.length > 0 && (
        <button className="download-button" onClick={DownloadFile}>
          <MdFileDownload className="icon" />
          Download
        </button>
      )}
      <MRreport/>
    </div>
  );
};

export default Sales;
