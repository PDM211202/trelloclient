// import React, { useEffect } from 'react'
// import { useDispatch, useSelector } from 'react-redux';
// import { NavLink } from 'react-router-dom';
// import { getMovieByTypeApi } from '../../redux/reducer/filmReducer';

// export default function PhimBo() {
//     const { type } = useSelector(state => state.filmReducer);

//     const dispatch = useDispatch();
//     useEffect(() => {
//         const actionGetMovieByType = getMovieByTypeApi('phim-bo')
//         dispatch(actionGetMovieByType)
//     }, [type]);

//     const renderFilm = () => {
//         if (type && type.year_movies) {
//             return type.year_movies.map((film, index) => {
//                 return <div className="small" key={index}>
//                     <NavLink title={film.primary_title} to={`/info/${film.url_name}`}>
//                         <img src={film.cover_image} alt="" />
//                         <span className='label'>HD-Vietsub</span>
//                         <p>{film.primary_title}</p>
//                     </NavLink>
//                 </div>
//             })
//         }
//         return null;
//     }

//     return (
//         <div className='container genre'>
//             <h4 className='mt-2'>
//                 {type.type}
//             </h4>

//             <div className="des d-flex justify-content-start mt-3 mb-3">
//                 <i className="fa fa-home ml-3 mr-2 pt-2 pb-2 color" />
//                 <p className='m-0 mr-2 pt-2 pb-2 color'>Phim Mới</p>
//                 <i className="fa fa-angle-right mr-2 pt-2 pb-2 color" />
//                 <p className='m-0 mr-2 pt-2 pb-2'>{type.type}</p>
//             </div>

//             {renderFilm()}
//             <div className="clear"></div>
//         </div>
//     )
// }
