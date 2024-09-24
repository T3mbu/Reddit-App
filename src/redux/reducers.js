// Define the initial state for the Redux store
const initialState = {
  posts: [],        // Store the fetched posts (initially empty)
  loading: false,   // Boolean flag to indicate whether posts are being fetched
  error: null,      // Store error message if something goes wrong (initially null)
};

// The reducer function to handle state transitions based on dispatched actions
export const redditReducer = (state = initialState, action) => {

  // Switch statement to handle different types of actions
  switch (action.type) {
    
    // Action dispatched when fetching posts begins
    case 'FETCH_POSTS_REQUEST':
      return {
        // Spread the current state to retain existing properties
        ...state,

        // Set loading to true to indicate that fetching is in progress
        loading: true,

        // Clear any previous error (in case of a new request after an error)
        error: null,
      };

    // Action dispatched when posts are successfully fetched
    case 'FETCH_POSTS_SUCCESS':
      return {
        // Spread the current state to retain existing properties
        ...state,

        // Set loading to false as fetching is complete
        loading: false,

        // Update the posts array with the fetched posts from the action payload
        posts: action.payload,
      };

    // Action dispatched when there's an error fetching posts
    case 'FETCH_POSTS_FAILURE':
      return {
        // Spread the current state to retain existing properties
        ...state,

        // Set loading to false as fetching has ended (unsuccessfully)
        loading: false,

        // Store the error message from the action payload
        error: action.payload,
      };

    // Default case: if the action type doesn't match any case, return the current state
    default:
      return state;
  }
};
