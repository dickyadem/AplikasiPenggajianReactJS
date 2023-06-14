import { useEffect, useState } from "react";
import { Form, InputGroup, Modal, Button, Table } from "react-bootstrap";
import GolonganService from "../../services/GolonganService";
import GolonganSearchInlineWidget from "./GolonganSearchInlineWidget";

const initQuery = { page: 1, limit: 7 };

const GolonganChoiceWidget = ({
    callbackGolonganChoiceWidget,
    onlyButton = true,
    dataInjection,
}) => {
    const [show, setShow] = useState(false);
    const [daftarGolongan, setDaftarGolongan] = useState([]);
    const [query, setQuery] = useState(initQuery);
    const [golonganReview, setGolonganReview] = useState({});

    useEffect(() => {
        if (show) handleGolonganServiceList();
    }, [show, query]);

    const handleGolonganServiceList = () => {
        GolonganService.list(query)
            .then((response) => {
                setDaftarGolongan(response.data);
            })
            .catch((error) => { });
    };

    const callbackGolonganSearchInlineWidget = (q) => {
        setQuery((values) => ({ ...values, ...q }));
    };

    const handleChoice = (golongan) => {
        setKaryawanReview(golongan);
        if (dataInjection) {
            callbackGolonganChoiceWidget({ ...golongan, ...dataInjection });
        } else {
            callbackKaryawanChoiceWidget(golongan);
        }

        setShow(false);
    };

    return (
        <>
            {!onlyButton && (
                <InputGroup>
                    <Form.Control
                        type="text"
                        disabled
                        value={karyawanReview.Nama_Golongan || ""}
                    />
                    <Button onClick={() => setShow(true)}>Pilih Golongan</Button>
                </InputGroup>
            )}

            {onlyButton && (
                <Button onClick={() => setShow(true)}>Pilih Golongan</Button>
            )}

            <Modal show={show} onHide={() => setShow(false)} centered size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Pilih Golongan</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <KaryawanSearchInlineWidget
                        isShowID_Golongan={true}
                        isShowNama_Golongan={true}
                        q={query}
                        callbackGolonganSearchInlineWidget={callbackGolonganSearchInlineWidget}
                    />
                </Modal.Body>
                <Table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nama Golongan</th>
                            <th>Tunjangan Golongan</th>
                        </tr>
                    </thead>
                    <tbody>
                        {daftarGolongan.map((golongan, index) => {
                            <tr key={index}>
                                <td>{golongan.ID_Golongan}</td>
                                <td>{golongan.Nama_Golongan}</td>
                                <td>{golongan.Tunjangan_Golongan}</td>
                                <td>
                                    <Button onClick={() => handleChoice(golongan)}>
                                        <FaArrowDown />
                                    </Button>
                                </td>
                            </tr>
                        })}
                    </tbody>
                </Table>
            </Modal>
        </>
    );
};

export default GolonganChoiceWidget;