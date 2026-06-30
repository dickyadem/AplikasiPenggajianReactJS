import { Button, Card, Spinner, Modal, Form, InputGroup } from "react-bootstrap";
import NavigationWidget from "../../widgets/commons/NavigationWidget";
import { useNavigate } from "react-router-dom";
import { VscAdd } from "react-icons/vsc";
import { useEffect, useState } from "react";
import { FaKey, FaEye, FaEyeSlash } from "react-icons/fa";
import UserService from "../../services/UserService";
import ToastWidget from "../../widgets/commons/ToastWidget";
import useToast from "../../hooks/useToast";
import AdvancedTable from "../../widgets/commons/AdvancedTable";
import Paginator from "../../widgets/commons/PaginatorWidget";

const UserPage = () => {
  const navigate = useNavigate();
  const { toast, hideToast, error, success } = useToast();
  const [daftarUser, setDaftarUser] = useState({});
  const [paginateUser, setPaginateUser] = useState([]);
  const [queryUser, setQueryUser] = useState({ page: 1, limit: 10 });
  const [loading, setLoading] = useState(false);

  // Reset password state
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    setLoading(true);
    UserService.list(queryUser)
      .then((response) => {
        setDaftarUser(response.data);
        if (response.headers.pagination) {
          setPaginateUser(JSON.parse(response.headers.pagination));
        }
      })
      .catch((err) => {
        const errorMsg = err.response?.data?.message || "Gagal memuat data user.";
        error(errorMsg);
        console.error("Error loading user:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [queryUser]);

  const callbackPaginator = (page) => {
    setQueryUser((values) => ({ ...values, page }));
  };

  // Table columns
  const userColumns = [
    {
      header: 'ID User',
      accessor: 'ID_User',
      style: { minWidth: '120px' }
    },
    {
      header: 'Nama',
      accessor: 'NamaLengkap',
      style: { minWidth: '200px' }
    },
    {
      header: 'Email',
      accessor: 'email',
      style: { minWidth: '250px' }
    },
    {
      header: 'Role',
      accessor: 'role',
      style: { minWidth: '120px' }
    },
    {
      header: 'Department',
      accessor: 'department',
      style: { minWidth: '120px' },
      render: (row) => row.department || '-'
    },
    {
      header: 'Status',
      accessor: 'Status',
      style: { minWidth: '100px' },
      render: (row) => (
        <span className={`badge bg-${row.Status === 'Active' ? 'success' : 'secondary'}`}>
          {row.Status}
        </span>
      )
    },
    {
      header: 'Aksi',
      accessor: 'actions',
      style: { minWidth: '140px' },
      render: (row) => (
        <Button
          size="sm"
          variant="outline-warning"
          onClick={(e) => { e.stopPropagation(); handleResetPassword(row); }}
        >
          <FaKey /> Reset Password
        </Button>
      )
    }
  ];

  // Handlers
  const handleSearch = (term) => {
    console.log('Search:', term);
  };

  const handleEdit = (row) => {
    navigate(`/user/edit/${row.email}`);
  };

  const handleDelete = (row) => {
    const confirmed = window.confirm(`Hapus user ${row.email}?`);
    if (confirmed) {
      success(`Berhasil menghapus ${row.email}`);
    }
  };

  const handleResetPassword = (row) => {
    setResetEmail(row.email);
    setNewPassword("");
    setShowPassword(false);
    setShowResetModal(true);
  };

  const submitResetPassword = () => {
    if (!newPassword || newPassword.length < 8) {
      error("Password baru minimal 8 karakter!");
      return;
    }

    setResetting(true);
    UserService.resetPassword(resetEmail, newPassword)
      .then((response) => {
        success(`Password untuk ${resetEmail} berhasil direset!`);
        setShowResetModal(false);
      })
      .catch((err) => {
        const msg = err?.response?.data?.message || "Gagal mereset password.";
        error(msg);
      })
      .finally(() => {
        setResetting(false);
      });
  };

  const handleExport = () => {
    success('Data sedang diexport...');
  };

  return (
    <>
      <NavigationWidget
        buttonCreate={
          <Button onClick={() => navigate("/user/add")}>
            <VscAdd />  Tambah
          </Button>
        }
      >
        <Card className="mt-2">
          <Card.Header className="bg-secondary text-light d-flex justify-content-between align-items-center">
            <h5>User</h5>
            <Paginator paginate={paginateUser} callbackPaginator={callbackPaginator} />
          </Card.Header>
          {loading ? (
            <div className="d-flex justify-content-center p-5">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : (
            <AdvancedTable
              columns={userColumns}
              data={daftarUser.results || []}
              loading={loading}
              searchable={true}
              selectable={true}
              exportable={true}
              onSearch={handleSearch}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onExport={handleExport}
              pagination={{
                currentPage: queryUser.page,
                total: daftarUser.total || 0,
                from: (queryUser.page - 1) * queryUser.limit + 1,
                to: queryUser.page * queryUser.limit,
                lastPage: Math.ceil((daftarUser.total || 0) / queryUser.limit)
              }}
              onPageChange={(page, limit) => {
                setQueryUser((values) => ({ ...values, page, limit }));
              }}
            />
          )}
        </Card>
      </NavigationWidget>
      <ToastWidget
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={hideToast}
      />

      {/* Modal Reset Password */}
      <Modal show={showResetModal} onHide={() => setShowResetModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title><FaKey /> Reset Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Reset password untuk: <strong>{resetEmail}</strong></p>
          <Form.Group>
            <Form.Label>Password Baru <span className="text-danger">*</span></Form.Label>
            <InputGroup>
              <Form.Control
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimal 8 karakter"
              />
              <Button
                variant="outline-secondary"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </Button>
            </InputGroup>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowResetModal(false)}>
            Batal
          </Button>
          <Button variant="warning" onClick={submitResetPassword} disabled={resetting}>
            {resetting ? "Mereset..." : "Reset Password"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default UserPage;
