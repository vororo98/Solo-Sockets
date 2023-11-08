import { useRef } from "react";
import { useNavigate } from "react-router-dom";

const CreateAccount = () => {
    const usernameInput = useRef<HTMLInputElement>(null);
    const passwordInput = useRef<HTMLInputElement>(null);
    const reEnterPasswordInput = useRef<HTMLInputElement>(null);

    const navigate = useNavigate();

    const handleRequest = (e: any) => {
        e.preventDefault();
    
        const userData = {
          user_name: usernameInput.current!.value,
          password: passwordInput.current!.value,
        };
    
        fetch("/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        }).then((res) => {
          res.status == 200 ? navigate("/") : console.log(res.status);
        });
      };

      return (
        <>
          <h1 className="title-createacc">Boxed IN</h1>
          <form className="form-createacc" action="#" onSubmit={handleRequest}>
            <label className="label-createacc" htmlFor="username">
              Username
            </label>
            <input
              className="input-createacc"
              type="text"
              name="username"
              ref={usernameInput}
            />
            <label className="label-createacc" htmlFor="password">
              Password
            </label>
            <input
              className="input-createacc"
              type="password"
              name="password"
              ref={passwordInput}
            />
            <label className="label-createacc" htmlFor="repassword">
              Re-enter Password
            </label>
            <input
              className="input-createacc"
              type="password"
              name="repassword"
              ref={reEnterPasswordInput}
            />
            <button className="button-createacc">Create Account</button>
          </form>
          {/* <div className="space-invader"> </div> */}
        </>
      );
};

export default CreateAccount;
