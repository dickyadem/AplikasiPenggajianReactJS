import { useState } from "react";
import NavigationWidget from "../../widgets/commons/NavigationWidget";
import { FaDownload } from "react-icons/fa";
import ReportingService from "../../services/LaporanService";
import { Button, Card, Form, InputGroup, Table } from "react-bootstrap";

export default () => {
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
            <Card className="mt-2">
                <Card.Header className="bg-secondary text-light">
                    <h5>Laporan Karyawan</h5>
                </Card.Header>
            </Card>

            <div className="mt-4 d-flex justify-content-between">
                <Card style={{ width: '18rem' }}>
                    <Card.Body>
                        <Card.Title>Cetak Laporan Penggajian Karyawan</Card.Title>
                        <Button onClick={GajiList}>
                            <FaDownload /> Export
                        </Button>
                    </Card.Body>
                </Card>

                <Card style={{ width: '18rem' }}>
                    <Card.Body>
                        <Card.Title>Cetak Laporan Potongan BPJS</Card.Title>
                        <Button onClick={BPJS}>
                            <FaDownload /> Export
                        </Button>
                    </Card.Body>
                </Card>

                <Card style={{ width: '18rem' }}>
                    <Card.Body>
                        <Card.Title>Cetak Laporan Potongan PPh</Card.Title>
                        <Button onClick={PPH}>
                        <FaDownload /> Export
                    </Button>
                    </Card.Body>
                </Card>

                <Card style={{ width: '18rem' }}>
                    <Card.Body>
                        <Card.Title>Cetak Laporan Slip Gaji Karyawan</Card.Title>
                        <Button onClick={SlipGaji}>
                        <FaDownload /> Export
                    </Button>
                    </Card.Body>
                </Card>
            </div>
        </NavigationWidget>
    );
};