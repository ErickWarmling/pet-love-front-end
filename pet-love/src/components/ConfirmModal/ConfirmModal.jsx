import { Modal, Button } from "react-bootstrap";

function ConfirmModal({ show, onClose, onConfirm, message }) {
    return (
        <Modal show={show} onHide={onClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Confirmação</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>{message}</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Não
                </Button>
                <Button variant="danger" onClick={onConfirm}>
                    Sim
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ConfirmModal;