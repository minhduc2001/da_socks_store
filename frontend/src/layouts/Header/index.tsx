import "./index.scss";
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import { Link, useLocation, useNavigate } from "react-router-dom";
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import { Badge, Drawer, Menu, Dropdown } from "antd";
import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import { MenuOutlined } from "@mui/icons-material";
import { useGetUserRedux } from "@/redux/slices/UserSlice";
function Header() {
    const [visible, setVisible] = useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const user = useGetUserRedux()
    const navigate = useNavigate()
    const showDrawer = () => {
        setVisible(true);
    };
    const onClose = () => {
        setVisible(false);
    };


    // Handle window resize
    useEffect(() => {
        if (location.pathname == "/login") {
            navigate("/")
        }
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener("resize", handleResize);

        // Cleanup event listener
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <div className="header">
            <Drawer
                title="Tất phải chất"
                placement={"left"}
                closable={true}
                onClose={onClose}
                open={visible}
                key={"left"}
            >
                <div className="nav">
                    <ul className="flex-col gap-10">
                        <li className="text-blue-500">
                            <Link to="/">
                                <HomeRoundedIcon style={{ color: "#0b850b", fontSize: 30 }} />
                            </Link>
                        </li>
                        <li>
                            <Link to={"/introduce"} className="menu-item text-gray-700">
                                Giới thiệu
                            </Link>
                        </li>
                        <li>
                            <Link to={"/product"} className="menu-item text-gray-700">
                                Sản phẩm
                            </Link>
                        </li>
                        <li>
                            <Link to={"/contact"} className="menu-item text-gray-700">
                                Liên hệ
                            </Link>
                        </li>
                        <li>
                            <Link to={"/history"} className="menu-item text-gray-700">
                                Lịch sử đặt hàng
                            </Link>
                        </li>
                        <li>
                            <Link to={"/cart"}>
                                <Badge count={1}>
                                    <ShoppingBagOutlinedIcon />
                                </Badge>
                            </Link>
                        </li>
                    </ul>
                </div>
            </Drawer>
            <div className="container relative">
                {windowWidth < 768 && (
                    <button
                        onClick={showDrawer}
                        className="absolute top-5 left-0"
                    >
                        <MenuOutlined />
                    </button>
                )}
                <div className="logo-header">
                    <img src="/logo.png" />
                </div>
                <div className="nav">
                    <ul>
                        <li>
                            <Link to="/">
                                <HomeRoundedIcon style={{ color: "#0b850b", fontSize: 30 }} />
                            </Link>
                        </li>
                        <li>
                            <Link to={"/introduce"}>
                                Giới thiệu
                            </Link>
                        </li>
                        <li >
                            <Link to={"/product"}>
                                Sản phẩm
                            </Link>
                        </li>
                        <li>
                            <Link to={"/contact"}>
                                Liên hệ
                            </Link>
                        </li>
                        <li>
                            {
                                !user?.id ?
                                    <></> :
                                    <Link to={"/history"}>
                                        Lịch sử đặt hàng
                                    </Link>
                            }
                        </li>
                        <li>
                            <Link to={"/cart"}>
                                <Badge count={1}>
                                    <ShoppingBagOutlinedIcon />
                                </Badge>
                            </Link>
                        </li>
                        <li>
                            {
                                !user?.id ?
                                    <></> :
                                    <Button disabled={true}>
                                        {/*<LogoutIcon />*/}
                                    </Button>
                            }
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Header;
