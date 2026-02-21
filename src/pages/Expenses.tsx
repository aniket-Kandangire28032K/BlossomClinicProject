import axios from "axios";
import { useState,useEffect } from "react";
import { toast } from "react-toastify";

type Staff = {
  name: string;
  salary: Number;
};

type OtherExpense = {
  title: string;
  amount: Number;
};

function Expense() {
  const URL = import.meta.env.VITE_Backend_URL;
  const [rent, setRent] = useState("");
  const [electricity, setElectricity] = useState("");
  const [expenses,setExpencess] = useState([])
  const [staff, setStaff] = useState<Staff[]>([
    // { name: "", salary: "" }
  ]);

  const [otherExpenses, setOtherExpenses] = useState<OtherExpense[]>([
    // { title: "", amount: "" }
  ]);
  const [staffList,setStaffList] = useState([])

  const getStaff = async () => {
    try {
      const res =await axios.get(`${URL}/staff`)
      console.log(res.data.staff)
      setStaffList(res.data.staff)
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(()=>{
    getStaff();
  },[])
  // * Get expencess ---------------
  const getexpencess = async () => {
    try {
      const res =await axios.get(`${URL}/expenses`);
      setExpencess(res.data)
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(()=>{
    getexpencess();
  },[])
  // * ---------- Staff ----------
  const addStaff = () => {
    setStaff([...staff, { name: "", salary: 0 }]);
  };

  const removeStaff = (index: number) => {
    setStaff(staff.filter((_, i) => i !== index));
  };

  const handleStaffChange = (
    index: number,
    field: keyof Staff,
    value: String | Number
  ) => {
    const updated = [...staff];
    updated[index] ={
      ...updated[index],
      [field]:value,
    };
    setStaff(updated);
  };

  // * ---------- Other Expenses ----------
  const addOtherExpense = () => {
    setOtherExpenses([...otherExpenses, { title: "", amount: 0 }]);
  };

  const removeOtherExpense = (index: number) => {
    setOtherExpenses(otherExpenses.filter((_, i) => i !== index));
  };

  const handleOtherChange = (
    index: number,
    field: keyof OtherExpense,
    value: String | Number
  ) => {
    const updated = [...otherExpenses];
    updated[index]={
    ...updated[index],
    [field]:value
  };
    setOtherExpenses(updated);
  };

  // * ---------- Submit ----------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let data ={
    }
    if(otherExpenses.length == 0){
       data = {
      rent:Number(rent),
      electricity:Number(electricity),
      staff,
      otherExpenses:[],
      total:Number(staff.reduce((sum:number,item:any)=> sum + item.salary,0) + Number(rent) + Number(electricity))
    }
  }
    else{
      data = {
        rent:Number(rent),
        electricity:Number(electricity),
        staff,
        otherExpenses,
        total:Number(staff.reduce((sum:number,item:any)=> sum + item.salary,0)) + Number(rent) + Number(electricity) + Number(otherExpenses.reduce((sum:number,item:any)=> sum + item.amount,0))
      };
    }
    try {
      const res = await axios.post(`${URL}/expenses`,data);
      console.log(res.data);
      toast.success('Expense Added')
    } catch (error) {
      console.log(error);
      toast.error('Internal Server Error')
    }finally{
      setElectricity("");
      setOtherExpenses([]);
      setRent("");
      setStaff([]);
    }
  };

  return (
    <div className="expenses">
      <h1>Expense</h1>
    <form onSubmit={handleSubmit} style={{ maxWidth: 500 }}>
        <p>Enter Expenses</p>
      {/* Rent */}
      <input
        type="number"
        placeholder="Rent*" required
        value={rent}
        onChange={(e) => setRent(e.target.value)}
      />

      {/* Electricity */}
      <input
        type="number"
        placeholder="Electricity Bill*" required
        value={electricity}
        onChange={(e) => setElectricity(e.target.value)}
      />

      {/* Staff */}
      <h3>Staff</h3>
      {staff.map((person:any, index) => (
        <div key={index} style={{ marginBottom: 8 }}>
          {/* <input
            type="text"
            placeholder="Staff Name"
            value={person.name}
            onChange={(e) =>
              handleStaffChange(index, "name", e.target.value)
            }
          /> */}
          <select id="" value={person.name} onChange={(e) =>
              handleStaffChange(index, "name", e.target.value)
            }>
            {staffList.length > 0 &&
              staffList.map((item)=>(
                <option value={item?.fullname}>{item?.fullname}</option>
              ))
            }
          </select>
          <input
            type="number"
            placeholder="Salary"
            value={person.salary}
            onChange={(e) =>
              handleStaffChange(index, "salary", Number(e.target.value))
            }
          />
          <button
            type="button"
            onClick={() => removeStaff(index)}
          >
            ❌
          </button>
        </div>
      ))}
      <button type="button" onClick={addStaff}>
        + Add Staff
      </button>

      {/* Other Expenses */}
      <h3>Other Expenses</h3>
      {otherExpenses.map((expense:any, index) => (
        <div key={index} style={{ marginBottom: 8 }}>
          <input
            type="text"
            placeholder="Expense Name"
            value={expense.title}
            onChange={(e) =>
              handleOtherChange(index, "title", e.target.value)
            }
          />
          <input
            type="number"
            placeholder="Amount"
            value={expense.amount}
            onChange={(e) =>
              handleOtherChange(index, "amount", Number(e.target.value))
            }
          />
          <button
            type="button"
            onClick={() => removeOtherExpense(index)}
          >
            ❌
          </button>
        </div>
      ))}
      <button type="button" onClick={addOtherExpense}>
        + Add Other Expense
      </button>
      <button type="submit">Submit</button>
    </form>
    {expenses.length > 0 && <table border={1}>
      <thead>
        <tr>
          <th>No.</th>
          <th>Date</th>
          <th>Rent</th>
          <th>Elec</th>
          <th>Staff</th>
          <th>Other</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        { expenses.map((item:any,num:number)=>(
          <tr key={item._id}>
            <td>{num+1}</td>
            <td>{item.date}</td>
            <td>{item.rent}</td>
            <td>{item.electricity}</td>
            <td>{item.staff.map((st:any,num:number)=>(
              <ul key={num}>
                <li>{st.name} ₹. {st.salary}</li>
              </ul>
            ))}</td>
            <td>{item.otherExpenses.map((ex:any,num:number)=>(
              <ul key={num}>
                <li>{ex.title} ₹. {ex.amount}</li>
              </ul>
            ))}</td>
            <td>{item.total}</td>
          </tr>
        ))
        }
      </tbody>
      </table>}
   </div> 
  );
}

export default Expense;
