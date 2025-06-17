import { useEffect, useState } from 'react';
import AddButton from '../../Grid/AddButton/AddButton';
import GridContent from '../../Grid/GridContent/GridContent';
import FilterDropdown from '../../Grid/FilterDropdown/FilterDropdown';
import { createConsulta, deleteConsulta, listConsultas, updateConsulta } from '../../../api/consultas';
import ModalForm from '../../Form/ModalForm';
import { listPets } from '../../../api/pets';
import { listFuncionarios } from '../../../api/funcionarios';

const formatDate = (dateString) => {
    const [year, month, day] = dateString.split('-');
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('pt-BR');
};

const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Pet', accessor: 'pet' },
    { header: 'Data', accessor: 'date' },
    { header: 'Veterinário', accessor: 'veterinary' },
];

function ListConsultas() {
    const [rawData, setRawData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [atualizar, setAtualizar] = useState(false);
    const [setselectedConsulta, setsetselectedConsulta] = useState(null);
    const [petsOptions, setPetsOptions] = useState([]);
    const [vetsOptions, setVetsOptions] = useState([]);
    const [optionsLoaded, setOptionsLoaded] = useState(false);

    useEffect(() => {
        async function fetchOptions() {
            try {
                const [petsRes, vetsRes] = await Promise.all([
                    listPets(),
                    listFuncionarios()
                ]);

                setPetsOptions(petsRes.data.map(p => ({ value: p.id, label: p.nome })));
                setVetsOptions(vetsRes.data.map(v => ({ value: v.id, label: v.nome })));

                setOptionsLoaded(true);
            } catch (error) {
                console.error('Erro ao carregar opções:', error);
            }
        }
        fetchOptions();
    }, []);

    useEffect(() => {
        if (!optionsLoaded) return;

        async function fetchConsultas() {
            const resposta = await listConsultas();
            const consultas = resposta.data.map(consulta => ({
                id: consulta.id,
                pet: consulta.petId,
                date: consulta.dataHora,
                veterinary: consulta.funcionarioId,
            }));

            setRawData(consultas);
            setFilteredData(formatConsultasData(consultas));
        }

        fetchConsultas();
    }, [optionsLoaded, atualizar]);

    function formatConsultasData(consultas) {
        return consultas.map(consulta => ({
            ...consulta,
            pet: petsOptions.find(p => p.value === consulta.pet)?.label || 'Desconhecido',
            veterinary: vetsOptions.find(v => v.value === consulta.veterinary)?.label || 'Desconhecido',
            // date: formatDate(consulta.date)
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

        setFilteredData(formatConsultasData(filtered));
    };

    const handleSubmit = (formData) => {
        const data = {
            dataHora: "2025-05-18T14:30:00",
            petId: formData.pet,
            funcionarioId: formData.veterinary,
            observacoes: formData.description,
            valor: formData.value
        };

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
                            renderActions={(row) => {
                                const consultaToEdit = {
                                    id: row.id,
                                    veterinary: vetsOptions.find(o => o.label === row.veterinary)?.value || '',
                                    pet: petsOptions.find(e => e.label === row.pet)?.value || '',
                                    date: row.date.split('/').reverse().join('-'), // para o input date
                                };
                                return (
                                    <>
                                        <button
                                            className="btn btn-sm btn-primary me-2"
                                            onClick={() => {
                                                setsetselectedConsulta(consultaToEdit);
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