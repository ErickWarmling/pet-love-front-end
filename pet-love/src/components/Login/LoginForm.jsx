import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import './LoginForm.css'

function LoginForm({ onSubmit }) {
    const [formData, setFormData] = useState({
        email:'',
        senha:'',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value, }));
    };

    const handleSubmit = () => {
        e.preventDefault();
       onSubmit(formData);
       setFormData({email: '', senha: ''});
    };

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
           <Button type="submit" className="w-100 enter-button">
                ENTRAR
            </Button>
        </Form>
    );
}

export default LoginForm;