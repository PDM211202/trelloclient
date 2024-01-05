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
  member_login: {}
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
    },
    setMember_login: (state, action) => {
      const filteredMembers = state.member.filter(mb => mb.user_id === state.user.user_id);
      state.member_login = filteredMembers[0];
    }
  }
});

export const { setMember_login, setMember_all, setBackground, setMember_user, setMember, setWork, setLogin, setUser, setWorkspace, setProject, setWorkspace_manager, setWsId, setProjectId, setTask } = trelloReducer.actions

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
        dispatch(setWorkspace_manager(response.data));
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
        dispatch(setWorkspace_manager(response.data));
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
        dispatch(setWorkspace_manager(response.data));
      }
    } catch (error) {
      console.error(error);
    }
  };
};

export const CreateWorkspaceApi = (ws_name, ws_description, user_id, ws_id) => {
  return async dispatch => {
    try {
      // Tạo dữ liệu form
      const formData = new URLSearchParams();
      formData.append('working_space_name', ws_name);
      formData.append('working_space_description', ws_description);
      formData.append('working_space_description', ws_id);
      formData.append('user_id', user_id);

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

export const AddMemberApi = (user_email, ws_id) => {
  return async dispatch => {
    try {
      // Tạo dữ liệu form
      const formData = new URLSearchParams();
      formData.append('user_email', user_email);
      formData.append('working_space_id', ws_id);

      const response = await axios.post('http://localhost:8080/itad/api/MemberApi', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      if (response.data) {
        dispatch(setMember_user(response.data));
      }
    } catch (error) {
      console.error(error);
    }
  };
};

export const UpdateWorkspaceDeletePublicApi = (wsId, status) => {
  return async dispatch => {
    try {
      // Tạo dữ liệu form
      const formData = new URLSearchParams();
      formData.append('working_space_id', wsId);
      formData.append('working_space_delete_public', status);

      const response = await axios.post('http://localhost:8080/itad/api/WorkspaceApi', formData, {
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

export const UpdateWorkspaceDeleteProtectedApi = (wsId, status) => {
  return async dispatch => {
    try {
      // Tạo dữ liệu form
      const formData = new URLSearchParams();
      formData.append('working_space_id', wsId);
      formData.append('working_space_delete_protected', status);

      const response = await axios.post('http://localhost:8080/itad/api/WorkspaceApi', formData, {
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

export const UpdateWorkspaceDeletePrivateApi = (wsId, status) => {
  return async dispatch => {
    try {
      // Tạo dữ liệu form
      const formData = new URLSearchParams();
      formData.append('working_space_id', wsId);
      formData.append('working_space_delete_private', status);

      const response = await axios.post('http://localhost:8080/itad/api/WorkspaceApi', formData, {
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

export const UpdateProjectNameApi = (pId, pName) => {
  return async dispatch => {
    try {
      // Tạo dữ liệu form
      const formData = new URLSearchParams();
      formData.append('project_id', pId);
      formData.append('project_name', pName);

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

export const CreateWorkApi = (pId, wName) => {
  return async dispatch => {
    try {
      // Tạo dữ liệu form
      const formData = new URLSearchParams();
      formData.append('project_id', pId);
      formData.append('work_name', wName);

      const response = await axios.post('http://localhost:8080/itad/api/WorkApi', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      if (response.data) {
        dispatch(setWork(response.data));
      }
    } catch (error) {
      console.error(error);
    }
  };
};

export const UpdateWorkNameApi = (work_id, wName) => {
  return async dispatch => {
    try {
      // Tạo dữ liệu form
      const formData = new URLSearchParams();
      formData.append('work_id', work_id);
      formData.append('work_name', wName);
      formData.append('update_work_name', wName);

      const response = await axios.post('http://localhost:8080/itad/api/WorkApi', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      if (response.data) {
        dispatch(setWork(response.data));
      }
    } catch (error) {
      console.error(error);
    }
  };
};

export const CreateTaskApi = (wId, tName) => {
  return async dispatch => {
    try {
      // Tạo dữ liệu form
      const formData = new URLSearchParams();
      formData.append('work_id', wId);
      formData.append('task_name', tName);

      const response = await axios.post('http://localhost:8080/itad/api/TaskApi', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      if (response.data) {
        dispatch(setTask(response.data));
      }
    } catch (error) {
      console.error(error);
    }
  };
};

export const DeleteMemberApi = (mu) => {
  return async dispatch => {
    try {
      // Tạo dữ liệu form
      const formData = new URLSearchParams();
      formData.append('member_id', mu.member_id);
      formData.append('delete_member', mu.member_id);
      formData.append('working_space_id', mu.working_space_id);

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

export const DeleteWorkspaceApi = (ws) => {
  return async dispatch => {
    try {
      // Tạo dữ liệu form
      const formData = new URLSearchParams();
      formData.append('working_space_id', ws.working_space_id);
      formData.append('delete_member', ws.working_space_id);

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

export const UpdateWorkspaceNameApi = (ws) => {
  return async dispatch => {
    try {
      // Tạo dữ liệu form
      const formData = new URLSearchParams();
      formData.append('working_space_id', ws.working_space_id);
      formData.append('working_space_name', ws.working_space_name);
      formData.append('update_name', ws.working_space_name);
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

export const UpdateMemberRoleApi = (ws, role) => {
  return async dispatch => {
    try {
      // Tạo dữ liệu form
      const formData = new URLSearchParams();
      formData.append('member_id', ws.member_id);
      formData.append('working_space_id', ws.working_space_id);
      formData.append('user_roles', role);
      const response = await axios.post('http://localhost:8080/itad/api/MemberApi', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      if (response.data) {
        dispatch(setMember(response.data));
      }
      console.log("api", response.data);
    } catch (error) {
      console.error(error);
    }
  };
};

export const GetMemberRoleApi = (uId, wsId) => {
  return async dispatch => {
    try {
      // Tạo dữ liệu form
      const formData = new URLSearchParams();
      formData.append('user_id', uId);
      formData.append('working_space_id', wsId);
      formData.append('get_member', "1");
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