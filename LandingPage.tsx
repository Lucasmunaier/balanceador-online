import React from 'react';
import { SparklesIcon, UserCircleIcon, AiIcon, ClockIcon, PokerChipIcon, UsersIcon } from './components/icons/Icons';
import AdSenseBlock from './components/AdSenseBlock';
import Footer from './components/Footer';

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
    <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 transform transition-transform hover:-translate-y-1">
        <div className="flex items-center gap-4 mb-3">
            <div className="bg-slate-700 p-2 rounded-lg text-teal-400">{icon}</div>
            <h3 className="text-xl font-bold text-slate-100">{title}</h3>
        </div>
        <p className="text-slate-400">{children}</p>
    </div>
);

const LandingPage: React.FC = () => {
    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Hero Section */}
                <section className="text-center py-20">
                    <h1 className="text-4xl sm:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
                        A Ferramenta Definitiva Para Suas Partidas
                    </h1>
                    <p className="mt-4 max-w-2xl mx-auto text-lg sm:text-xl text-slate-400">
                        Crie times justos e equilibrados, importe jogadores com IA, use nosso temporizador e muito mais. Chega de discussões, é hora de jogar!
                    </p>
                    <a
                        href="#/app"
                        className="mt-8 inline-block bg-teal-500 hover:bg-teal-600 text-white font-bold py-4 px-8 rounded-lg transition-transform duration-200 transform hover:scale-105 shadow-lg text-lg"
                    >
                        Começar a Montar Times
                    </a>
                </section>

                {/* AdSense Block */}
                <div className="my-12">
                     <AdSenseBlock adSlot="3839660660" />
                </div>

                {/* Features Section */}
                <section className="py-20">
                    <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-slate-100">Funcionalidades Incríveis</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <FeatureCard icon={<UsersIcon />} title="Criação de Times Equilibrada">
                            Adicione jogadores, defina suas notas de habilidade e nosso algoritmo inteligente cria equipes balanceadas para garantir partidas mais justas e competitivas.
                        </FeatureCard>
                        <FeatureCard icon={<AiIcon className="w-8 h-8 text-teal-400" />} title="Importação com IA">
                            Copie e cole a lista de jogadores do seu grupo de WhatsApp. Nossa IA identifica os nomes e os adiciona para você, poupando seu tempo.
                        </FeatureCard>
                        <FeatureCard icon={<UserCircleIcon />} title="Gerenciamento de Jogadores">
                             Adicione, remova, e edite jogadores com facilidade. Marque quem é goleiro para uma distribuição ainda mais inteligente nos times.
                        </FeatureCard>
                         <FeatureCard icon={<ClockIcon className="w-8 h-8"/>} title="Temporizador Integrado">
                            Controle o tempo de cada partida com nosso temporizador simples e eficaz. Com alerta sonoro e vibração ao final do tempo.
                        </FeatureCard>
                         <FeatureCard icon={<PokerChipIcon className="w-8 h-8 text-blue-500"/>} title="Sorte na Tampinha">
                           Precisa decidir quem entra ou sai? Use nossa ferramenta de sorteio digital para resolver disputas de forma rápida e imparcial.
                        </FeatureCard>
                        <FeatureCard icon={<SparklesIcon className="w-8 h-8" />} title="Resultados Claros e Exportáveis">
                            Visualize os times formados de maneira clara e organizada. Copie e cole os resultados para compartilhar facilmente com todos.
                        </FeatureCard>
                    </div>
                </section>

                <Footer />
            </div>
        </div>
    );
};

export default LandingPage;
