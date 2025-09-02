import React from 'react';

const Navbar: React.FC = () => {
    return (
        <header className="bg-slate-900/80 backdrop-blur-sm sticky top-0 z-40 border-b border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <a href="#/" className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
                        Sortear Times
                    </a>
                    <div className="hidden sm:flex items-center space-x-6 text-sm font-medium text-slate-300">
                        <a href="#/app" className="hover:text-teal-400 transition-colors">Ir para o App</a>
                        <a href="#/about" className="hover:text-teal-400 transition-colors">Sobre</a>
                        <a href="#/contact" className="hover:text-teal-400 transition-colors">Fale Conosco</a>
                    </div>
                    <div className="sm:hidden">
                       <a href="#/app" className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded-lg text-sm transition-colors">App</a>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
