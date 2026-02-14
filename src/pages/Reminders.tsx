import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Reminders = () => {
  const URL = import.meta.env.VITE_Backend_URL;
  const [patientList, setPatientList] = useState([]);
  const [currentMonth,setCurrentMonth] = useState([]);
  const [filteredData, setFilterdData] = useState([]);

  const getList = async () => {
    // get All Patient's Prescriptions
    try {
      const res = await axios.get(`${URL}/prescription`);
      // console.log(res.data);
      setPatientList(() =>
        res.data.filter(
          (item: any) => item.nextAppointmentDate !== "No Appointment",
        ),
      );
    } catch (error) {
      console.log(error);
      toast.warning("internal Server Error");
    }
  };
  const handleChange = (e: any) => {
    const data = e.target.value;
    if (!data) {
      return;
    }
    const date = data.split("-").reverse().join("/");
    let list = patientList.filter(
      (item: any) => item.nextAppointmentDate === date,
    );
    if(list.length === 0){
      toast.info(`No Appointments on ${date}`)
    }
    setFilterdData(list);
  };
  useEffect(() => {
    getList();
  }, []);
  
  useEffect(() => {
    const date = new Date();
    const month = `${date.getMonth() + 1}/${date.getFullYear()}`;
    setCurrentMonth(
      patientList.filter((item: any) =>
        item.nextAppointmentDate.includes(month),
      ),
    );
  }, [patientList]);
  return (
    <div className="reminders">
      <h1>Appointments</h1>
      <div className="btn-grp">
        <input type="date" onChange={handleChange} />
        <button type="button" onClick={()=> setFilterdData([])}>
          Clear
        </button>
      </div>
      <div className="table-wrapper">
        <table border={1}>
          <thead>
            <tr>
              <th>No</th>
              <th>Date</th>
              <th>Name</th>
              <th>OPD NO.</th>
              <th>Appointmnet Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 &&
              filteredData.map((item: any, num: number) => (
                <tr key={item._id}   style={{backgroundColor:"#f0f8ff",fontWeight:"bold"}}>
                  <td>{num + 1}</td>
                  <td>{item.date}</td>
                  <td style={{ textTransform: "capitalize" }}>
                    {item.patientname}
                  </td>
                  <td>{item.opdno}</td>
                  <td>{item.nextAppointmentDate}</td>
                </tr>
              ))}
              {filteredData.length > 0 && <br /> }
            {currentMonth.map((item: any, num: number) => (
              <tr key={item._id}>
                <td>{num + 1}</td>
                <td>{item.date}</td>
                <td style={{ textTransform: "capitalize" }}>
                  {item.patientname}
                </td>
                <td>{item.opdno}</td>
                <td>{item.nextAppointmentDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reminders;
