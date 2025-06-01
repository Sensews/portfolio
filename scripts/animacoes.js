// Gerenciador de animações e efeitos visuais
class GerenciadorAnimacoes {
    constructor() {        this.comandosTerminal = [
            'python security_scanner.py --target localhost',
            'java -jar NetworkAnalyzer.jar --scan',
            'git clone https://github.com/joaopedro/projeto-cyber',
            'pip install cryptography pandas numpy',
            'nmap -sT 127.0.0.1',
            'python password_generator.py --length 16',
            'ls -la ~/cybersec-projects/',
            'cat /var/log/security.log | grep "failed"',
            'python hash_analyzer.py --file passwords.txt'
        ];
        
        this.respostasTerminal = [
            'Iniciando scanner de segurança...\n[✓] Porta 80: ABERTA\n[✓] Porta 443: ABERTA\n[!] Porta 22: FECHADA',
            'Analisando rede...\nDispositivos encontrados: 5\nStatus: Rede segura\nRelatório salvo em: ~/reports/network_scan.txt',
            'Cloning into projeto-cyber...\nremote: Counting objects: 127\nReceiving objects: 100% (127/127)\nResolving deltas: 100%',
            'Collecting cryptography...\n✓ Successfully installed cryptography-3.4.8\n✓ Successfully installed pandas-1.5.3\n✓ Successfully installed numpy-1.24.3',
            'Starting Nmap scan...\nHost is up (0.0010s latency)\n80/tcp   open   http\n443/tcp  open   https\nNmap done: 1 IP address scanned',
            'Gerando senha segura...\nSenha gerada: Kp9#mL2$wR8@nQ5!\nForça: MUITO FORTE\nEntropy: 104 bits',
            'total 24\ndrwxr-xr-x  6 joao joao 4096 jun  1 10:30 .\ndrwxr-xr-x 15 joao joao 4096 jun  1 10:25 ..\ndrwxr-xr-x  3 joao joao 4096 mai 28 14:20 password-manager\ndrwxr-xr-x  2 joao joao 4096 mai 25 09:15 network-scanner',
            'mai 28 10:15:23 failed password for user guest\nmai 28 10:15:45 failed password for user admin\nmai 28 10:16:02 failed password for user root\n[3 tentativas de login falharam]',
            'Analisando hashes...\nMD5 detectado: 5d41402abc4b2a76b9719d911017c592\nSHA256 detectado: e3b0c44298fc1c149afbf4c8996fb924\nStatus: 2 hashes analisados com sucesso'
        ];
        
        this.comandoIndex = 0;
        this.inicializarAnimacoes();
    }
    
    inicializarAnimacoes() {
        this.animarTerminal();
        this.observarElementos();
        this.animarEstatisticas();
        this.animarBarrasProgresso();
        this.iniciarEfeitoParticulas();
    }
    
    // Animação do terminal na hero section
    animarTerminal() {
        const elementoComando = document.getElementById('comandoAnimado');
        const elementoResultado = document.getElementById('resultadoComando');
        
        if (!elementoComando || !elementoResultado) return;
        
        const digitarComando = (comando, callback) => {
            elementoComando.textContent = '';
            let i = 0;
            
            const intervalo = setInterval(() => {
                elementoComando.textContent += comando[i];
                i++;
                
                if (i >= comando.length) {
                    clearInterval(intervalo);
                    setTimeout(callback, 1000); // Pausa antes de mostrar resultado
                }
            }, 50); // Velocidade de digitação
        };
        
        const mostrarResultado = (resultado, callback) => {
            elementoResultado.innerHTML = resultado;
            setTimeout(callback, 3000); // Tempo para ler resultado
        };
        
        const proximoComando = () => {
            const comando = this.comandosTerminal[this.comandoIndex];
            const resultado = this.respostasTerminal[this.comandoIndex];
            
            digitarComando(comando, () => {
                mostrarResultado(resultado, () => {
                    this.comandoIndex = (this.comandoIndex + 1) % this.comandosTerminal.length;
                    setTimeout(proximoComando, 1000); // Pausa antes do próximo comando
                });
            });
        };
        
        // Iniciar ciclo de animação
        proximoComando();
    }
    
    // Observer para animações de entrada dos elementos
    observarElementos() {
        const observador = new IntersectionObserver((entradas) => {
            entradas.forEach(entrada => {
                if (entrada.isIntersecting) {
                    entrada.target.classList.add('visivel');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        // Adicionar classe de animação a elementos relevantes
        const elementosAnimados = document.querySelectorAll(
            '.card-habilidade, .card-projeto, .card-perfil, .stat, .titulo-secao'
        );
        
        elementosAnimados.forEach(elemento => {
            elemento.classList.add('animar-entrada');
            observador.observe(elemento);
        });
    }
    
    // Animação das estatísticas numéricas
    animarEstatisticas() {
        const numerosStats = document.querySelectorAll('.stat .numero');
        
        const observadorStats = new IntersectionObserver((entradas) => {
            entradas.forEach(entrada => {
                if (entrada.isIntersecting) {
                    this.animarNumero(entrada.target);
                }
            });
        }, { threshold: 0.5 });
        
        numerosStats.forEach(numero => {
            observadorStats.observe(numero);
        });
    }
    
    // Animar um número específico
    animarNumero(elemento) {
        const valorFinal = parseInt(elemento.dataset.numero);
        const duracao = 2000; // 2 segundos
        const incremento = valorFinal / (duracao / 16); // 60 FPS
        let valorAtual = 0;
        
        const timer = setInterval(() => {
            valorAtual += incremento;
            
            if (valorAtual >= valorFinal) {
                valorAtual = valorFinal;
                clearInterval(timer);
            }
            
            elemento.textContent = Math.floor(valorAtual);
        }, 16);
    }
      // Animação das barras de progresso
    animarBarrasProgresso() {
        const barrasProgresso = document.querySelectorAll('.progresso');
        const barrasProgressoCurso = document.querySelectorAll('.progresso-preenchido');
        
        const observadorBarras = new IntersectionObserver((entradas) => {
            entradas.forEach(entrada => {
                if (entrada.isIntersecting) {
                    const barra = entrada.target;
                    const progresso = barra.dataset.progresso;
                    
                    setTimeout(() => {
                        barra.style.width = progresso + '%';
                    }, 300);
                }
            });
        }, { threshold: 0.5 });
        
        // Observar barras de habilidades
        barrasProgresso.forEach(barra => {
            observadorBarras.observe(barra);
        });
        
        // Observar barras de progresso do curso
        barrasProgressoCurso.forEach(barra => {
            observadorBarras.observe(barra);
        });
    }
    
    // Efeito de partículas flutuantes (opcional)
    iniciarEfeitoParticulas() {
        const heroSection = document.querySelector('.secao-hero');
        if (!heroSection) return;
        
        // Criar partículas flutuantes sutis
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                this.criarParticula(heroSection);
            }, i * 200);
        }
        
        // Recriar partículas periodicamente
        setInterval(() => {
            this.criarParticula(heroSection);
        }, 3000);
    }
    
    // Criar uma partícula individual
    criarParticula(container) {
        const particula = document.createElement('div');
        particula.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: var(--cor-secundaria);
            border-radius: 50%;
            pointer-events: none;
            opacity: 0.6;
            z-index: 1;
        `;
        
        // Posição inicial aleatória
        const x = Math.random() * window.innerWidth;
        const y = window.innerHeight + 10;
        
        particula.style.left = x + 'px';
        particula.style.top = y + 'px';
        
        container.appendChild(particula);
        
        // Animação da partícula
        let posY = y;
        let posX = x;
        let velocidadeY = -(Math.random() * 3 + 1);
        let velocidadeX = (Math.random() - 0.5) * 2;
        let opacidade = 0.6;
        
        const animar = () => {
            posY += velocidadeY;
            posX += velocidadeX;
            opacidade -= 0.01;
            
            particula.style.top = posY + 'px';
            particula.style.left = posX + 'px';
            particula.style.opacity = opacidade;
            
            if (posY > -10 && opacidade > 0) {
                requestAnimationFrame(animar);
            } else {
                particula.remove();
            }
        };
        
        animar();
    }
    
    // Efeito de glitch no texto (para elementos específicos)
    aplicarEfeitoGlitch(elemento) {
        const textoOriginal = elemento.textContent;
        const caracteres = '!@#$%^&*()_+-=[]{}|;:,.<>?';
        let iteracoes = 0;
        
        const intervalo = setInterval(() => {
            elemento.textContent = textoOriginal
                .split('')
                .map((letra, index) => {
                    if (index < iteracoes) {
                        return textoOriginal[index];
                    }
                    return caracteres[Math.floor(Math.random() * caracteres.length)];
                })
                .join('');
            
            if (iteracoes >= textoOriginal.length) {
                clearInterval(intervalo);
            }
            
            iteracoes += 1/3;
        }, 30);
    }
    
    // Adicionar efeito de hover 3D aos cards
    adicionarEfeito3D() {
        const cards = document.querySelectorAll('.card-habilidade, .card-projeto, .card-perfil');
        
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
            });
        });
    }
}

// Classe para efeitos visuais adicionais
class EfeitosVisuais {
    constructor() {
        this.inicializarEfeitos();
    }
    
    inicializarEfeitos() {
        this.adicionarEfeitoRipple();
        this.adicionarEfeitoParallax();
        this.configurarScrollSuave();
    }
    
    // Efeito ripple nos botões
    adicionarEfeitoRipple() {
        const botoes = document.querySelectorAll('.botao-primario, .botao-secundario, .botao-enviar');
        
        botoes.forEach(botao => {
            botao.addEventListener('click', function(e) {
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    left: ${x}px;
                    top: ${y}px;
                    background: rgba(255, 255, 255, 0.3);
                    border-radius: 50%;
                    transform: scale(0);
                    animation: ripple 0.6s linear;
                    pointer-events: none;
                `;
                
                this.style.position = 'relative';
                this.style.overflow = 'hidden';
                this.appendChild(ripple);
                
                setTimeout(() => ripple.remove(), 600);
            });
        });
        
        // Adicionar CSS da animação ripple
        if (!document.querySelector('#ripple-styles')) {
            const style = document.createElement('style');
            style.id = 'ripple-styles';
            style.textContent = `
                @keyframes ripple {
                    to {
                        transform: scale(4);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // Efeito parallax suave
    adicionarEfeitoParallax() {
        const elementosParallax = document.querySelectorAll('.secao-hero::before');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            elementosParallax.forEach(elemento => {
                elemento.style.transform = `translateY(${rate}px)`;
            });
        });
    }
    
    // Configurar scroll suave para navegação
    configurarScrollSuave() {
        const linksNavegacao = document.querySelectorAll('a[href^="#"]');
        
        linksNavegacao.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const headerHeight = document.getElementById('cabecalho').offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    window.animacoes = new GerenciadorAnimacoes();
    window.efeitos = new EfeitosVisuais();
    
    // Adicionar efeito 3D após um pequeno delay
    setTimeout(() => {
        window.animacoes.adicionarEfeito3D();
    }, 1000);
});
