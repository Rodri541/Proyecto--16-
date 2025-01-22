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
};

export default Dashboard;