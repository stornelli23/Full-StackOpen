import { useState } from "react";
import blogService from '../services/blogs'

const Blog = ({ blog, updateBlog, user, deleteBlog }) => {
  const [visible, setVisible] = useState(false);

  const toggleVisibility = () => setVisible(!visible);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const handleLikeButton = async (e) =>{
    e.preventDefault()
    let currentBlog = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
      user: blog.user.id
    }
    try {
      
      const updatedBlog = await blogService.update(blog.id, currentBlog)
      updateBlog(updatedBlog)
      
    } catch (error) {
      console.error('Error updating likes:', error);
    }

  }

  const handleDeleteBlog = async (e) => {
    e.preventDefault()
    const confirmed = window.confirm(`Are you sure you want to delete the blog "${blog.title}"?`)
    if (!confirmed) return
    try {
      await blogService.deleteBlog(blog.id); 
      deleteBlog(blog.id); 
    } catch (error) {
      console.error("Error deleting blog:", error);
    }
  };

  return (
    <div style={blogStyle}>
      {blog.title}
      {visible ? (
        <button onClick={toggleVisibility}>Hide</button>
      ) : (
        <button onClick={toggleVisibility}>View</button>
      )}
      {visible && (
        <ul>
          <li>{blog.url}</li>
          <li>
            {blog.likes}
            <button onClick={handleLikeButton}>like</button>
            </li>
          <li>{blog.author}</li>
        </ul>
      )}
      {user.username === blog.user.username && <button onClick={handleDeleteBlog}>Delete blog</button>}
      
    </div>
  );
};

export default Blog;
