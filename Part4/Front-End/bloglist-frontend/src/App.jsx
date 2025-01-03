import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newBlog, setNewBlog] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

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
      setErrorMessage("Wrong credentials")
      setTimeout(()=>{
        setErrorMessage(null)
      }, 5000)
      
    }
  }
  const addBlog = (e) => {
    e.preventDefault();
    const blogObject = {
      content: newBlog,
      important: Math.random() > 0.5,
    };

    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
      setNewBlog("");
    });
  }

  const handleBlogChange = (event) => setNewBlog(event.target.value)

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


  const renderCreateBlogForm = () =>( 
  <form onSubmit={addBlog}>
    <input
      placeholder='Create a new blog here...'
      value={newBlog}
      onChange={handleBlogChange}
    />
    <button type="submit">save</button>
  </form>  
  )
   

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={errorMessage}/>
        
      {user === null ?
      renderLoginForm() :
      <div>
        <p>{user.name} logged-in</p>
        <button onClick={handleLogout}>logout</button>
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