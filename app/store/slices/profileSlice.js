import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { profileDetail } from "@app/service"; // your API function

// Async thunk to fetch profile by id
export const fetchProfile = createAsyncThunk(
  "profile/fetchProfile",
  async (id, { rejectWithValue }) => {
    try {
      const res = await profileDetail(id);
      return res.data; // full API JSON
    } catch (err) {
      return rejectWithValue(err?.response?.data || err);
    }
  }
);

const initialState = {
  status: false,
  data: {
    id: null,
    username: "",
    bio: null,
    profile_picture: null,
    cover_picture: null,
    profile_type: "",
    visibility_status: "",
    followers_count: 0,
    following_count: 0,
    friends_count: 0,
    field_sections: [],
    is_friend: false,
    is_following: false,
    friend_request_status: null,
    friend_request_id: null,
    static_sections: [],
    got_friend_request: null,
    organized_events: [],
    website_url: null,
    tiktok_url: null,
    youtube_url: null,
    linkedin_url: null,
    instagram_url: null,
    twitter_url: null,
    facebook_url: null,
    awards: null,
    tools: null,
    notify_email: true,
    profile_tutorial: false,
    wall_tutorial: false,
    onboarding_required: true,
    total_posts_count: 0
  },
  loading: false,
  error: null
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setProfile: (state, action) => {
      state.status = action.payload.status;
      state.data = { ...state.data, ...action.payload.data };
    },
    clearProfile: (state) => {
      state.status = false;
      state.data = initialState.data;
      state.loading = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.status = action.payload.status ?? true;
        state.data = { ...state.data, ...action.payload.data };
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load profile";
      });
  }
});

export const { setProfile, clearProfile } = profileSlice.actions;
export default profileSlice.reducer;
