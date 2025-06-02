// Configurações globais e gerenciamento de temas
class GerenciadorConfiguracoes {
    constructor() {
        this.configuracoes = {
            tema: 'escuro',
            corSecundaria: '#00ff88',
            idioma: 'pt'
        };
        
        this.carregarConfiguracoes();
        this.inicializarEventos();
        this.aplicarConfiguracoes();
    }
    
    // Carrega configurações do localStorage
    carregarConfiguracoes() {
        const configSalvas = localStorage.getItem('portfolioConfiguracoes');
        if (configSalvas) {
            this.configuracoes = { ...this.configuracoes, ...JSON.parse(configSalvas) };
        }
    }
    
    // Salva configurações no localStorage
    salvarConfiguracoes() {
        localStorage.setItem('portfolioConfiguracoes', JSON.stringify(this.configuracoes));
    }
    
    // Inicializa eventos dos controles do modal
    inicializarEventos() {
        // Botão de abrir configurações
        const botaoConfig = document.getElementById('botaoConfig');
        const modal = document.getElementById('modalConfiguracoes');
        const fecharModal = document.getElementById('fecharModal');
        
        botaoConfig.addEventListener('click', () => {
            modal.classList.add('ativo');
        });
        
        // Fechar modal
        fecharModal.addEventListener('click', () => {
            modal.classList.remove('ativo');
        });
        
        // Fechar modal clicando fora
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('ativo');
            }
        });
        
        // Eventos dos botões de tema
        const botoesTema = document.querySelectorAll('.tema-botao');
        botoesTema.forEach(botao => {
            botao.addEventListener('click', () => {
                this.alterarTema(botao.dataset.tema);
                this.atualizarBotoesAtivos('.tema-botao', botao);
            });
        });
        
        // Eventos das cores secundárias
        const opcoesCor = document.querySelectorAll('.cor-opcao');
        opcoesCor.forEach(opcao => {
            opcao.addEventListener('click', () => {
                this.alterarCorSecundaria(opcao.dataset.cor);
                this.atualizarBotoesAtivos('.cor-opcao', opcao);
            });
        });
        
        // Eventos dos botões de idioma
        const botoesIdioma = document.querySelectorAll('.idioma-botao');
        botoesIdioma.forEach(botao => {
            botao.addEventListener('click', () => {
                this.alterarIdioma(botao.dataset.idioma);
                this.atualizarBotoesAtivos('.idioma-botao', botao);
            });
        });
    }
    
    // Atualiza botões ativos visualmente
    atualizarBotoesAtivos(seletor, botaoAtivo) {
        document.querySelectorAll(seletor).forEach(b => b.classList.remove('ativo', 'ativa'));
        botaoAtivo.classList.add(seletor.includes('cor') ? 'ativa' : 'ativo');
    }
    
    // Altera o tema da aplicação
    alterarTema(novoTema) {
        this.configuracoes.tema = novoTema;
        document.body.setAttribute('data-tema', novoTema);
        this.salvarConfiguracoes();
        
        // Log para debug
        console.log(`Tema alterado para: ${novoTema}`);
    }
      // Altera a cor secundária
    alterarCorSecundaria(novaCor) {
        this.configuracoes.corSecundaria = novaCor;
        
        // Cor principal
        document.documentElement.style.setProperty('--cor-secundaria', novaCor);
        
        // Converter cor para RGB para uso em transparências
        const sombra = novaCor.replace('#', '').match(/.{2}/g);
        const rgb = sombra.map(x => parseInt(x, 16)).join(', ');
        document.documentElement.style.setProperty('--cor-secundaria-rgb', rgb);
        
        // Gerar variações da cor para gradientes
        const corMaisEscura = this.ajustarCor(novaCor, -20);
        const corMaisClara = this.ajustarCor(novaCor, 20);
        
        // Atualizar gradientes
        document.documentElement.style.setProperty('--gradiente-secundario', `linear-gradient(135deg, ${novaCor}, ${corMaisEscura})`);
        document.documentElement.style.setProperty('--gradiente-hover', `linear-gradient(135deg, ${corMaisClara}, ${novaCor})`);
        
        // Atualizar sombras e glows
        document.documentElement.style.setProperty('--cor-shadow', `rgba(${rgb}, 0.3)`);
        document.documentElement.style.setProperty('--cor-glow', `rgba(${rgb}, 0.5)`);
        
        this.salvarConfiguracoes();
        this.atualizarInterfaceControles();
        
        console.log(`Cor secundária alterada para: ${novaCor}`);
    }
    
    // Altera o idioma da aplicação
    alterarIdioma(novoIdioma) {
        this.configuracoes.idioma = novoIdioma;
        this.aplicarTraducoes(novoIdioma);
        this.salvarConfiguracoes();
        
        console.log(`Idioma alterado para: ${novoIdioma}`);
    }
    
    // Aplica todas as configurações salvas
    aplicarConfiguracoes() {
        // Aplicar tema
        document.body.setAttribute('data-tema', this.configuracoes.tema);
        
        // Aplicar cor secundária
        this.alterarCorSecundaria(this.configuracoes.corSecundaria);
        
        // Aplicar idioma
        this.aplicarTraducoes(this.configuracoes.idioma);
        
        // Atualizar interface dos controles
        this.atualizarInterfaceControles();
    }
    
    // Atualiza a interface dos controles baseado nas configurações
    atualizarInterfaceControles() {
        // Atualizar botão de tema ativo
        const botaoTemaAtivo = document.querySelector(`[data-tema="${this.configuracoes.tema}"]`);
        if (botaoTemaAtivo) {
            this.atualizarBotoesAtivos('.tema-botao', botaoTemaAtivo);
        }
        
        // Atualizar cor ativa
        const corAtiva = document.querySelector(`[data-cor="${this.configuracoes.corSecundaria}"]`);
        if (corAtiva) {
            this.atualizarBotoesAtivos('.cor-opcao', corAtiva);
        }
        
        // Atualizar idioma ativo
        const idiomaAtivo = document.querySelector(`[data-idioma="${this.configuracoes.idioma}"]`);
        if (idiomaAtivo) {
            this.atualizarBotoesAtivos('.idioma-botao', idiomaAtivo);
        }
        
        // Definir cores das opções
        document.querySelectorAll('.cor-opcao').forEach(opcao => {
            opcao.style.backgroundColor = opcao.dataset.cor;
        });
    }
    
    // Aplica traduções baseado no idioma selecionado
    aplicarTraducoes(idioma) {
        document.querySelectorAll('[data-pt]').forEach(elemento => {
            const textoTraduzido = elemento.getAttribute(`data-${idioma}`);
            if (textoTraduzido) {
                elemento.textContent = textoTraduzido;
            }
        });
        
        // Atualizar placeholder dos inputs se necessário
        const tradutores = {
            pt: {
                nome: 'Nome',
                email: 'E-mail',
                mensagem: 'Mensagem'
            },
            en: {
                nome: 'Name',
                email: 'E-mail',
                mensagem: 'Message'
            }
        };
        
        Object.keys(tradutores[idioma]).forEach(key => {
            const input = document.getElementById(key);
            if (input) {
                const label = input.nextElementSibling;
                if (label) {
                    label.textContent = tradutores[idioma][key];
                }
            }
        });
    }
    
    // Função auxiliar para ajustar brightness de uma cor hex
    ajustarCor(cor, quantidade) {
        const num = parseInt(cor.replace('#', ''), 16);
        const amt = Math.round(2.55 * quantidade);
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;
        
        return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255))
            .toString(16).slice(1);
    }
}

// Inicializar gerenciador quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    window.configuracoes = new GerenciadorConfiguracoes();
});
