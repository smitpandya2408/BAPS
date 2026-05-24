import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, FilePlus, LogOut, UserCircle, Menu, X, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.jpeg';
import bg from '../assets/bg.png';

const Layout = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { logout, user, hasPermission } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { name: 'ડેશબોર્ડ', path: '/', icon: <LayoutDashboard size={20} /> },
        ...(hasPermission('canAdd') ? [{ name: 'નવું ફોર્મ', path: '/new-form', icon: <FilePlus size={20} /> }] : []),
        ...(user?.role === 'admin' ? [{ name: 'યુઝર મેનેજમેન્ટ', path: '/users', icon: <Users size={20} /> }] : []),
    ];

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 md:hidden"
                    onClick={toggleMenu}
                ></div>
            )}

            {/* Sidebar */}
            <div className={`
                fixed inset-y-0 left-0 z-30 w-72 bg-saffron text-white flex flex-col no-print shadow-2xl transition-transform duration-300 transform
                ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}
                md:relative md:translate-x-0 md:flex
            `}>
                <div className="p-0 border-b border-saffron-dark bg-white flex items-center justify-center overflow-hidden relative min-h-[80px]">
                    <img src={logo} alt="BAPS Logo" className="w-full h-full object-cover" />
                    <button className="md:hidden absolute right-4 top-4 bg-black/20 p-1 rounded-full text-white" onClick={toggleMenu}>
                        <X size={20} />
                    </button>
                </div>
                <nav className="flex-1 mt-6 overflow-y-auto">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setIsMenuOpen(false)}
                            className={`flex items-center gap-4 px-6 py-4 mx-3 rounded-xl mb-1 transition-all duration-200 ${location.pathname === item.path
                                ? 'bg-white/20 shadow-lg border-l-4 border-white'
                                : 'hover:bg-white/10'
                                }`}
                        >
                            {item.icon}
                            <span className="font-bold tracking-wide">{item.name}</span>
                        </Link>
                    ))}
                </nav>
                <div className="p-4 border-t border-saffron-dark">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-4 px-6 py-4 w-full hover:bg-white/10 rounded-2xl transition-all font-bold text-white/90"
                    >
                        <LogOut size={20} />
                        <span>લોગઆઉટ</span>
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 relative">
                {/* Background Image with Transparency */}
                <div
                    className="absolute inset-0 pointer-events-none opacity-[0.85] z-0"
                    style={{
                        backgroundImage: `url(${bg})`,
                        backgroundSize: '800px',
                        backgroundAttachment: 'fixed',
                        backgroundRepeat: 'repeat'
                    }}
                />

                {/* Navbar */}
                <header className="bg-white/80 backdrop-blur-md shadow-md h-20 flex items-center justify-between px-4 md:px-10 no-print z-10 shrink-0">
                    <div className="flex items-center gap-4">
                        <button
                            className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                            onClick={toggleMenu}
                        >
                            <Menu size={28} />
                        </button>
                        <h2 className="text-xl md:text-2xl font-extrabold text-gray-800 truncate">
                            {navItems.find(i => i.path === location.pathname)?.name || 'વિગતો'}
                        </h2>
                    </div>

                    <div className="flex items-center gap-2 md:gap-4 shrink-0">
                        <div className="hidden sm:flex flex-col items-end mr-2">
                            <span className="text-sm font-bold text-gray-900">{user?.name || user?.email?.split('@')[0]}</span>
                            <span className="text-[10px] text-saffron-dark font-bold uppercase tracking-widest">
                                {user?.role === 'admin' ? 'Administrator' : 'User'}
                            </span>
                        </div>
                        <div className="p-1 rounded-full border-2 border-saffron/20 shadow-sm bg-primary-50">
                            <UserCircle size={32} className="text-saffron-dark" />
                        </div>
                    </div>
                </header>

                {/* Content Container */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-8 relative z-1">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;
