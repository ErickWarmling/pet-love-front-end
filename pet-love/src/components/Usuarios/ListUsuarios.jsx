import { useEffect, useState } from "react";
import ModalForm from "../Form/ModalForm";
import AddButton from "../Grid/AddButton/AddButton";
import FilterDropdown from "../Grid/FilterDropdown/FilterDropdown";
import GridContent from "../Grid/GridContent/GridContent";
import { createUsuario, deleteUsuario, listUsuarios, updateUsuario } from "../../api/usuarios";
import { listDonos } from "../../api/donos";

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

    useEffect(() => {
        async function fetchData() {
            setFilteredData(await getUsuarios())
            await fetchPessoas();
        }
        fetchData();
    }, [atualizar]);

    async function fetchPessoas() {
        try {
            const resposta = await listDonos();
            const options = resposta.data.map((dono) => ({
                value: dono.id,
                label: dono.nome
            }));
            setPessoasOptions(options);
        } catch (error) {
            console.log('Erro ao buscar donos: ', error);
        }
    }

    async function getUsuarios() {
        try {
            const resposta = await listUsuarios();
            const responseData = resposta.data.map((usuario) => (
                {
                    id: usuario.id,
                    login: usuario.login,
                    senha: usuario.senha,
                    perfil: usuario.perfil,
                    person: usuario.pessoaId,
                }
            ));
            return responseData;
        } catch (error) {
            console.log(error);
            return[];
        }
    }
        

    const applyFilter = async function (filters) {
        const data = await getUsuarios();
        const filtered = data.filter(item =>
            Object.entries(filters).every(([key, val]) =>
                val === '' ||
                String(item[key] ?? '')
                    .toLowerCase()
                    .includes(String(val).toLowerCase())
            )
        );
        setFilteredData(filtered);
    };

    const handleSubmit = (formData) => {
        const data = {
            "login": formData.login,
            "perfil": parseInt(formData.perfil),
            "pessoaId": formData.person
        }

        if (formData.password && formData.password.trim() !== '') {
            data.senha = formData.password;
        }

        const apiCall = selectedUsuario
            ? updateUsuario(selectedUsuario.id, data)
            : createUsuario(data)

            apiCall.
                then(() => {
                    setAtualizar(prev => !prev);
                })
                .catch(error => {
                    console.error('Erro na requisição: ', error);
                });
    };

    const handleDelete = (user) => {
        deleteUsuario(user.id)
            .then(() => {
                setAtualizar(prev => !prev);
            })
            .catch(error => {
                console.error('Erro na requisição: ', error);
            });
    }

    const formFields = [
        { name: 'login', label: 'Login', type: 'text' },
        { name: 'password', label: 'Senha', type: 'password' },
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
                            renderActions={(row) => (
                                <>
                                    <button
                                        className="btn btn-sm btn-primary me-2"
                                        onClick={() => {
                                            setSelectedUsuario(row);
                                            setShowModal(true);
                                        }}
                                    >
                                        Editar
                                    </button>
                                    <button
                                        className="btn btn-sm btn-danger"
                                        onClick={() => handleDelete(row)}
                                    >
                                        Excluir
                                    </button>
                                </>
                            )}
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
            </div>
        </section>
    );
}

export default ListUsuarios;