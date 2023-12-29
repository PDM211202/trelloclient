import { createSlice } from '@reduxjs/toolkit'
import axios from 'axios';
import Cookies from 'js-cookie';

const initialState = {
  // listPhimLe: [],
  login: [],
  user: {},
  workspace: [],
  project: [],
  wsId: '',
  projectId: '',
  workspace_manager: [],
  work: [],
  task: [],
  member: [],
  member_user: [],
  background: [],
  member_all: [],
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
      // console.log("object" , state.workspace);
    },
    setProject: (state, action) => {
      state.project = action.payload;
    },
    setWorkspace_manager: (state, action) => {
      state.workspace_manager = action.payload;
    },
    setWsId: (state, action) => {
      state.wsId = `${action.payload}`;
    },
    setProjectId: (state, action) => {
      state.projectId = `${action.payload}`;
    },
    setWork: (state, action) => {
      state.work = action.payload;
    },
    setTask: (state, action) => {
      state.task = action.payload;
    },
    setMember: (state, action) => {
      state.member = action.payload;
    },
    setMember_user: (state, action) => {
      const memberUserIds = state.member.map(member => member.user_id);
      const matchedUsers = action.payload.filter(user => memberUserIds.includes(user.user_id));
      state.member_user = matchedUsers;
    },
    setBackground: (state, action) => {
      state.background = action.payload;
    },
    setMember_all: (state, action) => {
      state.member_all = action.payload;
    }
  }
});

export const { setMember_all, setBackground, setMember_user, setMember, setWork, setLogin, setUser, setWorkspace, setProject, setWorkspace_manager, setWsId, setProjectId, setTask } = trelloReducer.actions

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

export const ProjectApi = () => {
  return async dispatch => {
    try {
      const response = await axios.get('http://localhost:8080/itad/api/ProjectApi');
      if (response.data) {
        dispatch(setProject(response.data));
      }
      // console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };
};

export const WorkspaceManagerApi = (wsId) => {
  return async dispatch => {
    try {
      // Tạo dữ liệu form
      const formData = new URLSearchParams();
      formData.append('working_space_id', `${wsId}`);

      const response = await axios.post('http://localhost:8080/itad/api/WorkspaceManager', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      if (response.data) {
        dispatch(setWorkspace_manager(response.data));
      }
    } catch (error) {
      console.error(error);
    }
  };
};

export const WorkApi = () => {
  return async dispatch => {
    try {
      const response = await axios.get('http://localhost:8080/itad/api/WorkApi');
      if (response.data) {
        dispatch(setWork(response.data));
      }
      // console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };
};

export const TaskApi = () => {
  return async dispatch => {
    try {
      const response = await axios.get('http://localhost:8080/itad/api/TaskApi');
      if (response.data) {
        dispatch(setTask(response.data));
      }
      // console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };
};

export const MemberApi = (wsId) => {
  return async dispatch => {
    try {
      // Tạo dữ liệu form
      const formData = new URLSearchParams();
      formData.append('working_space_id', wsId); 

      const response = await axios.post('http://localhost:8080/itad/api/MemberApi', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      if (response.data) {
        dispatch(setMember(response.data));
      }
    } catch (error) {
      console.error(error);
    }
  };
};

export const UserApi = () => {
  return async dispatch => {
    try {
      const response = await axios.get('http://localhost:8080/itad/api/UserApi');
      if (response.data) {
        dispatch(setMember_user(response.data));
      }
      // console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };
};

export const MemberAllApi = () => {
  return async dispatch => {
    try {
      const response = await axios.get('http://localhost:8080/itad/api/MemberApi');
      if (response.data) {
        dispatch(setMember_all(response.data));
      }
      // console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };
};

export const BackgroundApi = () => {
  return async dispatch => {
    try {
      const response = await axios.get('http://localhost:8080/itad/api/BackgroundApi');
      if (response.data) {
        dispatch(setBackground(response.data));
      }
      // console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };
};

export const CreateProjectApi = (wsId, pName, pBg, pSt) => {
  return async dispatch => {
    try {
      // Tạo dữ liệu form
      const formData = new URLSearchParams();
      formData.append('working_space_id', wsId);
      formData.append('project_name', pName);
      formData.append('project_background_src', pBg);
      formData.append('project_status', pSt);

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

export const UpdateWorkspacePublicApi = (wsId, status) => {
  return async dispatch => {
    try {
      // Tạo dữ liệu form
      const formData = new URLSearchParams();
      formData.append('working_space_id', wsId);
      formData.append('working_space_public', status);

      const response = await axios.post('http://localhost:8080/itad/api/WorkspaceApi', formData, {
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

export const UpdateWorkspaceProtectedApi = (wsId, status) => {
  return async dispatch => {
    try {
      // Tạo dữ liệu form
      const formData = new URLSearchParams();
      formData.append('working_space_id', wsId);
      formData.append('working_space_protected', status);

      const response = await axios.post('http://localhost:8080/itad/api/WorkspaceApi', formData, {
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

export const UpdateWorkspacePrivateApi = (wsId, status) => {
  return async dispatch => {
    try {
      // Tạo dữ liệu form
      const formData = new URLSearchParams();
      formData.append('working_space_id', wsId);
      formData.append('working_space_private', status);

      const response = await axios.post('http://localhost:8080/itad/api/WorkspaceApi', formData, {
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