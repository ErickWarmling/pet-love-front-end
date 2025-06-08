import { useEffect, useState } from 'react';
import AddButton from '../../Grid/AddButton/AddButton';
import GridContent from '../../Grid/GridContent/GridContent';
import FilterDropdown from '../../Grid/FilterDropdown/FilterDropdown';
import { createConsulta, deleteConsulta, listConsultas, updateConsulta } from '../../../api/consultas';
import ModalForm from '../../Form/ModalForm';
import { listPets } from '../../../api/pets';
import { listFuncionarios } from '../../../api/funcionarios';

const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Pet', accessor: 'pet' },
    { header: 'Data', accessor: 'date' },
    { header: 'Veterinário', accessor: 'veterinary' },
];

function ListConsultas() {
    const [filteredData, setFilteredData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [atualizar, setAtualizar] = useState(false);
    const [setselectedConsulta, setsetselectedConsulta] = useState(null);
    const [petsOptions, setPetsOptions] = useState([]);
    const [vetsOptions, setVetsOptions] = useState([]);

    useEffect(() => {
        async function fetchData() {
            setFilteredData(await getConsultas())
            await fetchPets();
            await fetchVets();
        }
        fetchData();
    }, [atualizar]);

    async function fetchPets() {
        try {
            const resposta = await listPets();
            const options = resposta.data.map((pet) => ({
                value: pet.id,
                label: pet.nome
            }));
            setPetsOptions(options);
        } catch (error) {
            console.log('Erro ao buscar pets:', error);
        }
    }

    async function fetchVets() {
        try {
            const resposta = await listFuncionarios();
            const options = resposta.data.map((vet) => ({
                value: vet.id,
                label: vet.nome
            }));
            setVetsOptions(options);
        } catch (error) {
            console.log('Erro ao buscar veterinários:', error);
        }
    }

    async function getConsultas() {
        try {
            const resposta = await listConsultas();
            const responseData = resposta.data.map((item) => (
                {
                    id: item.id,
                    owner: '',
                    pet: item.petId,
                    date: item.dataHora,
                    veterinary: item.funcionarioId
                }
            ));
            return responseData;
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    const applyFilter = async function (filters) {
        const data = await getConsultas();
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
            "dataHora": "2025-05-18T14:30:00",
            "observacoes": formData.description,
            "valor": formData.value,
            "funcionarioId": formData.veterinary,
            "petId": formData.pet
        }

        const apiCall = setselectedConsulta
            ? updateConsulta(setselectedConsulta.id, data)
            : createConsulta(data);

        apiCall.
            then(response => {
                setAtualizar(prev => !prev);
            })
            .catch(error => {
                console.error('Erro na requisição:', error);
            });
    };

    const handleDelete = (consulta) => {
        deleteConsulta(consulta.id)
            .then(() => {
                setAtualizar(prev => !prev);
            })
            .catch(error => {
                console.error('Erro na requisição:', error);
            });
    }

    const formFields = [
        { name: 'pet', label: 'Pet', type: 'select', options: petsOptions },
        { name: 'veterinary', label: 'Veterinário', type: 'select', options: vetsOptions },
        { name: 'date', label: 'Data', type: 'date' },
        { name: 'time', label: 'Horário', type: 'time' },
        { name: 'description', label: 'Descrição', type: 'textarea', rows: 4 },
        { name: 'value', label: 'Valor', type: 'number' },
    ];

    return (
        <section className="ListConsultas py-4">
            <div className="container">
                {/* Header row */}
                <div className="row align-items-center mb-3">
                    <div className="col">
                        <h2 className="m-0">CONSULTAS</h2>
                    </div>
                    <div className="col-auto">
                        <AddButton text="Nova Consulta" onClick={() => {
                            setsetselectedConsulta(null);
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
                                            setsetselectedConsulta(row);
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

                {/* Modal Form */}
                <ModalForm
                    show={showModal}
                    onClose={() => {
                        setShowModal(false);
                        setsetselectedConsulta(null);
                    }}
                    title={setselectedConsulta ? 'Editar Consulta' : 'Novo Consulta'}
                    fields={formFields}
                    onSubmit={handleSubmit}
                    initialData={setselectedConsulta}
                />
            </div>
        </section>
    );
}

export default ListConsultas;