import { useEffect, useState } from 'react';
import AddButton from '../../Grid/AddButton/AddButton';
import GridContent from '../../Grid/GridContent/GridContent';
import FilterDropdown from '../../Grid/FilterDropdown/FilterDropdown';
import { createPet, deletePet, listPets, updatePet } from '../../../api/pets';
import ModalForm from '../../Form/ModalForm';
import { listDonos } from '../../../api/donos';

const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Nome', accessor: 'name' },
    { header: 'Dono', accessor: 'owner' },
    { header: 'Tipo', accessor: 'type' },
    { header: 'Raça', accessor: 'race' },
    { header: 'Data de Nascimento', accessor: 'date_birth' },
];

function ListPets() {
    const [filteredData, setFilteredData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [atualizar, setAtualizar] = useState(false);
    const [selectedPet, setSelectedPet] = useState(null);
    const [donosOptions, setDonosOptions] = useState([]);

    useEffect(() => {
        async function fetchData() {
            setFilteredData(await getPets());
            await fetchDonos();
        }
        fetchData();
    }, [atualizar]);

    async function fetchDonos() {
        try {
            const resposta = await listDonos();
            const options = resposta.data.map((dono) => ({
                value: dono.id,
                label: dono.nome
            }));
            setDonosOptions(options);
        } catch (error) {
            console.log('Erro ao buscar donos:', error);
        }
    }

    async function getPets() {
        try {
            const resposta = await listPets();
            const responseData = resposta.data.map((item) => (
                {
                    id: item.id,
                    name: item.nome,
                    owner: '',
                    type: item.especie.nome,
                    race: item.raca.nome,
                    date_birth: item.dataNascimento
                }
            ));
            return responseData;
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    const applyFilter = async function (filters) {
        const data = await getPets();
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

    const handleSubmit = (formData) => {
        const data = {
            "nome": formData.name,
            "dataNascimento": "2025-01-01",
            "observacoes": formData.phone,
            "foto": formData.city,
            "especie": { "id": 1 },
            "raca": { "id": 1 },
            "donos": []
        }

        const apiCall = selectedPet
            ? updatePet(selectedPet.id, data)
            : createPet(data);

        apiCall.
            then(() => {
                setAtualizar(prev => !prev);
            })
            .catch(error => {
                console.error('Erro na requisição:', error);
            });
    };

    const handleDelete = (pet) => {
        deletePet(pet.id)
            .then(() => {
                setAtualizar(prev => !prev);
            })
            .catch(error => {
                console.error('Erro na requisição:', error);
            });
    };

    const formFields = [
        { name: 'name', label: 'Nome' },
        {
            name: 'owner',
            label: 'Dono',
            type: 'select',
            options: donosOptions
        },
        { name: 'type', label: 'Tipo', type: 'select', options: ['Cachorro', 'Gato'] },
        { name: 'race', label: 'Raça' },
        { name: 'date_birth', label: 'Data de Nascimento', type: 'date' },
        { name: 'observation', label: 'Observações', type: 'textarea', rows: 4 },
        { name: 'image', label: 'Foto', type: 'file' },
    ];

    return (
        <section className="ListPets py-4">
            <div className="container">
                {/* Header row */}
                <div className="row align-items-center mb-3">
                    <div className="col">
                        <h2 className="m-0">PETS</h2>
                    </div>
                    <div className="col-auto">
                        <AddButton text="Novo Pet" onClick={() => {
                            setSelectedPet(null);
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
                            renderActions={(row) => (
                                <>
                                    <button
                                        className="btn btn-sm btn-primary me-2"
                                        onClick={() => {
                                            setSelectedPet(row);
                                            setShowModal(true);
                                        }}
                                    >
                                        Editar
                                    </button>
                                    <button
                                        className="btn btn-sm btn-danger"
                                        onClick={() => handleDelete(row)}
                                    >
                                        Excluir
                                    </button>
                                </>
                            )} />
                    </div>
                </div>

                {/* Modal Form */}
                <ModalForm
                    show={showModal}
                    onClose={() => {
                        setShowModal(false);
                        setSelectedPet(null);
                    }}
                    title={selectedPet ? 'Editar Pet' : 'Novo Pet'}
                    fields={formFields}
                    onSubmit={handleSubmit}
                    initialData={selectedPet}
                />
            </div>
        </section>
    );
}

export default ListPets;