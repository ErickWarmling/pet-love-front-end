import { useEffect, useState } from 'react';
import AddButton from '../../Grid/AddButton/AddButton';
import GridContent from '../../Grid/GridContent/GridContent';
import FilterDropdown from '../../Grid/FilterDropdown/FilterDropdown';
import { listPets } from '../../../api/pets';

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

    useEffect(() => {
        async function fetchData() {
            setFilteredData(await getPets())
        }
        fetchData();
    }, []);

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