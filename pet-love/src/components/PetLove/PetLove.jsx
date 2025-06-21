import { BrowserRouter, Route, Routes } from "react-router-dom";
import ListDonos from "../Donos/ListDonos/ListDonos";
import TopMenu from "../TopMenu/TopMenu";
import ListSolicitacaoAdocao from "../Adocoes/ListSolicitacaoAdocao/ListSolicitacaoAdocao";
import ListConsultas from "../Consultas/ListConsultas/ListConsultas";
import ListPets from "../Pets/ListPets/ListPets";
import ListFuncionarios from "../Funcionarios/ListFuncionarios/ListFuncionarios";
import Login from "../Login/Login";
import ListUsuarios from "../Usuarios/ListUsuarios";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Home from "../Home/Home";
import AuthProvider from "../Login/AuthProvider";
import AuthenticatedRoute from "../Login/AuthenticatedRoute";

function App() {
    const location = useLocation();
    const hideMenu = location.pathname === "/login";

    return (
        <>
            <ToastContainer position="top-right" autoClose={3000} />
            {!hideMenu && <TopMenu />}
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/funcionarios" element={<ListFuncionarios/>}></Route>
                    <Route path="/donos" element={<ListDonos/>}></Route>
                    <Route path="/pets" element={<ListPets/>}></Route>
                    <Route path="/consultas" element={<ListConsultas/>}></Route>
                    <Route path="/usuarios" element={<AuthenticatedRoute><ListUsuarios/></AuthenticatedRoute>}></Route>
                    <Route path="/adocoes" element={<ListSolicitacaoAdocao/>}></Route>
                    <Route path="/login" element={<Login />}></Route>
                </Routes>
        </>
    )
}

export default function PetLove() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </AuthProvider>
    );
}