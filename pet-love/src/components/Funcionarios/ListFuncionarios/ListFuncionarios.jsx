import { useEffect, useState } from 'react';
import AddButton from '../../Grid/AddButton/AddButton';
import GridContent from '../../Grid/GridContent/GridContent';
import FilterDropdown from '../../Grid/FilterDropdown/FilterDropdown';
import { listFuncionarios } from '../../../api/funcionarios';

const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Funcionário', accessor: 'employee' },
    { header: 'Função', accessor: 'function' },
];

function ListFuncionarios() {
    const [filteredData, setFilteredData] = useState([]);

    useEffect(() => {
        async function fetchData() {
            setFilteredData(await getFuncionarios())
        }
        fetchData();
    }, []);

    async function getFuncionarios() {
        try {
            const resposta = await listFuncionarios();
            const responseData = resposta.data.map((dono) => (
                {
                    id: dono.id,
                    employee: dono.nome,
                    function: dono.funcao,
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