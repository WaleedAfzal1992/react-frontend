import React, { useState, useRef, useEffect } from 'react';
import sanitizeHtml from 'sanitize-html';
import API from '../services/apiService';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../styles.css';

const BlogCreate = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const quillRef = useRef(null);

  // Function to calculate word count
  const calculateWordCount = (text) => {
    const plainText = text.replace(/<[^>]*>/g, ''); // Remove HTML tags
    const words = plainText.trim().split(/\s+/); // Split by spaces
    return plainText.trim() === '' ? 0 : words.length; // Count words
  };

  // Update word count whenever content changes
  useEffect(() => {
    setWordCount(calculateWordCount(content));
  }, [content]);

  // Function to sanitize HTML content
  const cleanHTMLContent = (html) => {
    return sanitizeHtml(html, {
      allowedTags: [], // Remove all tags
      allowedAttributes: {}, // Remove all attributes
    });
  };

  const handleImageUpload = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = async (event) => {
          const base64Image = event.target.result;
          const response = await API.post('/upload-image', { imageData: base64Image });

          if (response.ok) {
            const imageUrl = response.data.url;
            const quill = quillRef.current.getEditor();
            const range = quill.getSelection();
            if (range) {
              quill.insertEmbed(range.index, 'image', imageUrl);
            }
          } else {
            console.error('Error uploading image:', response.statusText);
          }
        };

        reader.onerror = (error) => {
          console.error('Error reading image file:', error);
        };
      }
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanedContent = cleanHTMLContent(content);
    const blogData = { title, content: cleanedContent };
    const token = localStorage.getItem('accessToken');

    API.post('/blogs/', blogData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(() => {
        alert('Blog created successfully!');
        setTitle('');
        setContent('');
      })
      .catch((error) => {
        console.error('Error creating blog:', error);
        alert('There was an error creating the blog.');
      });
  };

  return (
    <div className="container mt-5 d-flex justify-content-center">
      <div className="card p-4 shadow" style={{ width: '750px', minHeight: '750px', borderRadius: '15px' }}>
        <h2 className="text-center mb-4">Create a New Blog</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
          <div>
            <div className="mb-3">
              <label className="form-label">Title</label>
              <input
                type="text"
                className="form-control"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter blog title"
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Content</label>
              <ReactQuill
                ref={quillRef}
                theme="snow"
                value={content}
                onChange={setContent}
                modules={{
                  toolbar: [
                    [{ header: '1' }, { header: '2' }, { font: [] }],
                    [{ list: 'ordered' }, { list: 'bullet' }],
                    ['bold', 'italic', 'underline'],
                    ['link', 'image'],
                    [{ align: [] }],
                    ['clean'],
                  ],
                }}
                placeholder="Write your blog content here..."
                style={{ height: '400px' }}
              />
            </div>
            <div className="text-end mt-2">
              <small>Word Count: {wordCount}</small>
            </div>
          </div>
          <button
            type="submit"
            className="btn btn-primary w-100"
            style={{ marginTop: '30px', padding: '10px' }}
          >
            Create Blog
          </button>
        </form>
      </div>
    </div>
  );
};

export default BlogCreate;
