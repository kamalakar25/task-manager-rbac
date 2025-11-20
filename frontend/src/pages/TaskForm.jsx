import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../lib/api';

const defaultState = {
  title: '',
  description: '',
  status: 'pending',
};

const TaskForm = () => {
  const { taskId } = useParams();
  const isEdit = Boolean(taskId);
  const navigate = useNavigate();
  const [form, setForm] = useState(defaultState);
  const [error, setError] = useState('');
  const [fetching, setFetching] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadTask = async () => {
      setFetching(true);
      try {
        const { data } = await api.get(`/tasks/${taskId}`);
        setForm({
          title: data.title,
          description: data.description || '',
          status: data.status,
        });
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load task');
      } finally {
        setFetching(false);
      }
    };

    if (isEdit) {
      loadTask();
    }
  }, [isEdit, taskId]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      if (isEdit) {
        await api.put(`/tasks/${taskId}`, form);
      } else {
        await api.post('/tasks', form);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save task');
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="centered">
      <div className="card form-card wide">
        <h2>{isEdit ? 'Edit Task' : 'Create Task'}</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit} className="form">
          <label>
            Title
            <input name="title" value={form.title} onChange={handleChange} required />
          </label>
          <label>
            Description
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
            />
          </label>
          <label>
            Status
            <select name="status" value={form.status} onChange={handleChange}>
              <option value="pending">Pending</option>
              <option value="in-progress">In progress</option>
              <option value="completed">Completed</option>
            </select>
          </label>
          <button className="btn primary" type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Save Task'}
          </button>
        </form>
        {isEdit && fetching && <p className="muted">Loading task details...</p>}
      </div>
    </section>
  );
};

export default TaskForm;


