import { Link, useLocation } from "react-router-dom";
import { Nav } from "react-bootstrap";
import routes from "../routes";

function SideBar() {
  const { pathname } = useLocation();
  return (
    <nav className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
      <div className="sidebar-sticky pt-3">
        <Nav className="flex-column">
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
      </div>
    </nav>
  );
}

export default SideBar;
