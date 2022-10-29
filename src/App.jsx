import React, { useState } from 'react';
import Login from './Login';
import Theme from './Theme';
import './App.css';

function App() {
  const [isReady, setIsReady] = useState(false);
  const [minio, setMinio] = useState();
  const [themeInfo, setThemeInfo] = useState();

  return (
    <div className="App">
      <header className="App-header">
        {!isReady ? 
        <Login 
          onReady={(minio, state) => {
            setIsReady(true);
            setMinio(minio);
            setThemeInfo(state);
          }}
        /> :  
        <Theme 
          minio={minio}
          themeInfo={themeInfo}
        />}
      </header>
    </div>
  );
}

export default App;
