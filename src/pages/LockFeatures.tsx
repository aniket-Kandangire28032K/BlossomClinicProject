import { FaLock,FaWhatsapp,FaSms } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
const LockFeatures = () => {
  const location = useLocation();
  const loc = location.pathname.replace("/", "");

  return (
    <div className='lock'>
      <div className="lock-container">
        <span>{loc === 'whatsapp'?<FaWhatsapp /> : < FaSms color="#008fff"/> }<FaLock className="icon" size={30} color="gold"/></span>
        <h1>This Feature is Currently Disabled</h1>
        <Link to='/home'>Home</Link>
      </div>
    </div>
  )
}

export default LockFeatures