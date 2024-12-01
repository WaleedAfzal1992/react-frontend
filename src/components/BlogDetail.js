import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/apiService';

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    if (!token) {
      console.error("No access token found.");
      return;
    }

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

  const handleUpdateClick = () => {
    navigate(`/update-blog/${id}`);
  };

  const handleDeleteClick = () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this blog?");
    if (!confirmDelete) return;

    if (token) {
      API.delete(`/blogs/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(() => {
          alert("Blog deleted successfully.");
          navigate('/blog-list');
        })
        .catch((error) => {
          console.error('Error deleting the blog:', error);
          alert("Failed to delete the blog.");
        });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!blog) {
    return <div>Blog not found.</div>;
  }

  return (
    <div className="container mt-5">
      <h1>{blog.title}</h1>

      {/* Display the blog image */}
      

      <p>{blog.content}</p>
      <small>Created at: {new Date(blog.created_at).toLocaleString()}</small>

      <div className="mt-3">
        <button className="btn btn-primary me-2" onClick={handleUpdateClick}>
          Update Blog
        </button>
        <button className="btn btn-danger" onClick={handleDeleteClick}>
          Delete Blog
        </button>
      </div>
    </div>
  );
};

export default BlogDetail;
