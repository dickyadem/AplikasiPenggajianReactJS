import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../../services/AuthService";
import { Container, Card, Row, Col, Form, Button } from "react-bootstrap";

const AuthLoginPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({});

  const handleInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setUser((values) => ({ ...values, [name]: value }));
  };

  const handleAuthServiceLogin = () => {
    AuthService.login(user)
      .then((response) => {
        AuthService.saveToken(response.data.token);
        navigate("/user");
      })
      .catch((eror) => alert(eror));
  };

  return (
    <>
      <Container>
        <Row className="vh-100 d-flex justify-content-center align-items-center">
          <Col md={4}>
              <div className="d-flex justify-content-center">
                <h2>Admin Login</h2>
              </div>
            <Card className="mt-3">
              <Card.Body>
                <Form.Group className="my-3">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control name="email" onChange={handleInput} value={user.email || ""} type="email" placeholder="Masukan email..." />
                </Form.Group>
                <Form.Group className="my-3">
                  <Form.Label>Passwod</Form.Label>
                  <Form.Control name="password" onChange={handleInput} value={user.password || ""} type="password" placeholder="Masukan password..." />
                </Form.Group>

                <div className="d-grid gap-2">
                  <Button onClick={handleAuthServiceLogin}>Login</Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default AuthLoginPage;
