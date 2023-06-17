import { Button, Card, Col, Form, InputGroup, Row, Table } from "react-bootstrap";
import NavigationWidget from "../../widgets/commons/NavigationWidget";
import { useNavigate } from "react-router-dom";
import { MdCancel } from "react-icons/md";
import { FaArrowLeft, FaSave, FaSearch, FaTrash } from "react-icons/fa";
import { useEffect, useState } from "react";
import GajiDetailService from "../../services/GajiDetailService";
import PendapatanService from "../../services/PendapatanService";
import PotonganService from "../../services/PotonganService";
import GajiService from "../../services/GajiService";



const initGaji = {
    ID_Gaji: null,
    Tanggal: null,
    email: null,
    ID_Karyawan: null,
    ID_Profil: null,
    Keterangan: null,
    itemsPendapatan: [],
    itemsPotongan: [],
};



const PenggajianInputPage = () => {
    const [gaji, setGaji] = useState(initGaji);
    const [daftarPotongan, setDaftarPotongan] = useState([]);
    const [daftarPendapatan, setDaftarPendapatan] = useState([]);


    const [queryPendapatan, setQueryPendapatan] = useState({ page: 1, limit: 10 });
    const [paginatePendapatan, setPaginatePendapatan] = useState([]);

    const [paginatePotongan, setPaginatePotongan] = useState([]);
    const [queryPotongan, setQueryPotongan] = useState({ page: 1, limit: 10 });
    const navigate = useNavigate();

    useEffect(() => {
        PotonganService.list(daftarPotongan)
            .then((response) => {
                setDaftarPotongan(response.data.results);
                if (response.headers.pagination) {
                    setPaginatePotongan(JSON.parse(response.headers.pagination));
                }
            })
            .catch((error) => console.log(error));
        PendapatanService.list(daftarPendapatan)
            .then((response) => {
                console.log(response.data.results);
                setDaftarPendapatan(response.data.results);
                if (response.headers.pagination) {
                    setPaginatePendapatan(JSON.parse(response.headers.pagination));
                }
            })
            .catch((error) => console.log(error));
    }, [queryPendapatan, queryPotongan]);

    const callbackPaginator = (page) => {
        setQueryPendapatan((values) => ({ ...values, page }));
    };

    const handleInput = (e) => {
        let name = e.target.name;
        let value = e.target.value;

        setGaji((values) => ({ ...values, [name]: value }));
    };
    const handleInputPotongan = (e, index) => {
        const { name, value } = e.target;
        setGaji((prevGaji) => ({
            ...prevGaji,
            itemsPotongan: {
                ...prevGaji.itemsPotongan,
                [index]: {
                    ...prevGaji.itemsPotongan[index],
                    [name]: value,
                    ID_Potongan: daftarPotongan[index].ID_Potongan,
                },
            },
        }));
    };

    const handleInputPendapatan = (e, index) => {
        const { name, value } = e.target;
        setGaji((prevGaji) => ({
            ...prevGaji,
            itemsPendapatan: {
                ...prevGaji.itemsPendapatan,
                [index]: {
                    ...prevGaji.itemsPendapatan[index],
                    [name]: value,
                    ID_Pendapatan: daftarPendapatan[index].ID_Pendapatan,
                },
            },
        }));
    };






    const handleGajiServiceCreate = () => {
        const { itemsPendapatan, itemsPotongan, ...gajiData } = gaji;

        const formattedItemsPendapatan = Object.values(itemsPendapatan); // Convert to array
        const formattedItemsPotongan = Object.values(itemsPotongan); // Convert to array

        const updatedGaji = {
            ...gajiData,
            itemsPendapatan: formattedItemsPendapatan,
            itemsPotongan: formattedItemsPotongan,
        };

        GajiService.create(updatedGaji)
            .then((response) => {
                alert("Gaji berhasil ditambahkan.");
                navigate("/penggajian");
            })
            .catch((error) => console.log(error));
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
                                <Form.Control name="Tanggal"
                                    onChange={handleInput}
                                    type="date" />
                            </Form.Group>

                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>ID Karyawan</Form.Label>
                                    <Form.Control name="ID_Karyawan"
                                        onChange={handleInput} />

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
            <Card.Body>
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
                            {daftarPendapatan.length > 0 && daftarPendapatan.map((pendapatan, index) => (
                                <tr key={index}>
                                    <td>{pendapatan.ID_Pendapatan}</td>
                                    <td>{pendapatan.Nama_Pendapatan}</td>
                                    <td>
                                        <Form.Group>
                                            <Form.Control
                                                name="Jumlah_Pendapatan"
                                                onChange={(e) => handleInputPendapatan(e, index)}
                                            />
                                        </Form.Group>
                                    </td>
                                </tr>
                            ))}
                        </tbody>

                    </Table>
                </Card.Body>
                <Table>
                    <thead>
                        <tr>
                            <th style={{ width: "13%" }}>ID Potongan</th>
                            <th>Nama Potongan</th>
                            <th>Jumlah</th>
                        </tr>
                    </thead>
                    <tbody>
                        {daftarPotongan.length > 0 && daftarPotongan.map((potongan, index) => (
                            <tr key={index}>
                                <td>{potongan.ID_Potongan}</td>
                                <td>{potongan.Nama_Potongan}</td>
                                <td>
                                    <Form.Control
                                        name="Jumlah_Potongan"

                                        onChange={(e) => handleInputPotongan(e, index)}
                                    />

                                </td>
                            </tr>
                        ))}
                    </tbody>

                </Table>
            </Card.Body>

        </NavigationWidget >
    );
};

export default PenggajianInputPage;
