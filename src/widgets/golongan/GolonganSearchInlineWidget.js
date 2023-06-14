import { useEffect, useState } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";

const GolonganSearchInlineWidget = ({
    attr,
    isShowID_Golongan,
    isShowNama_Golongan,
    callbackGolonganSearchInlineWidget,
    q,
}) => {
    const [query, setQuery] = useState({ ID_Golongan: "", Nama_Golongan: "" });

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
            {isShowID_Golongan && (
          <Form.Control
            name="ID_Golongan"
            type="text"
            placeholder="ID Golongan..."
            value={query.ID_Golongan || ""}
            onChange={handleInput}
          />
        )}
        {isShowNama_Golongan && (
          <Form.Control
            name="Nama_Golongan"
            type="text"
            placeholder="Nama Golongan..."
            value={query.Nama_Golongan || ""}
            onChange={handleInput}
          />
        )}
        <Button
          {...attr}
          onClick={() => callbackGolonganSearchInlineWidget(query)}>
          <FaSearch /> Search
        </Button>
            </InputGroup>
        </>
    );

};

export default GolonganSearchInlineWidget;