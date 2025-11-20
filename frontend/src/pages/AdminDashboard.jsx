import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import api from '../lib/api';
import TaskFilters from '../components/TaskFilters.jsx';
import TaskTable from '../components/TaskTable.jsx';
import Pagination from '../components/Pagination.jsx';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [filters, setFilters] = useState({ status: '', search: '', page: 1, limit: 5 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/tasks', {
        params: {
          status: filters.status || undefined,
          search: filters.search || undefined,
          page: filters.page,
          limit: filters.limit,
        },
      });
      setTasks(data.tasks);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleDelete = async (taskId) => {
    const confirmation = window.confirm('Are you sure you want to delete this task?');
    if (!confirmation) return;
    try {
      await api.delete(`/tasks/${taskId}`);
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete task');
    }
  };

  const handlePageChange = (page) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  return (
    <section>
      <header className="page-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p className="muted">
            Welcome {user?.name}! You can view and manage all tasks in the system.
          </p>
        </div>
        <Link className="btn primary" to="/tasks/new">
          + Create Task
        </Link>
      </header>

      <TaskFilters filters={filters} onChange={setFilters} />
      {error && <p className="error">{error}</p>}
      {loading ? (
        <p className="muted">Loading tasks...</p>
      ) : (
        <>
          <TaskTable tasks={tasks} isAdmin={true} onDelete={handleDelete} />
          <Pagination pagination={pagination} onPageChange={handlePageChange} />
        </>
      )}
    </section>
  );
};

export default AdminDashboard;

