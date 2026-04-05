import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { IoClose } from "react-icons/io5";
import { MdOutlineUpdate } from "react-icons/md";

const Reminders = () => {
  const URL = import.meta.env.VITE_Backend_URL;
  interface objecttype {
    _id: string;
    patientname: string;
    nextAppointmentDate: string;
  }
  type datestate = {
    startdate: string;
    enddate: string;
  };
  const [patientList, setPatientList] = useState([]);
  const [currentMonth, setCurrentMonth] = useState([]);
  console.log(currentMonth)
  const [filteredData, setFilterdData] = useState([]);
  const [display, setDisplay] = useState(false);
  const [object, setObject] = useState<objecttype | null>(null);
  const [date, setDate] = useState("");   // Reschedule Date
  const [dates, setDates] = useState<datestate>({   //search Dates
    startdate: "",
    enddate: "",
  }); 
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

  const displayform = (item: any) => {
    console.log(item);
    setObject({ ...item });
    setDisplay(!display);
  };
  const closeform = () => {
    setDisplay(!display);
    setDate("");
  };

  const updateschedule = async (e: any) => {
    e.preventDefault();
    let nextAppointmentDate = date.split("-").reverse().join("/");
    try {
      await axios.patch(`${URL}/prescription/${object?._id}`, {
        nextAppointmentDate,
      });
      toast.success("Appointment Rescheduled");
    } catch (error) {
      console.log(error);
    } finally {
      setDisplay(!display);
      setDate("");
      getList();
    }
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

  const getfilteredData = async () => {
    let array = [];
    let start = new Date(dates.startdate);
    let end = new Date(dates.enddate);

    while (start <= end) {
      array.push(new Date(start));
      start.setDate(start.getDate() + 1);
    }
    let newDates = array.map((item) =>
      item.toISOString().split("T")[0].split("-").reverse().join("/"),
    );
    let list = patientList.filter((item: any) =>
      newDates.includes(item.nextAppointmentDate),
    );
    setFilterdData(list);
  };
  useEffect(() => {
    getfilteredData();
  }, [dates.enddate]);

  const clearfunction = () => {
    setFilterdData([]);
    getList();
    setDates({
      startdate: "",
      enddate: "",
    });
  };
  return (
    <div className="reminders">
      <h1>Appointments</h1>
      <div className="btn-grp">
        <label htmlFor="">Start:</label>
        <input
          type="date"
          value={dates.startdate}
          onChange={(e) => setDates({ ...dates, startdate: e.target.value })}
        />
        <label htmlFor="">End:</label>
        <input
          type="date"
          value={dates.enddate}
          onChange={(e) => setDates({ ...dates, enddate: e.target.value })}
        />
        <button type="reset" onClick={clearfunction}>
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
              <th>OPD No.</th>
              <th>Treatments</th>
              <th>Remaining Amount</th>
              <th>Next Appointment Date</th>
            </tr>
          </thead>
          <tbody>
            {/* Searched By date */}
            {filteredData.length > 0 &&
              filteredData.map((item: any, num: number) => (
                <tr
                  key={item._id}
                  style={{ backgroundColor: "#f0f8ff", fontWeight: "bold" }}
                >
                  <td>{num + 1}</td>
                  <td>{item.date}</td>
                  <td style={{ textTransform: "capitalize" }}>
                    {item.patientname}
                  </td>
                  <td>{item.opdno}</td>
                  <td>                    
                      {item.treatments > 0 ? <table border={1} >
                        
                        <tbody>
                          <tr>
                            <td>Name</td>
                            <td>Sessions</td>
                          </tr>
                          {item.treatments.map((item: any, num: number) => (
                            <tr key={num}>
                              <td>{item.name || "NA"}</td>
                              <td>{item.sessions || "NA"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table> : "No Treatments"}
                  </td>
                  <td>{item.balanceamount || 0}</td>
                  <td>
                    {item.nextAppointmentDate}{" "}
                    <button className="hover" onClick={() => displayform(item)}>
                      <MdOutlineUpdate />
                    </button>
                  </td>
                </tr>
              ))}
            {/* searched my current month */}
            {filteredData.length === 0 &&
              currentMonth.map((item: any, num: number) => (
                <tr key={item._id}>
                  <td>{num + 1}</td>
                  <td>{item.date}</td>
                  <td style={{ textTransform: "capitalize" }}>
                    {item.patientname}
                  </td>
                  <td>{item.opdno}</td>
                  <td>
                   {item?.treatments.length > 0 ? <table className="innertable" border={1} >
                          <thead >
                            <tr>
                            <td>Name</td>
                            <td>Remaining</td>
                            <td>Sessions</td>

                            </tr>
                          </thead>
                          <tbody>

                          {item.treatments.map((item: any, num: number) => (
                            <tr key={num}>
                              <td>{item.name}</td>
                              <td>{Number(item.sessions)-Number(item.completesessions)}</td>
                              <td>{item.sessions}</td>
                            </tr>
                          ))}
                          </tbody>
                        
                      </table> : "No Treatments"}
                  </td>
                  <td>{item.balanceamount || 0}</td>
                  <td>
                    {item.nextAppointmentDate}{" "}
                    <button className="hover" onClick={() => displayform(item)}>
                      <MdOutlineUpdate className="icon"/>Reschedule
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      { display && (
        <div className="overview" onClick={closeform}>
          <form
            className="reschedule-form"
            onClick={(e) => e.stopPropagation()}
            onSubmit={updateschedule}
          >
            <h3>Reschedule Appointment</h3>
            <p>
              Name: <span>{object?.patientname}</span>
            </p>
            <p>
              Appointment Date: <span>{object?.nextAppointmentDate}</span>
            </p>
            <input
              type="date"
              required
              onChange={(e) => setDate(e.target.value)}
              min={0}
            />
            
            <button className="hover" type="submit">
              Update
            </button>
            <button className="hover" type="reset">
              Clear
            </button>
            <button className="close" type="button" onClick={closeform}>
              <IoClose />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Reminders;
