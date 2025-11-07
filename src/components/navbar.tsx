import Link from "next/link";
import React from "react";

// TODO: Navigation links 
//      if signed in:  Cart, My Rentals, Account
//      if not signed in: Sign In/Register

const Navbar: React.FC = () => {
  return (
    <nav className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-2 flex items-center justify-between">
            <div className="flex items-center space-x-4">
            <Link href="/">
                <img src="/logo-placeholder.png" alt="Logo" className="h-12 w-12 max-w-12"/>
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">UP Cebu Exchange</h1>
            </div>
            <div className="flex items-center space-x-4">
            <Link href="/cart" className="text-gray-600 hover:text-gray-800">Cart</Link>
            <Link href="/my-rentals" className="text-gray-600 hover:text-gray-800">My Rentals</Link>
            <Link href="/account" className="text-gray-600 hover:text-gray-800">Account</Link>
            </div>
        </div>
    </nav>
  );
}

export default Navbar;