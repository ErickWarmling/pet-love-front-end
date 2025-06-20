import { useEffect, useState } from 'react';
import GridContent from '../../Grid/GridContent/GridContent';
import FilterDropdown from '../../Grid/FilterDropdown/FilterDropdown';
import { listAdocoes } from '../../../api/adocoes';
import { listDonos } from '../../../api/donos';
import { listPets } from '../../../api/pets';

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

function ListSolicitacaoAdocao() {
    const [rawData, setRawData] = useState([]);
    const [petsOptions, setPetsOptions] = useState([]);
    const [donosOptions, setDonosOptions] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [optionsLoaded, setOptionsLoaded] = useState(false);

    useEffect(() => {
        async function fetchOptions() {
            try {
                const [petsRes, donosRes] = await Promise.all([
                    listPets(),
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
    }, [optionsLoaded]);

    function formatSolicitacoesData(solicitacoes) {
        return solicitacoes.map(adocao => ({
            ...adocao,
            pet: petsOptions.find(p => p.value === adocao.pet)?.label || 'Desconhecido',
            person: donosOptions.find(v => v.value === adocao.person)?.label || 'Desconhecido',
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

    return (
        <section className="ListSolicitacaoAdocao py-4">
            <div className="container">
                {/* Header row */}
                <div className="row align-items-center mb-3">
                    <div className="col">
                        <h2 className="m-0">SOLICITAÇÕES DE ADOÇÃO</h2>
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
                                            setSelectedDono(row);
                                            setShowModal(true);
                                        }}
                                    >
                                        Aprovar
                                    </button>
                                    <button
                                        className="btn btn-sm btn-danger"
                                        onClick={() => handleDelete(row)}
                                    >
                                        Recusar
                                    </button>
                                </>
                            )} />
                    </div>
                </div>
            </div>
        </section>
    );
}

export default ListSolicitacaoAdocao;