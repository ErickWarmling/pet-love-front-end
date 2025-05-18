import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const AddButton = ({ text, onClick }) => {
    return (
        <button className="btn btn-outline-primary d-flex align-items-center gap-2" onClick={onClick}>
            <FontAwesomeIcon icon={faPlus} />
            {text}
        </button>
    );
};

export default AddButton;