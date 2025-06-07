import { BrowserRouter, Route, Routes } from "react-router-dom";
import ListDonos from "../Donos/ListDonos/ListDonos";
import TopMenu from "../TopMenu/TopMenu";
import ListSolicitacaoAdocao from "../Adocoes/ListSolicitacaoAdocao/ListSolicitacaoAdocao";
import ListConsultas from "../Consultas/ListConsultas/ListConsultas";
import ListPets from "../Pets/ListPets/ListPets";
import ListFuncionarios from "../Funcionarios/ListFuncionarios/ListFuncionarios";
import Login from "../Login/Login";

export default function PetLove() {
    return (
        <div>
            <TopMenu></TopMenu>
            <BrowserRouter>
                <Routes>
                    <Route path="/funcionarios" element={<ListFuncionarios/>}></Route>
                    <Route path="/donos" element={<ListDonos/>}></Route>
                    <Route path="/pets" element={<ListPets/>}></Route>
                    <Route path="/consultas" element={<ListConsultas/>}></Route>
                    <Route path="/adocoes" element={<ListSolicitacaoAdocao/>}></Route>
                    <Route path="/login" element={<Login />}></Route>
                </Routes>
            </BrowserRouter>
        </div>
    )
}