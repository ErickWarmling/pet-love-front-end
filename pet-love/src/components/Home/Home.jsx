import { useEffect, useState } from "react";
import { Card, Button, Spinner } from "react-bootstrap";
import { listPets } from "../../api/pets";
import { listDonos } from "../../api/donos";
import { listConsultas } from "../../api/consultas";
import { useNavigate } from "react-router-dom";
import { listAdocoes } from "../../api/adocoes";

export default function Home() {
    const [totals, setTotals] = useState({
        pets: 0,
        donos: 0,
        consultas: 0,
        adocoes: 0
    });

    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchData() {
            try {
                const [petsRes, donosRes, consultasRes, adocoesRes] = await Promise.all([
                    listPets(),
                    listDonos(),
                    listConsultas(),
                    listAdocoes()
                ]);

                setTotals({
                    pets: petsRes.data.length,
                    donos: donosRes.data.length,
                    consultas: consultasRes.data.length,
                    adocoes: adocoesRes.data.length
                });
            } catch (error) {
                console.error("Erro ao buscar dados:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    const cards = [
        {
            title: "Pets",
            count: totals.pets,
            text: "Gerencie os pets cadastrados no sistema.",
            link: "/pets",
            color: "primary"
        },
        {
            title: "Donos",
            count: totals.donos,
            text: "Gerencie os donos dos pets.",
            link: "/donos",
            color: "success"
        },
        {
            title: "Consultas",
            count: totals.consultas,
            text: "Veja e agende consultas veterinárias.",
            link: "/consultas",
            color: "warning"
        },
        {
            title: "Adoções",
            count: totals.adocoes,
            text: "Acompanhe as solicitações de adoção.",
            link: "/adocoes",
            color: "danger"
        }
    ];

    return (
        <div className="container py-4">
            <h1 className="mb-4">🐾 Bem-vindo ao Sistema PetLove</h1>
            <p className="mb-5">Gerencie Pets, Donos, Consultas e muito mais.</p>

            {loading ? (
                <div className="d-flex justify-content-center">
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : (
                <div className="row">
                    {cards.map((card, index) => (
                        <div className="col-md-6 col-lg-3 mb-4" key={index}>
                            <Card border={card.color}>
                                <Card.Body>
                                    <Card.Title>
                                        {card.title} <span className="badge bg-secondary">{card.count}</span>
                                    </Card.Title>
                                    <Card.Text>{card.text}</Card.Text>
                                    <Button
                                        variant={card.color}
                                        onClick={() => navigate(card.link)}
                                    >
                                        Acessar
                                    </Button>
                                </Card.Body>
                            </Card>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
