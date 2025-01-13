import { useState } from "react";

const CreateBlogForm = ({ createBlog }) => {
  const [blogTitle, setBlogTitle] = useState("");
  const [blogAuthor, setBlogAuthor] = useState("");
  const [blogURL, setBlogURL] = useState("");

  const handleBlogTitleChange = (event) => setBlogTitle(event.target.value);
  const handleBlogAuthorChange = (event) => setBlogAuthor(event.target.value);
  const handleBlogUrlChange = (event) => setBlogURL(event.target.value);

  const addBlog = (e) => {
    e.preventDefault();

    createBlog({
      title: blogTitle,
      author: blogAuthor,
      url: blogURL,
    });

    setBlogTitle("");
    setBlogAuthor("");
    setBlogURL("");
  };

  return (
    <form onSubmit={addBlog}>
      <legend>CREATE NEW BLOG</legend>

      <label htmlFor="title">Title </label>
      <input
        id="title"
        value={blogTitle}
        onChange={handleBlogTitleChange}
      />
      <br />

      <label htmlFor="author">Author </label>
      <input
        id="author"
        value={blogAuthor}
        onChange={handleBlogAuthorChange}
      />
      <br />

      <label htmlFor="url">URL </label>
      <input
        id="url"
        value={blogURL}
        onChange={handleBlogUrlChange}
      />
      <br />

      <button type="submit">Create</button>
    </form>
  );
};

export default CreateBlogForm;
