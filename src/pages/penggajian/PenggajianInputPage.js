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
import { helperDuplicatedInArrayObject } from "../../utils/helpers";
import PendapatanChoiceWidget from "../../widgets/pendapatan/PendapatanChoiceWidget";
import PotonganChoiceWidget from "../../widgets/potongan/PotonganChoiceWidget";


const initGaji = {
    ID_Gaji: null,
    Tanggal_Entry: null,
    email: null,
    ID_Karyawan: null,
    ID_Profil: null,
    Keterangan: null,
    Jumlah_Potongan: 0,
    Jumlah_Pendapatan: 0,
};

// const initPendapatan ={
//     ID_Pendapatan: null,
//     Nama_Pendapatan: null,
// }
// const initPotongan ={
//     ID_Potongan: null,
//     Nama_Potongan: null,
// }

const PenggajianInputPage = () => {
    const [gaji, setGaji] = useState(initGaji);
    // const [potongan, daftarPotongan] = useState({});
    // const [pendapatan, daftarPendapatan] = useState({});
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
    const handleInputPotongan = (e) => {
        let name = e.target.name;
        let value = e.target.value;
    
        setDaftarPotongan((values) => ({ ...values, [name]: value }));
    };
    
    const handleInputPendapatan = (e) => {
        let name = e.target.name;
        let value = e.target.value;
    
        setDaftarPendapatan((values) => ({ ...values, [name]: value }));
    };
    
    // const getCurrentDate = () => {
    //     const currentDate = new Date();
    //     const year = currentDate.getFullYear();
    //     let month = currentDate.getMonth() + 1;
    //     let day = currentDate.getDate();

    //     if (month < 10) {
    //         month = `0${month}`;
    //     }
    //     if (day < 10) {
    //         day = `0${day}`;
    //     }
    //     return `${year}-${month}-${day}`;
    // };
    const handleGajiServiceCreate = () => {
        GajiService.create(gaji).then((response) => {
            alert("Gaji berhasil ditambahkan.");
            navigate("/penggajian");
        });
    };
    // const callbackPendapatanChoiceWidget = (data) => {
    //     if (helperDuplicatedInArrayObject(data, "ID Pendapatan", daftarPendapatan)) {
    //         alert("Item sama.");
    //     }
    //     setDaftarPendapatan(data);
    // };
    
    // const callbackPotonganChoiceWidget = (data) => {
    //     if (helperDuplicatedInArrayObject(data, "ID Pendapatan", daftarPotongan)) {
    //         alert("Item sama.");
    //     }
    //     setDaftarPotongan(data);
    // };
    
    const handleRemoveItem = (index) => {
    setDaftarPendapatan((values) => {
        const result = [...values];
        result.splice(index, 1);
        return result;
    });
    setDaftarPotongan((values) => {
        const result = [...values];
        result.splice(index, 1);
        return result;
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
                                        type="date" />
                            </Form.Group>

                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>ID Karyawan</Form.Label>
                                    <Form.Control name="ID_Karyawan" 
                                    onChange={handleInput}/>
                                    
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

            <Card className="mt-4">
                            <Card.Header className="d-flex justify-content-between align-items-center">
                                Daftar Pendapatan
                                {/* <PendapatanChoiceWidget
                                    onlyButton={true}
                                    // callbackPendapatanChoiceWidget={callbackPendapatanChoiceWidget}
                                /> */}
                            </Card.Header>
                            <Card.Body></Card.Body>
                            <Table responsive>
                                <thead>
                                    <tr>
                                        <th>ID Pendapatan</th>
                                        <th>Nama Pendapatan</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {daftarPendapatan.length > 0 && daftarPendapatan.map((pendapatan, index) => (
                                        <tr key={index}>
                                            <td>{pendapatan.ID_Pendapatan}</td>
                                            <td>{pendapatan.Nama_Pendapatan}</td>
                                            <td>
                                                <Form.Control
                                                    name="Jumlah Pendapatan"
                                                    type="number"
                                                    // value={gaji.Jumlah_Pendapatan}
                                                    onChange={(e) => handleInputPendapatan(e, index)}
                                                />
                                            </td>
                                            <td>
                                                <Button
                                                    title={`Hapus ${pendapatan.ID_Pendapatan}`}
                                                    onClick={() => handleRemoveItem(index)}
                                                    variant="outline-danger"
                                                    size={"sm"}>
                                                    <FaTrash />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Card>
                        <Card className="mt-4">
                            <Card.Header className="d-flex justify-content-between align-items-center">
                                Daftar Potongan
                                {/* <PotonganChoiceWidget
                                    onlyButton={true}
                                    // callbackPotonganChoiceWidget={callbackPotonganChoiceWidget}
                                /> */}
                            </Card.Header>
                            <Card.Body></Card.Body>
                            <Table responsive>
                                <thead>
                                    <tr>
                                        <th>ID Potongan</th>
                                        <th>Nama Potongan</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {daftarPotongan.length > 0 && daftarPotongan.map((potongan, index) => (
                                        <tr key={index}>
                                            <td>{potongan.ID_Potongan}</td>
                                            <td>{potongan.Nama_Potongan}</td>
                                            <td>
                                                <Form.Control
                                                    name="Jumlah Potongan"
                                                    // type="number"
                                                    // value={gaji.Jumlah_Potongan}
                                                    onChange={(e) => handleInputPotongan(e, index)}
                                                />
                                            </td>
                                            <td>
                                                <Button
                                                    title={`Hapus ${potongan.ID_Potongan}`}
                                                    onClick={() => handleRemoveItem(index)}
                                                    variant="outline-danger"
                                                    size={"sm"}>
                                                    <FaTrash />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Card>
           

        </NavigationWidget>
    );
};

export default PenggajianInputPage;
