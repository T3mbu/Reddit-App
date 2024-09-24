// Action to start the process of fetching posts
export const fetchPostsRequest = () => {
  return {
    type: 'FETCH_POSTS_REQUEST', 
  };
};

// Action to handle success when posts are fetched successfully
export const fetchPostsSuccess = (posts) => {
  return {
    type: 'FETCH_POSTS_SUCCESS',
    payload: posts, 
  };
};

// Action to handle errors that occur during the post-fetching process
export const fetchPostsFailure = (error) => {
  return {
    type: 'FETCH_POSTS_FAILURE',
    payload: error,
  };
};

// Main function to fetch Reddit posts based on subreddit and filter
export const fetchRedditPosts = (subreddit, filter = 'hot') => {
  // This function returns another function (enabled by redux-thunk for async actions)
  return (dispatch) => {
    
    // Dispatch the request action to indicate the fetch process has started
    dispatch(fetchPostsRequest());

    // Perform the actual fetch from Reddit's API using the selected subreddit and filter
    fetch(`https://www.reddit.com/r/${subreddit}/${filter}.json`)
      .then((response) => {
        // Check if the response is OK (status code 200), otherwise throw an error
        if (!response.ok) {
          throw new Error(`Subreddit not found (status code: ${response.status})`);
        }

        // Convert the response to JSON format
        return response.json();
      })
      .then((data) => {
        // Check if the data has the expected structure (data and children array)
        if (!data.data || !data.data.children) {
          throw new Error('Unexpected API response format');
        }

        // Extract the posts from the response and map over the children array to get each post's data
        const posts = data.data.children.map((child) => child.data);

        // Dispatch the success action with the posts data as payload
        dispatch(fetchPostsSuccess(posts));
      })
      .catch((error) => {
        // If any error occurs, dispatch the failure action with the error message
        dispatch(fetchPostsFailure(error.message));
      });
  };
};
