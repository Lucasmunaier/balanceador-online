import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="border-t border-slate-800 mt-20">
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 text-center text-slate-500">
                <div className="flex justify-center space-x-6 mb-4">
                    <a href="#/app" className="hover:text-teal-400 transition-colors">App</a>
                    <a href="#/about" className="hover:text-teal-400 transition-colors">Sobre</a>
                    <a href="#/contact" className="hover:text-teal-400 transition-colors">Fale Conosco</a>
                </div>
                <p>&copy; {new Date().getFullYear()} Sortear Times. Todos os direitos reservados.</p>
            </div>
        </footer>
    );
};

export default Footer;
