import { useEffect, useState } from "react";
import NavigationWidget from "../../widgets/commons/NavigationWidget";
import { FaDownload } from "react-icons/fa";
import ReportingService from "../../services/LaporanService";
import { Button, Card, Form, InputGroup, Table } from "react-bootstrap";
import KaryawanService from "../../services/KaryawanService";
import GajiService from "../../services/GajiService";
import PotonganService from "../../services/PotonganService";
import GajiDetailService from "../../services/GajiDetailService";

const LaporanPage = () => {
    const [daftarKaryawan, setDaftarKaryawan] = useState({});
    const [paginateKaryawan, setPaginateKaryawan] = useState([]);
    const [queryKaryawan, setQueryKaryawan] = useState({ page: 1, limit: 10 });
    const [daftarGaji, setDaftarGaji] = useState({});
    const [queryGaji, setQueryGaji] = useState({ page: 1, limit: 10 });
    const [paginateGaji, setPaginateGaji] = useState([]);
    const [daftarPotongan, setDaftarPotongan] = useState({});
    const [paginatePotongan, setPaginatePotongan] = useState([]);
    const [queryPotongan, setQueryPotongan] = useState({ page: 1, limit: 10 });
    const [daftarGajiDetail, setDaftarGajiDetail] = useState({});
    const [queryGajiDetail, setQueryGajiDetail] = useState({ page: 1, limit: 10 });
    const [paginateGajiDetail, setPaginateGajiDetail] = useState([]);
    const [showTable, setShowTable] = useState(false);
    const [showListPenggajian, setShowListPenggajian] = useState(false);
    const [showPotonganBPJS, setShowPotonganBPJS] = useState(false);
    const [showPotonganPPH, setShowPotonganPPH] = useState(false);

    useEffect(() => {
        GajiDetailService.list(daftarGajiDetail)
            .then((response) => {
                setDaftarGajiDetail(response.data);
                if (response.headers.pagination) {
                    setPaginateGajiDetail(JSON.parse(response.headers.pagination));
                }
            })
            .catch((error) => console.log(error));
    }, [queryGajiDetail]);



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
    useEffect(() => {
        KaryawanService.list(daftarKaryawan)
            .then((response) => {
                setDaftarKaryawan(response.data);
                if (response.headers.pagination) {
                    setPaginateKaryawan(JSON.parse(response.headers.pagination));
                }
            })
            .catch((error) => console.log(error));
    }, [queryKaryawan]);

    const [reportingGaji, setReportingGaji] = useState({
    });


    const GajiList = async () => {
        await ReportingService.reportListGaji(reportingGaji);
    };
    const BPJS = async () => {
        await ReportingService.reportBPJS(reportingGaji);
    }
    const PPH = async () => {
        await ReportingService.reportPPh(reportingGaji);
    }
    const SlipGaji = async () => {
        await ReportingService.reportslipgaji(reportingGaji);
    }

    return (
        <NavigationWidget>



            {showListPenggajian && (
                <Card className="mt-10">
                    <Card.Header className="bg-secondary text-light">
                        <h5>Laporan List Penggajian </h5>
                    </Card.Header>
                    <Table striped bordered hover size="sm">
                        <thead>
                            <tr>
                                <th>ID Gaji</th>
                                <th>Tanggal</th>
                                <th>Nama Karyawan</th>
                                <th>Divisi</th>
                                <th>Total Pendapatan</th>
                                <th>Total Potongan</th>
                                <th>Gaji Bersih</th>
                            </tr>
                        </thead>
                        <tbody>

                            {daftarGaji.results &&
                                daftarGaji.results.map((gaji, index) => {
                                    const karyawan = daftarKaryawan.results.find(
                                        (k) => k.ID_Karyawan === gaji.ID_Karyawan
                                    );
                                    const potongan = daftarPotongan.results.find(
                                        (p) => p.ID_Potongan
                                    );

                                    return (
                                        <tr key={index}>
                                            <td>{gaji.ID_Gaji}</td>
                                            <td>{gaji.Tanggal}</td>
                                            <td>{karyawan && karyawan.Nama_Karyawan}</td>
                                            <td>{karyawan && karyawan.Divisi}</td>
                                            <td>{gaji.Total_Pendapatan}</td>
                                            <td>{gaji.Total_Potongan}</td>
                                            <td>{gaji.Gaji_Bersih}</td>
                                        </tr>
                                    );
                                })}
                        </tbody>
                    </Table>
                </Card>

            )}



            {showPotonganBPJS && (
                <>
                    {/* //laporan BPJS */}
                    <Card className="mt-10">
                        <Card.Header className="bg-secondary text-light">
                            <h5>Laporan Potongan BPJS </h5>
                        </Card.Header>
                        <Table striped bordered hover size="sm">
                            <thead>
                                <tr>
                                    <th>ID Gaji</th>
                                    <th>ID Karyawan</th>
                                    <th>Nama Karyawan</th>
                                    <th>Jumlah Potongan</th>
                                </tr>
                            </thead>
                            <tbody>
                                {daftarGaji.results &&
                                    daftarGaji.results
                                        .filter((gaji) => {
                                            // Filter ID Gaji yang memiliki ID Potongan bernilai 01
                                            const gajiDetail = daftarGajiDetail.results.find(
                                                (gd) => gd.ID_Gaji === gaji.ID_Gaji && gd.ID_Potongan === "01"
                                            );
                                            return gajiDetail !== undefined;
                                        })
                                        .map((gaji, index) => {
                                            const karyawan = daftarKaryawan.results.find(
                                                (k) => k.ID_Karyawan === gaji.ID_Karyawan
                                            );
                                            const gajiDetail = daftarGajiDetail.results.find(
                                                (gd) => gd.ID_Gaji === gaji.ID_Gaji && gd.ID_Potongan === "01"
                                            );

                                            return (
                                                <tr key={index}>
                                                    <td>{gaji.ID_Gaji}</td>
                                                    <td>{gaji.ID_Karyawan}</td>
                                                    <td>{karyawan && karyawan.Nama_Karyawan}</td>
                                                    <td>{gajiDetail && gajiDetail.Jumlah_Potongan}</td>
                                                </tr>
                                            );
                                        })}
                            </tbody>
                        </Table>
                    </Card>
                </>
            )}


            {showPotonganPPH && (
                <>
                    {/* Laporan PPh */}
                    <Card className="mt-10">
                        <Card.Header className="bg-secondary text-light">
                            <h5>Laporan Potongan PPH </h5>
                        </Card.Header>
                        <Table striped bordered hover size="sm">
                            <thead>
                                <tr>
                                    <th>ID Gaji</th>
                                    <th>ID Karyawan</th>
                                    <th>Nama Karyawan</th>
                                    <th>Jumlah Potongan</th>
                                </tr>
                            </thead>
                            <tbody>
                                {daftarGaji.results &&
                                    daftarGaji.results
                                        .filter((gaji) => {
                                            const gajiDetail = daftarGajiDetail.results.find(
                                                (gd) => gd.ID_Gaji === gaji.ID_Gaji && gd.ID_Potongan === "02"
                                            );
                                            return gajiDetail !== undefined;
                                        })
                                        .map((gaji, index) => {
                                            const karyawan = daftarKaryawan.results.find(
                                                (k) => k.ID_Karyawan === gaji.ID_Karyawan
                                            );
                                            const gajiDetail = daftarGajiDetail.results.find(
                                                (gd) => gd.ID_Gaji === gaji.ID_Gaji && gd.ID_Potongan === "02"
                                            );

                                            return (
                                                <tr key={index}>
                                                    <td>{gaji.ID_Gaji}</td>
                                                    <td>{gaji.ID_Karyawan}</td>
                                                    <td>{karyawan && karyawan.Nama_Karyawan}</td>
                                                    <td>{gajiDetail && gajiDetail.Jumlah_Potongan}</td>
                                                </tr>
                                            );
                                        })}
                            </tbody>
                        </Table>
                    </Card>
                </>
            )}


            {/* 
            Eksport Laporan */}
            <Card className="mt-5">
                <Card.Header className="bg-secondary text-light">
                    <h5>Laporan Karyawan</h5>
                </Card.Header>
            </Card>

            <div className="mt-4 d-flex justify-content-between">
                <div className="container">
                    <div className="d-flex flex-column">
                        <Card className="mb-3">
                            <Card.Body>
                                <Card.Title>Cetak Laporan Penggajian Karyawan</Card.Title>
                                <Button onClick={GajiList} style={{ margin: '0 10px' }}>
                                    <FaDownload /> Export
                                </Button>
                                <Button onClick={() => setShowListPenggajian(!showListPenggajian)}>
                                    {showListPenggajian ? 'Hide List Penggajian' : 'View List Penggajian'}
                                </Button>
                            </Card.Body>
                        </Card>

                        <Card className="mb-3">
                            <Card.Body>
                                <Card.Title>Cetak Laporan Potongan BPJS</Card.Title>
                                <Button onClick={BPJS} style={{ margin: '0 10px' }}>
                                    <FaDownload /> Export
                                </Button>
                                <Button onClick={() => setShowPotonganBPJS(!showPotonganBPJS)}>
                                    {showPotonganBPJS ? 'Hide Potongan BPJS' : 'View Potongan BPJS'}
                                </Button>
                            </Card.Body>
                        </Card>

                        <Card className="mb-3">
                            <Card.Body>
                                <Card.Title>Cetak Laporan Potongan PPh</Card.Title>
                                <Button onClick={PPH} style={{ margin: '0 10px' }} >
                                    <FaDownload /> Export
                                </Button>
                                <Button onClick={() => setShowPotonganPPH(!showPotonganPPH)}>
                                    {showPotonganPPH ? 'Hide Potongan PPH' : 'View Potongan PPH'}
                                </Button>
                            </Card.Body>
                        </Card>

                        <Card className="mb-3">
                            <Card.Body>
                                <Card.Title>Cetak Laporan Slip Gaji Karyawan</Card.Title>
                                <Button onClick={SlipGaji}>
                                    <FaDownload /> Export
                                </Button>
                            </Card.Body>
                        </Card>
                    </div>
                </div>
            </div>

        </NavigationWidget>
    );
};
export default LaporanPage;