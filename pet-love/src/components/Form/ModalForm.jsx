import { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

function ModalForm({ show, onClose, title, fields, onSubmit, initialData = {} }) {
    const [formData, setFormData] = useState({});

    useEffect(() => {
        setFormData(initialData || {});
    }, [initialData, show]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        onSubmit(formData);
        setFormData({});
        onClose();
    };

    const renderField = (field) => {
        const commonProps = {
            name: field.name,
            value: field.multiple
                ? formData[field.name] || []
                : formData[field.name] || '',
            onChange: handleChange
        };

        switch (field.type) {
            case 'select':
                return (
                    <Form.Select
                        {...commonProps}
                        multiple={field.multiple}
                        onChange={(e) => {
                            const selected = Array.from(e.target.selectedOptions).map(option => option.value);
                            setFormData(prev => ({
                                ...prev,
                                [field.name]: field.multiple ? selected : e.target.value
                            }));
                        }}
                    >
                        {!field.multiple && <option value="">Selecione</option>}
                        {field.options?.map((option, i) => (
                            <option key={i} value={option.value || option}>
                                {option.label || option}
                            </option>
                        ))}
                    </Form.Select>
                );
            case 'textarea':
                return (
                    <Form.Control as="textarea" rows={field.rows || 3} {...commonProps} />
                );
            default:
                return (
                    <Form.Control type={field.type || 'text'} {...commonProps} />
                );
        }
    };

    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    {fields.map((field, index) => (
                        <Form.Group className="mb-3" key={index}>
                            <Form.Label>{field.label}</Form.Label>
                            {renderField(field)}
                        </Form.Group>
                    ))}
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>Cancelar</Button>
                <Button variant="primary" onClick={handleSubmit}>Salvar</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ModalForm;
