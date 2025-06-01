// Script principal - funcionalidades gerais e coordenação
class PortfolioApp {
    constructor() {
        this.inicializado = false;
        this.inicializar();
    }
    
    // Inicializar aplicação
    inicializar() {
        if (this.inicializado) return;
        
        this.configurarFormularioContato();
        this.configurarNavegacaoMobile();
        this.configurarScrollHeader();
        this.configurarTecladoNavegacao();
        this.adicionarEfeitosPersonalizados();
        
        this.inicializado = true;
        console.log('Portfolio App inicializado com sucesso!');
    }
    
    // Configurar formulário de contato
    configurarFormularioContato() {
        const formulario = document.querySelector('.formulario-contato');
        if (!formulario) return;
        
        formulario.addEventListener('submit', (e) => {
            e.preventDefault();
            this.processarFormularioContato(formulario);
        });
        
        // Validação em tempo real
        const inputs = formulario.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validarCampo(input));
            input.addEventListener('input', () => this.removerErroValidacao(input));
        });
    }
    
    // Processar envio do formulário
    processarFormularioContato(formulario) {
        const dados = new FormData(formulario);
        const dadosObj = Object.fromEntries(dados);
        
        // Validar todos os campos
        const camposValidos = this.validarFormulario(formulario);
        
        if (!camposValidos) {
            this.mostrarNotificacao('Por favor, corrija os erros antes de enviar.', 'erro');
            return;
        }
        
        // Simular envio (aqui você integraria com um backend real)
        this.simularEnvioFormulario(dadosObj);
    }
    
    // Validar formulário completo
    validarFormulario(formulario) {
        const inputs = formulario.querySelectorAll('input, textarea');
        let todosValidos = true;
        
        inputs.forEach(input => {
            if (!this.validarCampo(input)) {
                todosValidos = false;
            }
        });
        
        return todosValidos;
    }
    
    // Validar campo individual
    validarCampo(campo) {
        const valor = campo.value.trim();
        const tipo = campo.type;
        let valido = true;
        let mensagem = '';
        
        // Validações básicas
        if (campo.required && !valor) {
            valido = false;
            mensagem = 'Este campo é obrigatório.';
        } else if (tipo === 'email' && valor) {
            const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!regexEmail.test(valor)) {
                valido = false;
                mensagem = 'Por favor, insira um e-mail válido.';
            }
        } else if (campo.id === 'nome' && valor && valor.length < 2) {
            valido = false;
            mensagem = 'Nome deve ter pelo menos 2 caracteres.';
        } else if (campo.id === 'mensagem' && valor && valor.length < 10) {
            valido = false;
            mensagem = 'Mensagem deve ter pelo menos 10 caracteres.';
        }
        
        if (!valido) {
            this.mostrarErroValidacao(campo, mensagem);
        } else {
            this.removerErroValidacao(campo);
        }
        
        return valido;
    }
    
    // Mostrar erro de validação
    mostrarErroValidacao(campo, mensagem) {
        this.removerErroValidacao(campo);
        
        campo.classList.add('erro');
        
        const divErro = document.createElement('div');
        divErro.className = 'mensagem-erro';
        divErro.textContent = mensagem;
        divErro.style.cssText = `
            color: #ff4757;
            font-size: 0.8rem;
            margin-top: 0.5rem;
            animation: fadeIn 0.3s ease;
        `;
        
        campo.parentNode.appendChild(divErro);
    }
    
    // Remover erro de validação
    removerErroValidacao(campo) {
        campo.classList.remove('erro');
        
        const erroExistente = campo.parentNode.querySelector('.mensagem-erro');
        if (erroExistente) {
            erroExistente.remove();
        }
    }
    
    // Simular envio do formulário
    simularEnvioFormulario(dados) {
        const botaoEnviar = document.querySelector('.botao-enviar');
        const textoOriginal = botaoEnviar.innerHTML;
        
        // Mostrar loading
        botaoEnviar.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        botaoEnviar.disabled = true;
        
        // Simular delay de envio
        setTimeout(() => {
            // Restaurar botão
            botaoEnviar.innerHTML = textoOriginal;
            botaoEnviar.disabled = false;
            
            // Mostrar sucesso
            this.mostrarNotificacao('Mensagem enviada com sucesso!', 'sucesso');
            
            // Limpar formulário
            document.querySelector('.formulario-contato').reset();
            
            // Log dos dados (em produção, enviar para servidor)
            console.log('Dados do formulário:', dados);
        }, 2000);
    }
    
    // Sistema de notificações
    mostrarNotificacao(mensagem, tipo = 'info') {
        const notificacao = document.createElement('div');
        notificacao.className = `notificacao notificacao-${tipo}`;
        notificacao.innerHTML = `
            <div class="conteudo-notificacao">
                <i class="fas ${this.obterIconeNotificacao(tipo)}"></i>
                <span>${mensagem}</span>
                <button class="fechar-notificacao">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        notificacao.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            padding: 1rem;
            border-radius: 8px;
            color: white;
            max-width: 400px;
            animation: slideInRight 0.3s ease;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        `;
        
        // Cores baseadas no tipo
        const cores = {
            sucesso: '#27ae60',
            erro: '#e74c3c',
            info: '#3498db',
            aviso: '#f39c12'
        };
        
        notificacao.style.background = cores[tipo] || cores.info;
        
        document.body.appendChild(notificacao);
        
        // Fechar notificação
        const botaoFechar = notificacao.querySelector('.fechar-notificacao');
        botaoFechar.addEventListener('click', () => {
            this.fecharNotificacao(notificacao);
        });
        
        // Auto-fechar após 5 segundos
        setTimeout(() => {
            if (document.body.contains(notificacao)) {
                this.fecharNotificacao(notificacao);
            }
        }, 5000);
    }
    
    // Obter ícone para notificação
    obterIconeNotificacao(tipo) {
        const icones = {
            sucesso: 'fa-check-circle',
            erro: 'fa-exclamation-circle',
            info: 'fa-info-circle',
            aviso: 'fa-exclamation-triangle'
        };
        return icones[tipo] || icones.info;
    }
    
    // Fechar notificação
    fecharNotificacao(notificacao) {
        notificacao.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (document.body.contains(notificacao)) {
                notificacao.remove();
            }
        }, 300);
    }
    
    // Configurar navegação mobile (se necessário)
    configurarNavegacaoMobile() {
        // Para futuras melhorias de responsividade
        const menuToggle = document.createElement('button');
        menuToggle.className = 'menu-toggle';
        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        menuToggle.style.display = 'none'; // Por enquanto escondido
        
        // Adicionar funcionalidade quando necessário
        window.addEventListener('resize', () => {
            this.ajustarLayoutMobile();
        });
    }
    
    // Ajustar layout para mobile
    ajustarLayoutMobile() {
        const largura = window.innerWidth;
        
        if (largura <= 768) {
            // Ajustes específicos para mobile
            document.body.classList.add('mobile');
        } else {
            document.body.classList.remove('mobile');
        }
    }
    
    // Configurar comportamento do header no scroll
    configurarScrollHeader() {
        let ultimoScroll = 0;
        const header = document.getElementById('cabecalho');
        
        window.addEventListener('scroll', () => {
            const scrollAtual = window.pageYOffset;
            
            if (scrollAtual > ultimoScroll && scrollAtual > 100) {
                // Scrolling down - esconder header
                header.style.transform = 'translateY(-100%)';
            } else {
                // Scrolling up - mostrar header
                header.style.transform = 'translateY(0)';
            }
            
            // Adicionar classe quando scrolled
            if (scrollAtual > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            ultimoScroll = scrollAtual;
        });
    }
    
    // Configurar navegação por teclado
    configurarTecladoNavegacao() {
        document.addEventListener('keydown', (e) => {
            // ESC para fechar modal
            if (e.key === 'Escape') {
                const modal = document.querySelector('.modal.ativo');
                if (modal) {
                    modal.classList.remove('ativo');
                }
            }
            
            // Enter para ativar elementos focados
            if (e.key === 'Enter') {
                const elementoFocado = document.activeElement;
                if (elementoFocado.classList.contains('botao-configuracoes')) {
                    elementoFocado.click();
                }
            }
        });
    }
    
    // Efeitos personalizados adicionais
    adicionarEfeitosPersonalizados() {
        // Adicionar cursor customizado em elementos interativos
        const elementosInterativos = document.querySelectorAll(
            'button, a, .card-habilidade, .card-projeto, .cor-opcao'
        );
        
        elementosInterativos.forEach(elemento => {
            elemento.addEventListener('mouseenter', () => {
                document.body.style.cursor = 'pointer';
            });
            
            elemento.addEventListener('mouseleave', () => {
                document.body.style.cursor = 'default';
            });
        });
        
        // Efeito de loading na página
        this.adicionarLoadingInicial();
    }
    
    // Loading inicial da página
    adicionarLoadingInicial() {
        // Criar overlay de loading
        const loading = document.createElement('div');
        loading.id = 'loading-inicial';
        loading.innerHTML = `
            <div class="loading-content">
                <div class="logo-loading">
                    <i class="fas fa-shield-alt"></i>
                </div>
                <div class="loading-text">CyberSec</div>
                <div class="loading-bar">
                    <div class="loading-progress"></div>
                </div>
            </div>
        `;
        
        loading.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: var(--cor-fundo);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            transition: opacity 0.5s ease;
        `;
        
        document.body.appendChild(loading);
        
        // Simular carregamento
        setTimeout(() => {
            loading.style.opacity = '0';
            setTimeout(() => {
                loading.remove();
            }, 500);
        }, 1500);
    }
    
    // Método utilitário para debug
    debug(mensagem, dados = null) {
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            console.log(`[Portfolio Debug] ${mensagem}`, dados || '');
        }
    }
}

// Adicionar estilos CSS dinâmicos necessários
function adicionarEstilosDinamicos() {
    const style = document.createElement('style');
    style.textContent = `
        /* Estilos para notificações */
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        .conteudo-notificacao {
            display: flex;
            align-items: center;
            gap: 1rem;
        }
        
        .fechar-notificacao {
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            margin-left: auto;
            opacity: 0.8;
            transition: opacity 0.2s;
        }
        
        .fechar-notificacao:hover {
            opacity: 1;
        }
        
        /* Estilos para campos com erro */
        .grupo-input input.erro,
        .grupo-input textarea.erro {
            border-color: #ff4757;
            box-shadow: 0 0 10px rgba(255, 71, 87, 0.3);
        }
        
        /* Header quando scrolled */
        #cabecalho.scrolled {
            background: rgba(15, 15, 15, 0.98);
            backdrop-filter: blur(20px);
            box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
        }
        
        /* Loading inicial */
        .loading-content {
            text-align: center;
            color: var(--cor-secundaria);
        }
        
        .logo-loading {
            font-size: 4rem;
            margin-bottom: 1rem;
            animation: pulse-glow 2s infinite;
        }
        
        .loading-text {
            font-family: var(--fonte-primaria);
            font-size: 2rem;
            font-weight: 700;
            margin-bottom: 2rem;
        }
        
        .loading-bar {
            width: 200px;
            height: 4px;
            background: var(--cor-borda);
            border-radius: 2px;
            overflow: hidden;
            margin: 0 auto;
        }
        
        .loading-progress {
            width: 100%;
            height: 100%;
            background: var(--gradiente-secundario);
            border-radius: 2px;
            animation: loading-progress 1.5s ease-in-out infinite;
        }
        
        @keyframes loading-progress {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
        }
        
        /* Ajustes para mobile */
        @media (max-width: 768px) {
            .notificacao {
                right: 10px;
                left: 10px;
                max-width: none;
            }
        }
    `;
    
    document.head.appendChild(style);
}

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    adicionarEstilosDinamicos();
    window.portfolioApp = new PortfolioApp();
    
    // Ajustar layout inicial
    window.portfolioApp.ajustarLayoutMobile();
});
