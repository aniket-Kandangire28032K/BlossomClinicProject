import { Suspense } from "react";
import "./App.css";

import Main from "./layout/Main";
import Nav from "./layout/Nav";
import { Bounce, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "./layout/Loader";
function App() {

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover={false}
        theme="colored"
        transition={Bounce}
      />
      <Suspense fallback={<Loader/>}>
      <nav className="Navbar">
        <Nav />
      </nav>
        <main className="Main">
          <Main />
        </main>
      </Suspense>
    </>
  );
}

export default App;
