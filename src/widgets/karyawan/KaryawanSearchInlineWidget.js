import { useEffect, useState } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";

const KaryawanSearchInlineWidget = ({
    attr,
    isShowID_Karyawan,
    isShowNama_Karyawan,
    callbackKaryawanSearchInlineWidget,
    q,
}) => {
    const [query, setQuery] = useState({ ID_Karyawan: "", Nama_Karyawan: "" });

    const handleInput = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setQuery((values) => ({ ...values, [name]: value }));
    };

    useEffect(() => {
      if(q){
        setQuery((values) => ({...values, ...q}));
      }
    }, [q]);

    return (
        <>
            <InputGroup>
            {isShowID_Karyawan && (
          <Form.Control
            name="ID_Karyawan"
            type="text"
            placeholder="ID Karyawan..."
            value={query.ID_Karyawan || ""}
            onChange={handleInput}
          />
        )}
        {isShowNama_Karyawan && (
          <Form.Control
            name="Nama_Karyawan"
            type="text"
            placeholder="Nama Karyawan..."
            value={query.Nama_Karyawan || ""}
            onChange={handleInput}
          />
        )}
        <Button
          {...attr}
          onClick={() => callbackKaryawanSearchInlineWidget(query)}>
          <FaSearch /> Search
        </Button>
            </InputGroup>
        </>
    );

};

export default KaryawanSearchInlineWidget;