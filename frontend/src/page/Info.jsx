import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { setToken, getToken, removeToken } from '../service/LocalStorageService';
import { fetchWith401Check } from '../utils/fetchWith401Check';
import { API_BASE_URL } from "../configuration/configuration";

function Info() {
  const [data, setData] = React.useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchWith401Check(`${API_BASE_URL}/user/info`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getToken()}`,
          },
        });

        if (!response.ok) {
          removeToken();
          navigate('/');
          throw new Error('Fetch user info failed');
        }

        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [navigate]);

  const handleCallBack = async () => {
    try {
      const response = await fetchWith401Check(`${API_BASE_URL}/user/info`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
      });

      if (!response.ok) throw new Error('Callback failed');

      const result = await response.json();
      console.log('Callback result:', result);
    } catch (error) {
      console.error('Error in callback:', error);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetchWith401Check(`${API_BASE_URL}/auth/logout`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Logout failed');

      removeToken();
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className='info-container'>
      <h1>Welcome to the Home Page</h1>
      {data ? (
        <div>
          <h2>User Info:</h2>
          <p>UserName: {data.username}</p>
          <p>Email: {data.email}</p>
          <ul>
            {data.roles.map((role, index) => (
              <li key={index}>{role.name}</li>
            ))}
          </ul>
        </div>
      ) : (
        <p>Loading user info...</p>
      )}
      <button onClick={handleCallBack}>Call Back</button>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Info;
