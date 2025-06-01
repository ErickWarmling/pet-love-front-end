import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import './LoginForm.css'

function LoginForm({ onSubmit }) {
    const [formData, setFormData] = useState({
        email:'',
        senha:'',
        perfil: null,
    });

    const handleChange = (e) => {
        const { name, type, value, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : name === 'perfil' ? parseInt(value) : value }));
    };

    const handleSubmit = () => {
        e.preventDefault();
       onSubmit(formData);
       setFormData({});
    }

    return (
        <Form onSubmit={handleSubmit} className="login-form">
            <Form.Group className="mb-3">
                <Form.Label>E-MAIL</Form.Label>
                <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>SENHA</Form.Label>
                <Form.Control
                    type="password"
                    name="senha"
                    value={formData.senha}
                    onChange={handleChange}
                    required
                />
            </Form.Group>
            <Form.Group className="mb-3">
                <div className="radio">
                    <Form.Check
                        type="radio"
                        name="perfil"
                        value="1"
                        label="Recepção"
                        checked={formData.perfil === 1}
                        onChange={handleChange}
                        inline
                    />
                    <Form.Check
                        type="radio"
                        name="perfil"
                        value="2"
                        label="Veterinário"
                        checked={formData.perfil === 2}
                        onChange={handleChange}
                        inline
                    />
                </div>
            </Form.Group>
            <button className="btn btn-primary enter-button" type="submit">
                ENTRAR
            </button>
        </Form>
    );
}

export default LoginForm;