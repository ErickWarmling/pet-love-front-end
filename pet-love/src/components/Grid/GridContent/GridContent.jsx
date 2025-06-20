function GridContent({ data, columns, renderActions }) {
    return (
        <div className="table-responsive">
            <table className="table table-striped table-bordered table-hover">
                <thead className="table-success">
                    <tr>
                        {columns.map((col, index) => (
                            <th key={index}>{col.header}</th>
                        ))}
                        {renderActions && <th>Ações</th>}
                    </tr>
                </thead>
                <tbody>
                    {data.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length + (renderActions ? 1 : 0)} className="text-center">
                                Nenhum dado disponível
                            </td>
                        </tr>
                    ) : (
                        data.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                {columns.map((col, colIndex) => (
                                    <td key={colIndex}>{row[col.accessor]}</td>
                                ))}
                                {renderActions && (
                                    <td>{renderActions(row)}</td>
                                )}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default GridContent;