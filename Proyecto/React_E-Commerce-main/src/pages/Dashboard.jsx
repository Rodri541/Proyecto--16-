<<<<<<< HEAD
import { Navbar } from "../components";
import Sidebar from "../components/Sidebar";
import "../css/sidebar.css";

const Dashboard = () => {
  return (
    <div className="main-container">
      <Navbar />
      <div className="dashboard">
       
        <Sidebar />
      </div>
    </div>
  );
=======
import { Navbar, Sidebar } from "../components"; 
import "../css/sidebar.css"

const Dashboard = () => {
    return (
        <div>
            <div className="main-container">
                <Navbar />
                <div className="dashboard-content">
                    <Sidebar /> 
                </div>
            </div>
        </div>
    );
>>>>>>> 750a6b834aff33e60be8577a970be584c48f02b3
};

export default Dashboard;
