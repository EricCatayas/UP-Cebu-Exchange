import React from "react";

const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-800 text-white py-6 mt-auto">
                <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                                <div>
                                        <img src="/logo-placeholder.png" alt="Logo" className="h-10 w-10 mb-2"/>
                                </div>
                                <div>
                                        <h3 className="text-lg font-bold mb-2">CONTACT</h3>
                                        <p className="text-sm">(+63) 987 654 3210</p>
                                        <p className="text-sm">
                                                <a href="mailto:upcebuexchange@email.com">upcebuexchange@email.com</a>
                                        </p>
                                        <p className="text-sm">University Of The Philippines, Arts & Sciences Building, 3rd Floor, Gorordo Ave, Cebu City</p>
                                </div>
                                <div>
                                        <h3 className="text-lg font-bold mb-2">ABOUT</h3>
                                        <p className="text-sm">About Us</p>
                                        <p className="text-sm">Terms of Service</p>
                                        <p className="text-sm">Privacy Policy</p>
                                </div>
                                <div>
                                        <h3 className="text-lg font-bold mb-2">FOLLOW US</h3>
                                        <p className="text-sm">Facebook</p>
                                        <p className="text-sm">Twitter</p>
                                        <p className="text-sm">Instagram</p>
                                </div>
                        </div>
                        <div className="text-center text-sm mt-6">
                                &copy; {new Date().getFullYear()} UP Cebu Exchange. All rights reserved.
                        </div>
                </div>
        </footer>
    );
};

export default Footer;