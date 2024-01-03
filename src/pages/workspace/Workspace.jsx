import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { UpdateWorkspaceNameApi, DeleteMemberApi, AddMemberApi, UpdateWorkspaceDeletePrivateApi, UpdateWorkspaceDeleteProtectedApi, UpdateWorkspaceDeletePublicApi, UpdateWorkspacePublicApi, UpdateWorkspaceProtectedApi, CreateProjectApi, UpdateWorkspacePrivateApi, UserApi, WorkspaceManagerApi, setProjectId, setWsId, MemberApi } from '../../redux/reducer/trelloReducer';
import { NavLink } from 'react-router-dom';

export default function Workspace() {
    const dispatch = useDispatch();
    const { user, workspace_manager, workspace, project, wsId, member_all, member, member_user, background } = useSelector(state => state.trelloReducer)
    const [showLimitCreation, setShowLimitCreation] = useState(false);
    const [showLimitDelete, setShowLimitDelete] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [workspaceName, setWorkspaceName] = useState(workspace.working_space_name);
    const [showModal, setShowModal] = useState(false);
    const [currentBg, setCurrentBg] = useState();
    const [projectTitle, setProjectTitle] = useState("");
    const [projectStatus, setProjectStatus] = useState("Không gian làm việc");
    const [selectedWorkspaceId, setSelectedWorkspaceId] = useState(``);
    const [userEmail, setUserEmail] = useState('');
    const [inputValue, setInputValue] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        // Gọi API để cập nhật tên không gian làm việc
        dispatch(UpdateWorkspaceNameApi(workspace_manager));
    };

    const handleLeaveClick = (mu) => {
        dispatch(DeleteMemberApi(mu));
    }

    const handleAddMember = async () => {
        dispatch(AddMemberApi(userEmail, wsId))
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleButtonClick = async (wsId) => {
        dispatch(setWsId(wsId));
        setShowModal(true);
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showModal && !event.target.closest('.create_project')) {
                handleCloseModal();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showModal]);

    const handleWorkspaceChange = (event) => {
        setSelectedWorkspaceId(event.target.value);
    };

    const handleStatusChange = (event) => {
        setProjectStatus(event.target.value);
    };

    const handleToggleLimitCreation = () => {
        setShowLimitCreation(prevState => !prevState);
    };

    const handleToggleLimitDelete = () => {
        setShowLimitDelete(prevState => !prevState);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showLimitCreation && !event.target.closest('.create_project')) {
                setShowLimitCreation(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showLimitCreation]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showLimitDelete && !event.target.closest('.create_project')) {
                setShowLimitDelete(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showLimitDelete]);

    const handleBgChange = (newBg) => {
        setCurrentBg(newBg);
    };

    const createProject = () => {
        dispatch(CreateProjectApi(selectedWorkspaceId, projectTitle, currentBg, projectStatus))
    };

    const handleSetProjectId = async (pId, wsId) => {
        dispatch(setProjectId(pId));
        dispatch(setWsId(wsId));
    }

    const handleUpdateWsPublic = async (wsId, status) => {
        dispatch(UpdateWorkspacePublicApi(wsId, status));
    }

    const handleUpdateWsProtected = async (wsId, status) => {
        dispatch(UpdateWorkspaceProtectedApi(wsId, status));
    }

    const handleUpdateWsPrivate = async (wsId, status) => {
        dispatch(UpdateWorkspacePrivateApi(wsId, status));
    }

    const handleUpdateWsDeletePublic = async (wsId, status) => {
        dispatch(UpdateWorkspaceDeletePublicApi(wsId, status));
    }

    const handleUpdateWsDeleteProtected = async (wsId, status) => {
        dispatch(UpdateWorkspaceDeleteProtectedApi(wsId, status));
    }

    const handleUpdateWsDeletePrivate = async (wsId, status) => {
        dispatch(UpdateWorkspaceDeletePrivateApi(wsId, status));
    }

    useEffect(() => {
        if (wsId) {
            const actionWorkspaceManager = WorkspaceManagerApi(wsId)
            dispatch(actionWorkspaceManager)
        }
    }, [dispatch])

    useEffect(() => {
        if (wsId) {
            const actionMember = MemberApi(wsId)
            dispatch(actionMember)
        }
    }, [dispatch])

    useEffect(() => {
        if (member) {
            const actionUser = UserApi()
            dispatch(actionUser)
        }
    }, [dispatch])


    const renderAddMemberModal = () => {
        return <div className="modal fade" id="AddMemberModal" tabIndex={-1} aria-labelledby="AddMemberModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="AddMemberModalLabel">Mời vào không gian làm việc</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                    </div>
                    <div className="modal-body">
                        <input type="text" name="user_name" value={userEmail}
                            onChange={(e) => setUserEmail(e.target.value)} placeholder="Địa chỉ email hoặc tên" />
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={handleAddMember}>Thêm</button>
                    </div>
                </div>
            </div>
        </div>
    }

    const renderWorkspaceOption = () => {
        return member_all.map((m, index) => {
            if (m.user_id == user.user_id) {
                return workspace.map((ws, index) => {
                    if (ws.working_space_id === m.working_space_id) {
                        return <option value={ws.working_space_id}>{ws.working_space_name}</option>
                    }
                })
            }
        })
    }

    const renderListBackground = () => {
        return background.map((bg, index) => {
            return <li key={index} onClick={() => handleBgChange(bg.background_src)} className='col-3 list_background_item mb-2'>
                <img style={{ width: "100%" }} src={bg.background_src} alt="" />
            </li>
        })
    }

    const renderCreateProjectModal = () => {
        if (!showModal) return null;
        return <div className="create_project">
            <div className="create_project_header">
                <h2 className='create_project_header_title'>
                    Tạo bảng
                </h2>
                <button onClick={handleCloseModal} className='create_project_header_close'>
                    <i className="fa fa-times"></i>
                </button>
            </div>
            <div className="create_project_content">
                <div className="kaGQXLXBcM0_mi">
                    <div className="U3cJFwAMTWKgYO" style={{ backgroundImage: `url(${currentBg})` }}>
                        <img src="https://trello.com/assets/14cda5dc635d1f13bc48.svg" alt="#" />
                    </div>
                </div>
                <div className="eCkm4CfIIzzW4L">
                    <div>
                        <span>Phông nền</span>
                    </div>
                    <div className="background">
                        <ul className='row list_background'>
                            {renderListBackground()}
                        </ul>
                    </div>
                    <form>
                        <div>
                            <label className='fMvxkh4DHKJGnq'>
                                <div>
                                    Tiêu đề bảng
                                    <span className='bKPMIrxAJqgHwG'>*</span>
                                </div>
                                <input type="text" className='lsOhPsHuxEMYEb' value={projectTitle}
                                    onChange={(e) => setProjectTitle(e.target.value)} />
                            </label>
                        </div>
                        <div className="AOsf5x5baMpD1a">
                            <span role="img" aria-label="wave" class="O45xR3m3EpkbfR">👋</span>
                            <p>Tiêu đề bảng là bắt buộc</p>
                        </div>
                        <label className='fMvxkh4DHKJGnq'>Không gian làm việc</label>
                        <div>
                            <div className="input-group mb-3">
                                <select onChange={handleWorkspaceChange} value={selectedWorkspaceId} className="form-select" id="inputGroupSelect01">
                                    {renderWorkspaceOption()}
                                </select>
                            </div>
                        </div>
                        <label className='fMvxkh4DHKJGnq'>Quyền xem</label>
                        <div>
                            <div className="input-group mb-3">
                                <select onChange={handleStatusChange} className="form-select" id="inputGroupSelect01">
                                    {renderWorkspaceProtected()}
                                    {renderWorkspacePrivate()}
                                    {renderWorkspacePublic()}
                                </select>
                            </div>
                        </div>
                    </form>
                    <button className={`hY6kPzdkHFJhfG ${projectTitle ? "active" : ""}`}
                        onClick={createProject}
                        disabled={!projectTitle}>
                        Tạo mới
                    </button>
                </div>
            </div>
        </div>
    }

    const renderWorkspacePublic = () => {
        let mb;
        member.forEach((item) => {
            if (item.user_id == user.user_id) {
                mb = item
            }
        })
        return workspace.map((ws, index) => {
            if (ws.working_space_id == wsId) {
                if (ws.working_space_public === 2) {
                    return null;
                }
                if (ws.working_space_public === 1 && mb.member_role === 'Quản trị viên') {
                    return <option value={"Công khai"}>Công khai</option>
                }
                if (ws.working_space_public === 1 && mb.member_role === 'Bình thường') {
                    return null;
                }
                if (ws.working_space_public === 0) {
                    return <option value={"Công khai"}>Công khai</option>
                }
            }
        })
    }

    const renderWorkspaceProtected = () => {
        let mb;
        member.forEach((item) => {
            if (item.user_id == user.user_id) {
                mb = item
            }
        })
        return workspace.map((ws, index) => {
            if (ws.working_space_id == wsId) {
                if (ws.working_space_protected === 2) {
                    return null;
                }
                if (ws.working_space_protected === 1 && mb.member_role === 'Quản trị viên') {
                    return <option value={"Không gian làm việc"}>Không gian làm việc</option>
                }
                if (ws.working_space_protected === 1 && mb.member_role === 'Bình thường') {
                    return null;
                }
                if (ws.working_space_protected === 0) {
                    return <option value={"Không gian làm việc"}>Không gian làm việc</option>
                }
            }
        })
    }

    const renderWorkspacePrivate = () => {
        let mb;
        member.forEach((item) => {
            if (item.user_id == user.user_id) {
                mb = item
            }
        })
        return workspace.map((ws, index) => {
            if (ws.working_space_id == wsId) {
                if (ws.working_space_private === 2) {
                    return null;
                }
                if (ws.working_space_private === 1 && mb.member_role === 'Quản trị viên') {
                    return <option value={"Riêng tư"}>Riêng tư</option>
                }
                if (ws.working_space_private === 1 && mb.member_role === 'Bình thường') {
                    return null;
                }
                if (ws.working_space_private === 0) {
                    return <option value={"Riêng tư"}>Riêng tư</option>
                }
            }
        })
    }

    const renderProjectitem = (wsId) => {
        return project.map((p, index) => {
            if (wsId == p.working_space_id) {
                return <div style={{ backgroundImage: `url(${p.project_background_src})` }} className="project_item col-4">
                    <NavLink onClick={() => { handleSetProjectId(p.project_id, p.working_space_id) }} to="/project" className="project_name">
                        {p.project_name}
                    </NavLink>
                </div>
            }
        })
    }

    const renderProjectMenuitem = (wsId) => {
        return project.map((p, index) => {
            if (wsId == p.working_space_id) {
                return <li style={{ backgroundColor: "#fff" }} className="list-group-item-p" aria-current="true">
                    <NavLink to="/project" style={{ color: '#000', textDecoration: 'none' }}>
                        <img className='me-2' src="./img/logo.png" />
                        {p.project_name}
                    </NavLink>
                </li>
            }
        })
    }

    const renderBtnUserRole = (userId) => {

        return member.map((mb, index) => {
            if (mb.user_id == userId) {
                return <button key={index} type="button" className="btn btn-primary me-2">
                    {mb.member_role}
                </button>
            }
        })
    }

    const renderMemberList = () => {
        return member_user.map((mu, index) => {
            return member.map((item, index) => {
                const isAdmin = item.member_role === "Quản trị viên";
                if (mu.user_id === item.user_id) {
                    return <div key={index} className="member_list mb-3 row">
                        <div className="member_item_left d-flex col">
                            <div className="logo_user">
                                <img src={mu.user_background_avatar_src} />
                            </div>
                            <div className="name_user">
                                <p>{mu.user_name}</p>
                                <span>{mu.user_email}</span>
                            </div>
                        </div>
                        <div className="member_item_right col">
                            {renderBtnUserRole(mu.user_id)}
                            <button type="button" className={`btn ${isAdmin ? "btn-danger" : "btn-secondary"}`}
                                onClick={isAdmin ? () => { handleLeaveClick(item) } : null}
                                disabled={!isAdmin}>
                                <i className="fa fa-times" />
                                Rời đi
                            </button>
                        </div>
                    </div>
                }
            })
        })
    }

    const renderLimitCreation = (wsId) => {
        if (!showLimitCreation) return null;
        return <div className="create_project">
            <div className="create_project_header">
                <h2 className='create_project_header_title'>
                    Chính Sách Hạn Chế Tạo Bảng
                </h2>
                <button onClick={handleToggleLimitCreation} className='create_project_header_close'>
                    <i className="fa fa-times"></i>
                </button>
            </div>
            <div className="create_project_content">
                <div className="eCkm4CfIIzzW4L">
                    <div>
                        <span>Ai có thể tạo các bảng công khai?</span>
                    </div>
                    <ul className="list_group_public">
                        <li onClick={() => { handleUpdateWsPublic(wsId, "0") }} className="list_group_public_item d-flex ">
                            <i class="fa fa-check"></i>
                            <p>Mọi thành viên Không gian làm việc</p>
                        </li>
                        <li onClick={() => { handleUpdateWsPublic(wsId, "1") }} className="list_group_public_item d-flex ">
                            <i class="fa fa-check"></i>
                            <p>Chỉ các quản trị viên Không gian làm việc</p>
                        </li>
                        <li onClick={() => { handleUpdateWsPublic(wsId, "2") }} className="list_group_public_item d-flex ">
                            <i class="fa fa-check"></i>
                            <p>Không ai</p>
                        </li>
                    </ul>
                    <div className="line"></div>
                    <div>
                        <span>Ai có thể tạo các bảng hiển thị trong Không gian làm việc?</span>
                    </div>
                    <ul className="list_group_public">
                        <li onClick={() => { handleUpdateWsProtected(wsId, "0") }} className="list_group_public_item d-flex ">
                            <i class="fa fa-check"></i>
                            <p>Mọi thành viên Không gian làm việc</p>
                        </li>
                        <li onClick={() => { handleUpdateWsProtected(wsId, "1") }} className="list_group_public_item d-flex ">
                            <i class="fa fa-check"></i>
                            <p>Chỉ các quản trị viên Không gian làm việc</p>
                        </li>
                        <li onClick={() => { handleUpdateWsProtected(wsId, "2") }} className="list_group_public_item d-flex ">
                            <i class="fa fa-check"></i>
                            <p>Không ai</p>
                        </li>
                    </ul>
                    <div className="line"></div>
                    <div>
                        <span>Ai có thể tạo bảng riêng tư?</span>
                    </div>
                    <ul className="list_group_public">
                        <li onClick={() => { handleUpdateWsPrivate(wsId, "0") }} className="list_group_public_item d-flex ">
                            <i class="fa fa-check"></i>
                            <p>Mọi thành viên Không gian làm việc</p>
                        </li>
                        <li onClick={() => { handleUpdateWsPrivate(wsId, "1") }} className="list_group_public_item d-flex ">
                            <i class="fa fa-check"></i>
                            <p>Chỉ các quản trị viên Không gian làm việc</p>
                        </li>
                        <li onClick={() => { handleUpdateWsPrivate(wsId, "2") }} className="list_group_public_item d-flex ">
                            <i class="fa fa-check"></i>
                            <p>Không ai</p>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    }

    const renderLimitDelete = (wsId) => {
        if (!showLimitDelete) return null;

        return <div className="create_project">
            <div className="create_project_header">
                <h2 className='create_project_header_title'>
                    Chính Sách Hạn Chế Xóa Bảng
                </h2>
                <button onClick={handleToggleLimitCreation} className='create_project_header_close'>
                    <i className="fa fa-times"></i>
                </button>
            </div>
            <div className="create_project_content">
                <div className="eCkm4CfIIzzW4L">
                    <div>
                        <span>Ai có thể tạo xóa bảng công khai?</span>
                    </div>
                    <ul className="list_group_public">
                        <li onClick={() => { handleUpdateWsDeletePublic(wsId, "0") }} className="list_group_public_item d-flex ">
                            <i class="fa fa-check"></i>
                            <p>Mọi thành viên Không gian làm việc</p>
                        </li>
                        <li onClick={() => { handleUpdateWsDeletePublic(wsId, "1") }} className="list_group_public_item d-flex ">
                            <i class="fa fa-check"></i>
                            <p>Chỉ các quản trị viên Không gian làm việc</p>
                        </li>
                        <li onClick={() => { handleUpdateWsDeletePublic(wsId, "2") }} className="list_group_public_item d-flex ">
                            <i class="fa fa-check"></i>
                            <p>Không ai</p>
                        </li>
                    </ul>
                    <div className="line"></div>
                    <div>
                        <span>Ai có thể xóa các bảng hiển thị trong Không gian làm việc?</span>
                    </div>
                    <ul className="list_group_public">
                        <li onClick={() => { handleUpdateWsDeleteProtected(wsId, "0") }} className="list_group_public_item d-flex ">
                            <i class="fa fa-check"></i>
                            <p>Mọi thành viên Không gian làm việc</p>
                        </li>
                        <li onClick={() => { handleUpdateWsDeleteProtected(wsId, "1") }} className="list_group_public_item d-flex ">
                            <i class="fa fa-check"></i>
                            <p>Chỉ các quản trị viên Không gian làm việc</p>
                        </li>
                        <li onClick={() => { handleUpdateWsDeleteProtected(wsId, "2") }} className="list_group_public_item d-flex ">
                            <i class="fa fa-check"></i>
                            <p>Không ai</p>
                        </li>
                    </ul>
                    <div className="line"></div>
                    <div>
                        <span>Ai có thể xóa bảng riêng tư?</span>
                    </div>
                    <ul className="list_group_public">
                        <li onClick={() => { handleUpdateWsDeletePrivate(wsId, "0") }} className="list_group_public_item d-flex ">
                            <i class="fa fa-check"></i>
                            <p>Mọi thành viên Không gian làm việc</p>
                        </li>
                        <li onClick={() => { handleUpdateWsDeletePrivate(wsId, "1") }} className="list_group_public_item d-flex ">
                            <i class="fa fa-check"></i>
                            <p>Chỉ các quản trị viên Không gian làm việc</p>
                        </li>
                        <li onClick={() => { handleUpdateWsDeletePrivate(wsId, "2") }} className="list_group_public_item d-flex ">
                            <i class="fa fa-check"></i>
                            <p>Không ai</p>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    }

    const renderTitleDeleteWsPublic = () => {
        if (workspace_manager.working_space_delete_public === 2) {
            return <p className='mb-2'>
                Không ai có thể xóa <i style={{ color: "green" }} class="fa fa-globe-americas"></i> các bảng công khai.
            </p>
        }
        if (workspace_manager.working_space_delete_public === 1) {
            return <p className='mb-2'>
                Chỉ các quản trị viên Không gian làm việc mới có thể xóa <i style={{ color: "green" }} class="fa fa-globe-americas"></i> các bảng công khai.
            </p>
        }
        if (workspace_manager.working_space_delete_public === 0) {
            return <p className='mb-2'>
                Bất kỳ thành viên Không gian làm việc nào cũng có thể xóa <i style={{ color: "green" }} class="fa fa-globe-americas"></i> các bảng công khai.
            </p>
        }
    }

    const renderTitleDeleteWsProtected = () => {
        if (workspace_manager.working_space_delete_protected === 2) {
            return <p className='mb-2'>
                Không ai có thể xóa <i style={{ color: "orange" }} class="fa fa-user-friends"></i> các bảng hiển thị trong Không gian làm việc.
            </p>
        }
        if (workspace_manager.working_space_delete_protected === 1) {
            return <p className='mb-2'>
                Chỉ các quản trị viên Không gian làm việc mới có thể xóa <i style={{ color: "orange" }} class="fa fa-user-friends"></i> các bảng hiển thị trong Không gian làm việc.
            </p>
        }
        if (workspace_manager.working_space_delete_protected === 0) {
            return <p className='mb-2'>
                Bất kỳ thành viên Không gian làm việc nào cũng có thể xóa <i style={{ color: "orange" }} class="fa fa-user-friends"></i> các bảng hiển thị trong Không gian làm việc.
            </p>
        }
    }

    const renderTitleDeleteWsPrivate = () => {
        if (workspace_manager.working_space_delete_private === 2) {
            return <p className='mb-2'>
                Không ai có thể xóa <i style={{ color: "red" }} class="fa fa-lock"></i> các bảng riêng tư.
            </p>
        }
        if (workspace_manager.working_space_delete_private === 1) {
            return <p className='mb-2'>
                Chỉ các quản trị viên Không gian làm việc mới có thể xóa <i style={{ color: "red" }} class="fa fa-lock"></i> các bảng riêng tư.
            </p>
        }
        if (workspace_manager.working_space_delete_private === 0) {
            return <p className='mb-2'>
                Bất kỳ thành viên Không gian làm việc nào cũng có thể xóa <i style={{ color: "red" }} class="fa fa-lock"></i> các bảng riêng tư.
            </p>
        }
    }

    const renderTitleCreateWsPublic = () => {
        if (workspace_manager.working_space_public === 2) {
            return <p className='mb-2'>
                Không ai có thể tạo <i style={{ color: "green" }} class="fa fa-globe-americas"></i> các bảng công khai.
            </p>
        }
        if (workspace_manager.working_space_public === 1) {
            return <p className='mb-2'>
                Chỉ các quản trị viên Không gian làm việc mới có thể tạo <i style={{ color: "green" }} class="fa fa-globe-americas"></i> các bảng công khai.
            </p>
        }
        if (workspace_manager.working_space_public === 0) {
            return <p className='mb-2'>
                Bất kỳ thành viên Không gian làm việc nào cũng có thể tạo <i style={{ color: "green" }} class="fa fa-globe-americas"></i> các bảng công khai.
            </p>
        }
    }

    const renderTitleCreateWsProtected = () => {
        if (workspace_manager.working_space_protected === 2) {
            return <p className='mb-2'>
                Không ai có thể tạo <i style={{ color: "orange" }} class="fa fa-user-friends"></i> các bảng hiển thị trong Không gian làm việc.
            </p>
        }
        if (workspace_manager.working_space_protected === 1) {
            return <p className='mb-2'>
                Chỉ các quản trị viên Không gian làm việc mới có thể tạo <i style={{ color: "orange" }} class="fa fa-user-friends"></i> các bảng hiển thị trong Không gian làm việc.
            </p>
        }
        if (workspace_manager.working_space_protected === 0) {
            return <p className='mb-2'>
                Bất kỳ thành viên Không gian làm việc nào cũng có thể tạo <i style={{ color: "orange" }} class="fa fa-user-friends"></i> các bảng hiển thị trong Không gian làm việc.
            </p>
        }
    }

    const renderTitleCreateWsPrivate = () => {
        if (workspace_manager.working_space_private === 2) {
            return <p className='mb-2'>
                Không ai có thể tạo <i style={{ color: "red" }} class="fa fa-lock"></i> các bảng riêng tư.
            </p>
        }
        if (workspace_manager.working_space_private === 1) {
            return <p className='mb-2'>
                Chỉ các quản trị viên Không gian làm việc mới có thể tạo <i style={{ color: "red" }} class="fa fa-lock"></i> các bảng riêng tư.
            </p>
        }
        if (workspace_manager.working_space_private === 0) {
            return <p className='mb-2'>
                Bất kỳ thành viên Không gian làm việc nào cũng có thể tạo <i style={{ color: "red" }} class="fa fa-lock"></i> các bảng riêng tư.
            </p>
        }
    }

    const renderDeleteWorkSpaceModal = (ws) => {
        const handleSubmit = async (event) => {
            event.preventDefault();
            if (inputValue === ws.working_space_name) {

            }
        };

        const isButtonDisabled = inputValue !== ws.working_space_name;

        return <div className="modal fade" id="DeleteWorkSpaceModal" tabIndex={-1} aria-labelledby="DeleteWorkSpaceModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="DeleteWorkSpaceModalLabel">Xóa không gian làm việc?</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                    </div>
                    <div className="modal-body">
                        <h4>Nhập tên không gian làm việc {ws.working_space_name} để xóa</h4>
                        <span>Những điều cần biết:</span>
                        <ul>
                            <li>Điều này là vĩnh viễn và không thể hoàn tác.</li>
                            <li>Tất cả các bảng trong Không gian làm việc này sẽ bị đóng.</li>
                            <li>Các quản trị viên bảng có thể mở lại các bảng.</li>
                            <li>Các thành viên bảng sẽ không thể tương tác với các bảng đã đóng.</li>
                        </ul>
                        <span>Nhập tên không gian làm việc để xóa</span>
                        <form onSubmit={handleSubmit}>
                            <input type="text" name="workspace_name" value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
                            <button type="submit" className={`btn ${isButtonDisabled ? 'btn-secondary' : 'btn-danger'}`} disabled={isButtonDisabled}>
                                Xóa không gian làm việc
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    }

    return (
        <div>
            <div className="container-fluid">
                <div className="row">
                    <nav className="menu p-0 col" style={{ backgroundColor: "#fff" }}>
                        <div className="menu__header">
                            <div className="menu__header__left">
                                <img src="./img/logo.png" />
                            </div>
                            <div className="menu__header__mid">
                                <p>{user.user_name}</p>
                                <span>Miễn phí</span>
                            </div>
                            <div className="menu__header__right">
                                <div>
                                    <i className="fa fa-angle-left" />
                                </div>
                            </div>
                        </div>
                        <div className="menu__mid pt-1 mb-3">
                            <div className="menu__mid__item">
                                <i className="fa fa-table" />
                                <span>Bảng</span>
                            </div>
                            <div className="menu__mid__item">
                                <i className="fa fa-user" />
                                <span>Thành viên</span>
                                <i className="fa fa-plus user__add" data-bs-toggle="modal" data-bs-target="#AddMemberModal" />
                            </div>
                            <div className="menu__mid__item">
                                <i className="fa fa-cog" />
                                <span>Cài đặt</span>
                            </div>
                        </div>
                        <div className="menu__bottom">
                            <div className="menu__bottom__title">
                                <p>Các bảng của bạn</p>
                                <i data-bs-toggle="modal" data-bs-target="#WorkSpaceModal" className="fa fa-plus" />
                            </div>
                            <ul className="list-group">
                                {renderProjectMenuitem(wsId)}
                            </ul>
                        </div>
                    </nav>
                    <div className="content col">
                        <div className="content_header row">
                            <div className="user_avatar col-2 p-0">
                                <img src="./img/logo.png" />
                            </div>
                            {!isEditing ? (
                                <div className="workspace_name col-5 d-flex">
                                    <h3>{workspace_manager.working_space_name}</h3>
                                    <i className="fa fa-edit edit_workspace" onClick={() => setIsEditing(true)} />
                                </div>
                            ) : (
                                <div className="workspace_update col-5">
                                    <form method="post" className="d-flex" onSubmit={handleSubmit}>
                                        <input type="text" name="ws_name" value={workspace_manager.working_space_name} onChange={(e) => setWorkspaceName(e.target.value)} />
                                        <div className="btn-option">
                                            <button type="submit" className="btn btn-primary">Lưu</button>
                                            <button type="button" className="btn close" onClick={() => setIsEditing(false)}>Hủy</button>
                                        </div>
                                    </form>
                                </div>
                            )}
                            <div className="add_member col-5">
                                <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#AddMemberModal">
                                    <i className="fa fa-user-plus" />
                                    <span>Mời các thành viên vào Không gian làm việc</span>
                                </button>
                            </div>
                        </div>
                        <div id="board" className="list_project mt-5">
                            <h4 className="list_project_title mb-4">Bảng</h4>
                            <div className="project_group row ">
                                <div onClick={() => { handleButtonClick(workspace_manager.working_space_id) }} className="project_item_create col-4">
                                    <span>Tạo bảng mới</span>
                                    {renderCreateProjectModal()}
                                </div>
                                {renderProjectitem(wsId)}
                            </div>
                        </div>
                        <div id="member" className="list_project mt-5">
                            <h4 className="list_member_title mb-4">Thành viên</h4>
                            <h4 className="list_member_title mb-4">Các thành viên trong không gian làm việc (1)</h4>
                            <p>Các thành viên trong Không gian làm việc có thể xem và tham gia tất cả các bảng Không gian làm
                                việc hiển thị và tạo ra các bảng mới trong Không gian làm việc.</p>
                            <div className="member_group">
                                {renderMemberList()}
                            </div>
                            <h4 className="list_member_title mb-4">Khách (0)</h4>
                            <p>Khách chỉ có thể xem và chỉnh sửa bảng mà họ được thêm vào.</p>
                        </div>
                        <div id="setting" className="list_project mt-5">
                            <h4 className="list_setting_title mb-4">Cài đặt</h4>
                            <h4 className="list_member_title mb-4">Các cài đặt không gian làm việc</h4>
                            <div className="setting_option_list">
                                <div className="setting_option_item mb-5">
                                    <button type="button" style={{ backgroundColor: "#091e420f", fontWeight: "500" }} class="btn">Thay đổi</button>
                                    <h4 style={{ fontSize: "16px" }} className="list_member_title mb-4">
                                        Khả năng hiển thị trong Không gian làm việc
                                    </h4>
                                    <div className="line"></div>
                                    <p>
                                        Riêng tư - Đây là Không gian làm việc riêng tư. Chỉ những người trong Không gian làm việc có thể truy cập hoặc nhìn thấy Không gian làm việc.
                                    </p>
                                </div>
                                <div className="setting_option_item mb-5">
                                    <button type="button" style={{ backgroundColor: "#091e420f", fontWeight: "500" }} class="btn">Thay đổi</button>
                                    <h4 style={{ fontSize: "16px" }} className="list_member_title mb-4">
                                        Chính sách hạn chế tư cách thành viên Không gian làm việc
                                    </h4>
                                    <div className="line"></div>
                                    <p>
                                        Bất kỳ ai cũng có thể được thêm vào Không gian làm việc này.
                                    </p>
                                </div>
                                <div className="setting_option_item mb-5">
                                    <button onClick={handleToggleLimitCreation} type="button" style={{ backgroundColor: "#091e420f", fontWeight: "500" }} class="btn">Thay đổi</button>
                                    <h4 style={{ fontSize: "16px" }} className="list_member_title mb-4">
                                        Chính sách hạn chế tạo bảng
                                    </h4>
                                    {showLimitCreation && renderLimitCreation(wsId)}
                                    <div className="line"></div>
                                    {renderTitleCreateWsPublic()}
                                    {renderTitleCreateWsProtected()}
                                    {renderTitleCreateWsPrivate()}
                                </div>
                                <div className="setting_option_item mb-5">
                                    <button onClick={handleToggleLimitDelete} type="button" style={{ backgroundColor: "#091e420f", fontWeight: "500" }} class="btn">Thay đổi</button>
                                    <h4 style={{ fontSize: "16px" }} className="list_member_title mb-4">
                                        Chính Sách Hạn Chế Xóa Bảng
                                    </h4>
                                    {showLimitDelete && renderLimitDelete(wsId)}
                                    <div className="line"></div>
                                    {renderTitleDeleteWsPublic()}
                                    {renderTitleDeleteWsProtected()}
                                    {renderTitleDeleteWsPrivate()}
                                </div>
                                <div className="setting_option_item mb-5">
                                    <button type="button" style={{ backgroundColor: "#091e420f", fontWeight: "500" }} class="btn">Thay đổi</button>
                                    <h4 style={{ fontSize: "16px" }} className="list_member_title mb-4">
                                        Chia sẻ các bảng với khách
                                    </h4>
                                    <div className="line"></div>
                                    <p>
                                        Bất kỳ ai cũng có thể gửi hoặc nhận lời mời tham gia các bảng trong Không gian làm việc này.
                                    </p>
                                </div>
                            </div>

                            {/* Button trigger modal */}
                            <button type="button" className="btn btn-danger" data-bs-toggle="modal" data-bs-target="#DeleteWorkSpaceModal">
                                Xóa không gian làm việc này?
                            </button>
                            {/* Modal */}
                            {renderDeleteWorkSpaceModal(workspace_manager)}
                        </div>
                    </div>
                </div>
            </div>
            {/* Modal */}
            {renderAddMemberModal()}
            {/* Modal */}
            <div className="modal fade" id="WorkSpaceModal" tabIndex={-1} aria-labelledby="WorkSpaceModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                        </div>
                        <div className="modal-body">
                            <form method="post">
                                <h3>Hãy xây dựng một không gian làm việc</h3>
                                <p>Tên không gian làm việc</p>
                                <input type="text" name="working_space_name" id placeholder="Công ty của ..." />
                                <span>Đây là tên công ty, nhóm hoặc tổ chức của bạn.</span>
                                <p>Mô tả không gian làm việc</p>
                                <textarea name="working_space" id rows={10} defaultValue={""} />
                                <span>Đưa các thành viên của bạn vào bảng với mô tả ngắn về Không gian làm việc của bạn.</span>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary">Save changes</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
