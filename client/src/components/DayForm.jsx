import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Activity from './Activity';
import '../css/DayForm.css'; 
import '../css/ItineraryForm.css'; 

const API = import.meta.env.VITE_BACKEND_URL;

function DayForm() {
  const { itineraryId } = useParams();
  const [formData, setFormData] = useState({
    dayNumber: "",
    date: ""
  });
  const [days, setDays] = useState([]);
  const [error, setError] = useState("");
  const [selectedDayId, setSelectedDayId] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Authentication check
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

  // Fetch days for the itinerary
  useEffect(() => {
    const fetchDays = async () => {
      try {
        const response = await fetch(`${API}/api/${itineraryId}/days`);
        if (response.ok) {
          const data = await response.json();
          setDays(data);
        } else {
          setError('Error fetching days');
        }
      } catch (err) {
        console.error('Error:', err);
        setError('Error fetching days');
      }
    };

    if (itineraryId) fetchDays();
  }, [itineraryId]);

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API}/api/${itineraryId}/create-day`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        const newDay = await response.json();
        setDays([...days, newDay]);
        setFormData({ dayNumber: "", date: "" });
      } else {
        setError('Error adding a new day');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error adding a new day');
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
    <div data-testid="day-form-page">
      <Link to="/itineraries">
        <button className='navbar' data-testid="home-button">Home</button>
      </Link>

      <div className="dayform-container" data-testid="dayform-container">
        <h1 className="dayform-header">Add Day to Itinerary</h1>
        {error && <p className="dayform-error" data-testid="error-message">{error}</p>}

        <form onSubmit={handleSubmit} className="dayform-form" data-testid="day-form">
          <div className="dayform-input-group">
            <label htmlFor="dayNumber" className="dayform-label">Day Number:</label>
            <input
              id="dayNumber"
              name="dayNumber"
              type="text"
              value={formData.dayNumber}
              onChange={(e) => setFormData({ ...formData, dayNumber: e.target.value })}
              required
              className="dayform-input"
              data-testid="day-number-input"
            />
          </div>
          <div className="dayform-input-group">
            <label htmlFor="date" className="dayform-label">Date:</label>
            <input
              id="date"
              name="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
              className="dayform-input"
              data-testid="date-input"
            />
          </div>
          <button type="submit" className="dayform-add-button" data-testid="add-day-button">
            Add Day
          </button>
        </form>

        <h2 className="dayform-subheader">Days in Itinerary</h2>
        {days.length > 0 ? (
          <div className="dayform-days-list" data-testid="days-list">
            {days.map((day) => (
              <div
                key={day._id}
                className={`dayform-day-card ${selectedDayId === day._id ? "expanded" : ""}`}
                data-testid={`day-card-${day._id}`}
              >
                <div>
                  <strong className="dayform-day-number" data-testid={`day-number-${day._id}`}>
                    Day {day.dayNumber}
                  </strong>: {new Date(day.date).toLocaleDateString()}
                </div>
                <button
                  onClick={() => setSelectedDayId(selectedDayId === day._id ? null : day._id)}
                  className="dayform-schedule-button"
                  data-testid={`toggle-activities-${day._id}`}
                >
                  {selectedDayId === day._id ? "Hide Activities" : "View Activities"}
                </button>
                {selectedDayId === day._id && (
                  <Activity dayId={day._id} data-testid={`activities-${day._id}`} />
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="dayform-no-days" data-testid="no-days-message">No days added yet.</p>
        )}
      </div>
    </div>
  );
}

export default DayForm;
