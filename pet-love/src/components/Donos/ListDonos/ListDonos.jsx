import { useState } from 'react';
import AddButton from '../../Grid/AddButton/AddButton';
import GridContent from '../../Grid/GridContent/GridContent';
import FilterDropdown from '../../Grid/FilterDropdown/FilterDropdown';
import ModalForm from '../../Form/ModalForm';

const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Nome', accessor: 'name' },
    { header: 'CPF', accessor: 'cpf' },
    { header: 'Cidade', accessor: 'city' },
    { header: 'Telefone', accessor: 'phone' },
    { header: 'E-mail', accessor: 'email' },
];

const data = [
    {
        id: 1,
        name: 'Lucas Silva',
        cpf: '123.456.789-00',
        city: 'São Paulo',
        phone: '(11) 91234-5678',
        email: 'lucas.silva@example.com',
    },
    {
        id: 2,
        name: 'Ana Costa',
        cpf: '987.654.321-00',
        city: 'Rio de Janeiro',
        phone: '(21) 99876-5432',
        email: 'ana.costa@example.com',
    },
    {
        id: 3,
        name: 'João Pereira',
        cpf: '111.222.333-44',
        city: 'Belo Horizonte',
        phone: '(31) 98877-6655',
        email: 'joao.pereira@example.com',
    },
    {
        id: 4,
        name: 'Mariana Rocha',
        cpf: '555.666.777-88',
        city: 'Curitiba',
        phone: '(41) 99911-2233',
        email: 'mariana.rocha@example.com',
    },
    {
        id: 5,
        name: 'Carlos Almeida',
        cpf: '222.333.444-55',
        city: 'Salvador',
        phone: '(71) 98765-4321',
        email: 'carlos.almeida@example.com',
    }
];

function ListDonos() {
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
        { name: 'name', label: 'Nome' },
        { name: 'cpf', label: 'CPF' },
        { name: 'city', label: 'Cidade' },
        { name: 'phone', label: 'Telefone' },
        { name: 'email', label: 'E-mail', type: 'email' },
    ];

    return (
        <section className="ListDonos py-4">
            <div className="container">
                {/* Header row */}
                <div className="row align-items-center mb-3">
                    <div className="col">
                        <h2 className="m-0">Donos</h2>
                    </div>
                    <div className="col-auto">
                        <AddButton text="Novo Dono" onClick={() => setShowModal(true)} />
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
                    title="Novo Dono"
                    fields={formFields}
                    onSubmit={handleAdd}
                />
            </div>
        </section>
    );
}

export default ListDonos;