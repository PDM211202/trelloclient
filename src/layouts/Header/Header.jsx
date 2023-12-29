import React from 'react'

export default function Header() {
    return (
        <div className='container-fluid'>
            <div className="header">
                <a className="header-logo" href="">
                    <div>
                        <div className="header-logo-item"></div>
                    </div>
                </a>
                <div className="header-menu">
                    <div className="header-nav">
                        <div className="header-nav-left">
                            <button className='btn-workspaces'>
                                <span className='btn-title'>
                                    Các không gian làm việc
                                </span>
                                <i className="fa fa-angle-down"></i>
                            </button>
                        </div>
                        <div className="header-nav-create">

                        </div>
                        <div className="header-nav-right">

                        </div>
                    </div>
                </div>
                <div className="header-options">

                </div>
            </div>
        </div>
    )
}
