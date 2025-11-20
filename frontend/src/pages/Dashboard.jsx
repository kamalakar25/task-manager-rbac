import useAuth from '../hooks/useAuth';
import AdminDashboard from './AdminDashboard';
import UserDashboard from './UserDashboard';

const Dashboard = () => {
  const { isAdmin } = useAuth();

  return isAdmin ? <AdminDashboard /> : <UserDashboard />;
};

export default Dashboard;


