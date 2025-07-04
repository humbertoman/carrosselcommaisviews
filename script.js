document.addEventListener("DOMContentLoaded", function() {
    const container = document.querySelector('.carousel-container');
    const track = document.querySelector('.carousel-track');
    const originalCards = Array.from(track.children);
    const nextButton = document.querySelector('.carousel-button.next');
    const prevButton = document.querySelector('.carousel-button.prev');

    let allCards = [];
    let currentIndex = 0;
    let isMoving = false;
    
    // --- LÓGICA PRINCIPAL ---

    function setupCarousel() {
        // Limpa o track para reconstruir
        track.innerHTML = '';
        
        // Clona os cards para o loop infinito
        const clonesStart = originalCards.slice(-3).map(card => card.cloneNode(true));
        const clonesEnd = originalCards.slice(0, 3).map(card => card.cloneNode(true));
        
        allCards = [...clonesStart, ...originalCards, ...clonesEnd];
        allCards.forEach(card => track.appendChild(card));

        currentIndex = clonesStart.length; // Posição inicial nos cards reais
        
        // Adiciona listeners aos botões
        nextButton.addEventListener('click', () => moveCarousel(1));
        prevButton.addEventListener('click', () => moveCarousel(-1));
        
        // Listener para o final da transição (para o loop infinito)
        track.addEventListener('transitionend', checkInfiniteLoop);

        // Listener para redimensionamento da janela
        window.addEventListener('resize', resizeAndPositionCarousel);

        // Primeira execução
        resizeAndPositionCarousel();
    }

    // Função que CALCULA E APLICA OS TAMANHOS
    function resizeAndPositionCarousel() {
        const containerWidth = container.offsetWidth;
        const numVisible = 3; // Queremos sempre 3 cards visíveis
        const gap = 15; // Espaço entre os cards

        // Calcula a largura exata de cada card para caberem 3 na tela
        const cardWidth = (containerWidth - (gap * (numVisible - 1))) / numVisible;
        
        // Aplica a largura e o gap a todos os cards
        track.style.gap = `${gap}px`;
        allCards.forEach(card => {
            card.style.width = `${cardWidth}px`;
        });

        // Posiciona o carrossel no lugar certo sem animação
        const initialOffset = - (currentIndex * (cardWidth + gap));
        track.style.transition = 'none';
        track.style.transform = `translateX(${initialOffset}px)`;
    }

    function moveCarousel(direction) {
        if (isMoving) return;
        isMoving = true;
        
        currentIndex += direction;
        
        const cardWidth = allCards[0].offsetWidth;
        const gap = parseInt(track.style.gap);
        const offset = - (currentIndex * (cardWidth + gap));
        
        track.style.transition = 'transform 0.5s ease-in-out';
        track.style.transform = `translateX(${offset}px)`;
    }

    function checkInfiniteLoop() {
        isMoving = false;
        const cardWidth = allCards[0].offsetWidth;
        const gap = parseInt(track.style.gap);

        // Se chegou nos clones do fim, salta para o início
        if (currentIndex >= originalCards.length + 3) {
            currentIndex = 3;
            const offset = - (currentIndex * (cardWidth + gap));
            track.style.transition = 'none';
            track.style.transform = `translateX(${offset}px)`;
        }
        // Se chegou nos clones do início, salta para o fim
        if (currentIndex < 3) {
            currentIndex = originalCards.length + 2;
            const offset = - (currentIndex * (cardWidth + gap));
            track.style.transition = 'none';
            track.style.transform = `translateX(${offset}px)`;
        }
    }
    
    // Inicia tudo
    setupCarousel();
});
