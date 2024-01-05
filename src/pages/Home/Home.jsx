import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { GetMemberRoleApi, CreateWorkspaceApi, setMember_login, CreateProjectApi, MemberAllApi, WorkspaceApi, MemberApi, BackgroundApi, ProjectApi, setProjectId, setWsId } from '../../redux/reducer/trelloReducer';
import { NavLink } from 'react-router-dom';


export default function Home() {
    const { user, workspace, project, member_user, member_login, wsId, background, member, member_all } = useSelector(state => state.trelloReducer)
    const [showDropdown, setShowDropdown] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [currentBg, setCurrentBg] = useState();
    const [projectTitle, setProjectTitle] = useState("")
    const [projectStatus, setProjectStatus] = useState("Không gian làm việc");
    const [selectedWorkspaceId, setSelectedWorkspaceId] = useState(``);

    const [workspaceName, setWorkspaceName] = useState('');
    const [workspaceDescription, setWorkspaceDescription] = useState('');

    console.log("member_login", member_login);
    console.log("user", user);
    console.log("member", member);

    const handleNameChange = (e) => {
        setWorkspaceName(e.target.value);
    };

    const handleDescriptionChange = (e) => {
        setWorkspaceDescription(e.target.value);
    };

    useEffect(() => {
        dispatch(setMember_login());
    }, [member]);

    

    const handleBgChange = (newBg) => {
        setCurrentBg(newBg);
    };

    const handleWorkspaceChange = (event) => {
        setSelectedWorkspaceId(event.target.value);
    };


    const handleStatusChange = (event) => {
        setProjectStatus(event.target.value);
    };


    // const handlehandleSubmit = () => {
    //     setProjectTitle(true);
    // };

    const handleDropdownClick = (workspaceId) => {
        setShowDropdown(prevState => ({
            ...prevState,
            [workspaceId]: !prevState[workspaceId]
        }));
    };

    const createProject = () => {
        dispatch(CreateProjectApi(selectedWorkspaceId, projectTitle, currentBg, projectStatus))
    };

    // const handleShowModal = () => {
    //     setShowModal(true);
    // };
    useEffect(() => {
        if (background.length > 0) {
            setCurrentBg(background[0].background_src);
        }
    }, [background]);

    const handleCloseModal = () => {
        setShowModal(false);
    };

    useEffect(() => {
        if (member_all.length > 0) {
            const userWorkspaces = member_all.filter(m => m.user_id === user.user_id);
            if (userWorkspaces.length > 0) {
                const firstWorkspaceId = userWorkspaces[0].working_space_id;
                setSelectedWorkspaceId(firstWorkspaceId);
            }
        }
    }, [member_all, user.user_id]);

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

    const dispatch = useDispatch();

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(CreateWorkspaceApi(workspaceName, workspaceDescription, user.user_id, wsId));
    };

    useEffect(() => {
        const actionBackground = BackgroundApi()
        dispatch(actionBackground)
    }, [dispatch])

    useEffect(() => {
        const actionMemberAll = MemberAllApi()
        dispatch(actionMemberAll)
    }, [dispatch])

    useEffect(() => {
        if (user && user.user_id) {
            const actionWorkspace = WorkspaceApi(user.user_id)
            dispatch(actionWorkspace)
        }
    }, [dispatch, user])

    useEffect(() => {
        if (wsId) {
            const actionMember = MemberApi(wsId)
            dispatch(actionMember)
        }
    }, [dispatch, wsId])

    useEffect(() => {
        const actionProject = ProjectApi()
        dispatch(actionProject)
    }, [dispatch])



    const handleButtonClick = async (wsId) => {
        dispatch(setWsId(wsId));
        setShowModal(true);
    }
    const handleSetProjectId = async (pId, wsId) => {
        dispatch(setProjectId(pId));
        dispatch(setWsId(wsId));
    }
    // console.log("wsId", wsId);
    const renderListWorkspace = () => {
        return workspace.map((ws, index) => {
            return <li className="list-workspace-item" key={index}>
                <a onClick={() => handleDropdownClick(ws.working_space_id)} data-selected="false">
                    <img src={ws.working_space_avatar_src} alt="" />
                    <span className='workspace-name'>{ws.working_space_name}</span>
                    {showDropdown[ws.working_space_id] ? (
                        <i className="fa fa-angle-up"></i>
                    ) : (
                        <i className="fa fa-angle-down"></i>
                    )}
                </a>
                {showDropdown[ws.working_space_id] && (
                    <ul className='workspace-item-dropdown'>
                        <li className="workspace-dropdown-item">
                            <NavLink className='button' to="/workspacemanager" onClick={() => handleButtonClick(ws.working_space_id)}>
                                <i className="fa fa-columns" />
                                <span>Bảng</span>
                            </NavLink>
                        </li>
                        <li className="workspace-dropdown-item">
                            <NavLink className='button' to="/workspacemanager" onClick={() => handleButtonClick(ws.working_space_id)}>
                                <i className="fa fa-user" />
                                <span>Thành viên</span>
                            </NavLink>
                        </li>
                        <li className="workspace-dropdown-item">
                            <NavLink className='button' to="/workspacemanager" onClick={() => handleButtonClick(ws.working_space_id)}>
                                <i className="fa fa-cog" />
                                <span>Cài đặt</span>
                            </NavLink>
                        </li>
                    </ul>
                )}

            </li>
        })
    }

    const renderListProject = (wsId) => {
        return project.map((p, index) => {
            if (wsId == p.working_space_id) {
                return <li className='workspace-page-content-list-item col-3' key={index}>
                    <NavLink to="/project" className='project-item' onClick={() => { handleSetProjectId(p.project_id, p.working_space_id) }} style={{ backgroundImage: `url(${p.project_background_src})` }}>
                        <span className='project-item-fade'></span>
                        <div className='project-item-details'>
                            <div className="project-item-details-name">
                                <div>{p.project_name}</div>
                            </div>
                            <div className="project-item-details-star ">
                                <i className="fa fa-star hide"></i>
                            </div>
                        </div>
                    </NavLink>
                </li>
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

    const renderWorkspaceContent = () => {
        return workspace.map((ws, index) => {
            return <div className="workspace-page-content" key={index}>
                <div className="workspace-page-content-header">
                    <div className="workspace-page-content-header-icon">
                        <img src={ws.working_space_avatar_src} alt="" />
                    </div>
                    <h3 className='workspace-page-content-header-name'>
                        {ws.working_space_name}
                    </h3>
                    <div className="workspace-page-content-header-options">
                        <NavLink onClick={() => handleButtonClick(ws.working_space_id)} to="/workspacemanager" className='workspace-page-content-header-options-item'>
                            <i className="fa fa-columns" />
                            <span>Bảng</span>
                        </NavLink>
                        <NavLink onClick={() => handleButtonClick(ws.working_space_id)} to="/workspacemanager" className='workspace-page-content-header-options-item'>
                            <i className="fa fa-user" />
                            <span>Thành viên</span>
                        </NavLink>
                        <NavLink onClick={() => handleButtonClick(ws.working_space_id)} to={`/workspacemanager?ws_id=${ws.working_space_id}`} className='workspace-page-content-header-options-item'>
                            <i className="fa fa-cog" />
                            <span>Cài đặt</span>
                        </NavLink>
                    </div>
                </div>
                <div>
                    <ul className='workspace-page-content-list row'>
                        {renderListProject(ws.working_space_id)}
                        <li className='workspace-page-content-list-item col-3'>
                            <div onClick={() => { handleButtonClick(ws.working_space_id) }} className="workspace-add-project">
                                <p>
                                    <span>Tạo bảng mới</span>
                                </p>
                            </div>
                            {renderCreateProjectModal()}
                        </li>
                    </ul>
                </div>
            </div>
        })
    }

    return (
        <div className='container'>
            <div className='home row'>
                <div className="home__left col-3">
                    <div>
                        <ul className='list-menu'>
                            <li className='menu-item active'>
                                <a href="">
                                    <i className="fa fa-columns" />
                                    <span>Bảng</span>
                                </a>
                            </li>
                            <li className='menu-item'>
                                <a href="">
                                    <i className="fa fa-list-alt" />
                                    <span>Mẫu</span>
                                </a>
                            </li>
                            <li className='menu-item'>
                                <a href="">
                                    <i className="fa fa-home" />
                                    <span>Trang chủ</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <ul className='list-workspace'>
                            <div className="list-workspace-title">
                                Các không gian làm việc
                                <i className="fa fa-plus" data-bs-toggle="modal" data-bs-target="#WorkSpaceModal"></i>
                            </div>
                            {renderListWorkspace()}
                        </ul>
                    </div>
                </div>
                <div className="home__right col-9">
                    <div>
                        <h3 className='workspace-page-header'>CÁC KHÔNG GIAN LÀM VIỆC CỦA BẠN</h3>
                        {renderWorkspaceContent()}
                    </div>
                </div>
            </div>

            <div className="modal fade" id="WorkSpaceModal" tabIndex=" - 1" aria-labelledby="WorkSpaceModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleSubmit}>
                                <h3>Hãy xây dựng một không gian làm việc</h3>
                                <p>Tên không gian làm việc</p>
                                <input type="text" name="working_space_name" value={workspaceName} onChange={handleNameChange} placeholder="Công ty của ..." />
                                <span>Đây là tên công ty, nhóm hoặc tổ chức của bạn.</span>
                                <p>Mô tả không gian làm việc</p>
                                <textarea name="working_space" value={workspaceDescription} onChange={handleDescriptionChange} rows={10} defaultValue={""} />
                                <span>Đưa các thành viên của bạn vào bảng với mô tả ngắn về Không gian làm việc của bạn.</span>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                    <button type="submit" className="btn btn-primary">Save changes</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
