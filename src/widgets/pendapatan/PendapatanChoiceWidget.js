import { useEffect, useState } from "react";
import PendapatanService from "../../services/PendapatanService";
import { Button, Modal, Table, Form, InputGroup } from "react-bootstrap";
import { helperReadableCurrency } from "../../utils/helpers";
import { FaArrowDown } from "react-icons/fa";
import PendapatanSearchInlineWidget from "./PendapatanSearchInlineWidget";

const initQuery = { page: 1, limit: 7 };
const initPendapatan = {
    ID_Pendapatan: null,
    Nama_Pendapatan: null
};

const PendapatanChoiceWidget = ({
    callbackPendapatanChoiceWidget,
    onlyButton = true,
}) => {
    const [show, setShow] = useState(false);
    const [daftarPendapatan, setDaftarPendapatan] = useState([]);
    const [query, setQuery] = useState(initQuery);
    const [pendapatanReview, setPendapatanReview] = useState(initPendapatan);

    const handlePendapatanServiceList = () => {
        PendapatanService.list(query)
            .then((response) => {
                setDaftarPendapatan(response.data.results);
            })
            .catch((error) => { });
    };

    const handleChoice = (pendapatan) => {
        setPendapatanReview(pendapatan);
        callbackPendapatanChoiceWidget(pendapatan);
        setShow(false);
    };

    const callbackPendapatanSearchInlineWidget = (q) => {
        setQuery((values) => ({ ...values, ...q }));
    };

    useEffect(() => {
        handlePendapatanServiceList();
    }, [query]);
    return (
        <>
            {!onlyButton && (
                <InputGroup>
                    <Form.Control
                        type="text"
                        disabled
                        value={pendapatanReview.Nama_Pendapatan || ""}
                    />
                    <Button onClick={() => setShow(true)}>Pilih Pendapatan</Button>
                </InputGroup>
            )}

            {onlyButton && (
                <Button onClick={() => setShow(true)}>Pilih Pendapatan</Button>
            )}

<Modal show={show} onHide={() => setShow(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Pilih Pendapatan</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <PendapatanSearchInlineWidget
                        isShowID_Pendapatan={true}
                        isShowNama_Pendapatan={true}
                        q={query}
                        callbackPendapatanSearchInlineWidget={callbackPendapatanSearchInlineWidget}
                    />
                </Modal.Body>


                <Table>
                    <thead>
                        <tr>
                            <th>ID Pendapatan</th>
                            <th>Nama Pendapatan</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {daftarPendapatan.length >0 &&  daftarPendapatan.map((pendapatan, index) => (
                            <tr key={index}>
                                <td>{pendapatan.ID_Pendapatan}</td>
                                <td>{pendapatan.Nama_Pendapatan}</td>
                                <td>
                                    <Button onClick={() => handleChoice(pendapatan)}>
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

export default PendapatanChoiceWidget;