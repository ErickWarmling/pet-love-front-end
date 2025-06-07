import { useEffect, useState } from 'react';
import AddButton from '../../Grid/AddButton/AddButton';
import GridContent from '../../Grid/GridContent/GridContent';
import FilterDropdown from '../../Grid/FilterDropdown/FilterDropdown';
import { listAdocoes } from '../../../api/adocoes';

const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Dono', accessor: 'person' },
    { header: 'Pet', accessor: 'pet' },
    { header: 'Data', accessor: 'date' },
    { header: 'Status', accessor: 'status' },
];

function ListSolicitacaoAdocao() {
    const [filteredData, setFilteredData] = useState([]);

    useEffect(() => {
        async function fetchData() {
            setFilteredData(await getAdocoes())
        }
        fetchData();
    }, []);

    async function getAdocoes() {
        try {
            const resposta = await listAdocoes();
            const responseData = resposta.data.map((item) => (
                {
                    id: item.id,
                    person: item.pessoaId,
                    pet: item.petId,
                    date: item.dataHora,
                    status: item.status
                }
            ));
            return responseData;
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    const applyFilter = async function (filters) {
        const data = await getAdocoes();
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
                        <GridContent data={filteredData} columns={columns} />
                    </div>
                </div>
            </div>
        </section>
    );
}

export default ListSolicitacaoAdocao;