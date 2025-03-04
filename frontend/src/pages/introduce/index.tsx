import React from "react";
import "./index.scss"
import Helmet from "@/components/Helmet.tsx";

function IntroducePage() {
    return (
        <section className="introduce-container">
            <div className="container bg-white shadow-md rounded-lg p-4">
                <div className="wrap_background_aside mb-10">
                    <div className="row">
                        <div className="col-span-12">
                            <div className="border-b pb-2 mb-4">
                                <h1 className="text-xl font-bold text-gray-800">
                                    <a href="#">Giới thiệu</a>
                                </h1>
                            </div>

                            <div className="content-page text-gray-700 space-y-4">
                                <p className="text-lg font-semibold">Có tất</p>
                                <p>Chuyên Tất vớ Nam | Tất vớ nữ | Tất mang giày tây | Vớ mang giày tây | Tất thể thao</p>
                                <p>Hiện chúng mình đang bán Online, có mặt ở nhiều nền tảng thương mại điện tử khác nhau:</p>

                                <ul className="list-disc pl-5">
                                    <li>Website: <a href="/" className="text-blue-600">cotat.com</a></li>
                                    <li>Shopee: <a href="#" className="text-blue-600">shope.ee/7zf5UGSxOb</a></li>
                                    <li>Fanpage: <a href="#" className="text-blue-600">facebook.com/cotat</a></li>
                                </ul>

                                <p>Với hơn 5000 đơn hàng từ khắp mọi miền tổ quốc trong hơn năm qua, Có tất tin rằng sản phẩm sẽ làm hài lòng quý khách hàng.</p>

                                <p className="font-semibold">CẦN GẤP CÓ TẤT NGAY</p>
                                <p>- Thời gian giao hàng: 1-2 ngày ở HCM và 4-7 ngày ở các tỉnh thành khác</p>
                                <p>- Anh chị cần gấp sản phẩm có thể note trong phần ghi chú hoặc nhắn tin Zalo trực tiếp: <strong>0902 69 26 46</strong></p>

                                <p className="font-semibold">AN TÂM MUA SẮM</p>
                                <p>Với phương thức COD, khách hàng được kiểm tra hàng trước khi thanh toán.</p>

                                <p className="font-semibold">ĐỔI TRẢ TRONG 7 NGÀY</p>
                                <p>Nếu sản phẩm có lỗi từ NSX hoặc giao sai màu, sai mẫu, chúng tôi sẽ đổi trả trong vòng 7 ngày.</p>

                                <p className="font-semibold">Mọi góp ý đóng góp xin vui lòng liên hệ:</p>
                                <p>HOTLINE/ZALO: <strong>0902 69 26 46</strong></p>
                                <p>LIÊN HỆ MUA SỈ: <strong>0985 242 750</strong></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
export default IntroducePage;
