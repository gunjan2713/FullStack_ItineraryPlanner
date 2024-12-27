import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import {useNavigate,Link} from 'react-router-dom';
import '../css/Activity.css'; // Import CSS for styling

const API = import.meta.env.VITE_BACKEND_URL;


function Activity({ dayId }) {
  // const { dayId } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    time: "",
    location: "",
    duration: "",
    cost: "",
    notes: "",
  });
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false); // State to toggle form visibility
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

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch(`${API}/api/${dayId}/activities`);
        if (response.ok) {
          const data = await response.json();
          setActivities(data);
        } else {
          setError("Error fetching activities");
        }
      } catch (err) {
        console.error("Error:", err);
        setError("Error fetching activities");
      }
    };

    if (dayId) fetchActivities();
  }, [dayId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API}/api/${dayId}/add-activity`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        const newActivity = await response.json();
        setActivities([...activities, newActivity]);
        setFormData({
          name: "",
          time: "",
          location: "",
          duration: "",
          cost: "",
          notes: "",
        });
        setShowForm(false); // Hide form after submission
      } else {
        setError("Error adding activity");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Error adding activity");
    }
  };

  const handleDelete = async (activityId) => {
    try {
      const response = await fetch(`${API}/api/${dayId}/delete-activity/${activityId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setActivities(activities.filter((activity) => activity._id !== activityId));
      } else {
        setError("Error deleting activity");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Error deleting activity");
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
    <div className="activityform-container">
      <h1 className="activityform-header">Activities for the Day</h1>
      {error && <p className="activityform-error">{error}</p>}

      {/* Button to toggle form visibility */}
      <button
        onClick={() => setShowForm(!showForm)}
        className="activityform-toggle-button"
      >
        {showForm ? "Cancel" : "Add Activity"}
      </button>

      {/* Conditionally render the form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="activityform-form">
          <div className="activityform-input-group">
            <label className="activityform-label">Activity Name:</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
              className="activityform-input"
            />
          </div>
          <div className="activityform-input-group">
            <label className="activityform-label">Time:</label>
            <input
              type="time"
              value={formData.time}
              onChange={(e) =>
                setFormData({ ...formData, time: e.target.value })
              }
              required
              className="activityform-input"
            />
          </div>
          <div className="activityform-input-group">
            <label className="activityform-label">Location:</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              className="activityform-input"
            />
          </div>
          <div className="activityform-input-group">
            <label className="activityform-label">Duration:</label>
            <input
              type="text"
              value={formData.duration}
              onChange={(e) =>
                setFormData({ ...formData, duration: e.target.value })
              }
              className="activityform-input"
            />
          </div>
          <div className="activityform-input-group">
            <label className="activityform-label">Cost:</label>
            <input
              type="number"
              value={formData.cost}
              onChange={(e) =>
                setFormData({ ...formData, cost: e.target.value })
              }
              className="activityform-input"
            />
          </div>
          <div className="activityform-input-group">
            <label className="activityform-label">Notes:</label>
            <textarea
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              className="activityform-textarea"
            />
          </div>
          <button type="submit" className="activityform-submit-button">
            Add Activity
          </button>
        </form>
      )}

      <h2 className="activityform-subheader">Existing Activities</h2>
      {activities.length > 0 ? (
        <table className="activityform-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Time</th>
              <th>Location</th>
              <th>Duration</th>
              <th>Cost</th>
              <th>Notes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((activity) => (
              <tr key={activity._id}>
                <td>{activity.name}</td>
                <td>{activity.time}</td>
                <td>{activity.location}</td>
                <td>{activity.duration}</td>
                <td>{activity.cost}</td>
                <td>{activity.notes}</td>
                <td>
                  <button
                    onClick={() => handleDelete(activity._id)}
                    className="activityform-delete-button"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="activityform-no-activities">No activities added yet.</p>
      )}
    </div>
  );
}

Activity.propTypes = {
  dayId: PropTypes.string.isRequired,
};

export default Activity;
