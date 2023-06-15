import { useEffect, useState } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";

const PendapatanSearchInlineWidget = ({
    attr,
    isShowID_Potongan,
    isShowNama_Potongan,
    callbackPendapatanSearchInlineWidget,
    q,
}) => {
    const [query, setQuery] = useState({ ID_Potongan: "", Nama_Potongan: "" });

    const handleInput = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setQuery((values) => ({ ...values, [name]: value }));
    };
    useEffect(() => {
        if (q) {
            setQuery((values) => ({ ...values, ...q }));
        }
    }, [q]);

    return (
        <>
            <InputGroup>
                {isShowID_Potongan && (
                    <Form.Control
                        name="ID_Potongan"
                        type="text"
                        placeholder="ID pendapatan..."
                        value={query.ID_Potongan || ""}
                        onChange={handleInput}
                    />
                )}
                {isShowNama_Potongan && (
                    <Form.Control
                        name="Nama_Potongan"
                        type="text"
                        placeholder="Nama pendapatan..."
                        value={query.Nama_Potongan || ""}
                        onChange={handleInput}
                    />
                )}
                <Button
                    {...attr}
                    onClick={() => callbackPendapatanSearchInlineWidget(query)}>
                    <FaSearch /> Search
                </Button>
            </InputGroup>
        </>
    );
};

export default PendapatanSearchInlineWidget;
