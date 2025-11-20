const statusStyles = {
  pending: 'badge warning',
  'in-progress': 'badge info',
  completed: 'badge success',
};

const StatusBadge = ({ status }) => {
  return <span className={statusStyles[status] || 'badge'}>{status}</span>;
};

export default StatusBadge;


