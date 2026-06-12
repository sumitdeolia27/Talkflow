import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../api/axios.js'
import toast from 'react-hot-toast'


const initialState = {
    value: null,
    loading: false,
    error: null,
}

const normalizeUser = (user) => {
    if (!user) return null

    return {
        ...user,
        followers: Array.isArray(user.followers) ? user.followers : [],
        following: Array.isArray(user.following) ? user.following : [],
        connections: Array.isArray(user.connections) ? user.connections : [],
        bio: user.bio || 'Hey there! I am using TalkFlow.',
        profile_picture: user.profile_picture || '',
        cover_photo: user.cover_photo || '',
        location: user.location || '',
    }
}

export const fetchUser = createAsyncThunk('user/fetchUser', async (token, { rejectWithValue }) => {
    if (!token) {
        return rejectWithValue('Firebase login token is missing. Please sign in again.')
    }

    const { data } = await api.get('/api/user/data', {
        headers: {Authorization: `Bearer ${token}`}
    })
    return data.success ? normalizeUser(data.user) : rejectWithValue(data.message || 'Failed to load user profile')
})

export const updateUser = createAsyncThunk('user/update', async ({userData ,token}) => {
    const { data } = await api.post('/api/user/update', userData, {
        headers: {Authorization: `Bearer ${token}`}
    })
    if(data.success){
        toast.success(data.message)
        return data.user
    }else{
        toast.error(data.message)
        return null
    }
})


const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {

    },
    extraReducers: (builder)=>{
        builder.addCase(fetchUser.pending, (state)=>{
            state.loading = true
            state.error = null
        }).addCase(fetchUser.fulfilled, (state, action)=>{
            state.loading = false
                state.value = normalizeUser(action.payload)
        }).addCase(fetchUser.rejected, (state, action)=>{
            state.loading = false
            state.error = action.payload || action.error.message
        }).addCase(updateUser.fulfilled, (state, action)=>{
            state.value = normalizeUser(action.payload)
        })
    }
})

export default userSlice.reducer
