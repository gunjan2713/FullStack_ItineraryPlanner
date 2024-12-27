import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/ItineraryForm.css'; 
const API = import.meta.env.VITE_BACKEND_URL;

function ItineraryForm() {
  const [formData, setFormData] = useState({
    title: '',
    startDate: '',
    endDate: '',
    destination: '',
  });

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch(`${API}/api/check-auth`, {
          method: 'GET',
          credentials: 'include', 
        });

        if (response.ok) {
          const data = await response.json();
          if (data.isAuthenticated) {
            setIsAuthenticated(true);
            setUser(data.user); 
          } else {
            setIsAuthenticated(false);
            navigate('/login');  
          }
        } else {
          setIsAuthenticated(false);
          navigate('/login');  
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        setIsAuthenticated(false);
        navigate('/login');  
      }
    };

    checkAuthStatus();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API}/api/create-itinerary`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include', 
      });

      if (response.ok) {
        window.location.href = '/itineraries';
      } else {
        console.error('Failed to create itinerary');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };


  if (!isAuthenticated) {
    return (
      <div data-testid="not-authorized">
        <h2>You are not authorized to access this page. Please log in.</h2>
        <Link to="/login">
          <button>Login</button>
        </Link>
      </div>
    );
  }


  return (
    <div data-testid="itinerary-form-page">
      <Link to="/itineraries">
        <button className='navbar' data-testid="home-button">Home</button>
      </Link>
      <div className="form-container" data-testid="form-container">
        <h1>Create Itinerary</h1>
        <form onSubmit={handleSubmit} className="itinerary-form" data-testid="create-itinerary-form">
          <label htmlFor="title">
            Title
            <input
              id="title"
              name="title"
              type="text"
              placeholder="Enter itinerary title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              data-testid="title-input"
            />
          </label>
          <label htmlFor="startDate">
            Start Date
            <input
              id="startDate"
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              required
              data-testid="start-date-input"
            />
          </label>
          <label htmlFor="endDate">
            End Date
            <input
              id="endDate"
              name="endDate"
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              required
              data-testid="end-date-input"
            />
          </label>
          <label htmlFor="destination">
            Destination
            <input
              id="destination"
              name="destination"
              type="text"
              placeholder="Enter destination"
              value={formData.destination}
              onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
              required
              data-testid="destination-input"
            />
          </label>
          <button 
            type="submit" 
            className="submit-button"
            data-testid="submit-button"
          >
            Create Itinerary
          </button>
        </form>
      </div>
    </div>
  );
}

export default ItineraryForm;
