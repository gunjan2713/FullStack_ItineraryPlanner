import { useState, useEffect } from 'react';
import { Link ,useNavigate} from 'react-router-dom';
import '../css/ItineraryList.css'; // Import the CSS file
const API = import.meta.env.VITE_BACKEND_URL;

function ItineraryList() {
  const [itineraries, setItineraries] = useState([]);
  const defaultImages = [
    '/img/image1.jpg',
    '/img/image2.jpg',
    '/img/image3.jpg',
    '/img/image4.jpg',
    '/img/image5.jpg',
  ];
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
    fetch(`${API}/api/itineraries`, {
      method: 'GET',
      credentials: 'include', // Ensures cookies are sent with the request
    })
      .then((res) => res.json())
      .then((data) => setItineraries(data))
      .catch((err) => console.error(err));
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API}/api/itineraries/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (response.ok) {
        setItineraries(itineraries.filter((item) => item._id !== id));
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
    <div className="itinerary-list-container" data-testid="itinerary-container">
      <header className="itinerary-header">
        <img
          src="img/logo.png"
          alt="Itinerary Logo"
          className="itinerary-logo"
          data-testid="header-logo"
        />
        <h1>My Itineraries</h1>
        <Link 
          to="/create" 
          className="create-button"
          data-testid="create-itinerary-button"
        >
          Create Itinerary +
        </Link>
      </header>
      {itineraries.length === 0 ? (
        <div className="no-itineraries" data-testid="empty-state">
          <h2>No itinerary created</h2>
        </div>
      ) : (
        <div className="itinerary-grid" data-testid="itinerary-grid">
          {itineraries.map((itinerary, index) => (
            <div 
              key={itinerary._id} 
              className="itinerary-card"
              data-testid={`itinerary-card-${itinerary._id}`}
            >
              <img
                src={itinerary.image || defaultImages[index % defaultImages.length]}
                alt={itinerary.title || 'Destination'}
                className="itinerary-image"
                data-testid={`itinerary-image-${itinerary._id}`}
              />
              <div className="card-content">
                <h3 data-testid={`itinerary-title-${itinerary._id}`}>
                  {itinerary.title}
                </h3>
                <div className="inline-details">
                  <p data-testid={`destination-${itinerary._id}`}>
                    <strong>Destination:</strong> {itinerary.destination}
                  </p>
                  <p data-testid={`start-date-${itinerary._id}`}>
                    <strong>From:</strong> {new Date(itinerary.startDate).toLocaleDateString()}
                  </p>
                  <p data-testid={`end-date-${itinerary._id}`}>
                    <strong>To:</strong> {new Date(itinerary.endDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
  
              <div className="card-actions">
                <Link 
                  to={`/add-day/${itinerary._id}`} 
                  className="action-button"
                  data-testid={`view-schedule-${itinerary._id}`}
                >
                  View Schedule
                </Link>
                <button
                  onClick={() => handleDelete(itinerary._id)}
                  className="delete-button"
                  data-testid={`delete-button-${itinerary._id}`}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ItineraryList;
