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
    const scrollWrapper = document.querySelector(".cards-scroll-wrapper");
    const cardsContainer = document.querySelector(".cards-container");
    const cards = gsap.utils.toArray(".card"); // Usar gsap.utils.toArray para melhor integração com GSAP
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
    
    // Configuração inicial - garantir visibilidade dos elementos
    gsap.set(title, { xPercent: 100 }); // Título fora da tela (à direita)
    gsap.set(cardsContainer, { 
      opacity: 1,
      visibility: "visible",
      clearProps: "transform" // Limpar transformações anteriores
    });
    
    // Garantir que imagens dos cards sejam visíveis
    gsap.utils.toArray(".card-image").forEach(img => {
      gsap.set(img, { 
        opacity: 1, 
        visibility: "visible", 
        zIndex: 10,
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        objectFit: "cover"
      });
    });
    
    // Calcular a largura total de rolagem com precisão (importante para sites responsivos)
    let totalCardsWidth = 0;
    const cardGap = parseFloat(window.getComputedStyle(cardsContainer).columnGap || "0");
    
    cards.forEach((card, index) => {
      const cardWidth = card.offsetWidth;
      totalCardsWidth += cardWidth;
      
      // Adicionar o gap entre os cards (exceto o último card)
      if (index < cards.length - 1) {
        totalCardsWidth += cardGap;
      }
      
      // Logging para debug
      console.log(`Card ${index+1}: Width=${cardWidth}px, Running Total=${totalCardsWidth}px`);
    });
    
    // Largura disponível na janela
    const containerWidth = cardsContainer.offsetWidth;
    const scrollDistance = Math.max(totalCardsWidth - containerWidth + 100, 0); // +100px para garantir scroll completo
    
    console.log("Largura total dos cards:", totalCardsWidth, 
                "Largura do container:", containerWidth, 
                "Distância de rolagem:", scrollDistance);
    
    // Se a largura total não for suficiente para rolar, ajustar o espaçamento
    if (scrollDistance < 200 && cards.length > 1) {
      const extraGap = Math.ceil((200 - scrollDistance) / (cards.length - 1));
      cards.forEach((card, index) => {
        if (index < cards.length - 1) {
          card.style.marginRight = extraGap + "px";
        }
      });
      console.log("Ajustando espaçamento entre cards para garantir rolagem suficiente");
      
      // Recalcular a largura total depois dos ajustes
      totalCardsWidth = 0;
      cards.forEach((card, index) => {
        totalCardsWidth += card.offsetWidth;
        if (index < cards.length - 1) {
          totalCardsWidth += extraGap;
        }
      });
      
      console.log("Nova largura total após ajustes:", totalCardsWidth);
    }
    
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
        markers: true // Manter para debugging, remover em produção      }
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
    
    // Animar cards com imagens para garantir visibilidade
    gsap.utils.toArray(".card-with-image").forEach(card => {
      gsap.set(card, { 
        backgroundColor: "transparent", 
        autoAlpha: 1 
      });
      
      // Se houver imagens dentro do card, garantir que estejam visíveis
      const img = card.querySelector(".card-image");
      if (img) {
        gsap.set(img, { autoAlpha: 1, zIndex: 10 });
      }
      
      // Remover classes de gradiente
      ["gradient-0", "gradient-1", "gradient-2", "gradient-3", "gradient-4"].forEach(cls => {
        card.classList.remove(cls);
      });
    });
    
    // Ajustar quando a janela muda de tamanho ou após imagens carregarem
    window.addEventListener("resize", () => {
      ScrollTrigger.refresh(true);
    });
    
    // Refresh adicional após todas as imagens carregarem
    window.addEventListener("load", () => {
      // Pequeno atraso para garantir que tudo esteja renderizado
      setTimeout(() => {
        ScrollTrigger.refresh(true);
        console.log("ScrollTrigger refresh após load completo");
      }, 500);
    });
    
    // Debug para ajudar a identificar problemas
    console.group("Configuração da animação horizontal");
    console.log("Cards encontrados:", cards.length);
    console.log("Largura total para rolagem:", totalCardsWidth + "px");
    console.log("Distância de scroll:", scrollDistance + "px");
    console.log("Timeline criada:", !!tl);
    console.groupEnd();
    
    console.log("Animação configurada com sucesso");
  }
  
  // Iniciar animação com um pequeno atraso para garantir que todos os recursos estejam carregados
  // usando uma abordagem mais robusta com verificação de carregamento
  if (document.readyState === "complete" || document.readyState === "interactive") {
    setTimeout(initAnimation, 300);
  } else {
    document.addEventListener("DOMContentLoaded", () => setTimeout(initAnimation, 300));
  }
});
