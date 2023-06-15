import { useEffect, useState } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";

const PendapatanSearchInlineWidget = ({
    attr,
    isShowID_Pendapatan,
    isShowNama_Pendapatan,
    callbackPendapatanSearchInlineWidget,
    q,
}) => {
    const [query, setQuery] = useState({ ID_Pendapatan: "", Nama_Pendapatan: "" });

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
                {isShowID_Pendapatan && (
                    <Form.Control
                        name="ID_Pendapatan"
                        type="text"
                        placeholder="Kode pendapatan..."
                        value={query.ID_Pendapatan || ""}
                        onChange={handleInput}
                    />
                )}
                {isShowNama_Pendapatan && (
                    <Form.Control
                        name="Nama_Pendapatan"
                        type="text"
                        placeholder="Nama pendapatan..."
                        value={query.Nama_Pendapatan || ""}
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
