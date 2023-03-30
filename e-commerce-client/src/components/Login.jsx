import { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../context/login-provider";

export default function Login() {
  const navigate = useNavigate();
  const { login, setLogin } = useContext(LoginContext);
  const URL = "http://localhost:8080/auth/login";
  const initiaState = {
    email: "",
    password: "",
    error: "",
    errorStatus: true,
  };
  const [state, setState] = useState(initiaState);

  useEffect(() => {
    console.log("Login");
  }, [state]);

  async function fetchLogin(url) {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: state.email,
        password: state.password,
      }),
    };

    const response = await fetch(url, options);
    const data = await response.json();

    if (data.success === true) {
      console.log("STATUS ==== ", state);
      setState({ ...state, errorStatus: true });
      localStorage.setItem("token", data.token);
      setLogin(true);
      // navigate("/");
      console.log("STATUS ==== ", state.errorStatus);
    } else {
      setState({ ...state, errorStatus: true });
    }

    setState({ ...state, error: data.status });

    console.log(data);
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("login");
    fetchLogin(URL);
  };
  return (
    <div>
      <div className="signup-container text-center">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email*
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="Enter your email"
              onChange={(e) => {
                setState({ ...state, email: e.target.value });
              }}
            ></input>
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password*
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Create a password"
              onChange={(e) => {
                setState({ ...state, password: e.target.value });
              }}
            ></input>
            <div id="emailHelp" className="form-text">
              Must be at least 8 characters.
            </div>
          </div>
          <div>
            {state.errorStatus ? (
              <p className="text-success"> {state.error}</p>
            ) : (
              <p className="text-danger"> {state.error}</p>
            )}
          </div>
          <button type="submit" className="btn btn-primary">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
