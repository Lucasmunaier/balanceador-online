import React, { useState, useEffect } from 'react';
import LandingPage from './LandingPage';
import TeamSorterApp from './TeamSorterApp';
import AboutPage from './AboutPage';
import ContactPage from './ContactPage';
import Navbar from './components/Navbar';

const App: React.FC = () => {
    const [route, setRoute] = useState(window.location.hash || '#/');

    useEffect(() => {
        const handleHashChange = () => {
            setRoute(window.location.hash || '#/');
            window.scrollTo(0, 0); // Scroll to top on page change
        };

        window.addEventListener('hashchange', handleHashChange);
        return () => {
            window.removeEventListener('hashchange', handleHashChange);
        };
    }, []);

    let pageComponent;
    switch (route) {
        case '#/app':
            pageComponent = <TeamSorterApp />;
            break;
        case '#/about':
            pageComponent = <AboutPage />;
            break;
        case '#/contact':
            pageComponent = <ContactPage />;
            break;
        default:
            pageComponent = <LandingPage />;
            break;
    }

    // The main app component has its own header, so we don't show the global navbar there.
    const showNavbar = route !== '#/app';

    return (
        <div className="bg-slate-900 text-slate-100 font-sans">
            {showNavbar && <Navbar />}
            <main>
                {pageComponent}
            </main>
        </div>
    );
};

export default App;
