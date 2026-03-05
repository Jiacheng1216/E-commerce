import { Outlet } from "react-router-dom";
import Nav from "./NavComponent/nav-component.jsx";
import FooterComponent from "./footerComponent/FooterComponent.tsx";

const Layout = ({ currentUser, setCurrentUser, cartQuantity }) => {
  return (
    <>
      <Nav
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        cartQuantity={cartQuantity}
      />
      <Outlet />
      <FooterComponent></FooterComponent>
    </>
  );
};

export default Layout;
