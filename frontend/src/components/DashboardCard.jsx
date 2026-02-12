function DashboardCard({ title, description }) {
  return (
    <div className="dashboard-card">
      <h4>{title}</h4>
      <p>{description}</p>
    </div>
  );
}

export default DashboardCard;