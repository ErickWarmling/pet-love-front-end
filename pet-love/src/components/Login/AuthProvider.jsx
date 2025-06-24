import { createContext, useContext, useEffect, useState } from "react";
import { loginUsuario } from "../../api/usuarios";

export const AutCtx = createContext();
export const useAutCtx = () => useContext(AutCtx);

export default function AuthProvider({ children }) {
    const [autenticado, setAutenticado] = useState(() => {
        return !!localStorage.getItem("usuario");
    });

    const [usuario, setUsuario] = useState(() => {
        const saved = localStorage.getItem("usuario");
        return saved ? JSON.parse(saved) : null;
    });

    async function autenticar(login, senha) {
        try {
            const loginDTO = { login, senha };
            const response = await loginUsuario(loginDTO);
            setUsuario(response.data);
            setAutenticado(true);
            localStorage.setItem("usuario", JSON.stringify(response.data));
            return true;
        } catch (error) {
            setAutenticado(false);
            setUsuario(null);
            localStorage.removeItem("usuario");
            return false;
        }
    }

    function sair() {
        setAutenticado(false);
        setUsuario(null);
        localStorage.removeItem("usuario");
    }

    return (
        <AutCtx.Provider value={{ autenticado, usuario, autenticar, sair }}>
            {children}
        </AutCtx.Provider>
    )
}