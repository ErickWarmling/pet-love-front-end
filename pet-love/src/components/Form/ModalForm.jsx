import { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

function validarCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');
    if (cpf.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(cpf)) return false;
    let soma = 0;
    for (let i = 0; i < 9; i++) soma += parseInt(cpf.charAt(i)) * (10 - i);
    let resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(9))) return false;
    soma = 0;
    for (let i = 0; i < 10; i++) soma += parseInt(cpf.charAt(i)) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(10))) return false;
    return true;
}

function validarTelefone(tel) {
    tel = tel.replace(/\D/g, '');
    if (tel.length < 10 || tel.length > 11) return false;
    if (/^(\d)\1+$/.test(tel)) return false; // números iguais não são válidos
    return true;
}

function validarEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function ModalForm({ show, onClose, title, fields, onSubmit, initialData = {} }) {
    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});
    const isCreating = !initialData?.id;

    useEffect(() => {
        setFormData(initialData || {});
    }, [initialData, show]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        let newValue = value;

        if (e.target.multiple) {
            newValue = Array.from(e.target.selectedOptions).map(opt => opt.value);
        }

        if (name.toLowerCase().includes('cpf')) {
            newValue = value
                .replace(/\D/g, '')
                .replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
                .substring(0, 14);
        }

        if (name.toLowerCase().includes('phone')) {
            newValue = value
                .replace(/\D/g, '')
                .replace(/(\d{2})(\d)/, '($1) $2')
                .replace(/(\d{5})(\d)/, '$1-$2')
                .replace(/(-\d{4})\d+?$/, '$1')
                .substring(0, 15);
        }

        setFormData(prev => ({ ...prev, [name]: newValue }));
    };

    const handleSubmit = () => {
        const newErrors = {};

        if ('cpf' in formData && !validarCPF(formData.cpf || '')) {
            newErrors.cpf = 'CPF inválido';
        }
        if ('phone' in formData && !validarTelefone(formData.phone || '')) {
            newErrors.phone = 'Telefone inválido';
        }
        if ('email' in formData && !validarEmail(formData.email || '')) {
            newErrors.email = 'Email inválido';
        }

        if (!formData.login || formData.login.trim() === '') {
            newErrors.login = 'Login é obrigatório';
        }

        if (isCreating && (!formData.password || formData.password.trim() === '')) {
            newErrors.password = 'Senha é obrigatória';
        }

        if (!formData.perfil || formData.perfil === '') {
            newErrors.perfil = 'Selecione um perfil';
        }

        if (!formData.person || formData.person === '') {
            newErrors.person = 'Selecione uma pessoa'
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});
        onSubmit(formData);
        setFormData({});
        onClose();
    };

    const renderField = (field) => {
        const commonProps = {
            name: field.name,
            value: formData[field.name] || '',
            onChange: handleChange,
            isInvalid: !!errors[field.name]
        };

        switch (field.type) {
            case 'select':
                return (
                    <>
                        <Form.Select {...commonProps} multiple={field.multiple}>
                            {!field.multiple && <option value="">Selecione</option>}
                            {field.options?.map((option, i) => (
                                <option key={i} value={option.value || option}>
                                    {option.label || option}
                                </option>
                            ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">{errors[field.name]}</Form.Control.Feedback>
                    </>
                );
            case 'textarea':
                return (
                    <>
                        <Form.Control as="textarea" rows={field.rows || 3} {...commonProps} />
                        <Form.Control.Feedback type="invalid">{errors[field.name]}</Form.Control.Feedback>
                    </>
                );
            default:
                return (
                    <>
                        <Form.Control type={field.type || 'text'} {...commonProps} />
                        <Form.Control.Feedback type="invalid">{errors[field.name]}</Form.Control.Feedback>
                    </>
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