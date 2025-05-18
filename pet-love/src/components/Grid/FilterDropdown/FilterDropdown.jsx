import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState, useRef, useEffect } from 'react';

const FilterDropdown = ({ fields, onFilter }) => {
    const [show, setShow] = useState(false);
    const [values, setValues] = useState(() =>
        fields.reduce((acc, field) => {
            acc[field.accessor] = '';
            return acc;
        }, {})
    );

    const ref = useRef();

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                setShow(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onFilter(values);
        setShow(false);
    };

    const handleClear = () => {
        const cleared = Object.fromEntries(fields.map(f => [f.accessor, '']));
        setValues(cleared);
        onFilter(cleared);
        setShow(false);
    };

    return (
        <div className="position-relative d-inline-block" ref={ref}>
            <button
                className="btn btn-outline-primary d-flex align-items-center gap-2"
                onClick={() => setShow(!show)}
            >
                <FontAwesomeIcon icon={faFilter} />
                Filtrar
            </button>

            {show && (
                <div
                    className="position-absolute start-0 p-3 border bg-white rounded shadow"
                    style={{
                        top: 'calc(100% + 10px)', // Show dropdown just below the button
                        zIndex: 1000,
                        minWidth: '280px',
                    }}
                >
                    <form onSubmit={handleSubmit}>
                        {fields.map((field) => (
                            <div className="mb-2" key={field.accessor}>
                                <label className="form-label">{field.header}</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name={field.accessor}
                                    value={values[field.accessor]}
                                    onChange={handleChange}
                                />
                            </div>
                        ))}
                        <div className="d-flex justify-content-between mt-3">
                            <button type="submit" className="btn btn-sm btn-primary">Aplicar</button>
                            <button type="button" className="btn btn-sm btn-secondary" onClick={handleClear}>Limpar</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default FilterDropdown;
