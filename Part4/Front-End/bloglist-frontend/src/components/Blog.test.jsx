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


  const element = screen.getByText('Nuevo blog de test')
  expect(element).toBeDefined()

})

test('clicking the button calls event handler once', async () => {
  const blog = {
    title: 'Nuevo blog de test',
    author: 'Santiago',
    url:'aa.com',
    user: 'santiag0',
    likes: 2
  }

  const blogUser = {
    username: 'santiag0',
    name: 'Santiago Enzo'
  }

  const mockHandler = vi.fn()

  render(
    <Blog blog={blog} user={blogUser}/>
  )

  const user = userEvent.setup()
  const button = screen.getByText('View')
  // Antes de hacer clic, los detalles no deben estar visibles
  expect(screen.queryByText('aa.com')).to.be.null

  // Hacer clic en el botón "View"
  await user.click(button)

  // Después del clic, los detalles deben ser visibles
  expect(screen.queryByText('aa.com')).to.exist
})