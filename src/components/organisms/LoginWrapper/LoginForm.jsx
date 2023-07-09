import React, { useState } from 'react';
import { f7 } from 'framework7-react';
import './LoginForm.scss';
import API from '../../../services/axiosClient'
import '../../../constants/constant'
import { ROUTE_PATH } from '../../../constants/constant';



const LoginWrapper = () => {
  const [email, setEmail] = useState('');
  const [password, setPassWord] = useState('');

  const handleChange = (e, type) => {
    if (type === 'email') {
      setEmail(e.target.value);
    } else if (type === 'pass') setPassWord(e.target.value);
    else {
      return null;
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const userData = {
      email: email,
      password: password
    };

    try {
      const response = await API.apiLogin(userData) 
      localStorage.setItem('token', response.data.data?.token);
      f7.view.main.router.navigate(ROUTE_PATH.product);

    } catch (error) {
    console.log(error);
    }
  };

  return (
    <div className="login-box">
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <div className="user-box">
          <label>Username</label>
          <input
            type="text"
            name="current-user"
            autoComplete="current-user"
            required=""
            onChange={(e) => handleChange(e, 'email')}
            placeholder="UserName"
          />
        </div>
        <div className="user-box">
          <label>Password</label>
          <input
            type="password"
            name="current-password"
            autoComplete="current-password"
            onChange={(e) => handleChange(e, 'pass')}
            placeholder="PassWord"
          />
        </div>
        <button className="custom_button" type="submit">
          Đăng Nhập
        </button>
      </form>
    </div>
  );
};

export default LoginWrapper;
