import { useEffect, useState } from "react";
import { Form, InputGroup, Modal, Button, Table } from "react-bootstrap";
import KaryawanService from "../../services/KaryawanService";
import KaryawanSearchInlineWidget from "./KaryawanSearchInlineWidget";

const initQuery = { page: 1, limit: 7 };

const KaryawanChoiceWidget = ({
    callbackKaryawanChoiceWidget,
    onlyButton = true,
    dataInjection,
}) => {
    const [show, setShow] = useState(false);
    const [daftarKaryawan, setDaftarKaryawan] = useState([]);
    const [query, setQuery] = useState(initQuery);
    const [karyawanReview, setKaryawanReview] = useState({});

    useEffect(() => {
        if (show) handleKaryawanServiceList();
    }, [show, query]);

    const handleKaryawanServiceList = () => {
        KaryawanService.list(query)
            .then((response) => {
                setDaftarKaryawan(response.data);
            })
            .catch((error) => { });
    };

    const callbackKaryawanSearchInlineWidget = (q) => {
        setQuery((values) => ({ ...values, ...q }));
    };

    const handleChoice = (karyawan) => {
        setKaryawanReview(karyawan);
        if (dataInjection) {
            callbackKaryawanChoiceWidget({ ...karyawan, ...dataInjection });
        } else {
            callbackKaryawanChoiceWidget(karyawan);
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
                        value={karyawanReview.Nama_Karyawan || ""}
                    />
                    <Button onClick={() => setShow(true)}>Pilih Karyawan</Button>
                </InputGroup>
            )}

            {onlyButton && (
                <Button onClick={() => setShow(true)}>Pilih Karyawan</Button>
            )}

            <Modal show={show} onHide={() => setShow(false)} centered size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Pilih Karyawan</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <KaryawanSearchInlineWidget
                        isShowID_Karyawan={true}
                        isShowNama_Karyawan={true}
                        q={query}
                        callbackKaryawanSearchInlineWidget={callbackKaryawanSearchInlineWidget}
                    />
                </Modal.Body>
                <Table>
                    <thead>
                        <tr>
                            <th>ID Karyawan</th>
                            <th>Nama Karyawan</th>
                            <th>Golongan</th>
                            <th>Jabatan</th>
                            <th>Divisi</th>
                            <th>Status Pernikahan</th>
                            <th>Jumlah Anak</th>
                        </tr>
                    </thead>
                    <tbody>
                        {daftarKaryawan.map((karyawan, index) => {
                            <tr key={index}>
                                <td>{karyawan.ID_Karyawan}</td>
                                <td>{karyawan.Nama_Karyawan}</td>
                                <td>{karyawan.ID_Golongan}</td>
                                <td>{karyawan.ID_Jabatan}</td>
                                <td>{karyawan.Divisi}</td>
                                <td>{karyawan.Status_Pernikahan}</td>
                                <td>{karyawan.Jumlah_Anak}</td>
                                <td>
                                    <Button onClick={() => handleChoice(karyawan)}>
                                        <FaArrowDown />
                                    </Button>
                                </td>
                            </tr>
                        })}
                </tbody>
            </Table>
        </Modal >
        </>
    );
};

export default KaryawanChoiceWidget;