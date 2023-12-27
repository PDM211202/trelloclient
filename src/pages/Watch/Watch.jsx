// import React, { useEffect } from 'react'
// import { useDispatch, useSelector } from 'react-redux';
// import { getMovieApi } from '../../redux/reducer/filmReducer';
// import { NavLink } from 'react-router-dom';

// export default function Watch({ match }) {
//     let url_name = match.params.name;
//     const dispatch = useDispatch();
//     const { filmInfo } = useSelector(state => state.filmReducer);

//     useEffect(() => {
//         const actionGetMovie = getMovieApi(url_name)
//         dispatch(actionGetMovie)
//     }, []);

//     const renderGener = () => {
//         if (filmInfo && filmInfo.genres) {
//             return filmInfo.genres.map((item, index) => {
//                 return <NavLink to={`/the-loai/${item.genre_url}`} key={index}> {item.genre_name} </NavLink>;
//             });
//         }
//         return null;
//     };

//     const episodes = (url) => {
//         if (filmInfo && filmInfo.genres) {
//             const index = url.indexOf('=');
//             if (index !== -1) {
//                 return url.substring(index + 1);
//             } else {
//                 return '';
//             }
//         }
//         return null;
//     }

//     const watchUrl = episodes(filmInfo.episodes[0]);
// // console.log(filmInfo.episodes);
//     return (
//         <div className='container-info pd-80'>
//             <div className="des d-flex justify-content-start ">
//                 <i className="fa fa-home ml-3 mr-2 pt-2 pb-2 color" />
//                 <p className='m-0 mr-2 pt-2 pb-2 color'>Xem phim</p>
//                 <i className="fa fa-angle-right mr-2 pt-2 pb-2 color" />
//                 <p className='m-0 mr-2 pt-2 pb-2 color'>{filmInfo.type}</p>
//                 <i className="fa fa-angle-right mr-2 pt-2 pb-2 color" />
//                 <p className='m-0 mr-2 pt-2 pb-2'>{filmInfo.primary_title}</p>
//             </div>
//             <div className="film-info">
//                 <div className="video" >
//                     <iframe width="100%" height="490px" src={`https://www.youtube.com/embed/${watchUrl}`} frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
//                 </div>
//             </div>
//             <div className="film-des container-fluid">
//                 <div className="row line pb-2">
//                     <div className="col-4">
//                         <p>Đang phát: </p>
//                         <span> HD Vietsub</span>
//                     </div>
//                     <div className="col-4">
//                         <p>Năm Phát Hành:</p>
//                         <NavLink to={`/nam-phat-hanh/${filmInfo.year}`}> {filmInfo.year}</NavLink>
//                     </div>
//                     <div className="col-4">
//                         <p>Quốc gia:</p>
//                         <NavLink to={`/quoc-gia/${filmInfo.country_url}`}> {filmInfo.country}</NavLink>
//                     </div>
//                     <div className="col-4">
//                         <p>Thể loại: </p>
//                         {renderGener()}
//                     </div>
//                 </div>
//                 <div className="film-content mt-2 pb-2 line">
//                     <h3>Nội dung phim và review</h3>
//                     <span><b>{filmInfo.primary_title} </b>{filmInfo.summary}</span>
//                 </div>
//             </div>
//         </div>
//     )
// }
