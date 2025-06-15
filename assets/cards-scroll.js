/* 
  Cards Horizontal Scroll Animation
  Baseado no exemplo do Codepen: https://codepen.io/GreenSock/pen/yyBKVxP
  Adaptado para funcionar dentro de um layout completo de site com header e outras seções
*/

// Esperar por GSAP e ScrollTrigger
window.addEventListener("DOMContentLoaded", () => {
  // Função para inicializar quando GSAP estiver carregado
  function initAnimation() {
    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
      // Se GSAP ainda não estiver carregado, tenta novamente em 100ms
      console.log("Esperando GSAP carregar...");
      setTimeout(initAnimation, 100);
      return;
    }
    
    console.log("GSAP e ScrollTrigger carregados, inicializando animação");
    
    // Registrar o plugin ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);
    
    // Elementos principais
    const cardsContainer = document.querySelector(".cards-container");
    const cards = document.querySelectorAll(".card"); // Usando querySelectorAll em vez de gsap.utils.toArray
    const title = document.querySelector(".title-container");
    const cardsSection = document.querySelector(".cards-section");
    
    // Verificar se os elementos existem
    if (!cardsContainer || !title || !cardsSection || cards.length === 0) {
      console.error("Elementos necessários não encontrados:", {
        cardsContainer: !!cardsContainer,
        title: !!title,
        cardsSection: !!cardsSection,
        cardsLength: cards.length
      });
      return;
    }
    
    console.log("Todos os elementos encontrados, configurando animação");
    
    // Calcular altura do header para ajustar o ponto de início da animação
    const header = document.querySelector("header") || document.getElementById("header-component") || document.querySelector(".header-section");
    const headerHeight = header ? header.offsetHeight : 0;
    
    // Configuração inicial    gsap.set(title, { xPercent: 100 }); // Título fora da tela (à direita)
    gsap.set(cardsContainer, { 
      autoAlpha: 1 // Tornar visível
    });
    
    // Calcular a largura total de rolagem (importante para sites responsivos)
    let totalCardsWidth = 0;
    cards.forEach(card => {
      const style = window.getComputedStyle(card);
      const marginRight = parseInt(style.marginRight);
      totalCardsWidth += card.offsetWidth + (isNaN(marginRight) ? 0 : marginRight);
    });
    
    // Largura disponível na janela
    const windowWidth = window.innerWidth;
    
    // Calcular a distância que precisamos rolar horizontalmente
    const scrollDistance = Math.max(totalCardsWidth - windowWidth, 0);
    
    console.log("Largura total dos cards:", totalCardsWidth, "Largura da janela:", windowWidth, "Distância de rolagem:", scrollDistance);
    
    // Se a largura total não for suficiente para rolar, ajustar o espaçamento
    if (scrollDistance < 100 && cards.length > 1) {
      const extraGap = Math.ceil((100 - scrollDistance) / (cards.length - 1));
      cards.forEach((card, index) => {
        if (index < cards.length - 1) {
          card.style.marginRight = extraGap + "px";
        }
      });
      console.log("Ajustando espaçamento entre cards para garantir rolagem suficiente");
    }
    
    // Verificar novamente a largura total depois dos ajustes
    totalCardsWidth = 0;
    cards.forEach(card => {
      const style = window.getComputedStyle(card);
      const marginRight = parseInt(style.marginRight);
      totalCardsWidth += card.offsetWidth + (isNaN(marginRight) ? 0 : marginRight);
    });
    
    // Criar a animação com ajustes para o layout do site
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: cardsSection,
        start: `top-=${headerHeight}px top`, // Ajustar para compensar a altura do header
        end: () => `+=${totalCardsWidth}`, // Usar a largura total para determinar o fim
        scrub: 1, // Suavizar a animação com o scroll
        pin: true, // Fixar a seção durante a animação
        pinSpacing: true, // Garantir espaço adequado
        anticipatePin: 1, // Melhorar desempenho
        invalidateOnRefresh: true, // Recalcular em caso de mudança de tamanho
        onEnter: () => console.log("ScrollTrigger: onEnter"),
        onLeave: () => console.log("ScrollTrigger: onLeave"),
        onEnterBack: () => console.log("ScrollTrigger: onEnterBack"),
        onLeaveBack: () => console.log("ScrollTrigger: onLeaveBack"),
        markers: true // REMOVER EM PRODUÇÃO
      }
    });
    
    // Animação de rolagem horizontal
    tl.to(cardsContainer, {
      x: () => -scrollDistance,
      ease: "none",
      duration: 1
    });
    
    // Animação do título ao mesmo tempo
    tl.to(title, {
      xPercent: 0,
      ease: "power2.inOut",
      duration: 0.5
    }, "<");
    
    // Ajustar quando a janela muda de tamanho
    window.addEventListener("resize", () => {
      ScrollTrigger.refresh(true);
    });
    
    console.log("Animação configurada com sucesso");
  }
  
  // Iniciar animação com um pequeno atraso para garantir que todos os recursos estejam carregados
  setTimeout(initAnimation, 300);
});
