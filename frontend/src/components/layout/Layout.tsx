import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useState } from 'react';

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-slate-50">
      <div className={`fixed inset-y-0 left-0 z-50 transition-all duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <Sidebar />
      </div>

      <div className={`flex-1 flex flex-col h-screen overflow-hidden transition-all duration-300 ease-in-out
        ${sidebarOpen ? 'lg:ml-64' : ''}`}>
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} isSidebarOpen={sidebarOpen} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 relative">
          <Outlet />
        </main>
      </div>

      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
