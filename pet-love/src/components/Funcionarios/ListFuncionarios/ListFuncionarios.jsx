import { useState } from 'react';
import AddButton from '../../Grid/AddButton/AddButton';
import GridContent from '../../Grid/GridContent/GridContent';
import FilterDropdown from '../../Grid/FilterDropdown/FilterDropdown';

const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Funcionário', accessor: 'employee' },
    { header: 'Função', accessor: 'function' },
];

const data = [
    {
        id: 1,
        employee: 'Roberta Lima',
        function: 'Recepcionista'
    },
    {
        id: 2,
        employee: 'Diego Martins',
        function: 'Veterinário'
    },
    {
        id: 3,
        employee: 'Larissa Souza',
        function: 'Tosadora'
    },
    {
        id: 4,
        employee: 'Bruno Oliveira',
        function: 'Administrador'
    },
    {
        id: 5,
        employee: 'Camila Rocha',
        function: 'Auxiliar de Limpeza'
    }
];

function ListFuncionarios() {

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
        <section className="ListFuncionarios py-4">
            <div className="container">
                {/* Header row */}
                <div className="row align-items-center mb-3">
                    <div className="col">
                        <h2 className="m-0">FUNCIONÁRIOS</h2>
                    </div>
                    <div className="col-auto">
                        <AddButton text="Novo Funcionário" onClick={() => console.log('NOVO FUNCIONÁRIO')} />
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

export default ListFuncionarios;