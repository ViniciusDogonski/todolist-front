import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import 'bootstrap/dist/css/bootstrap.min.css';


const formatDateTimeLocal = (date: string) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = (`0${d.getMonth() + 1}`).slice(-2);
  const day = (`0${d.getDate()}`).slice(-2);
  const hours = (`0${d.getHours()}`).slice(-2);
  const minutes = (`0${d.getMinutes()}`).slice(-2);
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};


const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [description, setDescription] = useState('');
  const [dtInitial, setDtInitial] = useState('');
  const [dtFinal, setDtFinal] = useState('');
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [newCategory, setNewCategory] = useState('');
  const [editId, setEditId] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchActivities = async () => {
      try {
        const response = await axios.get('/api/activities', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setActivities(response.data);
      } catch (error) {
        console.error('Failed to fetch activities', error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/categories', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCategories(response.data);
      } catch (error) {
        console.error('Failed to fetch categories', error);
      }
    };

    fetchActivities();
    fetchCategories();
  }, [router]);

  const handleCreateOrUpdateActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');

      const formattedDtInitial = new Date(dtInitial).toISOString().slice(0, -5) + 'Z';
      const formattedDtFinal = new Date(dtFinal).toISOString().slice(0, -5) + 'Z';

      if (editId) {
        await axios.put(`/api/activities/${editId}`, { description, dtInitial: formattedDtInitial, dtFinal: formattedDtFinal, categoryId }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post('/api/activities', { description, dtInitial: formattedDtInitial, dtFinal: formattedDtFinal, categoryId }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      router.reload();
    } catch (error) {
      console.error(`Failed to ${editId ? 'update' : 'create'} activity`, error);
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/categories', { description: newCategory }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      router.reload();
    } catch (error) {
      console.error('Failed to create category', error);
    }
  };

  const handleEditActivity = (activity: any) => {
    setEditId(activity.id);
    setDescription(activity.description);
    setDtInitial(formatDateTimeLocal(activity.dtInitial));
    setDtFinal(formatDateTimeLocal(activity.dtFinal));
    setCategoryId(activity.categoryId);
  };

  const handleDeleteActivity = async (id: number) => {
    console.log("test")
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/activities/${id}`,  {
        headers: { Authorization: `Bearer ${token}` }
      });
      router.reload();
    } catch (error) {
      console.error('Failed to delete activity', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <div className="container">
      <button onClick={handleLogout} className="btn btn-secondary float-end">Logout</button>
      <h2>Activities</h2>
      <form onSubmit={handleCreateOrUpdateActivity}>
        <div className="mb-3">
          <label className="form-label">Description</label>
          <input type="text" className="form-control" value={description} onChange={(e) => setDescription(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Start Date</label>
          <input type="datetime-local" className="form-control" value={dtInitial} onChange={(e) => setDtInitial(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">End Date</label>
          <input type="datetime-local" className="form-control" value={dtFinal} onChange={(e) => setDtFinal(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Category</label>
          <select className="form-control" value={categoryId ?? ''} onChange={(e) => setCategoryId(Number(e.target.value))} required>
            <option value="">Select Category</option>
            {categories.map((category: any) => (
              <option key={category.id} value={category.id}>{category.description}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn btn-primary">{editId ? 'Update' : 'Create'} Activity</button>
      </form>

      <h2>Create New Category</h2>
      <form onSubmit={handleCreateCategory}>
        <div className="mb-3">
          <label className="form-label">Category Description</label>
          <input type="text" className="form-control" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} required />
        </div>
        <button type="submit" className="btn btn-primary">Create Category</button>
      </form>

      <h2>Activity List</h2>
      <ul className="list-group">
        {activities.map((activity: any) => (
          <li key={activity.id} className="list-group-item">
            {activity.description} - {new Date(activity.dtInitial).toLocaleString()} to {new Date(activity.dtFinal).toLocaleString()} - Category: {activity.category.description}
            <button className="btn btn-sm btn-warning float-end ms-2" onClick={() => handleEditActivity(activity)}>Edit</button>
            <button className="btn btn-sm btn-danger float-end" onClick={() => handleDeleteActivity(activity.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Activities;
