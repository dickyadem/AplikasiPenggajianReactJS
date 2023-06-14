import { Container, Nav, Navbar, Col, Row, Stack } from "react-bootstrap";
import { FaCartPlus } from "react-icons/fa";
import { BsFillDatabaseFill } from "react-icons/bs";
import { RiDashboardFill } from "react-icons/ri";
import { HiDocumentReport } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

const NavigationWidget = ({ children, buttonCreate, actionTop, username, avatar }) => {
  const navigate = useNavigate();

  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="#">PT. KELOMPOK II</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />

          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>Selamat datang! </Navbar.Text>
            {/* <Navbar.Text>{username}</Navbar.Text>
            <Navbar.Text>{avatar}</Navbar.Text> */}
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container className="mt-2">
        <Row>
          <Col md={2}>
            <Nav className="flex-column">
              <Nav.Link>
                <RiDashboardFill /> Dashboard</Nav.Link>
              <Nav.Link disabled>
                <BsFillDatabaseFill /> MASTER
              </Nav.Link>
              <Nav.Link onClick={() => navigate("/user")}>User</Nav.Link>
              <Nav.Link onClick={() => navigate("/profil")}>Profil</Nav.Link>
              <Nav.Link onClick={() => navigate("/karyawan")}>Karyawan</Nav.Link>
              <Nav.Link onClick={() => navigate("/jabatan")}>Jabatan</Nav.Link>
              <Nav.Link onClick={() => navigate("/golongan")}>Golongan</Nav.Link>
              <Nav.Link onClick={() => navigate("/pendapatan")}>Pendapatan</Nav.Link>
              <Nav.Link onClick={() => navigate("/potongan")}>Potongan</Nav.Link>
              <Nav.Link disabled>
                <FaCartPlus /> TRANSAKSI
              </Nav.Link>
              <Nav.Link onClick={() => navigate("/penggajian")}>Penggajian</Nav.Link>
              <Nav.Link onClick={() => navigate("/penggajian/add")}>Penggajian Input</Nav.Link>
              <Nav.Link disabled>
                <HiDocumentReport /> LAPORAN
              </Nav.Link>
              <Nav.Link onClick={() => navigate("/laporan")}>Laporan Gaji</Nav.Link>
            </Nav>
          </Col>
          <Col md={10}>
            <Stack direction="horizontal" gap={3} className="my-2">
              <div>{buttonCreate}</div>
              <div className="ms-auto">{actionTop}</div>
            </Stack>
            {children}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default NavigationWidget;
