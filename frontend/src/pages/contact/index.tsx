import React from "react";

const ContactPage = () => {
    return (
        <section className="page_contact section py-6">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Section */}
                    <div className="left-contact p-4">
                        <h1 className="text-2xl font-bold mb-4">Có tất </h1>
                        <div className="mb-3 flex items-start">
                            <i className="fas fa-map-marker-alt text-lg mr-2 text-gray-600"></i>
                            <div>
                                <p className="font-semibold">Địa chỉ:</p>
                                <p>61 Lê Thị Riêng, Phường Bến Thành, Quận 1, TP. HCM</p>
                                <p className="text-sm text-gray-500">(Warehouse) – Liên hệ trước khi đến</p>
                            </div>
                        </div>
                        <div className="mb-3 flex items-center">
                            <i className="fas fa-mobile-alt text-lg mr-2 text-gray-600"></i>
                            <a href="tel:0902692646" className="text-blue-600">0902 69 26 46</a>
                        </div>
                        <div className="mb-3 flex items-center">
                            <i className="fas fa-envelope text-lg mr-2 text-gray-600"></i>
                            <a href="mailto:cotat@gmail.com" className="text-blue-600">cotat@gmail.com</a>
                        </div>

                        {/* Contact Form */}
                        <div className="pt-6 border-t">
                            <h2 className="text-xl font-semibold mb-4">Liên hệ với chúng tôi</h2>
                            <form method="post" action="/postcontact" className="space-y-4">
                                <input type="hidden" name="FormType" value="contact" />
                                <input type="hidden" name="utf8" value="true" />
                                <div>
                                    <input
                                        type="text"
                                        name="contact[Name]"
                                        placeholder="Họ tên*"
                                        required
                                        className="w-full p-2 border rounded-md"
                                    />
                                </div>
                                <div>
                                    <input
                                        type="email"
                                        name="contact[email]"
                                        placeholder="Email*"
                                        required
                                        pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
                                        className="w-full p-2 border rounded-md"
                                    />
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        name="contact[Phone]"
                                        placeholder="Số điện thoại*"
                                        required
                                        pattern="\d+"
                                        className="w-full p-2 border rounded-md"
                                    />
                                </div>
                                <div>
                                    <textarea
                                        name="contact[body]"
                                        placeholder="Nhập nội dung*"
                                        required
                                        className="w-full p-2 border rounded-md"
                                        rows={5}
                                    ></textarea>
                                </div>
                                <div>
                                    <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
                                        Gửi liên hệ của bạn
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Right Section - Google Maps */}
                    <div className="px-4 mt-6 lg:mt-0">
                        <div className="w-full h-96">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.5241258981628!2d106.6890576142869!3d10.771110962238291!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f3c5703b96b%3A0xed7adbc5d89c7b76!2zNjEgxJAuIEzDqiBUaOG7iyBSacOqbmcsIFBoxrDhu51uZyBQaOG6oW0gTmfFqSBMw6NvLCBRdeG6rW4gMSwgVGjDoG5oIHBo4buRIEjhu5MgQ2jDrCBNaW5oLCBWaeG7h3QgTmFt!5e0!3m2!1svi!2s!4v1675399610855!5m2!1svi!2s"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactPage;