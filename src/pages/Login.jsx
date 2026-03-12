import "../styles/login.css";

function Login() {
  return (
    <div className="fb-container">
      {/* Left Side */}
      <div className="fb-left">
        <h1>ticket center</h1>
        <p>ticket center helps you report your problems.</p>
      </div>

      {/* Right Side */}
      <div className="fb-right">
        <div className="login-box">
          <form>
            <input type="text" placeholder="Email address" />

            <input type="password" placeholder="Password" />

            <button className="login-btn">Log In</button>

            <a href="#" className="forgot">
              Forgotten password?
            </a>

            <hr />

            <button className="signup-btn">Create New Account</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
