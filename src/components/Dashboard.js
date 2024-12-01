import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="container mt-5">
      <div className="text-center">
        <h1 className="mb-4">Welcome to Blog Dashboard</h1>
        <p className="lead text-muted">
          Manage your blogs, create new posts, or explore your blog list.
        </p>
        <div className="d-flex justify-content-center gap-3 mt-4">
          <button
            onClick={() => navigate('/create-blog')}
            className="btn btn-primary btn-lg shadow-sm"
          >
            Create Blog
          </button>
          <button
            onClick={() => navigate('/blog-list')}
            className="btn btn-secondary btn-lg shadow-sm"
          >
            See Blog List
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
