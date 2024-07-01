import { useEffect } from 'react';
import { useRouter } from 'next/router';
import 'bootstrap/dist/css/bootstrap.min.css';

const Home = () => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/activities');
    }
  }, [router]);

  return (
    <div className="container">
      <h1>Welcome to the Activity Manager</h1>
      <p>Please log in or register to manage your activities.</p>
      <div className="d-flex justify-content-around">
        <button className="btn btn-primary" onClick={() => router.push('/login')}>Login</button>
        <button className="btn btn-secondary" onClick={() => router.push('/register')}>Register</button>
      </div>
    </div>
  );
};

export default Home;
