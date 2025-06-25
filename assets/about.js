/**
 * About Section - ScrollSmoother Effect
 * Baseado no exemplo do CodePen: https://codepen.io/GreenSock/pen/yyBKVxP
 */

class AboutScrollSmoother {
  constructor(sectionId) {
    this.sectionId = sectionId;
    this.wrapper = null;
    this.content = null;
    this.smoother = null;
    this.skewSetter = null;
    this.clamp = null;
    
    this.init();
  }

  async init() {
    // Aguardar DOM estar pronto
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }

  async loadGSAP() {
    return new Promise((resolve, reject) => {
      if (typeof gsap !== 'undefined') {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js';
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  async loadScrollTrigger() {
    return new Promise((resolve, reject) => {
      if (typeof ScrollTrigger !== 'undefined') {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js';
      script.onload = () => {
        gsap.registerPlugin(ScrollTrigger);
        resolve();
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  async loadScrollSmoother() {
    return new Promise((resolve, reject) => {
      if (typeof ScrollSmoother !== 'undefined') {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollSmoother.min.js';
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  async setup() {
    try {
      // Carregar todas as dependências
      await this.loadGSAP();
      await this.loadScrollTrigger();
      await this.loadScrollSmoother();

      // Aguardar um frame para garantir renderização
      requestAnimationFrame(() => {
        this.initScrollSmoother();
      });

    } catch (error) {
      console.error('Erro ao carregar dependências GSAP:', error);
      this.fallback();
    }
  }

  initScrollSmoother() {
    console.log(`Inicializando About Section ${this.sectionId} com ScrollSmoother`);
    
    this.wrapper = document.getElementById(`wrapper-${this.sectionId}`);
    this.content = document.getElementById(`content-${this.sectionId}`);
    
    if (!this.wrapper || !this.content) {
      console.error('Elementos wrapper ou content não encontrados');
      return;
    }

    try {
      // Obter configurações do elemento
      const section = document.getElementById(`about-${this.sectionId}`);
      const maxSkew = parseInt(section.dataset.maxSkew) || 20;
      const smoothStrength = parseFloat(section.dataset.smoothStrength) || 2;
      const scrollSpeed = parseFloat(section.dataset.scrollSpeed) || 3;
      const skewFactor = parseInt(section.dataset.skewFactor) || 50;

      // Configuração do skew baseado na velocidade (igual ao CodePen)
      this.skewSetter = gsap.quickTo(`#about-${this.sectionId} img`, "skewY");
      this.clamp = gsap.utils.clamp(-maxSkew, maxSkew);

      // Criar ScrollSmoother exatamente como no CodePen
      this.smoother = ScrollSmoother.create({
        wrapper: `#wrapper-${this.sectionId}`,
        content: `#content-${this.sectionId}`,
        smooth: smoothStrength,
        speed: scrollSpeed,
        effects: true,
        onUpdate: (self) => {
          const velocity = self.getVelocity();
          const skewValue = this.clamp(velocity / -skewFactor);
          this.skewSetter(skewValue);
        },
        onStop: () => {
          this.skewSetter(0);
        }
      });

      console.log('ScrollSmoother criado com sucesso:', this.smoother);

      // Animações das imagens (entrada mais suave)
      this.setupImageAnimations();

      // Animação do texto (apenas fade in, sem movimento)
      this.setupTextAnimations();

    } catch (error) {
      console.error('Erro ao inicializar ScrollSmoother:', error);
      this.fallback();
    }
  }
  setupImageAnimations() {
    const images = document.querySelectorAll(`#about-${this.sectionId} img`);
    
    images.forEach((img, index) => {
      // Animação de entrada mais sutil
      gsap.fromTo(img, 
        {
          opacity: 0,
          scale: 0.95
        },
        {
          opacity: 1,
          scale: 1,
          duration: 1.2,
          delay: index * 0.08,
          ease: "power2.out",
          scrollTrigger: {
            trigger: img,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Efeito parallax mais suave baseado no data-speed
      const speed = parseFloat(img.getAttribute('data-speed')) || 1;
      
      // Parallax similar ao CodePen - movimento mais sutil
      gsap.to(img, {
        y: () => {
          const rect = img.getBoundingClientRect();
          const scrollRange = window.innerHeight + rect.height;
          return -(scrollRange * (speed - 1) * 0.5);
        },
        ease: "none",
        scrollTrigger: {
          trigger: img,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
          invalidateOnRefresh: true
        }
      });

      // Hover effect que funciona com GSAP
      img.addEventListener('mouseenter', () => {
        gsap.to(img, {
          scale: 1.1,
          filter: 'brightness(1.1)',
          duration: 0.3,
          ease: "power2.out",
          overwrite: 'auto'
        });
      });

      img.addEventListener('mouseleave', () => {
        gsap.to(img, {
          scale: 1,
          filter: 'brightness(1)',
          duration: 0.3,
          ease: "power2.out",
          overwrite: 'auto'
        });
      });
    });
  }

  setupTextAnimations() {
    // Animação simples do texto - apenas fade in sem movimento
    const textElements = document.querySelectorAll(`#about-${this.sectionId} .text`);
    
    textElements.forEach((text, index) => {
      gsap.fromTo(text,
        {
          opacity: 0
        },
        {
          opacity: 1,
          duration: 1.5,
          delay: index * 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: `#about-${this.sectionId}`,
            start: "top 90%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });
  }

  fallback() {
    console.log('Aplicando fallback básico sem ScrollSmoother');
    
    // Mostrar elementos básicos
    const images = document.querySelectorAll(`#about-${this.sectionId} img`);
    const textElements = document.querySelectorAll(`#about-${this.sectionId} .text`);
    
    images.forEach(img => {
      img.style.opacity = '1';
      img.style.transform = 'none';
    });
    
    textElements.forEach(text => {
      text.style.opacity = '1';
    });
  }

  destroy() {
    if (this.smoother) {
      this.smoother.kill();
    }
    ScrollTrigger.getAll().forEach(trigger => {
      if (trigger.vars.trigger && trigger.vars.trigger.includes(this.sectionId)) {
        trigger.kill();
      }
    });
  }
}

// Função global para inicializar a seção
window.initAboutSection = function(sectionId, config = {}) {
  // Aguardar um pouco para garantir que o DOM está pronto
  setTimeout(() => {
    new AboutScrollSmoother(sectionId);
  }, 100);
};

// Auto-inicialização para seções existentes
document.addEventListener('DOMContentLoaded', function() {
  const aboutSections = document.querySelectorAll('[id^="about-"]');
  aboutSections.forEach(section => {
    const sectionId = section.id.replace('about-', '');
    window.initAboutSection(sectionId);
  });
});
