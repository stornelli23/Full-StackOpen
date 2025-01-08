import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import CreateBlogForm from './components/CreateBlogForm'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState({ message: '', type: '' })

  const blogFormRef = useRef()

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
      const user = await loginService.login({ username, password })

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
      setNotification('Wrong credentials')
      setTimeout(() => {
        setNotification(null)
      }, 5000)

    }
  }

  const addBlog = async (blogObject) => {

    try {
      const returnedBlog = await blogService.create(blogObject)

      setBlogs((prevBlogs) => [...prevBlogs, returnedBlog])
      // Esto asegura que el nuevo blog creado (returnedBlog) se agregue al estado blogs local de inmediato. En lugar de esperar que los blogs se recarguen desde el servidor, simplemente actualizas el estado blogs en el frontend.
      // Obtener los blogs actualizados desde el backend
      const allBlogs = await blogService.getAll()
      setBlogs(allBlogs)  // Actualiza el estado con los blogs más recientes

      setNotification({ message: `Blog "${returnedBlog.title}" created successfully!`, type: 'success' })
      blogFormRef.current.toggleVisibility()
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'An error occurred while creating the blog.'
      setNotification({ message: errorMessage, type: 'error' })
    } finally {
      setTimeout(() => {
        setNotification({ message: '', type: '' })
      }, 5000)
    }
  }

  const updateBlog = (updatedBlog) => {
    setBlogs((prevBlogs) =>
      prevBlogs.map((blog) =>
        blog.id === updatedBlog.id ? updatedBlog : blog
      )
    )
  }

  const deleteBlog = (deletedBlogId) => {
    setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog.id !== deletedBlogId))
  }


  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    setUser(null)
    blogService.setToken(null)
  }


  const renderLoginForm = () => (
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


  return (
    <div>
      <h2>blogs</h2>

      {notification.message && (
        <Notification message={notification.message} type={notification.type} />
      )}

      {user === null ? (
        renderLoginForm()
      ) : (
        <div>
          <p>
            {user.name} logged-in <button onClick={handleLogout}>logout</button>
          </p>

          <Togglable buttonLabel="Create a new blog" ref={blogFormRef}>
            <CreateBlogForm createBlog={addBlog} />
          </Togglable>

          <div>
            { [...blogs].sort((a, b) => b.likes - a.likes).map((blog) => (
              <Blog
                key={blog.id}
                blog={blog}
                updateBlog={updateBlog}
                deleteBlog={deleteBlog}
                user={user}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default App