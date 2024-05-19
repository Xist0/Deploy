import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

const initialState = {
    loading: false,
    token: localStorage.getItem('token'),
    roleName: localStorage.getItem("roleName"),
    name: localStorage.getItem("name"),
    error: undefined
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logOut: (state) => {
            state.error = undefined
            state.loading = true
            state.name = undefined
            state.roleName = undefined
            state.token = undefined

            localStorage.removeItem("token")
            localStorage.removeItem("roleName")
            localStorage.removeItem("name")
        }
    },
    extraReducers: (builder) => {
        builder.addCase(loginThunk.pending, (state, action) => {
            state.loading = true
        })
        builder.addCase(loginThunk.fulfilled, (state, action) => {
            const payload = action.payload
            state.token = payload.token
            state.name = payload.user.name
            state.roleName = payload.user.roleName

            localStorage.setItem("token", payload.token)
            localStorage.setItem("name", payload.user.name)
            localStorage.setItem("roleName", payload.user.roleName)
            state.error = undefined
            state.loading = false
        })
        builder.addCase(loginThunk.rejected, (state, action) => {
            const payload = action.payload
            state.error = payload.message
            state.loading = false
        })
    }
})

export const loginThunk = createAsyncThunk("logThunk", async (data, { rejectWithValue }) => {
    const { username, password } = data

    try {
        const result = await fetch('/auth', {
            method: 'POST',
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        })
        const json = await result.json()
        if (result.status === 400) {
            return rejectWithValue(json)
        }
        return json
    } catch (error) {
        console.log(error);
        return rejectWithValue(error.message)
    }
})

export const { logOut } = authSlice.actions

export default authSlice.reducer