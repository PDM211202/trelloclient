import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { CreateTaskApi, CreateWorkApi, UpdateProjectNameApi, WorkspaceApi, TaskApi, WorkApi, setProjectId, ProjectApi } from '../../redux/reducer/trelloReducer';
import { NavLink } from 'react-router-dom';

export default function Project() {
    const dispatch = useDispatch();
    const { wsId, user, work, project, projectId, task } = useSelector(state => state.trelloReducer)
    const [showAddTask, setShowAddTask] = useState({});
    const [showForm, setShowForm] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [isAtEnd, setIsAtEnd] = useState(false);

    const [projectName, setProjectName] = useState("");
    const [editing, setEditing] = useState(false);

    const [workName, setWorkName] = useState('');

    const [taskName, setTaskName] = useState('');

    const handleAddTask = async (wId) => {
        dispatch(CreateTaskApi(wId, taskName));
        setShowAddTask({ ...showAddTask, [wId]: false });
        setTaskName("")
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(CreateWorkApi(projectId, workName));
        setShowForm(false);
        setWorkName('');
    };

    const handleShowInput = () => {
        setEditing(true);
    };

    const handleHideInput = async (project_id) => {
        dispatch(UpdateProjectNameApi(project_id, projectName));
        setEditing(false);
    };

    const handleScroll = (e) => {
        const element = e.target;
        if (element.scrollWidth - element.scrollLeft === element.clientWidth) {
            setIsAtEnd(true); // Người dùng đã cuộn đến cuối
        }
    };

    useEffect(() => {
        const cardsContainer = document.querySelector('.content__main');
        cardsContainer.addEventListener('scroll', handleScroll);

        return () => {
            cardsContainer.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleShowMenu = () => {
        setShowMenu(true);
    };

    const handleHideMenu = () => {
        setShowMenu(false);
    };


    const handleShowClick = (workId) => {
        setShowAddTask({ ...showAddTask, [workId]: true });
    };

    const handleCloseClick = (workId) => {
        setShowAddTask({ ...showAddTask, [workId]: false });
        setTaskName("");
    };

    const handleSetProjectId = (projectId) => {
        const actionSetProjectId = setProjectId(projectId)
        dispatch(actionSetProjectId)
    }

    const handleShowForm = () => {
        setShowForm(true);
    };

    const handleHideForm = () => {
        setShowForm(false);
        setWorkName('');
    };

    useEffect(() => {
        const actionWork = WorkApi()
        dispatch(actionWork)
    }, [dispatch])

    useEffect(() => {
        if (user && user.user_id) {
            const actionWorkspace = WorkspaceApi(user.user_id)
            dispatch(actionWorkspace)
        }
    }, [dispatch, user])

    useEffect(() => {
        const actionProject = ProjectApi()
        dispatch(actionProject)
    }, [dispatch])

    useEffect(() => {
        const actionTask = TaskApi()
        dispatch(actionTask)
    }, [dispatch])

    const renderListTask = (wId) => {
        return task.map((t, index) => {
            if (wId == t.work_id) {
                return <div key={index} className="list-group-item" task-position draggable="true" data-drop-target-for-element="true">
                    <div className="overlay" data-bs-toggle="modal" data-bs-target="#TodoListModal">
                        <i className="fa fa-edit" />
                    </div>
                    <div className="item__top">
                        {t.task_name}
                    </div>
                    <div className="item__bottom mt-1">
                        card 1
                    </div>
                </div>
            }
        })
    }

    const renderListCard = (pId) => {
        return work.map((w, index) => {
            if (pId == w.project_id) {
                return <div key={index} className="card" draggable="true" data-drop-target-for-element="true" work-position style={{ width: '19rem', display: "inline-block" }}>
                    <div className="card-body">
                        <div className="card__header">
                            <h5 className="card-title" style={{ width: '86%' }}>{w.work_name}</h5>
                            <i className="fa fa-bars" />
                        </div>
                        <div className="card__content">
                            <div className="list-group" data-drop-target-for-element="true">
                                {renderListTask(w.work_id)}
                            </div>
                        </div>
                        <div className="card__bottom mt-2">
                            {showAddTask[w.work_id] ? (
                                <div className="add_task">
                                    <form method="post">
                                        <input id="task_name" type="text" value={taskName}
                                            onChange={(e) => setTaskName(e.target.value)} placeholder="Nhập tiêu đề cho thẻ này" />
                                        <div className="add_option">
                                            <button className="btn btn-primary btn_add" onClick={() => handleAddTask(w.work_id)}>Thêm
                                                thẻ</button>
                                            <div className="btn_close" onClick={() => handleCloseClick(w.work_id)}>
                                                <i className="fa fa-times" />
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            ) : (
                                <button className="btn_show" type="button" onClick={() => handleShowClick(w.work_id)}>
                                    <i className="fa fa-plus" />
                                    <span>Thêm thẻ</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            }
        })
    }

    const renderCreateWork = () => {
        return <div>
            {!showForm && (
                <div
                    className="create_work"
                    style={{ cursor: "pointer", backgroundColor: "#ffffff54", width: "244px", padding: "10px 20px", borderRadius: "10px", fontWeight: "500", color: "#fff" }}
                    onClick={handleShowForm}>
                    <i class="fa fa-plus me-2"></i>
                    Thêm danh sách khác
                </div>
            )}
            {showForm && (
                <div style={{ width: "264px", borderRadius: "10px", backgroundColor: "#fff", padding: "10px" }}>
                    <form onSubmit={handleSubmit}>
                        <input value={workName}
                            onChange={(e) => setWorkName(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "10px" }} type="text" placeholder='Nhập tiêu đề cho danh sách' />
                        <button type="submit" className='btn btn-primary mt-2 me-2'>Thêm</button>
                        <button type="button" className="btn btn-primary mt-2" onClick={handleHideForm}>Hủy</button>
                    </form>
                </div>
            )}
        </div>
    }

    const renderProjectContent = (pId) => {
        return project.map((p, index) => {
            if (p.project_id === parseInt(pId)) {
                return <div className="content m-0 col p-0">
                    <div className="content__bar">
                        <div style={{ position: "relative" }} className="content__bar__left ">
                            {!editing ? (
                                <span className='project_name_show' onClick={handleShowInput}>{p.project_name}</span>
                            ) : (
                                <input style={{ width: "20%", color: "#000" }} type="text" className='project_name p-2 me-2 ' name="project_name" value={projectName}
                                    onChange={(e) => setProjectName(e.target.value)}
                                    onBlur={() => { handleHideInput(p.project_id) }} />
                            )}
                            <button type="button">
                                <i className="fa fa-star" />
                            </button>
                            <button type="button">
                                <i className="fa fa-user-friends" />
                            </button>
                            {!showMenu && (
                                <div onClick={handleShowMenu} style={{ top: "50%", cursor: "pointer", right: "10px", transform: "translateY(-50%)", position: "absolute", width: "32px", height: "32px", textAlign: "center" }} className="menu_show">
                                    <i style={{ lineHeight: "32px" }} className="fa fa-list"></i>
                                </div>
                            )}
                        </div>
                    </div>
                    <div style={{ maxWidth: "1091px" }} className="content__main">
                        {renderListCard(p.project_id)}
                        {renderCreateWork()}
                    </div>
                    <div className="modal fade" id="TodoListModal" tabIndex={-1} aria-labelledby="TodoListModalLabel" aria-hidden="true">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title " id="TodoListModalLabel">Modal title</h5>
                                    <input type="text" className="TodoList_name" name="TodoList_name" />
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                                </div>
                                <div className="modal-show mt-4 mb-3 d-flex">
                                    <div className="modal-user ">
                                        <p>Thành viên</p>
                                        <div className="user-show d-flex justify-content-start mt-2">
                                            <div className="user-avatar">
                                                <img src="../img/logo.png" alt />
                                            </div>
                                            <div className="user-avatar">
                                                <img src="../img/logo.png" alt />
                                            </div>
                                            <div style={{ backgroundColor: '#9fadbc' }} className=" user-avatar">
                                                <i className="fa fa-plus" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="modal-tag">
                                        <p>Nhãn</p>
                                    </div>
                                </div>
                                <div className="modal-body d-flex">
                                    <div className="body_left">
                                        <div className="description">
                                            <div className="description__title d-flex">
                                                <i className="fa fa-align-justify" />
                                                <h5>Mô tả</h5>
                                            </div>
                                            <div className="description__content">
                                                <div className="description__add ">Thêm mô tả chi tiết hơn...</div>
                                                <form className="hide" action>
                                                    <textarea className="description_text" name="description_text" id="description_text" cols={30} rows={10} defaultValue={""} />
                                                    <button className="btn btn-primary " type="submit">Lưu</button>
                                                    <button className="btn" type="reset">Hủy</button>
                                                </form>
                                            </div>
                                        </div>
                                        <div className="todolist">
                                            <div className="todolist-header d-flex justify-content-between">
                                                <div className="todolist_title d-flex">
                                                    <i style={{ fontSize: 16, lineHeight: 50, margin: '0 10px' }} className="fa fa-calendar-check" />
                                                    <h5>Việc cần làm</h5>
                                                </div>
                                                <div className="todolist_option d-flex">
                                                    <div className="hide_todo">
                                                        Ẩn các mục đã chọn
                                                    </div>
                                                    <div className="delete_todolist">
                                                        Xóa
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="progress_per">
                                                <span>50%</span>
                                                <div className="progress_persen">
                                                    <div className="persen">
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="form-check">
                                                <input className="form-check-input" type="checkbox" defaultValue id="flexCheckDefault" />
                                                <label className="form-check-label" htmlFor="flexCheckDefault">
                                                    Default checkbox 1
                                                </label>
                                                <button type="button" className="btn btn-update-todo">Chỉnh sửa</button>
                                                <div className="update_todo hide">
                                                    <textarea name="update_todo" id="update_todo" cols={30} rows={10} defaultValue={""} />
                                                    <div className="todo_btn m-0">
                                                        <button type="button" className="btn btn-primary">Lưu</button>
                                                        <button className="btn" type="reset">Hủy</button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="form-check">
                                                <input className="form-check-input" type="checkbox" defaultValue id="flexCheckChecked" />
                                                <label className="form-check-label" htmlFor="flexCheckChecked">
                                                    Checked checkbox 2
                                                </label>
                                                <button type="button" className="btn btn-update-todo">Chỉnh sửa</button>
                                                <div className="update_todo hide">
                                                    <textarea name="update_todo" id="update_todo" cols={30} rows={10} defaultValue={""} />
                                                    <div className="todo_btn m-0">
                                                        <button type="button" className="btn btn-primary">Lưu</button>
                                                        <button className="btn" type="reset">Hủy</button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="form-check">
                                                <input className="form-check-input" type="checkbox" defaultValue id="flexCheckDefault" />
                                                <label className="form-check-label" htmlFor="flexCheckDefault">
                                                    Default checkbox 3
                                                </label>
                                                <button type="button" className="btn btn-update-todo">Chỉnh sửa</button>
                                                <div className="update_todo hide">
                                                    <textarea name="update_todo" id="update_todo" cols={30} rows={10} defaultValue={""} />
                                                    <div className="todo_btn m-0">
                                                        <button type="button" className="btn btn-primary">Lưu</button>
                                                        <button className="btn" type="reset">Hủy</button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="form-check">
                                                <input className="form-check-input" type="checkbox" defaultValue id="flexCheckDefault" />
                                                <label className="form-check-label" htmlFor="flexCheckDefault">
                                                    Default checkbox 4
                                                </label>
                                                <button type="button" className="btn btn-update-todo">Chỉnh sửa</button>
                                                <div className="update_todo hide">
                                                    <textarea name="update_todo" id="update_todo" cols={30} rows={10} defaultValue={""} />
                                                    <div className="todo_btn m-0">
                                                        <button type="button" className="btn btn-primary">Lưu</button>
                                                        <button className="btn" type="reset">Hủy</button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="add_todo">
                                                <button type="button" className="btn btn_addtodo">Thêm một mục</button>
                                                <div className="todo_info hide">
                                                    <textarea name="todo" id cols={50} rows={3} defaultValue={""} />
                                                    <div className="todo_btn">
                                                        <button type="button" className="btn btn-primary">Thêm</button>
                                                        <button className="btn" type="reset">Hủy</button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="comment">
                                                <div className="add_comment d-flex">
                                                    <div className="user-avatar">
                                                        <img src="../img/logo.png" alt />
                                                    </div>
                                                    <input type="text" name="comment_text" placeholder="Viết bình luận..." />
                                                    <button type="button" className="btn btn-primary">Lưu</button>
                                                </div>
                                                <div className="comment_content d-flex mt-3">
                                                    <div className="user-avatar">
                                                        <img src="../img/logo.png" alt />
                                                    </div>
                                                    <div className="comment_item">
                                                        <div className="item_title">
                                                            <label>PDM user</label>
                                                            <span>11 phút trước</span>
                                                        </div>
                                                        <div className="item_body">
                                                            <div className="comment_user mt-2">
                                                                2
                                                            </div>
                                                            <div className="comment_option">
                                                                <span className="btn_update_comment">Chỉnh sửa</span>
                                                                <span className="btn_delete_comment">Xóa</span>
                                                            </div>
                                                        </div>
                                                        <div className="update_comment mt-2">
                                                            <textarea name="update_comment" id="update_comment" cols={30} rows={10} defaultValue={""} />
                                                            <div className="comment_btn">
                                                                <button type="button" className="btn btn-primary">Lưu</button>
                                                                <button className="btn" type="reset">Hủy</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="comment_content d-flex mt-3">
                                                    <div className="user-avatar">
                                                        <img src="../img/logo.png" alt />
                                                    </div>
                                                    <div className="comment_item">
                                                        <div className="item_title">
                                                            <label>PDM user</label>
                                                            <span>11 phút trước</span>
                                                        </div>
                                                        <div className="item_body">
                                                            <div className="comment_user mt-2">
                                                                2
                                                            </div>
                                                            <div className="comment_option">
                                                                <span className="btn_update_comment">Chỉnh sửa</span>
                                                                <span className="btn_delete_comment">Xóa</span>
                                                            </div>
                                                        </div>
                                                        <div className="update_comment mt-2">
                                                            <textarea name="update_comment" id="update_comment" cols={30} rows={10} defaultValue={""} />
                                                            <div className="comment_btn">
                                                                <button type="button" className="btn btn-primary">Lưu</button>
                                                                <button className="btn" type="reset">Hủy</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="body_right">
                                        <span>Thêm vào thẻ</span>
                                        <div className="body_item">
                                            <i className="fa fa-user" />
                                            <p>Thành viên</p>
                                            <div className="add_user show_add">
                                                <div className="add_user_title">
                                                    Thành viên
                                                </div>
                                                <input type="text" name="search_user" id />
                                                <p>Thành viên của bảng</p>
                                                <div className="list_user d-flex">
                                                    <div className="user-avatar">
                                                        <img src="../img/logo.png" alt />
                                                    </div>
                                                    <p className="user_name">PDM</p>
                                                </div>
                                                <div className="list_user added d-flex">
                                                    <div className="user-avatar">
                                                        <img src="../img/logo.png" alt />
                                                    </div>
                                                    <p className="user_name">PDM</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="body_item">
                                            <i className="fa fa-tags" />
                                            <p>Nhãn</p>
                                            <div className="add_todo show_add">
                                            </div>
                                        </div>
                                        <div className="body_item">
                                            <i className="fa fa-check-square" />
                                            <p>Việc cần làm</p>
                                            <div className="create_todo show_add">
                                                <div className="create_todo_title">
                                                    Thêm danh sách công việc
                                                </div>
                                                <input type="text" name="todo_name" id placeholder="Việc cần làm" />
                                                <button type="button" className="btn btn-primary">Thêm</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                    <button type="button" className="btn btn-primary">Save changes</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
        })
    }

    const renderProjectMenuitem = (wsId) => {
        return project.map((p, index) => {
            if (wsId == p.working_space_id) {
                return <li key={index} className="list-group-item-p" aria-current="true">
                    <a onClick={() => { handleSetProjectId(p.project_id) }} style={{ color: '#fff', textDecoration: 'none', cursor: 'pointer' }}>
                        <img className='me-2' src="./img/logo.png" />
                        {p.project_name}
                    </a>
                </li>
            }
        })
    }

    return (
        <div className='container-fluid project' style={{ backgroundImage: "url(./img/project_bg_2.jpg)" }}>
            <div className="row">
                <nav style={{ color: "#fff" }} className="menu p-0 col">
                    <div className="menu__header">
                        <div className="menu__header__left">
                            <img src="./img/logo.png" alt />
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
                        <NavLink style={{ color: "#fff" }} to="/workspacemanager">
                            <div className="menu__mid__item">
                                <i className="fa fa-table" />
                                <span>Bảng</span>
                            </div>
                        </NavLink>
                        <NavLink style={{ color: "#fff" }} to="/workspacemanager">
                            <div className="menu__mid__item">
                                <i className="fa fa-user"/>
                                <span>Thành viên</span>
                                <i className="fa fa-plus user__add" />
                            </div>
                        </NavLink>
                        <NavLink style={{ color: "#fff" }} to="/workspacemanager">
                            <div className="menu__mid__item">
                                <i className="fa fa-cog" />
                                <span>Cài đặt</span>
                            </div>
                        </NavLink>
                    </div>
                    <div className="menu__bottom">
                        <div className="menu__bottom__title">
                            <p>Các bảng của bạn</p>
                            <i className="fa fa-plus" />
                        </div>
                        <ul className="list-group">
                            {renderProjectMenuitem(wsId)}
                        </ul>
                    </div>
                </nav>
                {renderProjectContent(projectId)}
                {showMenu && (
                    <div className="project_option col-2">
                        <div className="project_option_header">
                            <h3 className='project_option_header_title'>Menu</h3>
                            <div className="project_option_close" onClick={handleHideMenu}>
                                <i class="fa fa-times"></i>
                            </div>
                        </div>
                        <div className="line"></div>
                        <div className="project_option_content">
                            <div className="project_option_content_item d-flex">
                                <div className="project_option_content_item_logo">
                                    <i class="fa fa-info-circle"></i>
                                </div>
                                <div className="project_option_content_item_description">
                                    <p>Về bảng này</p>
                                    <span>Thêm mô tả vào bảng</span>
                                </div>
                            </div>
                            <div className="project_option_content_item d-flex">
                                <div className="project_option_content_item_logo">
                                    <i class="fa fa-cog"></i>
                                </div>
                                <div className="project_option_content_item_setting">
                                    <p>Cài đặt</p>
                                </div>
                            </div>
                            <div className="project_option_content_item d-flex">
                                <div className="project_option_content_item_logo">
                                    <i class="fa fa-cog"></i>
                                </div>
                                <div className="project_option_content_item_setting">
                                    <p>Thay đổi hình nền</p>
                                </div>
                            </div>
                            <div className="project_option_content_item">
                                <div className="project_option_content_item_delete">
                                    <p style={{ color: "red" }} className='ms-5'>Xóa bảng</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}