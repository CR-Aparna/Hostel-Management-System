function DashboardCard({ title, description, onClick  }) {
  return (
    <div onClick={onClick} className="dashboard-card">
      <h4>{title}</h4>
      <p>{description}</p>
    </div>
  );
}

export default DashboardCard;