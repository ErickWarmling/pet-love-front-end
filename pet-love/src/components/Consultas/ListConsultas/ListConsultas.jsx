import { useEffect, useState } from 'react';
import AddButton from '../../Grid/AddButton/AddButton';
import GridContent from '../../Grid/GridContent/GridContent';
import FilterDropdown from '../../Grid/FilterDropdown/FilterDropdown';
import { createConsulta, deleteConsulta, listConsultas, updateConsulta } from '../../../api/consultas';
import ModalForm from '../../Form/ModalForm';
import { listPets } from '../../../api/pets';
import { listFuncionarios } from '../../../api/funcionarios';
import { toast } from 'react-toastify';
import ConfirmModal from '../../ConfirmModal/ConfirmModal';

const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date)) return 'Data inválida';
    return date.toLocaleDateString('pt-BR');
};

const formatTime = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date)) return '';
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
};

const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Pet', accessor: 'pet' },
    { header: 'Data/Hora', accessor: 'date' },
    { header: 'Veterinário', accessor: 'veterinary' },
    { header: 'Descrição', accessor: 'description' },
    { header: 'Valor', accessor: 'value' },
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
    const [showConfirm, setShowConfirm] = useState(false);
    const [consultaExcluir, setConsultaExcluir] = useState(null);

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
                description: consulta.observacoes,
                value: consulta.valor,
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
            date: `${formatDate(consulta.date)} ${formatTime(consulta.date)}`
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
            dataHora: `${formData.date}T${formData.time}`,
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
                const msg = `Erro ao incluir. Erro: ${error.response?.data?.message}`;
                toast.error(msg);
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
                                const [dataPart, timePart] = row.date.split(' ');
                                const consultaToEdit = {
                                    id: row.id,
                                    veterinary: vetsOptions.find(o => o.label === row.veterinary)?.value || '',
                                    pet: petsOptions.find(e => e.label === row.pet)?.value || '',
                                    description: row.description,
                                    value: row.value,
                                    date: dataPart.split('/').reverse().join('-'), // Input tipo date precisa de yyyy-mm-dd
                                    time: timePart || '', // Input tipo time
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
                                            onClick={() => { setConsultaExcluir(row); setShowConfirm(true) }}
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

                <ConfirmModal
                    show={showConfirm}
                    onClose={() => {
                        setShowConfirm(false);
                        setConsultaExcluir(null)
                    }}
                    onConfirm={() => {
                        if (consultaExcluir) {
                            handleDelete(consultaExcluir);
                        }
                        setShowConfirm(false);
                        setConsultaExcluir(null);
                    }}
                    message={`Tem certeza que deseja excluir esta consulta?`}
                />
            </div>
        </section>
    );
}

export default ListConsultas;