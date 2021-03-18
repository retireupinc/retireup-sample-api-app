import { Link, useLocation } from "react-router-dom";
import { Navbar, Nav } from "react-bootstrap";
import routes from "../routes";
import { ReactComponent as Logo } from "../assets/logo_t118_RU_160x32_white.svg";

function Header() {
  const { pathname } = useLocation();
  return (
    <Navbar
      bg="primary"
      variant="dark"
      sticky="top"
      className="flex-md-nowrap p-0 shadow"
      collapseOnSelect
      expand="md"
    >
      <Navbar.Brand
        as={Link}
        to="/"
        className="col-md-3 col-lg-2 mr-0 px-3 text-center"
      >
        <Logo width="160" height="32" />
      </Navbar.Brand>
      <Navbar.Toggle
        aria-controls="sidebarMenu"
        label="Toggle navigation"
        className="position-absolute d-md-none"
      />
      <Navbar.Collapse id="sidebarMenu">
        <Nav className="mr-auto d-md-none px-3">
          {routes.map(({ path, label }, i) => (
            <Nav.Item key={i}>
              <Nav.Link as={Link} to={path} active={pathname === path}>
                {label}
              </Nav.Link>
            </Nav.Item>
          ))}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Header;
