import React from 'react'
// import "../../css/login.css"
import { useDispatch } from 'react-redux';
import { loginApi } from '../../redux/reducer/trelloReducer';
import { useHistory } from 'react-router-dom/cjs/react-router-dom';


export default function Login() {
  const dispatch = useDispatch();
  const history = useHistory();
  const handleClick = (event) => {
    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.password.value;

    // Gọi Redux action với email và password
    dispatch(loginApi(email, password));
    history.push("/home");
  };

  return (
    <div className="background">
      <div className="background-img">
        <div className="form">
          <div className="form__header">
            <i className="fa fa-columns" />
            <h2>Trello</h2>
          </div>
          <div className="form__title">
            <p>Log in to continue</p>
          </div>
          <div className="form__input">
            <form action="" method="post" onSubmit={handleClick}>
              <input id="email" type="text" name="email" placeholder="Enter your email" />
              <br />
              <input id="password" type="password" name="password" placeholder="Enter your password" />
              <button className="btn btn-primary" type="submit">Log in</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
