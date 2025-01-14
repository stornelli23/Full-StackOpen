import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import { expect, test, vi } from 'vitest'
import blogService from '../services/blogs'

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

vi.mock('../services/blogs'); // Mock completo de blogService

test('if the like button is clicked twice, the event handler is called twice', async () => {
  const blog = {
    id: '123',
    title: 'Test Blog',
    author: 'Test Author',
    url: 'http://testblog.com',
    likes: 42,
    user: { username: 'testuser' },
  };

  const user = { username: 'testuser' };
  const updateBlog = vi.fn(); // Mock de la función updateBlog

  // Mock de blogService.update para que no interfiera en el test
  blogService.update.mockResolvedValue({
    ...blog,
    likes: blog.likes + 1,
  });

  render(<Blog blog={blog} user={user} updateBlog={updateBlog} />);

  const userAction = userEvent.setup();

  // Clic en "View" para mostrar el botón de "like"
  const viewButton = screen.getByText('View');
  await userAction.click(viewButton);

  // Clic en el botón "like" dos veces
  const likeButton = screen.getByRole('button', { name: /like/i });
  await userAction.click(likeButton);
  await userAction.click(likeButton);

  // Asegúrate de que updateBlog se llama dos veces
  expect(updateBlog).toHaveBeenCalledTimes(2);

  // Opcional: Verifica los argumentos con los que se llama updateBlog
  expect(updateBlog).toHaveBeenCalledWith(expect.objectContaining({ likes: 43 }));
});

// FALTA ESTE EJERCICIO.
// 5.15: Blog List Tests, step 3
// Make a test, which ensures that if the like button is clicked twice, the event 
// handler the component received as props is called twice.