import LoginForm from "./LoginForm";
import './Login.css'

function Login() {
    return (
       <div className="pageLogin">
         <div className="container mt-5">
            <h1 className="text-center">Login</h1>
            <LoginForm />
        </div>
       </div>
    );
}

export default Login;