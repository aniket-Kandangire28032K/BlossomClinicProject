import axios from "axios";
import { useState } from "react";
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

  const [staff, setStaff] = useState<Staff[]>([
    // { name: "", salary: "" }
  ]);

  const [otherExpenses, setOtherExpenses] = useState<OtherExpense[]>([
    // { title: "", amount: "" }
  ]);

  // ---------- Staff ----------
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

  //  ---------- Other Expenses ----------
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
          <input
            type="text"
            placeholder="Staff Name"
            value={person.name}
            onChange={(e) =>
              handleStaffChange(index, "name", e.target.value)
            }
          />
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
   </div> 
  );
}

export default Expense;
