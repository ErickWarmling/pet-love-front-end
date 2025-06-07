import { useEffect, useState } from 'react';
import AddButton from '../../Grid/AddButton/AddButton';
import GridContent from '../../Grid/GridContent/GridContent';
import FilterDropdown from '../../Grid/FilterDropdown/FilterDropdown';
import { listConsultas } from '../../../api/consultas';
import ModalForm from '../../Form/ModalForm';

const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Pet', accessor: 'pet' },
    { header: 'Data', accessor: 'date' },
    { header: 'Veterinário', accessor: 'veterinary' },
];

function ListConsultas() {
    const [filteredData, setFilteredData] = useState([]);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        async function fetchData() {
            setFilteredData(await getConsultas())
        }
        fetchData();
    }, []);

    async function getConsultas() {
        try {
            const resposta = await listConsultas();
            const responseData = resposta.data.map((item) => (
                {
                    id: item.id,
                    owner: '',
                    pet: item.petId,
                    date: item.dataHora,
                    veterinary: item.funcionarioId
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

    const handleAdd = (newConsultation) => {
        const newId = data.length ? Math.max(...data.map(d => d.id)) +1 : 1;
        setData(prev => [...prev, { id: newId, ... newConsultation }]);
    };

   const formFields = [
    { name: 'pet', label: 'Pet', type: 'select', options: ['Rex', 'Mimi', 'Thor', 'Luna', 'Max'] },
    { name: 'veterinary', label: 'Veterinário', type: 'select', options: [
        'Dra. Roberta Lima',
        'Dr. Diego Martins',
        'Dra. Larissa Souza',
        'Dr. Bruno Oliveira',
        'Dra. Camila Rocha'
    ]},
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

                {/* Modal Form */}
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