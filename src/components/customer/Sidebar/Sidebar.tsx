'use client';

import React from 'react';
import { useSidebar } from '@/contexts/SidebarContext';
import './Sidebar.css';

export function Sidebar() {
  const { isOpen, toggle } = useSidebar();

  if (!isOpen) return null;

  return (
    <>
      <div className="sidebar-overlay" onClick={toggle} />
      <div className="sidebar-content">
        <button className="sidebar-close" onClick={toggle} aria-label="Close sidebar">
          ✕
        </button>
        <nav className="sidebar-nav">
          {/* Navigation items can be added here */}
          <ul className="sidebar-menu">
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/artworks">Gallery</a>
            </li>
            <li>
              <a href="/about">About</a>
            </li>
            <li>
              <a href="/account">FAQ</a>
            </li>
            <li>
              <a href="/terms-of-use">Terms of Use</a>
            </li>
            <li>
              <a href="/privacy-policy">Privacy Policy</a>
            </li>
            <li>
              <a href="/settings">Settings</a>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
}
