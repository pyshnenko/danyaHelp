import React, { useState } from 'react';

import './App.css';
import './login.css';

import MinioCl from './helpers/minio/Minio'

const type = {
  pass: 'password'
}

function Login({ onReady }) {
  const [state, setState] = useState({
    url: 'spamigor.site',
    port: '9000',
    ssl: true,
    login: 'spamigor',
    pass: 'ugD6s2xz',
    theme: 'themes',
    folder: 'prod'
  });

  const loginCb = async (evt) => {
    evt.preventDefault();

    const { ssl, port, url, login, pass, folder } = state;
    const minioConfig = {
      endpoint: url,
      port: Number(port),
      use_ssl: ssl,
      access_key: login,
      secret_key: pass,
      folder
    }

    const minio = new MinioCl(minioConfig);
    await minio.initConnection();

    onReady(minio, state);
  }

  return (
    <div className="App">
      <header className="App-header">
        <form className="workedForm" onSubmit={loginCb} id="loginForm">
          {Object.keys(state).map((stEl) => {
            return (<div key={stEl} className="formField">
              <p className="formLable">{stEl.toUpperCase()}</p>
              <input
              type={type[stEl] || 'text'}
              className="formInput" 
              value={state[stEl]} 
              onChange={({ target }) => {
                const resObj = { ...state };
                resObj[stEl] = target.value
                setState(resObj)
              }} />
            </div>)
          })}
          <input className="formButton" type="submit" value='Вход' />
        </form>
      </header>
    </div>
  );
}

export default Login;
