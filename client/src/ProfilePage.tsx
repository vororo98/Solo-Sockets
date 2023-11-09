import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ProfilePage.css"

const ProfilePage = () => {
    const [currentUser, setCurrentUser] = useState({"id": 0, "user_name": "", "wins": 0, "losses": 0});
    const navigate = useNavigate();
    const handleClick = () => {
        navigate("/");
    };

    useEffect(() => {
        fetch("/currentUser")
          .then((res) => res.json())
          .then((data) => {
            console.log(data)
            setCurrentUser(data[0])});
      }, []);

    return (
        <>
        <h1 className="Title-Profile-Page" >Super Profile Programmer!!!</h1>
          <div className="Container-Profile">
          <div className="Greeting" >Hello, {currentUser.user_name}</div>
          <div className="Score" >Wins: {currentUser.wins}</div>
          <div className="Score" >Losses: {currentUser.losses}</div>
          <button
            className="Button-Play"
            onClick={() => {
              navigate("/play");
            }}
          >
            Play
          </button>
          <button className="Button-Logout" onClick={handleClick}>
            Logout
          </button>
          </div>
        </>
    );
};

export default ProfilePage;