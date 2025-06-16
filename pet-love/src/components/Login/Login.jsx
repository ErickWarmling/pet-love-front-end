import LoginForm from "./LoginForm";
import './Login.css'

function Login() {
    return (
       <div className="pageLogin">
        <img className="logo-petlove" src="../../../public/logo.png" alt="Logo PetLove" />
         <div className="container mt-5">
            <h1 className="text-center">LOGIN</h1>
            <LoginForm />
        </div>
       </div>
    );
}

export default Login;