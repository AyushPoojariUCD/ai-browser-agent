import logo from "../../assets/icon.ico";

const LogoBlock = () => (
  <div className="hidden md:block w-1/2 text-center">
    <img src={logo} alt="Logo" className="w-72 mx-auto animate-pulse" />
  </div>
);
export default LogoBlock;
