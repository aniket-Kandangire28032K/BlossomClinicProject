import axios from "axios";
import { useEffect, useState, useRef } from "react";

const PrescriptionPage = () => {
  const URL = import.meta.env.VITE_Backend_URL;
  const [list, setList] = useState([]);
  const inputDateRef = useRef<HTMLInputElement>(null);
  const getAllPrescriptions = async () => {
    try {
      const res = await axios.get(`${URL}/prescription`);
      // console.log(res.data);

      setList(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getAllPrescriptions();
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    // getAllPrescriptions();
    const value = inputDateRef.current?.value;
    const date = value?.split("-").reverse().join("/");
    const filteredData = list.filter((item: any) => item.date === date);
    setList(filteredData);
  };


  return (
    <div className="prescriptions">
      <h1>Prescriptions</h1>
      <form onSubmit={(e) => handleSubmit(e)}>
        <input type="date" id="datevalue" ref={inputDateRef} onChange={getAllPrescriptions} />
        <button type="submit">Search</button>
        <button type="reset" onClick={()=> {getAllPrescriptions();}}>
          Clear
        </button>
      </form>
      <div className="prescription-list">
        {list.length > 0 &&
          list.map((e: any, i: number) => (
            <div key={i} className="card">
              <p>Date: {e.date}</p>
              <p>Patient Name: {e.patientname}</p>
              <p>Patient OPD NO.:-{e.opdno}</p>
              <table className="data-list" border={1}>
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Name</th>
                    <th>Qty</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {e?.products?.length > 0 &&
                    e.products.map((item: any, index: number) => (
                      <tr key={index} className="data">
                        <td>{index + 1}</td>
                        <td>{item.name}</td>
                        <td>{item.qty}</td>
                        <td>{item.price}</td>
                      </tr>
                    ))}
                    {e?.products?.length == 0 && <tr> <td></td><td>No Record Found</td></tr>}
                </tbody>
              </table>
              {/* <div className="">
                <p>treatments</p>
                {e?.treatment?.length > 0 &&
                  e.treatment.map((treat: any, index: number) => (
                    <div key={index} className="data">
                      <p>Name: {treat.name}</p>
                      <p>Price: {treat.price}</p>
                    </div>
                  ))}
              </div> */}
            </div>
          ))}
      </div>
    </div>
  );
};

export default PrescriptionPage;
