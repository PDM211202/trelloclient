import { createSlice } from '@reduxjs/toolkit'
import axios from 'axios';
import Cookies from 'js-cookie';

const initialState = {
  // listPhimLe: [],
  login: [],
  user: {},
  workspace: [],
  project: []
}

const trelloReducer = createSlice({
  name: "trello",
  initialState,
  reducers: {
    setLogin: (state, action) => {
      state.login = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setWorkspace: (state, action) => {
      state.workspace = action.payload;
      console.log("object" , state.workspace);
    },
    setProject: (state, action) => {
      state.project = action.payload;
    }
  }
});

export const { setLogin, setUser, setWorkspace, setProject  } = trelloReducer.actions

export default trelloReducer.reducer

export const loginApi = (email, password) => {
  return async dispatch => {
    // Lưu trữ thông tin đăng nhập vào Redux
    dispatch(setLogin({ email, password }));
    // Lưu trữ email và password vào cookie
    Cookies.set('email', email, { expires: 1 });
    Cookies.set('password', password, { expires: 1 });
    try {
      // Gửi yêu cầu đến server với cookie
      const response = await axios.post('http://localhost:8080/itad/api/LoginApi', {}, {
        withCredentials: true // Quan trọng để gửi cookie
      });
      if (response.data) {
        dispatch(setUser(response.data));
      }
    } catch (error) {
      console.error(error);
    }
  };
};

export const WorkspaceApi = (userId) => {
  return async dispatch => {
    try {
      // Tạo dữ liệu form
      const formData = new URLSearchParams();
      formData.append('user_id', userId);

      const response = await axios.post('http://localhost:8080/itad/api/WorkspaceApi', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      if (response.data) {
        dispatch(setWorkspace(response.data));
      }
    } catch (error) {
      console.error(error);
    }
  };
};

export const ProjectApi = (wsId) => {
  return async dispatch => {
    try {
      // Tạo dữ liệu form
      const formData = new URLSearchParams();
      formData.append('working_space_id', wsId);

      const response = await axios.post('http://localhost:8080/itad/api/ProjectApi', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      if (response.data) {
        dispatch(setProject(response.data));
      }
    } catch (error) {
      console.error(error);
    }
  };
};