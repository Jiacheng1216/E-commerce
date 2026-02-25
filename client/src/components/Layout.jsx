import { Outlet } from "react-router-dom";
import Nav from "./NavComponent/nav-component.jsx";
import FooterComponent from "./footerComponent/FooterComponent.tsx";

const Layout = ({ currentUser, setCurrentUser }) => {
  return (
    <>
      <Nav currentUser={currentUser} setCurrentUser={setCurrentUser} />
      <Outlet />
      <FooterComponent></FooterComponent>
    </>
  );
};

export default Layout;
