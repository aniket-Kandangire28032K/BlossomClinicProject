import axios from "axios";
import dayjs from "dayjs"
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Reminders = () => {
  const URL = import.meta.env.VITE_Backend_URL;
  // const [patientList,setPatientList]=useState([]);
  const [todaysList,setTodaysList] = useState<any>([]);
  const [tomorrowList,setTomorrowList] = useState<any>([]);
  const today=dayjs();
  const tomorrow=dayjs().add(1,'day');
  // console.log(today.format('DD-MM-YYYY'))
  // console.log(tomorrow.format('DD-MM-YYYY'))
  
  const getList=async () => {
    // get All Patient's Prescriptions
    try {
      const res= await axios.get(`${URL}/prescription`);
      // setPatientList(res.data)
      fileterByDates(res.data)
    } catch (error) {
      console.log(error)
      toast.warning('internal Server Error');
    }
  }
  const fileterByDates = (list: any[]) => {
  const todayStr = today.format('DD-MM-YYYY');       // matches "26-11-2025"
  const tomorrowStr = tomorrow.format('DD-MM-YYYY');

  const result = list.filter(
    (e: any) => e.nextAppointmentDate === todayStr
  );
  setTodaysList(result);

  const dayafterList = list.filter(
    (e: any) => e.nextAppointmentDate === tomorrowStr
  );
  setTomorrowList(dayafterList);
};
  useEffect(()=>{
    getList();    
  },[])
  return (
    <div className="reminders">
        <h1>Appointment</h1>
        <div className="container-1">
          <h3>Today's Appointment</h3>
          {
            todaysList.length > 0 && todaysList.map((e:any,index:number)=>(
              <div key={index} className="card">
                 <p><strong>Patient:</strong> {e.patientname}</p> 
                 <p>Appointment Date: {e.nextAppointmentDate}</p> 
              </div>
            ))
          }
        </div>
        <div className="container-2">
          <h3>Next Day's Appointment</h3>
          {
            tomorrowList.length > 0 && tomorrowList.map((e:any,index:number)=>(
              <div key={index} className="card">
                 <p><strong>Patient:</strong> {e.patientname}</p> 
                 <p>Appointment Date: {e.nextAppointmentDate}</p> 
              </div>
            ))
          }
        </div>
    </div>
  )
}

export default Reminders