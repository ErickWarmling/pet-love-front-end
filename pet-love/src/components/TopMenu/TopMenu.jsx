import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import './TopMenu.css';

function TopMenu() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <>
            {/* Top Menu Bar */}
            <nav className="navbar bg-light px-3 d-flex align-items-center shadow">
                <div className="col-10">
                    <button className="btn me-2" onClick={() => setSidebarOpen(true)}>
                        <FontAwesomeIcon icon={faBars} size="lg" />
                    </button>
                    <img src="/logo.png" alt="Logo" style={{ height: '50px' }} />
                </div>
                <div className="col-2 d-flex justify-content-end">
                    <img src="/perfil.png" alt="Logo" style={{ height: '50px' }} />
                </div>
            </nav>

            {/* Sidebar */}
            <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-header d-flex justify-content-between align-items-center px-3 py-2 border-bottom">
                    <h5 className="mb-0">Menu</h5>
                    <button className="btn" onClick={() => setSidebarOpen(false)}>
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>
                <ul className="list-unstyled px-3 pt-3">
                    <li><a href="/funcionarios" className="d-block py-2 text-decoration-none">Cadastrar Funcionário</a></li>
                    <li><a href="/donos" className="d-block py-2 text-decoration-none">Cadastrar Dono</a></li>
                    <li><a href="/pets" className="d-block py-2 text-decoration-none">Cadastrar Pet</a></li>
                    <li><a href="/consultas" className="d-block py-2 text-decoration-none">Cadastrar Consulta</a></li>
                    <li><a href="/usuarios" className="d-block py-2 text-decoration-none">Cadastrar Usuários</a></li>
                    <li><a href="/adocoes" className="d-block py-2 text-decoration-none">Adoções</a></li>
                </ul>
            </div>

            {/* Backdrop */}
            {sidebarOpen && <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} />}
        </>
    );
}

export default TopMenu;