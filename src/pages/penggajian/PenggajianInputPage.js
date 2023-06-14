import { Button, Card, Col, Form, InputGroup, Row, Table } from "react-bootstrap";
import NavigationWidget from "../../widgets/commons/NavigationWidget";
import { useNavigate } from "react-router-dom";
import { MdCancel } from "react-icons/md";
import { FaArrowLeft, FaSave, FaSearch } from "react-icons/fa";
import { useEffect, useState } from "react";
import PendapatanService from "../../services/PendapatanService";
import PotonganService from "../../services/PotonganService";
import GajiService from "../../services/GajiService";
const initGaji = {
  ID_Gaji: null,
  tanggal: null,
  ID_Karyawan: null,
  Jumlah_Pendapatan: null,
  Jumlah_Potongan: null,
};

const PenggajianInputPage = () => {
  const navigate = useNavigate();
  const [gaji, setGaji] = useState(initGaji);
  const [daftarGaji, setDaftarGaji] = useState({});
  const [paginateGaji, setPaginateGaji] = useState([]);
  const [queryGaji, setQueryGaji] = useState({ page: 1, limit: 10 });

  const [daftarPendapatan, setDaftarPendapatan] = useState({});
  const [queryPendapatan, setQueryPendapatan] = useState({ page: 1, limit: 10 });
  const [paginatePendapatan, setPaginatePendapatan] = useState([]);

  const [daftarPotongan, setDaftarPotongan] = useState({});
  const [paginatePotongan, setPaginatePotongan] = useState([]);
  const [queryPotongan, setQueryPotongan] = useState({ page: 1, limit: 10 });


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

  const handleInput = (e, index, ID) => {
    const name = e.target.name;
    const value = e.target.value;

    const updatedItems = gaji.items.map((item, i) => {
      if (i === index) {
        return { ...item, [name]: value };
      }
      return item;
    });

    setGaji((prevState) => ({
      ...prevState,
      items: updatedItems
    }));
  };
  function getCurrentDate() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  const handleGajiServiceCreate = () => {
    GajiService.create(gaji).then((response) => {
      alert("Pendapatan berhasil ditambahkan.");
      navigate("/penggajian");
    });
  };
  return (
    <NavigationWidget
      actionTop={
        <>
          <Button className="me-2" variant="danger" onClick={() => navigate(-1)}>
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
                  onChange={handleInput} />
              </Form.Group>
              <Form.Group>
                <Form.Label>Tanggal Entry</Form.Label>
                <Form.Control name="Tanggal_Entry"

                  defaultValue={getCurrentDate()}
                  onChange={handleInput}
                  disabled />
              </Form.Group>

              <Form.Group>
                <Form.Label>ID Karyawan</Form.Label>
                <Form.Control name="ID Karyawan"
                  onChange={handleInput} />
              </Form.Group>
              <Form.Group>
                <Form.Label>Email</Form.Label>
                <Form.Control name="email"
                  onChange={handleInput}
                  type="email"
                  value={gaji.email || ""} />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>ID Profil</Form.Label>
                <Form.Control name="ID_Profil"
                  value={gaji.ID_Profil || ""}
                  onChange={handleInput} />
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
              {daftarPendapatan.results &&
                daftarPendapatan.results.map((pendapatan, index) => (
                  <tr key={pendapatan.ID_Pendapatan}>
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
                          onChange={(e) => handleInput(e, index, pendapatan.ID_Pendapatan)}
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
              {daftarPotongan.results &&
                daftarPotongan.results.map((potongan, index) => (
                  <tr key={potongan.ID_Potongan}>
                    <td style={{ width: "13%" }}>
                      <Form.Group>
                        <Form.Control
                          name="ID_Pendapatan"
                          value={potongan.ID_Potongan}
                          disabled
                        />
                      </Form.Group>
                    </td>
                    <td>
                      <Form.Group>
                        <Form.Control
                          name="Nama_Pendapatan"
                          value={potongan.Nama_Potongan}
                          disabled
                        />
                      </Form.Group>
                    </td>
                    <td>
                      <Form.Group>
                        <Form.Control
                          name="Jumlah_Pendapatan"
                          onChange={(e) => handleInput(e, index, potongan.ID_Potongan)}
                        />
                      </Form.Group>
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
