import { Button, Card, Col, Form, InputGroup, Row, Table } from "react-bootstrap";
import NavigationWidget from "../../widgets/commons/NavigationWidget";
import { MdCancel } from "react-icons/md";
import { FaFileExcel, FaSave, FaSearch } from "react-icons/fa";
import { Navigate, useNavigate } from "react-router-dom";
import GajiService from "../../services/GajiService";
import { useEffect, useState } from "react";
import { VscAdd } from "react-icons/vsc";
import GajiReviewWidget from "../../widgets/Penggajian/GajiReviewWidget";
import GajiSearchInlineWidget from "../../widgets/Penggajian/GajiSearchInlineWidget";

const PenggajianListPage = () => {
  const [daftarGaji, setDaftarGaji] = useState({});
  const [queryGaji, setQueryGaji] = useState({ page: 1, limit: 10 });
  const [paginateGaji, setPaginateGaji] = useState([]);
  useEffect(() => {
    GajiService.list(daftarGaji)
      .then((response) => {
        setDaftarGaji(response.data);
        if (response.headers.pagination) {
          setPaginateGaji(JSON.parse(response.headers.pagination));
        }
      })
      .catch((error) => console.log(error));
  }, [queryGaji]);

  const callbackPaginator = (page) => {
    setQueryGaji((values) => ({ ...values, page }));
  };

  const callbackGajiSearchInlineWidget = (query) => {
    setQueryGaji((values) => ({ ...values, ...query }));
  };


  return (
    <NavigationWidget
      // buttonCreate={
      //   <Button onClick={() => Navigate("/penggajian/input")}>
      //     <VscAdd />  Tambah
      //   </Button>
      // }
    //   actionTop={
    //     <GajiSearchInlineWidget
    //     attr={{ variant: "secondary" }}
    //     isShowGaji={true}
    //     isShowID_Karyawan={true}
    //     callbackGajiSearchInlineWidget={
    //         callbackGajiSearchInlineWidget
    //     }
    // />
    //       }
      
    >
      <Card className="mt-2">
        <Card.Header className="bg-secondary text-light">
          <h5>List Penggajian</h5>
        </Card.Header>
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th>ID Gaji</th>
              <th>Tanggal</th>
              <th>ID Karyawan</th>
              <th>Total Gaji</th>
              <th>Total Potongan</th>
              <th>Gaji Bersih</th>
              <th>Keterangan</th>
              {/* <th>Email</th>
              <th>ID Profil</th> */}
            </tr>
          </thead>
          <tbody>
            {daftarGaji.results &&
              daftarGaji.results.map((gaji, index) => (
                <tr key={index}>
                  <td>{gaji.ID_Gaji}</td>
                  <td>{gaji.Tanggal}</td>
                  <td>{gaji.ID_Karyawan}</td>
                  <td>{gaji.Total_Pendapatan}</td>
                  <td>{gaji.Total_Potongan}</td>
                  <td>{gaji.Gaji_Bersih}</td>
                  <td>{gaji.Keterangan}</td>
                  {/* <td>{gaji.email}</td>
                  <td>{gaji.ID_Profil}</td> */}
                  <GajiReviewWidget ID_Gaji={gaji.ID_Gaji} />
                </tr>
              ))}
          </tbody>
        </Table>
      </Card>
    </NavigationWidget>
  );
};

export default PenggajianListPage;
