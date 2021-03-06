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
          {routes
            .filter((r) => !!r.menuItemLabel)
            .map(({ path, menuItemLabel }, i) => (
              <Nav.Item key={i}>
                <Nav.Link as={Link} to={path} active={pathname === path}>
                  {menuItemLabel}
                </Nav.Link>
              </Nav.Item>
            ))}
        </Nav>
      </Navbar.Collapse>
      <ul className="navbar-nav px-3 d-none d-md-block">
        <Nav.Item as="li" className="text-nowrap">
          <Nav.Link as={Link} to="/logout">
            Logout
          </Nav.Link>
        </Nav.Item>
      </ul>
    </Navbar>
  );
}

export default Header;
