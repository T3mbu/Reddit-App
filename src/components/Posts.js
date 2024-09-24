import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchRedditPosts } from '../redux/actions';
import Modal from 'react-modal';

//link the modal to the root element in the DOM
Modal.setAppElement('#root');

// Main component for rendering Reddit posts
const Posts = () => {
  // Get dispatch function from Redux to send actions
  const dispatch = useDispatch();

  const [subreddit, setSubreddit] = useState('popular'); 
  const [filter, setFilter] = useState('hot'); 
  const [searchedSubreddit, setSearchedSubreddit] = useState('popular'); 
  const { posts, loading, error } = useSelector((state) => state.reddit);
  const [modalIsOpen, setModalIsOpen] = useState(false); 
  const [selectedPost, setSelectedPost] = useState(null); 
  const [comments, setComments] = useState([]); 


  useEffect(() => {
    dispatch(fetchRedditPosts(searchedSubreddit, filter)); 
  }, [dispatch, searchedSubreddit, filter]);

  // Function to fetch comments for a selected post
  const fetchComments = async (postId) => {
    const response = await fetch(`https://www.reddit.com${postId}.json`);
    // Parse the response data into JSON format
    const data = await response.json();
    setComments(data[1].data.children.map((child) => child.data));
  };



  // Function to open the modal and fetch comments for the selected post
  const openModal = (post) => {
    // Set the selected post to display in the modal
    setSelectedPost(post);
    
    setModalIsOpen(true);
    
    fetchComments(post.permalink);
  };



  // Function to close the modal and clear comments
  const closeModal = () => {
    setModalIsOpen(false);
    setComments([]); 
  };

  // Function to handle subreddit search form submission
  const handleSearch = (e) => {
    // Prevent the default form submission behavior (page reload)
    e.preventDefault(); 
    setSearchedSubreddit(subreddit); 
  };

  // Function to reset the subreddit search to the default ('popular')
  const handleResetToDefault = () => {
    setSearchedSubreddit('popular'); 
  };

  //Display a loading message
  if (loading) {
    return <div>Loading posts...</div>;
  }

  //show the error message and retry/reset buttons
  if (error) {
    return (
      <div>
        <p>Error fetching posts: {error}</p>
        {/* Button to retry fetching posts */}
        <button onClick={() => dispatch(fetchRedditPosts(searchedSubreddit, filter))}>
          Try Again
        </button>
        {/* Button to reset to default 'popular' posts */}
        <button onClick={handleResetToDefault} style={{ marginLeft: '10px' }}>
          Back to Default
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1>Reddit Posts</h1>
      
      {/* Search form for entering subreddit */}
      <form onSubmit={handleSearch}>
        {/* Text input to update the subreddit */}
        <input 
          type="text" 
          value={subreddit} 
          onChange={(e) => setSubreddit(e.target.value)} 
          placeholder="Enter subreddit"
        />
        {/* Submit button for subreddit search */}
        <button type="submit">Search</button>
      </form>

      {/* Dropdown filter to select post sorting options */}
      <label htmlFor="filter">Filter posts by: </label>
      <select
        id="filter"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      >
        <option value="hot">Hot</option>
        <option value="new">New</option>
        <option value="top">Top</option>
      </select>

      {/* List of Reddit posts */}
      <ul>
        {posts.map((post) => {
          // Check if the post has a valid thumbnail URL (not 'self', 'default', 'image')
          const validThumbnail = post.thumbnail && !['self', 'default', 'image'].includes(post.thumbnail);

          return (
            <li key={post.id} className="post-item">
              {/* Display the thumbnail if valid, otherwise show 'No Image' */}
              <div className="post-thumbnail">
                {validThumbnail ? (
                  <img src={post.thumbnail} alt="Thumbnail" />
                ) : (
                  <div className="no-thumbnail">No Image</div>
                )}
              </div>

              {/* Post content including title, subreddit, score, and author */}
              <div className="post-content">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    openModal(post);
                  }}
                  className="post-title"
                >
                  {post.title}
                </a>
                <p className="post-metadata">
                  Subreddit: <a href={`https://www.reddit.com/r/${post.subreddit}`} target="_blank" rel="noopener noreferrer">r/{post.subreddit}</a> | 
                  Score: {post.score} | 
                  Author: {post.author}
                </p>
              </div>
            </li>
          );
        })}
      </ul>

      {/* Conditional rendering: Show the modal if a post is selected */}
      {selectedPost && (
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Post Details"
          className="reddit-modal"
        >
          {/* Display the selected post details */}
          <h2>{selectedPost.title}</h2>
          <p>Subreddit: <a href={`https://www.reddit.com/r/${selectedPost.subreddit}`} target="_blank" rel="noopener noreferrer">r/{selectedPost.subreddit}</a></p>
          <p>Author: {selectedPost.author}</p>
          <p>Score: {selectedPost.score}</p>
          <p>{selectedPost.selftext}</p>

          {/* Comments section */}
          <h3>Comments:</h3>
          <ul className="comments-list">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <li key={comment.id}>
                  <p><strong>{comment.author}</strong>:</p>
                  <p>{comment.body}</p>
                  <p>Upvotes: {comment.ups}, Downvotes: {comment.downs}</p>
                </li>
              ))
            ) : (
              <p>No comments available.</p>
            )}
          </ul>

          {/* Button to close the modal */}
          <button onClick={closeModal}>Close</button>
        </Modal>
      )}
    </div>
  );
};

export default Posts;
