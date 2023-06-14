import { Button, Card, Form } from "react-bootstrap";
import NavigationWidget from "../../widgets/commons/NavigationWidget";
import { FaArrowLeft, FaSave } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import KaryawanService from "../../services/KaryawanService";

const KaryawanAddPage = () => {
  const navigate = useNavigate();
  const [karyawan, setKaryawan] = useState({});

  const handleInput = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    setKaryawan((values) => ({ ...values, [name]: value }));
  };

  const handleKaryawanServiceCreate = () => {
    KaryawanService.create(karyawan).then((response) => {
      alert("Karyawan berhasil ditambahkan.");
      navigate("/karyawan");
    });
  };

  return (
    <NavigationWidget
      actionTop={
        <>
          <Button className="me-2" variant="secondary" onClick={() => navigate(-1)}>
            <FaArrowLeft /> Kembali
          </Button>
          <Button onClick={handleKaryawanServiceCreate}>
            <FaSave /> Simpan
          </Button>
        </>
      }
    >
      <Card>
        <Card.Header>
          <h5>Tambah Karyawan</h5>
        </Card.Header>
        <Card.Body>
          <Form.Group>
            <Form.Label>ID Karyawan</Form.Label>
            <Form.Control name="ID_Karyawan" 
            value={karyawan.ID_Karyawan || ""} 
            onChange={handleInput} />
          </Form.Group>
          <Form.Group className="mt-3">
            <Form.Label>Nama Karyawan</Form.Label>
            <Form.Control 
            name="Nama_Karyawan" 
            value={karyawan.Nama_Karyawan || ""} 
            onChange={handleInput} />
          </Form.Group>
          <Form.Group className="mt-3">
            <Form.Label>ID Golongan</Form.Label>
            <Form.Control name="ID_Golongan" 
            value={karyawan.ID_Golongan || ""} 
            onChange={handleInput} />
          </Form.Group>
          <Form.Group className="mt-3">
            <Form.Label>ID Jabatan</Form.Label>
            <Form.Control name="ID_Jabatan" 
            value={karyawan.ID_Jabatan || ""} 
            onChange={handleInput} />
          </Form.Group>
          <Form.Group className="mt-3">
            <Form.Label>Divisi</Form.Label>
            <Form.Control name="Divisi" 
            value={karyawan.Divisi || ""} 
            onChange={handleInput} />
          </Form.Group>
          <Form.Group className="mt-3">
            <Form.Label>Status Pernikahan</Form.Label>
            <Form.Control name="Status_Pernikahan" 
            value={karyawan.Status_Pernikahan || ""} 
            onChange={handleInput} />
          </Form.Group>
          <Form.Group className="mt-3">
            <Form.Label>Jumlah Anak</Form.Label>
            <Form.Control name="Jumlah_Anak" 
            value={karyawan.Jumlah_Anak || ""} 
            isValid={parseInt(karyawan.Jumlah_Anak) > 0}
            isInvalid={parseInt(karyawan.Jumlah_Anak) < 0}
            onChange={handleInput} />
          </Form.Group>
        </Card.Body>
      </Card>
    </NavigationWidget>
  );
};

export default KaryawanAddPage;
