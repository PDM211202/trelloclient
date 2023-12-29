import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { UpdateWorkspacePublicApi, UpdateWorkspaceProtectedApi, UpdateWorkspacePrivateApi, UserApi, WorkspaceManagerApi, setProjectId, setWsId, MemberApi } from '../../redux/reducer/trelloReducer';
import { NavLink } from 'react-router-dom';

export default function Workspace() {
    const dispatch = useDispatch();
    const { user, workspace_manager, project, wsId, member, member_user } = useSelector(state => state.trelloReducer)
    const [showLimitCreation, setShowLimitCreation] = useState(false);
    const [showLimitDelete, setShowLimitDelete] = useState(false);

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

    const handleAddMember = () => {

    }

    const renderAddMemberModal = () => {
        return <div className="modal fade" id="AddMemberModal" tabIndex={-1} aria-labelledby="AddMemberModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="AddMemberModalLabel">Mời vào không gian làm việc</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                    </div>
                    <div className="modal-body">
                        <input type="text" name="user_name" id placeholder="Địa chỉ email hoặc tên" />
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" className="btn btn-primary">Thêm</button>
                    </div>
                </div>
            </div>
        </div>
    }

    const renderProjectitem = (wsId) => {
        return project.map((p, index) => {
            if (wsId == p.working_space_id) {
                console.log("render project", p);
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
            console.log(mb);
            if (mb.user_id == userId) {
                return <button key={index} type="button" className="btn btn-primary me-2">
                    {mb.member_role}
                </button>
            }
        })
    }

    const renderMemberList = () => {
        return member_user.map((mu, index) => {
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
                    <button type="button" className="btn btn-danger">
                        <i className="fa fa-times" />
                        Rời đi
                    </button>
                </div>
            </div>
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
                        <li onClick={() => {handleUpdateWsPublic(wsId, "0")}} className="list_group_public_item d-flex ">
                            <i class="fa fa-check"></i>
                            <p>Mọi thành viên Không gian làm việc</p>
                        </li>
                        <li onClick={() => {handleUpdateWsPublic(wsId, "1")}} className="list_group_public_item d-flex ">
                            <i class="fa fa-check"></i>
                            <p>Chỉ các quản trị viên Không gian làm việc</p>
                        </li>
                        <li onClick={() => {handleUpdateWsPublic(wsId, "2")}} className="list_group_public_item d-flex ">
                            <i class="fa fa-check"></i>
                            <p>Không ai</p>
                        </li>
                    </ul>
                    <div className="line"></div>
                    <div>
                        <span>Ai có thể tạo các bảng hiển thị trong Không gian làm việc?</span>
                    </div>
                    <ul className="list_group_public">
                        <li onClick={() => {handleUpdateWsProtected(wsId, "0")}} className="list_group_public_item d-flex ">
                            <i class="fa fa-check"></i>
                            <p>Mọi thành viên Không gian làm việc</p>
                        </li>
                        <li onClick={() => {handleUpdateWsProtected(wsId, "1")}} className="list_group_public_item d-flex ">
                            <i class="fa fa-check"></i>
                            <p>Chỉ các quản trị viên Không gian làm việc</p>
                        </li>
                        <li onClick={() => {handleUpdateWsProtected(wsId, "2")}} className="list_group_public_item d-flex ">
                            <i class="fa fa-check"></i>
                            <p>Không ai</p>
                        </li>
                    </ul>
                    <div className="line"></div>
                    <div>
                        <span>Ai có thể tạo bảng riêng tư?</span>
                    </div>
                    <ul className="list_group_public">
                        <li onClick={() => {handleUpdateWsPrivate(wsId, "0")}} className="list_group_public_item d-flex ">
                            <i class="fa fa-check"></i>
                            <p>Mọi thành viên Không gian làm việc</p>
                        </li>
                        <li onClick={() => {handleUpdateWsPrivate(wsId, "1")}} className="list_group_public_item d-flex ">
                            <i class="fa fa-check"></i>
                            <p>Chỉ các quản trị viên Không gian làm việc</p>
                        </li>
                        <li onClick={() => {handleUpdateWsPrivate(wsId, "2")}} className="list_group_public_item d-flex ">
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
                        <li onClick={() => {handleUpdateWsPublic(wsId, "0")}} className="list_group_public_item d-flex ">
                            <i class="fa fa-check"></i>
                            <p>Mọi thành viên Không gian làm việc</p>
                        </li>
                        <li onClick={() => {handleUpdateWsPublic(wsId, "1")}} className="list_group_public_item d-flex ">
                            <i class="fa fa-check"></i>
                            <p>Chỉ các quản trị viên Không gian làm việc</p>
                        </li>
                        <li onClick={() => {handleUpdateWsPublic(wsId, "2")}} className="list_group_public_item d-flex ">
                            <i class="fa fa-check"></i>
                            <p>Không ai</p>
                        </li>
                    </ul>
                    <div className="line"></div>
                    <div>
                        <span>Ai có thể xóa các bảng hiển thị trong Không gian làm việc?</span>
                    </div>
                    <ul className="list_group_public">
                        <li onClick={() => {handleUpdateWsProtected(wsId, "0")}} className="list_group_public_item d-flex ">
                            <i class="fa fa-check"></i>
                            <p>Mọi thành viên Không gian làm việc</p>
                        </li>
                        <li onClick={() => {handleUpdateWsProtected(wsId, "1")}} className="list_group_public_item d-flex ">
                            <i class="fa fa-check"></i>
                            <p>Chỉ các quản trị viên Không gian làm việc</p>
                        </li>
                        <li onClick={() => {handleUpdateWsProtected(wsId, "2")}} className="list_group_public_item d-flex ">
                            <i class="fa fa-check"></i>
                            <p>Không ai</p>
                        </li>
                    </ul>
                    <div className="line"></div>
                    <div>
                        <span>Ai có thể xóa bảng riêng tư?</span>
                    </div>
                    <ul className="list_group_public">
                        <li onClick={() => {handleUpdateWsPrivate(wsId, "0")}} className="list_group_public_item d-flex ">
                            <i class="fa fa-check"></i>
                            <p>Mọi thành viên Không gian làm việc</p>
                        </li>
                        <li onClick={() => {handleUpdateWsPrivate(wsId, "1")}} className="list_group_public_item d-flex ">
                            <i class="fa fa-check"></i>
                            <p>Chỉ các quản trị viên Không gian làm việc</p>
                        </li>
                        <li onClick={() => {handleUpdateWsPrivate(wsId, "2")}} className="list_group_public_item d-flex ">
                            <i class="fa fa-check"></i>
                            <p>Không ai</p>
                        </li>
                    </ul>
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
                            <div className="workspace_name col-5 d-flex">
                                <h3>{workspace_manager.working_space_name}</h3>
                                <i className="fa fa-edit edit_workspace" />
                            </div>
                            <div className="workspace_update hide col-5">
                                <form method="post" className="d-flex">
                                    <input type="text" name="ws_name" />
                                    <div className="btn-option">
                                        <button type="submit" className="btn btn-primary">Lưu</button>
                                        <button type="button" className="btn close">Hủy</button>
                                    </div>
                                </form>
                            </div>
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
                                <div className="project_item_create col-4">
                                    <span>Tạo bảng mới</span>
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
                                    <p className='mb-2'>
                                        Bất kỳ thành viên Không gian làm việc nào cũng có thể tạo các bảng công khai.
                                    </p>
                                    <p className='mb-2'>
                                        Bất kỳ thành viên Không gian làm việc nào cũng có thể tạo các bảng hiển thị trong Không gian làm việc.
                                    </p>
                                    <p className='mb-2'>
                                        Bất kỳ thành viên Không gian làm việc nào cũng có thể tạo các bảng riêng tư.
                                    </p>
                                </div>
                                <div className="setting_option_item mb-5">
                                    <button onClick={handleToggleLimitDelete} type="button" style={{ backgroundColor: "#091e420f", fontWeight: "500" }} class="btn">Thay đổi</button>
                                    <h4 style={{ fontSize: "16px" }} className="list_member_title mb-4">
                                        Chính Sách Hạn Chế Xóa Bảng
                                    </h4>
                                    {showLimitDelete && renderLimitDelete(wsId)}
                                    <div className="line"></div>
                                    <p className='mb-2'>
                                        Bất kỳ thành viên Không gian làm việc nào cũng có thể xóa các bảng công khai.                                    </p>
                                    <p className='mb-2'>
                                        Bất kỳ thành viên Không gian làm việc nào cũng có thể xóa các bảng hiển thị trong Không gian làm việc.
                                    </p>
                                    <p className='mb-2'>
                                        Bất kỳ thành viên Không gian làm việc nào cũng có thể xóa các bảng riêng tư.
                                    </p>
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
                            <div className="modal fade" id="DeleteWorkSpaceModal" tabIndex={-1} aria-labelledby="DeleteWorkSpaceModalLabel" aria-hidden="true">
                                <div className="modal-dialog">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title" id="DeleteWorkSpaceModalLabel">Xóa không gian làm việc?</h5>
                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                                        </div>
                                        <div className="modal-body">
                                            <h4>Nhập tên không gian làm việc "PDM" để xóa</h4>
                                            <span>Những điều cần biết:</span>
                                            <ul>
                                                <li>Điều này là vĩnh viễn và không thể hoàn tác.</li>
                                                <li>Tất cả các bảng trong Không gian làm việc này sẽ bị đóng.</li>
                                                <li>Các quản trị viên bảng có thể mở lại các bảng.</li>
                                                <li>Các thành viên bảng sẽ không thể tương tác với các bảng đã đóng.</li>
                                            </ul>
                                            <span>Nhập tên không gian làm việc để xóa</span>
                                            <form method="post">
                                                <input type="text" name="workspace_name" id />
                                                <button type="submit" className="btn btn-danger">Xóa không gian làm việc</button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
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
