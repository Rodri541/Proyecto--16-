import { Navbar, Sidebar } from "../components"; 

const Dashboard = () => {
    return (
        <>
            <div className="main-container">
                <Navbar />
                <div className="dashboard-content">
                    <Sidebar /> 
                </div>
            </div>
        </>
    );
};

export default Dashboard;