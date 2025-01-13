import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CreateBlogForm from '../components/CreateBlogForm';
import { test, vi, expect } from 'vitest';

test('calls createBlog with correct details when a new blog is submitted', async () => {
  const createBlog = vi.fn();
  render(<CreateBlogForm createBlog={createBlog} />);
  const user = userEvent.setup();

  // Encuentra los campos por su etiqueta asociada
  const titleInput = screen.getByLabelText(/title/i);
  const authorInput = screen.getByLabelText(/author/i);
  const urlInput = screen.getByLabelText(/url/i);

  // Escribe valores en los campos
  await user.type(titleInput, 'Test Blog Title');
  await user.type(authorInput, 'Test Author');
  await user.type(urlInput, 'http://testblog.com');

  // Envía el formulario
  const createButton = screen.getByRole('button', { name: /create/i });
  await user.click(createButton);

  // Verifica que createBlog fue llamado con los datos correctos
  expect(createBlog).toHaveBeenCalledWith({
    title: 'Test Blog Title',
    author: 'Test Author',
    url: 'http://testblog.com',
  });
  expect(createBlog).toHaveBeenCalledTimes(1);
});
