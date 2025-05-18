import { BrowserRouter, Route, Routes } from "react-router-dom";
import ListDonos from "../Donos/ListDonos/ListDonos";
import TopMenu from "../TopMenu/TopMenu";

export default function PetLove() {
    return (
        <div>
            <TopMenu></TopMenu>
            <BrowserRouter>
                <Routes>
                    <Route path="/donos" element={<ListDonos/>}></Route>
                </Routes>
            </BrowserRouter>
        </div>
    )
}