import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/apiService';

const BlogUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState({
    title: '',
    content: ''
  });
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    if (!token) {
      console.error("No access token found.");
      return;
    }

    // Fetch the blog data
    API.get(`/blogs/${id}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        setBlog(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching the blog:', error);
        setLoading(false);
      });
  }, [id, token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBlog((prevBlog) => ({
      ...prevBlog,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Send updated data to the server
    API.put(`/blogs/${id}/`, blog, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(() => {
        alert("Blog updated successfully.");
        navigate(`/blogs/${id}`); // Navigate back to the blog detail page after successful update
      })
      .catch((error) => {
        console.error('Error updating the blog:', error);
        alert("Failed to update the blog.");
      });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-5">
      <h1>Update Blog</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">Title</label>
          <input
            type="text"
            className="form-control"
            id="title"
            name="title"
            value={blog.title}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="content" className="form-label">Content</label>
          <textarea
            className="form-control"
            id="content"
            name="content"
            rows="5"
            value={blog.content}
            onChange={handleInputChange}
            required
          ></textarea>
        </div>
        <button type="submit" className="btn btn-primary">Update Blog</button>
      </form>
    </div>
  );
};

export default BlogUpdate;
