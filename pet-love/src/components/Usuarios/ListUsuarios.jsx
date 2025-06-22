import { useEffect, useState } from "react";
import ModalForm from "../Form/ModalForm";
import AddButton from "../Grid/AddButton/AddButton";
import FilterDropdown from "../Grid/FilterDropdown/FilterDropdown";
import GridContent from "../Grid/GridContent/GridContent";
import { createUsuario, deleteUsuario, listUsuarios, updateUsuario } from "../../api/usuarios";
import { listDonos } from "../../api/donos";
import { toast } from 'react-toastify';
import ConfirmModal from "../ConfirmModal/ConfirmModal";

const columns = [
    { header: 'ID', accessor: 'id'},
    { header: 'Login', accessor: 'login'},
    { header: 'Perfil', accessor: 'perfil'},
    { header: 'Pessoa', accessor: 'person'},
];

function ListUsuarios() {
    const [filteredData, setFilteredData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [atualizar, setAtualizar] = useState(false);
    const [selectedUsuario, setSelectedUsuario] = useState(null);
    const [pessoasOptions, setPessoasOptions] = useState([]);
    const [optionsLoaded, setOptionsLoaded] = useState(false);
    const [rawData, setRawData] = useState([]);
    const [showConfirm, setShowConfirm] = useState(false);
    const [usuarioExcluir, setUsuarioExcluir] = useState(null);

    useEffect(() => {
        async function fetchOptions() {
            try {
                const [pessoasRes] = await Promise.all([
                    listDonos()
                ]);

                setPessoasOptions(pessoasRes.data.map(p => ({ value: p.id, label: p.nome })));

                setOptionsLoaded(true);
            } catch (error) {
                console.error('Erro ao carregar pessoas: ', error);
            }
        }
        fetchOptions();
    }, []);

    useEffect(() => {
        if (!optionsLoaded) return;

        async function fetchUsuarios() {
            const resposta = await listUsuarios();
            const pessoas = resposta.data.map(usuario => ({
                id: usuario.id,
                login: usuario.login,
                senha: usuario.senha,
                perfil: usuario.perfil,
                person: usuario.pessoaId,
            }));

            setRawData(pessoas);
            setFilteredData(formatPessoasData(pessoas));
        }

        fetchUsuarios();
    }, [optionsLoaded, atualizar]);

    function formatPessoasData(usuarios) {
        return usuarios.map(usuario => ({
            ...usuario,
            person: pessoasOptions.find(p => p.value === usuario.person)?.label || 'Desconhecido'
        }));
    }    

    const applyFilter = (filters) => {
        const filtered = rawData.filter(item =>
            Object.entries(filters).every(([key, val]) => {
                if (!val) return true; 
                const itemValue = (item[key] ?? '').toString().toLowerCase();
                return itemValue.includes(val.toLowerCase());
            })
        );
        setFilteredData(formatPessoasData(filtered));
    };

    const handleSubmit = (formData) => {
        const data = {
            "login": formData.login,
            "senha": formData.password,
            "perfil": parseInt(formData.perfil),
            "pessoaId": formData.person
        }

        const apiCall = selectedUsuario
            ? updateUsuario(selectedUsuario.id, data)
            : createUsuario(data)

            apiCall.
                then(() => {
                    setAtualizar(prev => !prev);
                    if (selectedUsuario) {
                        toast.success('Usuário atualizado com sucesso!');
                    } else {
                        toast.success('Usuário cadastrado com sucesso!');
                    }
                })
                .catch(error => {
                    const msg = `Erro ao incluir. Erro: ${error.response?.data?.message}`;
                    toast.error(msg);
                });
    };

    const handleDelete = (user) => {
        deleteUsuario(user.id)
            .then(() => {
                setAtualizar(prev => !prev);
                toast.success('Usuário excluído com sucesso!');
            })
            .catch(error => {
                const msg = `Erro ao excluir usuário. Erro: ${error.response?.data?.message}`;
                toast.error(msg);
            });
    }

    const formFields = [
        { name: 'login', label: 'Login', type: 'text' },
        { name: 'password', label: 'Senha', type: 'password'},
        { name: 'perfil',  label: 'Perfil', type: 'select', 
            options: [
                { value: 1, label: 'Recepção' },
                { value: 2, label: 'Veterinário' }
            ]
        },
        { name: 'person', label: 'Pessoa', type: 'select', options: pessoasOptions },
    ];

    return (
        <section className="ListUsuarios py-4">
            <div className="container">
                {/* Header row */}
                <div className="row align-items-center mb-3">
                    <div className="col">
                        <h2 className="m-0">USUÁRIOS</h2>
                    </div>
                    <div className="col-auto">
                        <AddButton text="Novo Usuário" onClick={() => {
                            setSelectedUsuario(null);
                            setShowModal(true);
                        }}/>
                    </div>
                </div>

                {/* Filter row */}
                <div className="row mb-3">
                    <div className="col">
                        <FilterDropdown fields={columns.filter(c => c.accessor !== 'id')} onFilter={applyFilter}/>
                    </div>
                </div>

                {/* Grid row */}
                <div className="row">
                    <div className="col">
                        <GridContent 
                            data={filteredData} 
                            columns={columns}
                            renderActions={(row) => {
                                const pessoa = pessoasOptions.find(p => p.label === row.person);
                                return (
                                <>
                                    <button
                                        className="btn btn-sm btn-primary me-2"
                                        onClick={() => {
                                            setSelectedUsuario({ ...row, person: pessoa?.value || '' });
                                            setShowModal(true);
                                        }}
                                    >
                                        Editar
                                    </button>
                                    <button
                                        className="btn btn-sm btn-danger"
                                        onClick={() => { setUsuarioExcluir(row); setShowConfirm(true)}}
                                    >
                                        Excluir
                                    </button>
                                </>
                                );
                            }}
                        />
                    </div>
                </div>

                {/* Modal Form */}
                <ModalForm
                    show={showModal}
                    onClose={() => {
                        setShowModal(false);
                        setSelectedUsuario(null);
                    }}
                    title={selectedUsuario ? 'Editar Usuário' : 'Novo Usuário'}
                    fields={formFields}
                    onSubmit={handleSubmit}
                    initialData={selectedUsuario}
                />

                <ConfirmModal
                    show={showConfirm}
                    onClose={() => {
                        setShowConfirm(false);
                        setUsuarioExcluir(null)
                    }}
                    onConfirm={() => {
                        if (usuarioExcluir) {
                            handleDelete(usuarioExcluir);
                        }
                        setShowConfirm(false);
                        setUsuarioExcluir(null);
                    }}
                    message={`Tem certeza que deseja excluir o usuário "${usuarioExcluir?.login}"`}
                />
            </div>
        </section>
    );
}

export default ListUsuarios;