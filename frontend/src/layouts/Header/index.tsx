import "./index.scss";
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import { Link, useLocation, useNavigate } from "react-router-dom";
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import { Badge, Drawer } from "antd";
import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import { MenuOutlined } from "@mui/icons-material";
import { logoutUser, useGetUserRedux } from "@/redux/slices/UserSlice";
import { useCart } from "@/pages/cart/useCart";
import { LoginOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import ApiCart from "@/api/ApiCart";
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

    const dispatch = useDispatch()

    const {
        data: serverCart,
    } = useQuery({
        queryKey: ['cart'],
        queryFn: ApiCart.get,
        enabled: !!user?.id
    });

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

    const handleButton = () => {
        if (user?.id) dispatch(logoutUser())
        else navigate('/login')
    }
    return (
        <div className="header">
            <Drawer
                title="Có tất"
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
                    <img src="https://cotat.vn/wp-content/uploads/2024/06/cropped-logo-ctt-ngang-03-time-skip-355b465042.png" />
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
                            {
                                <Link to={"/cart"} className="mr-4">
                                    <Badge count={user?.id ? serverCart?.cart_items?.length ?? 0 : 0}>
                                        <ShoppingBagOutlinedIcon />
                                    </Badge>
                                </Link>
                            }

                            <Button onClick={handleButton}>
                                {
                                    user?.id ? <LogoutIcon></LogoutIcon> : "Đăng nhập"
                                }
                            </Button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Header;
