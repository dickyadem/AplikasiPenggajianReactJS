// import { useEffect, useState } from "react";
// import PendapatanService from "../../services/PendapatanService";
// import { Button, Modal, Table, Form, InputGroup } from "react-bootstrap";
// import { helperReadableCurrency } from "../../utils/helpers";
// import { FaArrowDown } from "react-icons/fa";
// import PendapatanSearchInlineWidget from "./PendapatanSearchInlineWidget";

// const initQuery = { page: 1, limit: 7 };
// const initPendapatan = {
//     kodePendapatan: null,
//     namaPendapatan: null,

// };

// const PendapatanChoiceWidget = ({
//     callbackPendapatanChoiceWidget,
//     onlyButton = true,
// }) => {
//     const [show, setShow] = useState(false);
//     const [daftarPendapatan, setDaftarPendapatan] = useState([]);
//     const [query, setQuery] = useState(initQuery);
//     const [pendapatanReview, setPendapatanReview] = useState(initPendapatan);

//     const handlePendapatanServiceList = () => {
//         PendapatanService.list(query)
//             .then((response) => {
//                 setDaftarPendapatan(response.data);
//             })
//             .catch((error) => { });
//     };

//     const handleChoice = (pendapatan) => {
//         setPendapatanReview(pendapatan);
//         callbackPendapatanChoiceWidget(pendapatan);
//         setShow(false);
//     };

//     const callbackPendapatanSearchInlineWidget = (q) => {
//         setQuery((values) => ({ ...values, ...q }));
//     };

//     useEffect(() => {
//         handlePendapatanServiceList();
//     }, [query]);
//     return (
//         <>
//             {!onlyButton && (
//                 <InputGroup>
//                     <Form.Control
//                         type="text"
//                         disabled
//                         value={pendapatanReview.namaPendapatan || ""}
//                     />
//                     <Button onClick={() => setShow(true)}>Pilih Pendapatan</Button>
//                 </InputGroup>
//             )}

//             {onlyButton && (
//                 <Button onClick={() => setShow(true)}>Pilih Pendapatan</Button>
//             )}

// <Modal show={show} onHide={() => setShow(false)} centered>
//                 <Modal.Header closeButton>
//                     <Modal.Title>Pilih Pendapatan</Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body>
//                     <PendapatanSearchInlineWidget
//                         isShowKodePendapatan={true}
//                         isShowNamaPendapatan={true}
//                         q={query}
//                         callbackPendapatanSearchInlineWidget={callbackPendapatanSearchInlineWidget}
//                     />
//                 </Modal.Body>


//                 <Table>
//                     <thead>
//                         <tr>
//                             <th>Kode Pendapatan</th>
//                             <th>Nama Pendapatan</th>
//                             <th>Harga Beli</th>
//                             <th>Harga Jual</th>
//                             <th>Jumlah Pendapatan</th>
//                             <th>Aksi</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {daftarPendapatan.map((pendapatan, index) => (
//                             <tr key={index}>
//                                 <td>{pendapatan.kodePendapatan}</td>
//                                 <td>{pendapatan.namaPendapatan}</td>
//                                 <td>{helperReadableCurrency(pendapatan.hargaBeli)}</td>
//                                 <td>{helperReadableCurrency(pendapatan.hargaJual)}</td>
//                                 <td>{pendapatan.jumlahPendapatan}</td>
//                                 <td>
//                                     <Button onClick={() => handleChoice(pendapatan)}>
//                                         <FaArrowDown />
//                                     </Button>
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </Table>
//             </Modal>
//         </>
//     );
// };

// export default PendapatanChoiceWidget;