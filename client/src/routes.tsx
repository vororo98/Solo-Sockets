import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
  } from "react-router-dom";
  import Homepage from "./Homepage";
  import CreateAccount from "./CreateAccount";
  import App from './App.tsx'
  
  const Pather = () => {
    return (
      <div className="container" >
      <Router>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="new" element={<CreateAccount />} />
          
          <Route path="/play" element={<App />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
      </div>
    );
  };
  //<Route path="/profile" element={<ProfilePage/>}/>
  export default Pather;
  