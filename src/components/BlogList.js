import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/apiService';

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);  // For loading state

  useEffect(() => {
    // Get the token from localStorage
    const token = localStorage.getItem('accessToken');

    if (!token) {
      console.log("No access token found.");
      return;
    }

    // Send the token as part of the request header for authentication
    API.get('/blogs/', {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    })
      .then((response) => {
        setBlogs(response.data);  // Set blogs returned by the backend
        setLoading(false);  // Stop loading after data is fetched
      })
      .catch((error) => {
        console.error('Error fetching blogs:', error);
        setLoading(false);  // Stop loading if there's an error
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;  // Show loading text while fetching blogs
  }

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">My Blogs</h1>
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
                    <Link to={`/blogs/${blog.id}`} className="btn btn-primary">
                      Read More
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No blogs found.</p>  // Show message when no blogs are available
        )}
      </div>
    </div>
  );
};

export default BlogList;
