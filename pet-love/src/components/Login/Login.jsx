import LoginForm from "./LoginForm";
import { useNavigate } from "react-router-dom";
import { loginUsuario } from "../../api/usuarios";
import { toast } from 'react-toastify';
import './Login.css'

function Login() {
    const navigate = useNavigate();

    const handleLoginSubmit = async ({ usuario, senha }) => {
        try {
            const loginDTO = {login: usuario, senha};
            const response = await loginUsuario(loginDTO);
            toast.success("Login efetuado com sucesso!");

            navigate('/');
        } catch (error) {
            toast.error("Login ou senha inválidos");
        }
    }

    return (
       <div className="pageLogin">
        <img className="logo-petlove" src="../../../public/logo.png" alt="Logo PetLove" />
         <div className="container mt-5">
            <h1 className="text-center">LOGIN</h1>
            <LoginForm onSubmit={handleLoginSubmit}/>
        </div>
       </div>
    );
}

export default Login;