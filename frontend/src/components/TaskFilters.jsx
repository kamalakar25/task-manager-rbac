const TaskFilters = ({ filters, onChange }) => {
  const handleChange = (event) => {
    const { name, value } = event.target;
    onChange({ ...filters, [name]: value, page: 1 });
  };

  return (
    <div className="card filters">
      <input
        type="text"
        name="search"
        placeholder="Search by title"
        value={filters.search}
        onChange={handleChange}
      />
      <select name="status" value={filters.status} onChange={handleChange}>
        <option value="">All statuses</option>
        <option value="pending">Pending</option>
        <option value="in-progress">In progress</option>
        <option value="completed">Completed</option>
      </select>
    </div>
  );
};

export default TaskFilters;


