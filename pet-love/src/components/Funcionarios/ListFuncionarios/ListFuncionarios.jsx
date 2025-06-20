import { useEffect, useState } from 'react';
import AddButton from '../../Grid/AddButton/AddButton';
import GridContent from '../../Grid/GridContent/GridContent';
import FilterDropdown from '../../Grid/FilterDropdown/FilterDropdown';
import { createFuncionario, deleteFuncionario, listFuncionarios, updateFuncionario } from '../../../api/funcionarios';
import ModalForm from '../../Form/ModalForm';
import { toast } from 'react-toastify';

const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Funcionário', accessor: 'employee' },
    { header: 'Função', accessor: 'function' },
    { header: 'CRMV', accessor: 'crmv' },
];

function ListFuncionarios() {
    const [filteredData, setFilteredData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [atualizar, setAtualizar] = useState(false);
    const [selectedFuncionario, setSelectedFuncionario] = useState(null);

    useEffect(() => {
        async function fetchData() {
            setFilteredData(await getFuncionarios())
        }
        fetchData();
    }, [atualizar]);

    async function getFuncionarios() {
        try {
            const resposta = await listFuncionarios();
            const responseData = resposta.data.map((funcionario) => (
                {
                    id: funcionario.id,
                    name: funcionario.nome,
                    cpf: funcionario.cpf,
                    city: funcionario.cidade,
                    phone: funcionario.telefone,
                    email: funcionario.email,
                    employee: funcionario.nome,
                    function: funcionario.funcao,
                    crmv: funcionario.crmv,
                }
            ));
            return responseData;
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    const applyFilter = async function (filters) {
        const data = await getFuncionarios();
        const filtered = data.filter(item =>
            Object.entries(filters).every(([key, val]) =>
                val === '' ||
                String(item[key] ?? '')
                    .toLowerCase()
                    .includes(val.toLowerCase())
            )
        );
        setFilteredData(filtered);
    };

    const handleSubmit = (formData) => {
        const data = {
            "nome": formData.name,
            "cpf": formData.cpf,
            "cidade": formData.city,
            "telefone": formData.phone,
            "email": formData.email,
            "crmv": formData.crmv,
            "funcao": formData.function
        }

        const apiCall = selectedFuncionario
            ? updateFuncionario(selectedFuncionario.id, data)
            : createFuncionario(data);

        apiCall.
            then(() => {
                setAtualizar(prev => !prev);
            })
            .catch(error => {
                const msg = `Erro ao incluir. Erro: ${error.response?.data?.message}`;
                toast.error(msg);
            });
    };

    const handleDelete = (funcionario) => {
        deleteFuncionario(funcionario.id)
            .then(() => {
                setAtualizar(prev => !prev);
            })
            .catch(error => {
                console.error('Erro na requisição:', error);
            });
    }

    const formFields = [
        { name: 'name', label: 'Nome' },
        { name: 'cpf', label: 'CPF' },
        { name: 'city', label: 'Cidade' },
        { name: 'phone', label: 'Telefone' },
        { name: 'email', label: 'E-mail', type: 'email' },
        { name: 'crmv', label: 'CRMV' },
        { name: 'function', label: 'Função' },
    ];

    return (
        <section className="ListFuncionarios py-4">
            <div className="container">
                {/* Header row */}
                <div className="row align-items-center mb-3">
                    <div className="col">
                        <h2 className="m-0">FUNCIONÁRIOS</h2>
                    </div>
                    <div className="col-auto">
                        <AddButton text="Novo Funcionário" onClick={() => {
                            setSelectedFuncionario(null);
                            setShowModal(true);
                        }} />
                    </div>
                </div>

                {/* Filter row */}
                <div className="row mb-3">
                    <div className="col">
                        <FilterDropdown fields={columns.filter(c => c.accessor !== 'id')} onFilter={applyFilter} />
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
                                            setSelectedFuncionario(row);
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
                            )} />
                    </div>
                </div>

                {/* Modal form */}
                <ModalForm
                    show={showModal}
                    onClose={() => {
                        setShowModal(false);
                        setSelectedFuncionario(null);
                    }}
                    title={selectedFuncionario ? 'Editar Funcionário' : 'Novo Funcionário'}
                    fields={formFields}
                    onSubmit={handleSubmit}
                    initialData={selectedFuncionario}
                />
            </div>
        </section>
    );
}

export default ListFuncionarios;