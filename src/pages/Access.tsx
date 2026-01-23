import { useEffect, useState } from "react";

//component import
import CreateAccountForm from "../components/CreateAccountForm";
import DeleteAccountForm from "../components/DeleteAccountForm";
// icons import
import { MdDelete } from "react-icons/md";
import { FaPlus } from "react-icons/fa";
import axios from "axios";


const Access = () => {
  const URL = import.meta.env.VITE_Backend_URL;
  const [newAcc, setNewAcc] = useState(true);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    //get All users
    const getUsers=async ()=> {
      try {
        const res = await axios.get(`${URL}/users/`);
        setUsers(res.data.users);
      } catch (error:any) {
        console.log(error)
      }
    };
    getUsers();
  }, [users]);

  return (
    <div className="account-page">
      <div className="btn-group">
        {!newAcc && (
          <button onClick={() => setNewAcc(true)}>
            <FaPlus className="icon" />
            Create Account
          </button>
        )}
        {newAcc && (
          <button onClick={() => setNewAcc(false)}>
            <MdDelete className="icon" /> Delete Account
          </button>
        )}
      </div>
      {newAcc && <CreateAccountForm />}
      {!newAcc && <DeleteAccountForm />}
      
      <h3>Users</h3>
      {users.length > 0 && (
        <div className="user-list">
          {users.map((user:any, i:number) => (
            <div key={i}>
              <p>User No:{i+1}</p>  
              <p><strong>Email: </strong>{user.email}</p>
              <p><strong>Username: </strong>{user.name}</p>
              <p><strong>Role: </strong>{user.role}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Access;
