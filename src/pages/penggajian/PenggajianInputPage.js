// import { Button, Card, Col, Form, InputGroup, Row, Table } from "react-bootstrap";
// import NavigationWidget from "../../widgets/commons/NavigationWidget";
// import { useNavigate } from "react-router-dom";
// import { MdCancel } from "react-icons/md";
// import { FaArrowLeft, FaSave, FaSearch } from "react-icons/fa";
// import { useState } from "react";
// import GajiDetailService from "../../services/GajiDetailService";

// const initGaji = {
//     ID_Gaji: null,
//     Tanggal_Entry: null,
//     ID_Karyawan: null,
// };

// const initGajiDetail = {
//     ID_Gaji: null,
//     ID_Pendapatan: null,
//     Jumlah_Pendapatan: 0,
//     ID_Potongan: null,
//     Jumlah_Potongan: 0,
// };

// const [gaji, setGaji] = useState(initGaji);
// const [daftarGaji, setDaftarGajiDetail] = useState(initGajiDetail);


// const PenggajianInputPage = () => {

//     const getCurrentDate = () => {
//         const currentDate = new Date();
//         const year = currentDate.getFullYear();
//         let month = currentDate.getMonth() + 1;
//         let day = currentDate.getDate();

//         // Add leading zeros if month or day is less than 10
//         if (month < 10) {
//             month = `0${month}`;
//         }
//         if (day < 10) {
//             day = `0${day}`;
//         }
//         return `${year}-${month}-${day}`;
//     };

//     return (
//         <NavigationWidget
//             actionTop={
//                 <>
//                     <Button className="me-2" variant="danger" >
//                         <MdCancel /> Batal
//                     </Button>
//                     <Button >
//                         <FaSave /> Simpan
//                     </Button>
//                 </>
//             }
//         >
//             <Card style={{ marginBottom: "20px" }}>
//                 <Card.Header>
//                     <h5>Input Data Penggajian</h5>
//                 </Card.Header>
//                 <Card.Body>
//                     <Row>
//                         <Col md={6}>
//                             <Form.Group>
//                                 <Form.Label>ID Gaji</Form.Label>
//                                 <Form.Control name="ID_Gaji"
//                                 />
//                             </Form.Group>
//                             <Form.Group>
//                                 <Form.Label>Tanggal Entry</Form.Label>
//                                 <Form.Control name="Tanggal_Entry"

//                                     defaultValue={getCurrentDate()}

//                                     disabled />
//                             </Form.Group>

//                             <Col md={6}>
//                                 <Form.Group>
//                                     <Form.Label>ID Karyawan</Form.Label>
//                                     <Form.Control name="ID_Karyawan" />
//                                 </Form.Group>
//                                 <Form.Group>
//                                     <Form.Label>Email</Form.Label>
//                                     <Form.Control
//                                         name="email"

//                                         type="email"
//                                     />
//                                 </Form.Group>
//                             </Col>
//                         </Col>
//                         <Col md={6}>
//                             <Form.Group>
//                                 <Form.Label>ID Profil</Form.Label>
//                                 <Form.Control name="ID_Profil"

//                                 />
//                             </Form.Group>
//                         </Col>
//                     </Row>
//                 </Card.Body>
//             </Card >
//             <Card style={{ marginBottom: "20px" }} >
//                 <Card.Header>
//                     <h5>Accounting</h5>
//                 </Card.Header>
//                 <Card.Body>
//                     <Table>
//                         <thead>
//                             <tr>
//                                 <th style={{ width: "13%" }}>ID Pendapatan</th>
//                                 <th>Nama Pendapatan</th>
//                                 <th>Jumlah</th>
//                             </tr>
//                         </thead>
//                         <tbody>

//                             <tr >
//                                 <td style={{ width: "13%" }}>
//                                     <Form.Group>
//                                         <Form.Control
//                                             name="ID_Pendapatan"

//                                             disabled
//                                         />
//                                     </Form.Group>
//                                 </td>
//                                 <td>
//                                     <Form.Group>
//                                         <Form.Control
//                                             name="Nama_Pendapatan"

//                                             disabled
//                                         />
//                                     </Form.Group>
//                                 </td>
//                                 <td>
//                                     <Form.Group>
//                                         <Form.Control
//                                             name="Jumlah_Pendapatan"

//                                         />
//                                     </Form.Group>
//                                 </td>
//                             </tr>


//                         </tbody>

//                     </Table>

//                     <Table>
//                         <thead>
//                             <tr>
//                                 <th style={{ width: "13%" }}>ID Potongan</th>
//                                 <th>Nama Potongan</th>
//                                 <th>Jumlah</th>
//                             </tr>
//                         </thead>
//                         <tbody>

//                             <tr >
//                                 <td style={{ width: "13%" }}>
//                                     <Form.Group>
//                                         <Form.Control
//                                             name="ID_Potongan"

//                                             disabled
//                                         />
//                                     </Form.Group>
//                                 </td>
//                                 <td>
//                                     <Form.Group>
//                                         <Form.Control
//                                             name="Nama_Potongan"

//                                             disabled
//                                         />
//                                     </Form.Group>
//                                 </td>
//                                 <td>
//                                     <Form.Group>
//                                         <Form.Control
//                                             name="Jumlah_Potongan"

//                                         />
//                                     </Form.Group>
//                                 </td>
//                             </tr>

//                         </tbody>

//                     </Table>

//                 </Card.Body>
//             </Card>

//         </NavigationWidget>
//     );
// };

// export default PenggajianInputPage;
