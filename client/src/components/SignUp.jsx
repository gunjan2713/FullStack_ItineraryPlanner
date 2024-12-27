import { useState } from 'react';
import { useNavigate, Link } from "react-router-dom"; 
const API = import.meta.env.VITE_BACKEND_URL;
import "../css/Signup.css"; 

function SignUp() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  });

  const [error, setError] = useState(""); // State to store error message
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    try {
      const response = await fetch(`${API}/api/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json(); // Parse the response

      if (!response.ok) {
        // If the response is not OK, display the error messages
        setError(data.errors ? Object.values(data.errors).join(", ") : data.message);
      } else {
        // Handle successful creation
        navigate('/login');
      }
    } catch (error) {
      console.error('Error:', error);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="signup-page">
      <img src="../img/logo1.png" alt="logo" />
      
      <div className="signup-container">
        <h1>Sign Up</h1>
        
        {/* Display error if any */}
        {error && <div className="error-message">{error}</div>}

        <form 
          className="signup-form"
          onSubmit={handleSubmit}
          style={{fontSize: "larger", display: "block", width: "100%", marginBottom: "40px"}}
        >
          <div className="input-group">
            <label htmlFor="username">
              User Name:  
              <input
                id="username"
                name="username"
                type="text"
                placeholder="username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                data-testid="username-input"
                required
              />
            </label>
          </div>
          <div className="input-group">
            <label htmlFor="email">
              Email:  
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                data-testid="email-input"
                required
              />
            </label>
          </div>
          <div className="input-group">
            <label htmlFor="password">
              Password: 
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                data-testid="password-input"
                required
              />
            </label>
          </div>
          <button 
            type="submit"
            className="signup-button"
            data-testid="signup-button"
          >
            Sign Up
          </button>
        </form>
        <Link to="/login" data-testid="login-link">Have an account? Login</Link>
      </div>
    </div>
  );
}

export default SignUp;
