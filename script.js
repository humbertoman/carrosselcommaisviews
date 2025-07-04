document.addEventListener("DOMContentLoaded", function() {
    const track = document.querySelector('.carousel-track');
    const cards = Array.from(track.children);
    const nextButton = document.querySelector('.carousel-button.next');
    const prevButton = document.querySelector('.carousel-button.prev');

    // --- Lógica para o carrossel infinito ---

    // 1. Clonar os cards para criar o efeito de loop
    const cardsToClone = cards.length; 

    // Clona os últimos e coloca no início
    for (let i = cardsToClone - 1; i >= 0; i--) {
        track.prepend(cards[i].cloneNode(true));
    }
    // Clona os primeiros e coloca no fim
    for (let i = 0; i < cardsToClone; i++) {
        track.append(cards[i].cloneNode(true));
    }

    let currentIndex = cardsToClone;
    let isMoving = false;

    // 2. Posicionar o carrossel no início dos cards "reais"
    function setInitialPosition() {
        const cardWidth = cards[0].getBoundingClientRect().width;
        const gap = 20; // Deve ser o mesmo do CSS
        const initialOffset = (cardWidth + gap) * currentIndex;
        track.style.transition = 'none'; // Sem animação para a posição inicial
        track.style.transform = `translateX(-${initialOffset}px)`;
    }
    
    // Pequeno delay para garantir que o layout foi calculado
    setTimeout(setInitialPosition, 50);

    // 3. Funções de movimento
    function move(direction) {
        if (isMoving) return;
        isMoving = true;

        const cardWidth = cards[0].getBoundingClientRect().width;
        const gap = 20;
        
        currentIndex += direction;
        const offset = (cardWidth + gap) * currentIndex;
        
        track.style.transition = 'transform 0.5s ease-in-out';
        track.style.transform = `translateX(-${offset}px)`;
    }

    // 4. Resetar a posição quando a animação termina
    track.addEventListener('transitionend', () => {
        isMoving = false;
        
        // Se chegamos nos clones do final, pulamos para o início real
        if (currentIndex >= cardsToClone * 2) {
            currentIndex = cardsToClone;
            track.style.transition = 'none';
            setInitialPosition();
        }
        
        // Se chegamos nos clones do início, pulamos para o final real
        if (currentIndex <= 0) {
            currentIndex = cardsToClone;
            track.style.transition = 'none';
            setInitialPosition();
        }
    });

    // 5. Event Listeners para os botões
    nextButton.addEventListener('click', () => move(1));
    prevButton.addEventListener('click', () => move(-1));

    // Recalcular em caso de redimensionamento da janela
    window.addEventListener('resize', () => {
        setTimeout(setInitialPosition, 50);
    });
});
