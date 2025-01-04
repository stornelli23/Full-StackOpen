import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [blogTitle, setBlogTitle] = useState('')
  const [blogAuthor, setBlogAuthor] = useState('')
  const [blogURL, setBlogURL] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState({ message: '', type: '' })

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  /* This `useEffect` hook is responsible for checking if there is a logged-in user stored in the
  browser's local storage. It runs only once when the component mounts (due to the empty dependency
  array `[]`). */
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])


  const handleLogin = async (e) => {

    e.preventDefault()

    try {
      const user = await loginService.login({username, password})

     /*storing the user object in the browser's local storage. */
      window.localStorage.setItem(
        'loggedBlogAppUser', JSON.stringify(user)
      ) 

      blogService.setToken(user.token)
      // console.log('Token set:', user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      
    } catch (e) {
      setNotification("Wrong credentials")
      setTimeout(()=>{
        setNotification(null)
      }, 5000)
      
    }
  }
  
  const handleBlogTitleChange = (event) => setBlogTitle(event.target.value)
  const handleBlogAuthorChange = (event) => setBlogAuthor(event.target.value)
  const handleBlogUrlChange = (event) => setBlogURL(event.target.value)

  const addBlog = async (e) => {
    e.preventDefault();
    const blogObject = {
      title: blogTitle,
      author: blogAuthor,
      url: blogURL,
    };
  
    try {
      const returnedBlog = await blogService.create(blogObject);
      setBlogs(blogs.concat(returnedBlog));
      setBlogTitle('');
      setBlogAuthor('');
      setBlogURL('');
      setNotification({ message: `Blog "${returnedBlog.title}" created successfully!`, type: 'success' });
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'An error occurred while creating the blog.';
      setNotification({ message: errorMessage, type: 'error' });
    } finally {
      setTimeout(() => {
        setNotification({ message: '', type: '' });
      }, 5000);
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser'); 
    setUser(null); 
    blogService.setToken(null); 
  };
  

  const renderLoginForm = ()=>(
    <form onSubmit={handleLogin}>
    <div>
      username
        <input
        type="text"
        value={username}
        name="Username"
        onChange={({ target }) => setUsername(target.value)}
      />
    </div>
    <div>
      password
        <input
        type="password"
        value={password}
        name="Password"
        onChange={({ target }) => setPassword(target.value)}
      />
    </div>
    <button type="submit">login</button>
  </form>
  )


  const renderCreateBlogForm = () => (
    <form onSubmit={addBlog}>
      <legend>CREATE NEW BLOG</legend>
        <label>Title </label>
        <input value={blogTitle} onChange={handleBlogTitleChange} />
        <br />
        <label>Author </label>
        <input value={blogAuthor} onChange={handleBlogAuthorChange} />
        <br />
        <label>URL </label>
        <input value={blogURL} onChange={handleBlogUrlChange} />
        <br />
        <button type="submit">Create</button>
    </form>
  );
   

  return (
    <div>
      <h2>blogs</h2>

      {notification.message && <Notification message={notification.message} type={notification.type} />}

        
      {user === null ?
      renderLoginForm() :
      <div>
          <p>{user.name} logged-in  <button onClick={handleLogout}>logout</button></p>
        
        {renderCreateBlogForm()}
          <div>
            {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} />
            )}
          </div>
      </div>
    }
      

    </div>
  )
}

export default App