import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';

const TaskTable = ({ tasks, isAdmin, onDelete }) => {
  if (!tasks.length) {
    return <p className="muted">No tasks to display.</p>;
  }

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Status</th>
            <th>Created</th>
            {isAdmin && <th>Owner</th>}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task._id}>
              <td>
                <strong>{task.title}</strong>
                <p className="muted small">{task.description || '—'}</p>
              </td>
              <td>
                <StatusBadge status={task.status} />
              </td>
              <td>{new Date(task.createdAt).toLocaleString()}</td>
              {isAdmin && <td>{task.createdBy?.name}</td>}
              <td className="actions">
                <Link className="btn tiny" to={`/tasks/${task._id}/edit`}>
                  Edit
                </Link>
                <button className="btn danger tiny" onClick={() => onDelete(task._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskTable;


