import React, { useState, useRef } from 'react';
import API from '../services/apiService';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../styles.css';

const BlogCreate = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const quillRef = useRef(null);

  // Handle image upload and insert into the editor
  const handleImageUpload = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (file && file.type.startsWith('image/')) {
        //const imageUrl = URL.createObjectURL(file);
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = async (event) => {
            const base64Image = event.target.result; // Get Base64 data

            // Send Base64 data to backend using API call
        const response = await API.post('/upload-image', { imageData: base64Image });

        if (response.ok) {
          const imageUrl = response.data.url; // Assuming backend returns image URL
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

        

  // Add resize functionality to inserted images
  const enableImageResizing = () => {
    const quill = quillRef.current.getEditor();

    // Add click event listener to all images in the editor
    quill.root.addEventListener('click', function (e) {
      const target = e.target;

      if (target.tagName === 'IMG') {
        if (!target.classList.contains('resizable')) {
          target.classList.add('resizable');
          addResizeHandles(target);
        }
      }
    });
  };

  // Add resize handles to the image
  const addResizeHandles = (img) => {
    const existingHandles = img.parentNode.querySelectorAll('.resize-handle');
    existingHandles.forEach(handle => handle.remove());

    const resizeHandle = document.createElement('div');
    resizeHandle.classList.add('resize-handle');
    img.parentNode.appendChild(resizeHandle);

    resizeHandle.addEventListener('mousedown', (e) => {
      e.preventDefault();

      const initialWidth = img.width;
      const initialHeight = img.height;
      const initialX = e.clientX;
      const initialY = e.clientY;

      const onMouseMove = (moveEvent) => {
        const deltaX = moveEvent.clientX - initialX;
        const deltaY = moveEvent.clientY - initialY;

        img.width = initialWidth + deltaX;
        img.height = initialHeight + deltaY;
      };

      const onMouseUp = () => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanedContent = content.replace(/<\/?p>/g, '');
    const blogData = { title, content: cleanedContent };
    const token = localStorage.getItem('accessToken'); // Retrieve access token

    API.post('/blogs/', blogData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
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
      <div className="card p-4 shadow" style={{ width: '750px', minHeight: '700px', borderRadius: '15px' }}>
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
                onFocus={enableImageResizing}
              />
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
