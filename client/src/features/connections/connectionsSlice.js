import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../api/axios'


const initialState = {
    connections: [],
    pendingConnections: [],
    followers: [],
    following: []
}

const normalizeConnections = (payload) => ({
    connections: Array.isArray(payload?.connections) ? payload.connections : [],
    pendingConnections: Array.isArray(payload?.pendingConnections) ? payload.pendingConnections : [],
    followers: Array.isArray(payload?.followers) ? payload.followers : [],
    following: Array.isArray(payload?.following) ? payload.following : [],
})

export const fetchConnections = createAsyncThunk('connections/fetchConnections', async (token) => {
    if (!token) return null;

    const { data } = await api.get('/api/user/connections', {
         headers: { Authorization: `Bearer ${token}` },
    })
    return data.success ? data : null;
})

const connectionsSlice = createSlice({
    name: 'connections',
    initialState,
    reducers: {

    },
    extraReducers: (builder)=>{
        builder.addCase(fetchConnections.fulfilled, (state, action)=>{
            if(action.payload){
                const payload = normalizeConnections(action.payload)
                state.connections = payload.connections
                state.pendingConnections = payload.pendingConnections
                state.followers = payload.followers
                state.following = payload.following
            }
        })
    }
})

export default connectionsSlice.reducer
