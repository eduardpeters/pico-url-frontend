import "../styles/Dashboard.css";

function Dashboard() {
    return (
        <div className="dashboard__container">
            <h1 className="dashboard__title">Pico URL Dashboard</h1>
            <div className="dashboard__upper">
                <div>User Statistics</div>
                <div>Create a picoUrl</div>
            </div>
            <div>Display URLs paginated</div>
        </div>
    );
}

export default Dashboard;