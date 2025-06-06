import { useEffect, useState } from 'react';
import AddButton from '../../Grid/AddButton/AddButton';
import GridContent from '../../Grid/GridContent/GridContent';
import FilterDropdown from '../../Grid/FilterDropdown/FilterDropdown';
import ModalForm from '../../Form/ModalForm';
import { listDonos } from '../../../api/donos';

const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Nome', accessor: 'name' },
    { header: 'CPF', accessor: 'cpf' },
    { header: 'Cidade', accessor: 'city' },
    { header: 'Telefone', accessor: 'phone' },
    { header: 'E-mail', accessor: 'email' },
];

function ListDonos() {
    const [filteredData, setFilteredData] = useState([]);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        async function fetchData() {
            setFilteredData(await getDonos())
        }
        fetchData();
    }, []);

    async function getDonos() {
        try {
            const resposta = await listDonos();
            const responseData = resposta.data.map((dono) => (
                {
                    id: dono.id,
                    name: dono.nome,
                    cpf: dono.cpf,
                    city: dono.cidade,
                    phone: dono.telefone,
                    email: dono.email,
                }
            ));
            return responseData;
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    const applyFilter = async function (filters) {
        const data = await getConsultas();
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