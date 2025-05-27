import { useState } from 'react';
import AddButton from '../../Grid/AddButton/AddButton';
import GridContent from '../../Grid/GridContent/GridContent';
import FilterDropdown from '../../Grid/FilterDropdown/FilterDropdown';

const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Nome', accessor: 'name' },
    { header: 'Dono', accessor: 'owner' },
    { header: 'Tipo', accessor: 'type' },
    { header: 'Raça', accessor: 'race' },
    { header: 'Data de Nascimento', accessor: 'date_birth' },
];

const data = [
    {
        id: 1,
        name: 'Rex',
        owner: 'Lucas Silva',
        type: 'Cachorro',
        race: 'Labrador',
        date_birth: '2020-03-15'
    },
    {
        id: 2,
        name: 'Mimi',
        owner: 'Ana Costa',
        type: 'Gato',
        race: 'Persa',
        date_birth: '2019-07-22'
    },
    {
        id: 3,
        name: 'Thor',
        owner: 'João Pereira',
        type: 'Cachorro',
        race: 'Bulldog Francês',
        date_birth: '2021-01-05'
    },
    {
        id: 4,
        name: 'Luna',
        owner: 'Mariana Rocha',
        type: 'Gato',
        race: 'Siamês',
        date_birth: '2018-11-11'
    },
    {
        id: 5,
        name: 'Max',
        owner: 'Carlos Almeida',
        type: 'Cachorro',
        race: 'Golden Retriever',
        date_birth: '2022-06-30'
    }
];


function ListPets() {

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
        <section className="ListPets py-4">
            <div className="container">
                {/* Header row */}
                <div className="row align-items-center mb-3">
                    <div className="col">
                        <h2 className="m-0">PETS</h2>
                    </div>
                    <div className="col-auto">
                        <AddButton text="Novo Pet" onClick={() => console.log('NOVO PET')} />
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

export default ListPets;