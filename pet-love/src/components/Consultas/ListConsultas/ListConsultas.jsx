import { useState } from 'react';
import AddButton from '../../Grid/AddButton/AddButton';
import GridContent from '../../Grid/GridContent/GridContent';
import FilterDropdown from '../../Grid/FilterDropdown/FilterDropdown';
import ModalForm from '../../Form/ModalForm';

const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Dono', accessor: 'owner' },
    { header: 'Pet', accessor: 'pet' },
    { header: 'Data', accessor: 'date' },
    { header: 'Veterinário', accessor: 'veterinary' },
];

const data = [
    {
        id: 1,
        owner: 'Lucas Silva',
        pet: 'Rex',
        date: '2024-08-12',
        veterinary: 'Dra. Roberta Lima'
    },
    {
        id: 2,
        owner: 'Ana Costa',
        pet: 'Mimi',
        date: '2024-09-05',
        veterinary: 'Dr. Diego Martins'
    },
    {
        id: 3,
        owner: 'João Pereira',
        pet: 'Thor',
        date: '2024-07-21',
        veterinary: 'Dra. Larissa Souza'
    },
    {
        id: 4,
        owner: 'Mariana Rocha',
        pet: 'Luna',
        date: '2024-06-18',
        veterinary: 'Dr. Bruno Oliveira'
    },
    {
        id: 5,
        owner: 'Carlos Almeida',
        pet: 'Max',
        date: '2024-10-03',
        veterinary: 'Dra. Camila Rocha'
    }
];


function ListConsultas() {
    const [filteredData, setFilteredData] = useState(data);
    const [showModal, setShowModal] = useState(false);

    const applyFilter = (filters) => {
        const filtered = data.filter(item =>
            Object.entries(filters).every(([key, val]) =>
                val === '' || (item[key] || '').toLowerCase().includes(val.toLowerCase())
            )
        );
        setFilteredData(filtered);
    };

    const handleAdd = (newPerson) => {
        const newId = data.length ? Math.max(...data.map(d => d.id)) + 1 : 1;
        setData(prev => [...prev, { id: newId, ...newPerson }]);
    };

    const formFields = [
        { name: 'pet', label: 'Pet' },
        { name: 'vet', label: 'Veterinário' },
        { name: 'date', label: 'Data', type: 'date' },
        { name: 'time', label: 'Horário', type: 'time' },
        { name: 'description', label: 'Descrição', type: 'textarea' },
        { name: 'price', label: 'Preço', type: 'number' },
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
                        <AddButton text="Nova Consulta" onClick={() => setShowModal(true)} />
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

                {/* Modal form */}
                <ModalForm
                    show={showModal}
                    onClose={() => setShowModal(false)}
                    title="Nova Consulta"
                    fields={formFields}
                    onSubmit={handleAdd}
                />
            </div>
        </section>
    );
}

export default ListConsultas;