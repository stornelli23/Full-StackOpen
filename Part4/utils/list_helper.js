const _ = require("lodash");

const dummy = (blogs) => {
    return 1
  }
  
  const totalLikes = (blogs) => {
    const likes = blogs.reduce((total, blog) => total + blog.likes, 0);
    return likes;
  }

  const favoriteBlog = (blogs)=> {
    if(blogs.length === 0){
        return null;
    }
    const favorite = blogs.reduce((max, blog) => (blog.likes > max.likes ? blog : max))
    return {
      title: favorite.title,
      author: favorite.author,
      likes: favorite.likes
    }
  }

  const mostBlogs = (blogs) => {
    if (_.isEmpty(blogs)) {
      return null; 
    }
      
    const authorCounts = _.countBy(blogs, 'author');

    const mostBlogsAuthor = _.maxBy(_.keys(authorCounts), author => authorCounts[author]);
    const maxBlogs = authorCounts[mostBlogsAuthor];
  
    return {
      author: mostBlogsAuthor,
      blogs: maxBlogs
    };
  };

  const mostLikes = (blogs) => {
    if (_.isEmpty(blogs)) {
        return null;
    }

    const likesByAuthor = _.reduce(blogs, (result, blog) => {
        result[blog.author] = (result[blog.author] || 0) + blog.likes;
        return result;
    }, {});

    const mostLikesAuthor = _.maxBy(_.keys(likesByAuthor), author => likesByAuthor[author]);
    const maxLikes = likesByAuthor[mostLikesAuthor];

    return {
        author: mostLikesAuthor,
        likes: maxLikes
    };
};
  
  module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
  };