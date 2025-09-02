import React from 'react';
import Footer from './components/Footer';

const ContactPage: React.FC = () => {
    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="max-w-2xl mx-auto text-slate-300">
                 <header className="text-center mb-12">
                     <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
                        Fale Conosco
                    </h1>
                    <p className="mt-4 text-lg text-slate-400">Adoramos ouvir suas sugestões e feedbacks!</p>
                </header>

                <div className="bg-slate-800/50 p-8 rounded-xl border border-slate-700 text-center">
                    <p className="text-lg mb-4">
                        Tem alguma dúvida, sugestão de melhoria ou encontrou algum problema? Quer fazer uma parceria ou anunciar conosco?
                    </p>
                    <p className="text-lg">
                        A melhor forma de entrar em contato é através do nosso e-mail:
                    </p>
                    <a 
                        href="mailto:contato@sorteartimes.com"
                        className="mt-4 inline-block text-xl font-bold text-teal-400 hover:text-teal-300 transition-colors break-all"
                    >
                        munaierapp@gmail.com
                    </a>
                     <p className="mt-6 text-slate-400">
                        Nós lemos todas as mensagens e tentamos responder o mais rápido possível. Seu feedback é muito importante para nós!
                    </p>
                </div>
                <Footer />
            </div>
        </div>
    );
};

export default ContactPage;
