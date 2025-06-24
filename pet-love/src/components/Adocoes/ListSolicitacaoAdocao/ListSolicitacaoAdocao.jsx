import { useEffect, useState } from 'react';
import GridContent from '../../Grid/GridContent/GridContent';
import FilterDropdown from '../../Grid/FilterDropdown/FilterDropdown';
import { createAdocao, deleteAdocao, listAdocoes, updateAdocao } from '../../../api/adocoes';
import { listDonos } from '../../../api/donos';
import { listPets, listPetsSemDono } from '../../../api/pets';
import ModalForm from '../../Form/ModalForm';
import ConfirmModal from '../../ConfirmModal/ConfirmModal';
import { toast } from 'react-toastify';
import AddButton from '../../Grid/AddButton/AddButton';

const formatDate = (dateString) => {
    const [year, month, day] = dateString.split('-');
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('pt-BR');
};

const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Dono', accessor: 'person' },
    { header: 'Pet', accessor: 'pet' },
    { header: 'Data', accessor: 'date' },
    { header: 'Status', accessor: 'status' },
];

const statusOptions = [
    { value: 1, label: 'Solicitação realizada' },
    { value: 2, label: 'Aprovado' },
    { value: 3, label: 'Reprovado' },
]

function ListSolicitacaoAdocao() {
    const [rawData, setRawData] = useState([]);
    const [petsOptions, setPetsOptions] = useState([]);
    const [donosOptions, setDonosOptions] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [optionsLoaded, setOptionsLoaded] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [atualizar, setAtualizar] = useState(false);
    const [selectedAdocao, setSelectedAdocao] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [adocaoExcluir, setAdocaoExcluir] = useState(null);

    useEffect(() => {
        async function fetchOptions() {
            try {
                const [petsRes, donosRes] = await Promise.all([
                    listPetsSemDono(),
                    listDonos()
                ]);

                setPetsOptions(petsRes.data.map(p => ({ value: p.id, label: p.nome })));
                setDonosOptions(donosRes.data.map(v => ({ value: v.id, label: v.nome })));

                setOptionsLoaded(true);
            } catch (error) {
                console.error('Erro ao carregar opções:', error);
            }
        }
        fetchOptions();
    }, []);

    useEffect(() => {
        if (!optionsLoaded) return;

        async function fetchSolicitacoes() {
            const resposta = await listAdocoes();
            const pets = resposta.data.map(adocao => ({
                id: adocao.id,
                person: adocao.pessoaId,
                pet: adocao.petId,
                date: adocao.dataHora,
                status: adocao.status
            }));

            setRawData(pets);
            setFilteredData(formatSolicitacoesData(pets));
        }

        fetchSolicitacoes();
    }, [optionsLoaded, atualizar]);

    function formatSolicitacoesData(solicitacoes) {
        return solicitacoes.map(adocao => ({
            ...adocao,
            pet: petsOptions.find(p => p.value === adocao.pet)?.label || 'Desconhecido',
            person: donosOptions.find(v => v.value === adocao.person)?.label || 'Desconhecido',
            status: statusOptions.find(v => v.value === adocao.status)?.label || 'Desconhecido',
            date: formatDate(adocao.date)
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

        setFilteredData(formatSolicitacoesData(filtered));
    };

    const handleSubmit = (formData) => {
        const data = {
            petId: formData.pet,
            pessoaId: formData.person,
            status: formData.status,
            dataHora: formData.date
        }

        const apiCall = selectedAdocao
            ? updateAdocao(selectedAdocao.id, data)
            : createAdocao(data)

        apiCall.
            then(() => {
                setAtualizar(prev => !prev);
                if (selectedAdocao) {
                    toast.success('Solicitação atualizada com sucesso!');
                } else {
                    toast.success('Solicitação cadastrada com sucesso!');
                }
            })
            .catch(error => {
                const msg = `Erro ao incluir. Erro: ${error.response?.data?.message}`;
                toast.error(msg);
            });
    };

    const handleDelete = (adocao) => {
        deleteAdocao(adocao.id)
            .then(() => {
                setAtualizar(prev => !prev);
                toast.success('Adoção excluída com sucesso!');
            })
            .catch(error => {
                const msg = `Erro ao excluir adoção. Erro: ${error.response?.data?.message}`;
                toast.error(msg);
            });
    }

    const formFields = [
        { name: 'pet', label: 'Pet', type: 'select', options: petsOptions, required: true },
        { name: 'person', label: 'Pessoa', type: 'select', options: donosOptions, required: true },
        { name: 'date', label: 'Data', type: 'date', required: true },
        {
            name: 'status', label: 'Status', type: 'select', required: true, options: statusOptions
        },
    ];

    return (
        <section className="ListSolicitacaoAdocao py-4">
            <div className="container">
                {/* Header row */}
                <div className="row align-items-center mb-3">
                    <div className="col">
                        <h2 className="m-0">SOLICITAÇÕES DE ADOÇÃO</h2>
                    </div>
                    <div className="col-auto">
                        <AddButton text="Nova Solicitação" onClick={() => {
                            setSelectedAdocao(null);
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
                                const adocaoToEdit = {
                                    id: row.id,
                                    person: donosOptions.find(o => o.label === row.person)?.value || '',
                                    pet: petsOptions.find(e => e.label === row.pet)?.value || '',
                                    status: statusOptions.find(e => e.label === row.status)?.value || '',
                                    date: row.date.split('/').reverse().join('-'),
                                };
                                return (
                                    <>
                                        <button
                                            className="btn btn-sm btn-primary me-2"
                                            onClick={() => {
                                                setSelectedAdocao(adocaoToEdit);
                                                setShowModal(true);
                                            }}
                                        >
                                            Editar
                                        </button>
                                        <button
                                            className="btn btn-sm btn-danger"
                                            onClick={() => { setAdocaoExcluir(row); setShowConfirm(true) }}
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
                        setSelectedAdocao(null);
                    }}
                    title={setSelectedAdocao ? 'Editar Solicitação' : 'Nova Solicitação'}
                    fields={formFields}
                    onSubmit={handleSubmit}
                    initialData={selectedAdocao}
                />

                <ConfirmModal
                    show={showConfirm}
                    onClose={() => {
                        setShowConfirm(false);
                        setAdocaoExcluir(null)
                    }}
                    onConfirm={() => {
                        if (adocaoExcluir) {
                            handleDelete(adocaoExcluir);
                        }
                        setShowConfirm(false);
                        setAdocaoExcluir(null);
                    }}
                    message={`Tem certeza que deseja excluir esta consulta?`}
                />
            </div>
        </section>
    );
}

export default ListSolicitacaoAdocao;