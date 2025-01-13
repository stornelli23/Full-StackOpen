import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import { expect } from 'vitest'

test('render a blog', () => {
  const blog = {
    title: 'Nuevo blog de test',
    author: 'Santiago',
    url:'aa.com',
    user: 'santiag0',
    likes: 2
  }

  const user = {
    username: 'santiag0',
    name: 'Santiago Enzo'
  }

  render(<Blog blog={blog} user={user}/>)

//   screen.debug()
  const element = screen.getByText('Nuevo blog de test')
  expect(element).toBeDefined()

})

test('shows URL and likes when the "View" button is clicked', async () => {
  const blog = {
    title: 'Test Blog',
    author: 'Test Author',
    url: 'http://testblog.com',
    likes: 42,
    user: { username: 'testuser' }
  };

  const user = { username: 'testuser' };

  render(<Blog blog={blog} user={user} />);

  // Verifica que la URL y los likes no están visibles inicialmente
  expect(screen.queryByText(blog.url)).not.toBeInTheDocument();
  expect(screen.queryByText(`42`)).not.toBeInTheDocument();

  // Hace clic en el botón "View"
  const viewButton = screen.getByText('View');
  const userAction = userEvent.setup();
  await userAction.click(viewButton);

  // Verifica que la URL y los likes están visibles
  expect(screen.getByText(blog.url)).toBeInTheDocument();
  expect(screen.getByText(`42`)).toBeInTheDocument();
});

// FALTA ESTE EJERCICIO.
// 5.15: Blog List Tests, step 3
// Make a test, which ensures that if the like button is clicked twice, the event 
// handler the component received as props is called twice.