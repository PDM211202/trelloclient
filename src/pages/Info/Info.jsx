import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getMovieApi } from '../../redux/reducer/filmReducer';
import { NavLink } from 'react-router-dom';

export default function Info({ match }) {
    let url_name = match.params.name;
    const dispatch = useDispatch();
    const { filmInfo } = useSelector(state => state.filmReducer);

    useEffect(() => {
        const actionGetMovie = getMovieApi(url_name)
        dispatch(actionGetMovie)
    }, []);

    const renderGener = () => {
        if (filmInfo && filmInfo.genres) {
            return filmInfo.genres.map((item, index) => {
                return <NavLink to={`/the-loai/${item.genre_url}`} key={index}> {item.genre_name} </NavLink>;
            });
        }
        return null;
    };

    return (
        <div className='container-info pd-80'>
            <div className="des d-flex justify-content-start ">
                <i className="fa fa-home ml-3 mr-2 pt-2 pb-2 color" />
                <p className='m-0 mr-2 pt-2 pb-2 color'>Xem phim</p>
                <i className="fa fa-angle-right mr-2 pt-2 pb-2 color" />
                <p className='m-0 mr-2 pt-2 pb-2 color'>{filmInfo.type}</p>
                <i className="fa fa-angle-right mr-2 pt-2 pb-2 color" />
                <p className='m-0 mr-2 pt-2 pb-2'>{filmInfo.primary_title}</p>
            </div>
            <div className="film-info">
                <div className="banner" style={{ backgroundImage: `url(${filmInfo.cover_image})` }}>
                    <img className='avatar' src={`${filmInfo.cover_image}`} alt="" />
                </div>
                <div className="text">
                    <h1>{filmInfo.primary_title}</h1>
                    <NavLink type="button" className="btn btn-danger" to={`/xem-phim/${filmInfo.url_name}`}><i className="fa fa-play-circle"></i> Xem Phim</NavLink>
                </div>
            </div>
            <div className="film-des container-fluid">
                <div className="row line pb-2">
                    <div className="col-4">
                        <p>Đang phát: </p>
                        <span> HD Vietsub</span>
                    </div>
                    <div className="col-4">
                        <p>Năm Phát Hành:</p>
                        <NavLink to={`/nam-phat-hanh/${filmInfo.year}`}> {filmInfo.year}</NavLink>
                    </div>
                    <div className="col-4">
                        <p>Quốc gia:</p>
                        <NavLink to={`/quoc-gia/${filmInfo.country_url}`}> {filmInfo.country}</NavLink>
                    </div>
                    <div className="col-4">
                        <p>Thể loại: </p>
                        {renderGener()}
                    </div>
                </div>
                <div className="film-content mt-2 pb-2 line">
                    <h3>Nội dung phim và review</h3>
                    <span><b>{filmInfo.primary_title} </b>{filmInfo.summary}</span>
                </div>
            </div>
        </div>
    )
}


