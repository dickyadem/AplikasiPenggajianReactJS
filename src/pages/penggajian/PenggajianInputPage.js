import { Button, Card, Col, Form, InputGroup, Row, Table } from "react-bootstrap";
import NavigationWidget from "../../widgets/commons/NavigationWidget";
import { useNavigate } from "react-router-dom";
import { MdCancel } from "react-icons/md";
import { FaArrowLeft, FaSave, FaSearch } from "react-icons/fa";
import { useEffect, useState } from "react";
import GajiDetailService from "../../services/GajiDetailService";
import PendapatanService from "../../services/PendapatanService";
import PotonganService from "../../services/PotonganService";
import GajiService from "../../services/GajiService";

const initGaji = {
    ID_Gaji: null,
    Tanggal_Entry: null,
    email: null,
    ID_Karyawan: null,
    ID_Profil: null,
    Keterangan: '',
};

const initGajiDetail = {
    ID_Gaji: null,
    ID_Pendapatan: null,
    Jumlah_Pendapatan: 0,
    ID_Potongan: null,
    Jumlah_Potongan: 0,
};


const PenggajianInputPage = () => {
    const [gaji, setGaji] = useState(initGaji);
    const [daftarGajiDetail, setDaftarGajiDetail] = useState([]);
    const [gajidetail, setGajidetail] = useState(initGajiDetail);
    const [daftarGaji, setDaftarGaji] = useState([]);
    const [queryDaftarDetail, setQueryDaftarDetail] = useState({ page: 1, limit: 10 });
    const [paginateGajiDetail, setPaginateGajiDetail] = useState([]);
    const [daftarPendapatan, setDaftarPendapatan] = useState({});
    const [queryPendapatan, setQueryPendapatan] = useState({ page: 1, limit: 10 });
    const [paginatePendapatan, setPaginatePendapatan] = useState([]);
    const [daftarPotongan, setDaftarPotongan] = useState([]);
    const [paginatePotongan, setPaginatePotongan] = useState([]);
    const [queryPotongan, setQueryPotongan] = useState({ page: 1, limit: 10 });
    const navigate = useNavigate();
    useEffect(() => {
        PotonganService.list(daftarPotongan)
            .then((response) => {
                setDaftarPotongan(response.data);
                if (response.headers.pagination) {
                    setPaginatePotongan(JSON.parse(response.headers.pagination));
                }
            })
            .catch((error) => console.log(error));
    }, [queryPotongan]);

    useEffect(() => {
        PendapatanService.list(daftarPendapatan)
            .then((response) => {
                setDaftarPendapatan(response.data);
                if (response.headers.pagination) {
                    setPaginatePendapatan(JSON.parse(response.headers.pagination));
                }
            })
            .catch((error) => console.log(error));
    }, [queryPendapatan]);

    const callbackPaginator = (page) => {
        setQueryPendapatan((values) => ({ ...values, page }));
    };

    useEffect(() => {
        GajiDetailService.list(queryDaftarDetail)
            .then((response) => {
                setDaftarGajiDetail(response.data.results); // Assuming the gaji details are stored in the "results" property of the response
                if (response.headers.pagination) {
                    setPaginateGajiDetail(JSON.parse(response.headers.pagination));
                }
            })
            .catch((error) => console.log(error));
    }, [queryDaftarDetail]);;

    const handleInputChange = (e, index) => {
        const { name, value } = e.target;
        const updatedGajiDetail = [...daftarGajiDetail];
        updatedGajiDetail[index][name] = value;
        setDaftarGajiDetail(updatedGajiDetail);
    };
    const handleInput = (e) => {
        let name = e.target.name;
        let value = e.target.value;

        setGaji((values) => ({ ...values, [name]: value }));
    };

    const getCurrentDate = () => {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        let month = currentDate.getMonth() + 1;
        let day = currentDate.getDate();

        if (month < 10) {
            month = `0${month}`;
        }
        if (day < 10) {
            day = `0${day}`;
        }
        return `${year}-${month}-${day}`;
    };
    const handleGajiServiceCreate = () => {
        GajiService.create(gaji).then((response) => {
            alert("Gaji berhasil ditambahkan.");
            navigate("/penggajian");
        });
    };

    return (
        <NavigationWidget
            actionTop={
                <>
                    <Button className="me-2" variant="danger" >
                        <MdCancel /> Batal
                    </Button>
                    <Button onClick={handleGajiServiceCreate}>
                        <FaSave /> Simpan
                    </Button>
                </>
            }
        >
            <Card style={{ marginBottom: "20px" }}>
                <Card.Header>
                    <h5>Input Data Penggajian</h5>
                </Card.Header>
                <Card.Body>
                    <Row>
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>ID Gaji</Form.Label>
                                <Form.Control name="ID_Gaji"
                                  onChange={handleInput}
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Tanggal Entry</Form.Label>
                                <Form.Control name="Tanggal_Entry"
                                    onChange={handleInput}
                                    defaultValue={getCurrentDate()}

                                    disabled />
                            </Form.Group>

                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>ID Karyawan</Form.Label>
                                    <Form.Control name="ID_Karyawan" />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        name="email"
                                        onChange={handleInput}
                                        type="email"
                                    />
                                </Form.Group>
                            </Col>
                        </Col>
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>ID Profil</Form.Label>
                                <Form.Control name="ID_Profil"
                                    onChange={handleInput}
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Keterangan</Form.Label>
                                <Form.Control name="Keterangan"
                                  onChange={handleInput}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                </Card.Body>
            </Card >
            <Card style={{ marginBottom: "20px" }} >
                <Card.Header>
                    <h5>Accounting</h5>
                </Card.Header>
                <Card.Body>
                    <Table>
                        <thead>
                            <tr>
                                <th style={{ width: "13%" }}>ID Pendapatan</th>
                                <th>Nama Pendapatan</th>
                                <th>Jumlah</th>
                            </tr>
                        </thead>
                        <tbody>
                            {daftarPendapatan.results && daftarPendapatan.results.map((pendapatan, index) => (
                                <tr key={index}>
                                    <td style={{ width: "13%" }}>
                                        <Form.Group>
                                            <Form.Control
                                                name="ID_Pendapatan"
                                                value={pendapatan.ID_Pendapatan}
                                                disabled
                                            />
                                        </Form.Group>
                                    </td>
                                    <td>
                                        <Form.Group>
                                            <Form.Control
                                                name="Nama_Pendapatan"
                                                value={pendapatan.Nama_Pendapatan}
                                                disabled
                                            />
                                        </Form.Group>
                                    </td>
                                    <td>
                                        <Form.Group>
                                            <Form.Control
                                                name="Jumlah_Pendapatan"
                                                // value={gajidetail.Jumlah_Pendapatan}
                                                onChange={(e) => handleInputChange(e, index)}
                                            />
                                        </Form.Group>
                                    </td>
                                </tr>
                            ))}
                        </tbody>

                    </Table>

                    <Table>
                        <thead>
                            <tr>
                                <th style={{ width: "13%" }}>ID Potongan</th>
                                <th>Nama Potongan</th>
                                <th>Jumlah</th>
                            </tr>
                        </thead>
                        <tbody>
                            {daftarPotongan.results && daftarPotongan.results.map((potongan, index) => (
                                <tr key={index}>
                                    <td style={{ width: "13%" }}>
                                        <Form.Group>
                                            <Form.Control
                                                name="ID_Potongan"
                                                value={potongan.ID_Potongan}
                                                disabled
                                            />
                                        </Form.Group>
                                    </td>
                                    <td>
                                        <Form.Group>
                                            <Form.Control
                                                name="Nama_Potongan"
                                                value={potongan.Nama_Potongan}
                                                disabled
                                            />
                                        </Form.Group>
                                    </td>
                                    <td>
                                        <Form.Control
                                            name="Jumlah_Potongan"
                                            value={potongan.Jumlah_Potongan}
                                            onChange={(e) => handleInputChange(e, index)}
                                        />

                                    </td>
                                </tr>
                            ))}
                        </tbody>

                    </Table>

                </Card.Body>
            </Card>

        </NavigationWidget>
    );
};

export default PenggajianInputPage;
