import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
  } from "react-router-dom";
  import Homepage from "./Homepage.tsx";
  import CreateAccount from "./CreateAccount.tsx";
  import App from './App.tsx'
  import ProfilePage from "./ProfilePage.tsx"
  
  const Pather = () => {
    return (
      <div className="container" >
      <Router>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="new" element={<CreateAccount />} />
          <Route path="/profile" element={<ProfilePage/>}/> 
          <Route path="/play" element={<App />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
      </div>
    );
  };
  //<Route path="/profile" element={<ProfilePage/>}/>
  export default Pather;
  