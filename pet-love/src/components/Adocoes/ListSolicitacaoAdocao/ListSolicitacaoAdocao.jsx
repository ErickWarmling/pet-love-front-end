import { useState } from 'react';
import AddButton from '../../Grid/AddButton/AddButton';
import GridContent from '../../Grid/GridContent/GridContent';
import FilterDropdown from '../../Grid/FilterDropdown/FilterDropdown';

const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Dono', accessor: 'person' },
    { header: 'Pet', accessor: 'pet' },
    { header: 'Data', accessor: 'date' },
    { header: 'Status', accessor: 'status' },
];

const data = [
    {
        id: 1,
        person: 'Lucas Silva',
        pet: 'Rex',
        date: '2024-10-15',
        status: 'Pendente'
    },
    {
        id: 2,
        person: 'Ana Costa',
        pet: 'Mimi',
        date: '2024-10-16',
        status: 'Confirmado'
    },
    {
        id: 3,
        person: 'João Pereira',
        pet: 'Thor',
        date: '2024-10-17',
        status: 'Cancelado'
    },
    {
        id: 4,
        person: 'Mariana Rocha',
        pet: 'Luna',
        date: '2024-10-18',
        status: 'Confirmado'
    },
    {
        id: 5,
        person: 'Carlos Almeida',
        pet: 'Max',
        date: '2024-10-19',
        status: 'Pendente'
    }
];

function ListSolicitacaoAdocao() {

    const [filteredData, setFilteredData] = useState(data);

    const applyFilter = (filters) => {
        const filtered = data.filter(item =>
            Object.entries(filters).every(([key, val]) =>
                val === '' || (item[key] || '').toLowerCase().includes(val.toLowerCase())
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