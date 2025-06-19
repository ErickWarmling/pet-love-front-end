import { useEffect, useState } from 'react';
import AddButton from '../../Grid/AddButton/AddButton';
import GridContent from '../../Grid/GridContent/GridContent';
import FilterDropdown from '../../Grid/FilterDropdown/FilterDropdown';
import { createPet, deletePet, listPets, updatePet } from '../../../api/pets';
import ModalForm from '../../Form/ModalForm';
import { listDonos } from '../../../api/donos';
import { listEspecies } from '../../../api/especies';
import { listRacas } from '../../../api/racas';
import { toast } from 'react-toastify';

const formatDate = (dateString) => {
    const [year, month, day] = dateString.split('-');
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('pt-BR');
};

const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Nome', accessor: 'name' },
    { header: 'Dono', accessor: 'owner' },
    { header: 'Tipo', accessor: 'type' },
    { header: 'Raça', accessor: 'race' },
    { header: 'Data de Nascimento', accessor: 'date_birth' },
];

function ListPets() {
    const [rawData, setRawData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [atualizar, setAtualizar] = useState(false);
    const [selectedPet, setSelectedPet] = useState(null);
    const [donosOptions, setDonosOptions] = useState([]);
    const [especiesOptions, setEspeciesOptions] = useState([]);
    const [racasOptions, setRacasOptions] = useState([]);
    const [optionsLoaded, setOptionsLoaded] = useState(false);

    useEffect(() => {
        async function fetchOptions() {
            try {
                const [donosRes, especiesRes, racasRes] = await Promise.all([
                    listDonos(),
                    listEspecies(),
                    listRacas()
                ]);

                setDonosOptions(donosRes.data.map(d => ({ value: d.id, label: d.nome })));
                setEspeciesOptions(especiesRes.data.map(e => ({ value: e.id, label: e.nome })));
                setRacasOptions(racasRes.data.map(r => ({ value: r.id, label: r.nome })));

                setOptionsLoaded(true);
            } catch (error) {
                console.error('Erro ao carregar opções:', error);
            }
        }
        fetchOptions();
    }, []);

    useEffect(() => {
        if (!optionsLoaded) return;

        async function fetchPets() {
            const resposta = await listPets();
            const pets = resposta.data.map(pet => ({
                id: pet.id,
                name: pet.nome,
                owner: pet.donos?.map(d => d.pessoaId) || [],
                type: pet.especie?.id,
                race: pet.raca?.id,
                date_birth: pet.dataNascimento,
                observation: pet.observacoes,
                image: pet.foto
            }));

            setRawData(pets);
            setFilteredData(formatPetsData(pets));
        }

        fetchPets();
    }, [optionsLoaded, atualizar]);

    function formatPetsData(pets) {
        return pets.map(pet => ({
            ...pet,
            owner: pet.owner.length > 0
                ? pet.owner.map(id => donosOptions.find(o => o.value === id)?.label || 'Desconhecido').join(', ')
                : 'Sem dono',
            type: especiesOptions.find(e => e.value === pet.type)?.label || 'Desconhecido',
            race: racasOptions.find(r => r.value === pet.race)?.label || 'Desconhecido',
            date_birth: formatDate(pet.date_birth)
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

        setFilteredData(formatPetsData(filtered));
    };

    const handleSubmit = (formData) => {
        const data = {
            nome: formData.name,
            dataNascimento: formData.date_birth,
            observacoes: formData.observation,
            foto: formData.image,
            especie: { id: formData.type },
            raca: { id: formData.race },
            donos: formData.owner?.map(id => ({
                pessoaId: id,
                principal: false
            })) || []
            // imagem não está sendo enviada por enquanto
        };

        const apiCall = selectedPet
            ? updatePet(selectedPet.id, data)
            : createPet(data);

        apiCall.then(() => {
            setAtualizar(prev => !prev);
            setShowModal(false);
            setSelectedPet(null);
        });
    };

    const handleDelete = (pet) => {
        deletePet(pet.id)
            .then(() => {
                setAtualizar(prev => !prev);
                toast.success('Registro excluído com sucesso!');
            })
            .catch(error => {
                const msg = `Erro ao excluir. Verifique se não há registros vinculados. Erro: ${error.response?.data?.message}`;
                toast.error(msg);
            });
    };

    const formFields = [
        { name: 'name', label: 'Nome' },
        { name: 'owner', label: 'Dono', type: 'select', options: donosOptions, multiple: true },
        { name: 'type', label: 'Tipo', type: 'select', options: especiesOptions },
        { name: 'race', label: 'Raça', type: 'select', options: racasOptions },
        { name: 'date_birth', label: 'Data de Nascimento', type: 'date' },
        { name: 'observation', label: 'Observações', type: 'textarea', rows: 4 },
        // { name: 'image', label: 'Foto' } --> Retirado por enquanto
    ];

    return (
        <section className="ListPets py-4">
            <div className="container">
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

                <div className="row mb-3">
                    <div className="col">
                        <FilterDropdown fields={columns.filter(c => c.accessor !== 'id')} onFilter={applyFilter} />
                    </div>
                </div>

                <div className="row">
                    <div className="col">
                        <GridContent
                            data={filteredData}
                            columns={columns}
                            renderActions={(row) => {
                                const petToEdit = {
                                    id: row.id,
                                    name: row.name,
                                    owner: Array.isArray(rawData.find(p => p.id === row.id)?.owner)
                                        ? rawData.find(p => p.id === row.id)?.owner
                                        : [],
                                    type: especiesOptions.find(e => e.label === row.type)?.value || '',
                                    race: racasOptions.find(r => r.label === row.race)?.value || '',
                                    date_birth: row.date_birth.split('/').reverse().join('-'),
                                    observation: row.observation,
                                    image: row.image
                                };
                                return (
                                    <>
                                        <button
                                            className="btn btn-sm btn-primary me-2"
                                            onClick={() => {
                                                setSelectedPet(petToEdit);
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
                                );
                            }}
                        />
                    </div>
                </div>

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
