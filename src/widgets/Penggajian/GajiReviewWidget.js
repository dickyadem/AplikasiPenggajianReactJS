import GajiService from "../../services/GajiService";
import { Button, Modal, Table } from "react-bootstrap";
import { FaFileExcel, FaPrint, FaSearchPlus } from "react-icons/fa";
import { useState } from "react";
import {
    helperReadableCurrency,
    helperReadableDate,
} from "../../utils/helpers";

const GajiReviewWidget = ({ attr, ID_Gaji }) => {
    const [gaji, setGaji] = useState();
    const [show, setShow] = useState(false);

    const handleGajiServiceGet = () => {
        GajiService.get(ID_Gaji).then((response) => {
            setShow(true);
            setGaji(response.data);
        });
    };

    const handleFakturPrint = async () => {
        await GajiService.ID_GajiPrint(ID_Gaji);
    };
    return (
        <>
            <Button {...attr} onClick={handleGajiServiceGet}>
                <FaSearchPlus />
            </Button>

            {gaji && (
                <Modal show={show} onHide={() => setShow(false)} size={"lg"}>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            ID Gaji No. {gaji.ID_Gaji || "Nomor ID_Gaji..."}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>{helperReadableDate(gaji.Tanggal)}</Modal.Body>
                    <Table>
                        <tbody>
                            <tr>
                                <th>ID Gaji</th>
                                <td>{gaji.ID_Gaji}</td>
                            </tr>
                            <tr>
                                <th>ID Karyawan</th>
                                <td>{gaji.ID_Karyawan}</td>
                            </tr>
                        </tbody>
                    </Table>
                    <Modal.Footer>
                        <Button onClick={handleFakturPrint}>
                            <FaFileExcel /> Export to Excel
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}
        </>
    );
};

export default GajiReviewWidget;