import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { WorkspaceApi, ProjectApi } from '../../redux/reducer/trelloReducer';
import { NavLink } from 'react-router-dom';


export default function Home() {
    const { user, workspace, project } = useSelector(state => state.trelloReducer)
    const dispatch = useDispatch();
    console.log("project: ", project);
    useEffect(() => {
        if (user && user.user_id) {
            const actionWorkspace = WorkspaceApi(user.user_id)
            dispatch(actionWorkspace)
        }
    }, [dispatch, user])


    const renderListWorkspace = () => {
        return workspace.map((ws, index) => {
            return <li className="list-workspace-item" key={index}>
                <a href="" data-selected="false">
                    <img src="./img/logo.png" alt="" />
                    <span className='workspace-name'>{ws.working_space_name}</span>
                    <i class="fa fa-angle-down"></i>
                    <i class="fa fa-angle-up hide"></i>
                </a>
                <ul className='workspace-item-dropdown'>
                    <li className="workspace-dropdown-item active">
                        <a className='button' to="/board">
                            <i className="fa fa-columns" />
                            <span>Bảng</span>
                        </a>
                    </li>
                    <li className="workspace-dropdown-item">
                        <a className='button' to="/member">
                            <i className="fa fa-user" />
                            <span>Thành viên</span>
                        </a>
                    </li>
                    <li className="workspace-dropdown-item">
                        <a className='button' to="/setting">
                            <i className="fa fa-cog" />
                            <span>Cài đặt</span>
                        </a>
                    </li>
                </ul>
            </li>
        })
    }

    const renderListProject = (wsId) => {
        return project.map((p, index) => {
            return
        })
    }

    const renderWorkspaceContent = () => {
        return workspace.map((ws, index) => {
            const actionProject = ProjectApi(ws.working_space_id)
            dispatch(actionProject)
            return <div className="workspace-page-content" key={index}>
                <div className="workspace-page-content" >
                    <div className="workspace-page-content-header">
                        <div className="workspace-page-content-header-icon">
                            <img src="./img/logo.png" alt="" />
                        </div>
                        <h3 className='workspace-page-content-header-name'>
                            {ws.working_space_name}
                        </h3>
                        <div className="workspace-page-content-header-options">
                            <a className='workspace-page-content-header-options-item'>
                                <i className="fa fa-columns" />
                                <span>Bảng</span>
                            </a>
                            <a className='workspace-page-content-header-options-item'>
                                <i className="fa fa-user" />
                                <span>Thành viên</span>
                            </a>
                            <a className='workspace-page-content-header-options-item'>
                                <i className="fa fa-cog" />
                                <span>Cài đặt</span>
                            </a>
                        </div>
                    </div>
                    <div>
                        <ul className='workspace-page-content-list row'>
                            <li className='workspace-page-content-list-item col-3'>
                                <a href="" className='project-item' style={{ backgroundImage: 'url("https://d2k1ftgv7pobq7.cloudfront.net/images/backgrounds/gradients/crystal.svg")' }}>
                                    <span className='project-item-fade'></span>
                                    <div className='project-item-details'>
                                        <div className="project-item-details-name">
                                            <div>Project</div>
                                        </div>
                                        <div className="project-item-details-star ">
                                            <i class="fa fa-star hide"></i>
                                        </div>
                                    </div>
                                </a>
                            </li>
                            <li className='workspace-page-content-list-item col-3'>
                                <div className="workspace-add-project">
                                    <p>
                                        <span>Tạo bảng mới</span>
                                    </p>
                                </div>
                            </li>
                        </ul>
                    </div>
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
        </div>
    )
}
