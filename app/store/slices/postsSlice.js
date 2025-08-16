// store/postsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllPosts } from '@app/service';

const BASE_URL = "https://backend.artdomainx.com/media/";

export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async (page) => {
    // console.log("🚀 Calling fetchPosts for page:", page);

    try {
      const res = await getAllPosts(page);
      // console.log("📦 API Response:", res?.data);

      const fetched = res?.data?.data || [];

      const mapped = fetched.map(post => ({
        id: post.id,
        imageUrl: post.media?.[0]?.file || '',
        user: {
          name: post.username || 'Anonymous',
          avatar: post.profile_picture
            ? `${BASE_URL}${post.profile_picture}`
            : 'https://artdomainx.com/images/profile-pic.png',
        },
        caption: post.title || '',
        reactionCount: post.reaction_count || 0,
        commentCount: post.comment_count || 0,
        shareCount: post.share_count || 0,
        viewCount: post.view_count || 0,
        reactionId: post.reaction_id || null, // 👉 store the id if needed
        comments: [],
      }));

      // console.log("✅ Mapped Posts:", mapped);

      return {
        data: mapped,
        hasMore: !!res?.data?.links?.next,
      };
    } catch (error) {
      console.error("❌ Error in fetchPosts:", error);
      throw error;
    }
  }
);


const postsSlice = createSlice({
  name: 'posts',
  initialState: {
    items: [],
    page: 1,
    loading: false,
    hasMore: true,
    loadedOnce: false,
  },
  reducers: {
    addComment(state, action) {
      const { postId, commentText } = action.payload;
      const post = state.items.find(p => p.id === postId);
      if (post) {
        post.comments.push({ user: 'You', text: commentText });
      }
    },
    resetPosts(state) {
      state.items = [];
      state.page = 1;
      state.hasMore = true;
      state.loadedOnce = false;
    },
    updatePostReaction(state, action) {
  const { postId, newCount, userReactionType } = action.payload;
  const post = state.items.find(p => p.id === postId);
  if (post) {
    post.reactionCount = newCount;
    post.user_reaction_type = userReactionType; // important if you want full sync
  }
}
  },
  extraReducers: builder => {
    builder
      .addCase(fetchPosts.pending, state => {
        state.loading = true;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        const { data, hasMore } = action.payload || {};
        if (state.page === 1) {
          state.items = data;
        } else {
          state.items = [...state.items, ...data];
        }
        state.page += 1;
        state.hasMore = hasMore;
        state.loading = false;
        state.loadedOnce = true;
      })
      .addCase(fetchPosts.rejected, state => {
        state.loading = false;
      });
  },
});

export const { addComment, resetPosts , updatePostReaction  } = postsSlice.actions;
export default postsSlice.reducer;
