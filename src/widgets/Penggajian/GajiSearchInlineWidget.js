// import { useState } from "react";
// import { Button, Form, InputGroup } from "react-bootstrap";
// import { FaSearch } from "react-icons/fa";

// const GajiSearchInlineWidget = ({
//     attr,
//     isShowGaji,
//     isShowID_Karyawan,
//     callbackGajiSearchInlineWidget,
// }) => {
//     const [query, setQuery] = useState({ ID_Karyawan: "", ID_Gaji: "" });

//     const handleInput = (e) => {
//         const name = e.target.name;
//         const value = e.target.value;
//         setQuery((values) => ({ ...values, [name]: value }));
//     };

//     return (
//         <>
//             <InputGroup>
//                 {isShowGaji && (
//                     <Form.Control
//                         name="ID_Gaji"
//                         type="text"
//                         placeholder="No ID Gaji..."
//                         value={query.ID_Gaji || ""}
//                         onChange={handleInput}
//                     />
//                 )}
//                 {isShowID_Karyawan && (
//                     <Form.Control
//                         name="ID_Karyawan"
//                         type="text"
//                         placeholder="ID Karyawan..."
//                         value={query.ID_Karyawan || ""}
//                         onChange={handleInput}
//                     />
//                 )}

//                 <Button
//                     {...attr}
//                     onClick={() => callbackGajiSearchInlineWidget(query)}>
//                     <FaSearch /> Search
//                 </Button>
//             </InputGroup>
//         </>
//     );
// };

// export default GajiSearchInlineWidget;