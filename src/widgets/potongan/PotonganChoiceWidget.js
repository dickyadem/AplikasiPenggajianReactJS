import { useEffect, useState } from "react";
import PotonganService from "../../services/PotonganService";
import { Button, Modal, Table, Form, InputGroup } from "react-bootstrap";
import { helperReadableCurrency } from "../../utils/helpers";
import { FaArrowDown } from "react-icons/fa";
import PotonganSearchInlineWidget from "./PotonganSearchInlineWidget";

const initQuery = { page: 1, limit: 7 };
const initPotongan = {
    ID_Potongan: null,
    Nama_Potongan: null
};

const PotonganChoiceWidget = ({
    callbackPotonganChoiceWidget,
    onlyButton = true,
}) => {
    const [show, setShow] = useState(false);
    const [daftarPotongan, setDaftarPotongan] = useState([]);
    const [query, setQuery] = useState(initQuery);
    const [potonganReview, setPotonganReview] = useState(initPotongan);

    const handlePotonganServiceList = () => {
        PotonganService.list(query)
            .then((response) => {
                setDaftarPotongan(response.data.results);
            })
            .catch((error) => { });
    };

    const handleChoice = (potongan) => {
        setPotonganReview(potongan);
        callbackPotonganChoiceWidget(potongan);
        setShow(false);
    };

    const callbackPotonganSearchInlineWidget = (q) => {
        setQuery((values) => ({ ...values, ...q }));
    };

    useEffect(() => {
        handlePotonganServiceList();
    }, [query]);
    return (
        <>
            {!onlyButton && (
                <InputGroup>
                    <Form.Control
                        type="text"
                        disabled
                        value={potonganReview.Nama_Potongan || ""}
                    />
                    <Button onClick={() => setShow(true)}>Pilih Potongan</Button>
                </InputGroup>
            )}

            {onlyButton && (
                <Button onClick={() => setShow(true)}>Pilih Potongan</Button>
            )}

<Modal show={show} onHide={() => setShow(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Pilih Potongan</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <PotonganSearchInlineWidget
                        isShowID_Potongan={true}
                        isShowNama_Potongan={true}
                        q={query}
                        callbackPotonganSearchInlineWidget={callbackPotonganSearchInlineWidget}
                    />
                </Modal.Body>


                <Table>
                    <thead>
                        <tr>
                            <th>ID Potongan</th>
                            <th>Nama Potongan</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {daftarPotongan.map((potongan, index) => (
                            <tr key={index}>
                                <td>{potongan.ID_Potongan}</td>
                                <td>{potongan.Nama_Potongan}</td>
                                <td>
                                    <Button onClick={() => handleChoice(potongan)}>
                                        <FaArrowDown />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Modal>
        </>
    );
};

export default PotonganChoiceWidget;