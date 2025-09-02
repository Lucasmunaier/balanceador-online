import React from 'react';
import Footer from './components/Footer';

const AboutPage: React.FC = () => {
    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto text-slate-300">
                <header className="text-center mb-12">
                     <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
                        Sobre o Sortear Times
                    </h1>
                    <p className="mt-4 text-lg text-slate-400">Nossa missão é tornar o esporte amador mais justo e divertido.</p>
                </header>
                
                <div className="prose prose-invert prose-lg max-w-none bg-slate-800/50 p-8 rounded-xl border border-slate-700">
                    <p>
                        O Sortear Times nasceu daquela clássica situação vivida por todo organizador de "pelada" ou jogo amistoso: a dificuldade de montar times equilibrados de forma rápida e justa. Quem nunca passou minutos preciosos discutindo quem joga em qual time, tentando balancear os "craques" e os "iniciantes"?
                    </p>
                    <p>
                        Nossa ferramenta foi criada para resolver exatamente esse problema. Com um algoritmo de distribuição inteligente, o app leva em consideração a nota de habilidade de cada jogador, garantindo que as equipes sejam o mais equilibradas possível. O resultado? Partidas mais competitivas, menos discussões e mais tempo jogando.
                    </p>
                    <h3>Nossos Recursos</h3>
                    <ul>
                        <li><strong>Balanceamento por Habilidade:</strong> O coração do nosso app. Dê uma nota de 1 a 5 para cada jogador e deixe que a mágica aconteça.</li>
                        <li><strong>IA para Importação:</strong> Poupe tempo e evite erros de digitação. Apenas cole a lista do seu grupo e nossa Inteligência Artificial extrai os nomes para você.</li>
                        <li><strong>Ferramentas Adicionais:</strong> Além da montagem de times, oferecemos um temporizador para controlar a duração das partidas e uma ferramenta de sorteio ("Sorte na Tampinha") para resolver qualquer disputa.</li>
                    </ul>
                    <p>
                        Somos apaixonados por esporte e tecnologia, e acreditamos que podemos usar o poder da programação para aprimorar nossas experiências de lazer. O Sortear Times é uma ferramenta feita por quem joga, para quem joga.
                    </p>
                     <p>
                        Obrigado por usar nosso app. Esperamos que ele torne seus jogos ainda melhores!
                    </p>
                </div>

                <div className="text-center mt-12">
                     <a
                        href="#/app"
                        className="mt-8 inline-block bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-6 rounded-lg transition-transform duration-200 transform hover:scale-105 shadow-lg text-lg"
                    >
                        Montar meus times agora
                    </a>
                </div>
                <Footer />
            </div>
        </div>
    );
};

export default AboutPage;
