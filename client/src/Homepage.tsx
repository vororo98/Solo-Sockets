import { useRef } from "react";
import { useNavigate } from "react-router-dom";

const Homepage = () => {
    const usernameInput = useRef<HTMLInputElement>(null);
    const passwordInput = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    const handleRequest = (e: any) => {
    e.preventDefault();
    const userData = {
      user_name: usernameInput.current!.value,
      password: passwordInput.current!.value,
    };

    fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    }).then((res) =>
      res.status == 200 ? navigate("/profile") : console.log(res.status)
    );
  };

    return (
        <>
          <h1 className="title-login">Super Robot Programmer!!!</h1>
          <div className="container-login">
            <form className="form-login" action="#" onSubmit={handleRequest}>
              <label className="label-login" htmlFor="username">
                Username
              </label>
              <input
                className="input-login"
                type="text"
                name="username"
                ref={usernameInput}
              />
              <label className="label-login" htmlFor="password">
                Password
              </label>
              <input
                className="input-login"
                type="password"
                name="password"
                ref={passwordInput}
              />
              <button className="button-login">Login</button>
            </form>
            <div className="newacc">
              <div className="space-invader"> </div>
              <a className="link-newacc" href="/new">
                Create An Account
              </a>
            </div>
          </div>
        </>
      );
}

export default Homepage;