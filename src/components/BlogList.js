import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/apiService';

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');

    if (!token) {
      console.log('No access token found.');
      return;
    }

    // Fetch the current user ID
    API.get('/auth/current_user/', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => setCurrentUserId(response.data.id))
      .catch((error) => console.error('Error fetching current user:', error));

    // Fetch blogs
    API.get('/blogs/', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        setBlogs(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching blogs:', error);
        setLoading(false);
      });

    // Fetch users
    API.get('/users/', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => setUsers(response.data))
      .catch((error) => console.error('Error fetching users:', error));
  }, []);

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredUsers(users.filter((user) => user.username.toLowerCase().includes(query)));
  };

  const handleGrantAccess = (blogId, permissionType) => {
    if (!selectedUser) {
      alert('Please select a user.');
      return;
    }

    const token = localStorage.getItem('accessToken');
    API.post(
      `/blogs/${blogId}/grant_access/`,
      { user_id: selectedUser.id, permission_type: permissionType },
      { headers: { Authorization: `Bearer ${token}` } }
    )
      .then((response) => alert(response.data.detail))
      .catch((error) => console.error('Error granting access:', error));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">My Blogs</h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search for users..."
          value={searchQuery}
          onChange={handleSearch}
          className="form-control"
        />
        <ul className="list-group mt-2">
          {filteredUsers.map((user) => (
            <li
              key={user.id}
              className={`list-group-item ${selectedUser?.id === user.id ? 'active' : ''}`}
              onClick={() => setSelectedUser(user)}
              style={{ cursor: 'pointer' }}
            >
              {user.username}
            </li>
          ))}
        </ul>
      </div>
      <div className="row">
        {blogs.length > 0 ? (
          blogs.map((blog) => (
            <div key={blog.id} className="col-md-6 mb-4">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h3 className="card-title">{blog.title}</h3>
                  <p className="card-text">{blog.content.substring(0, 100)}...</p>
                  <small className="text-muted">
                    Created at: {new Date(blog.created_at).toLocaleString()}
                  </small>
                  <div className="mt-3">
                    <Link to={`/blogs/${blog.id}`} className="btn btn-primary me-2">
                      Read More
                    </Link>
                    {/* Conditionally render grant buttons if user is the author */}
                    {currentUserId === blog.author && (
                      <div className="mt-3">
                        <button
                          className="btn btn-secondary me-2"
                          onClick={() => handleGrantAccess(blog.id, 'Watch Only')}
                        >
                          Grant Watch Only
                        </button>
                        <button
                          className="btn btn-success"
                          onClick={() => handleGrantAccess(blog.id, 'Full Access')}
                        >
                          Grant Watch & Update
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No blogs found.</p>
        )}
      </div>
    </div>
  );
};

export default BlogList;
