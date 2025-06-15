# Tema Shopify para Crowzy-Company

Este repositório contém uma implementação de tema Shopify para a Crowzy-Company. O tema oferece uma solução completa de loja virtual com seções personalizáveis, blocos, templates e recursos para criar uma experiência de compra única.

## Estrutura

```
├── README.md
├── assets/           # JavaScript, CSS e outros recursos estáticos
├── blocks/           # Blocos de tema reutilizáveis
├── config/           # Arquivos de configuração do tema
├── layout/           # Templates de layout do tema
├── locales/          # Arquivos de tradução para múltiplos idiomas
├── sections/         # Seções do tema
├── snippets/         # Trechos de código reutilizáveis
└── templates/        # Templates de página
```

## Funcionalidades

- Design responsivo
- Suporte a múltiplos idiomas (Inglês, Espanhol, Português, Italiano, Turco)
- Funcionalidade de gaveta de carrinho
- Facetas e filtragem personalizada de produtos
- Exibição dinâmica de coleções
- Barra de anúncios
- Componentes de acordeão personalizados
- Integração com Shop Pay
- Animação Cards Scroll com GSAP

## Seção Cards Scroll

O tema inclui uma seção especial "Cards Scroll" que implementa uma animação de rolagem horizontal de cards usando GSAP (GreenSock Animation Platform). Esta seção permite:

- Exibir uma série de cards com imagens ou textos que rolam horizontalmente com o scroll da página
- Personalizar cores, altura, espaçamento e outros atributos visuais
- Adicionar até 8 imagens personalizadas ou usar cards com gradientes coloridos e texto
- Criar experiências interativas e visualmente atraentes

Para adicionar esta seção à sua página:
1. No editor de tema Shopify, clique em "Adicionar seção"
2. Selecione "Cards Scroll" na categoria "Interactive"
3. Configure as opções de personalização conforme desejado

A seção carrega automaticamente as bibliotecas GSAP necessárias e não requer configuração técnica adicional.

## Instalação

1. Baixe ou clone este repositório
2. Faça upload do tema para sua loja Shopify através do Admin da Shopify ou usando o Shopify CLI

## Personalização

Edite as configurações do tema no Admin da Shopify:
- Logo e favicon: `/editor?context=theme&category=logo%20and%20favicon`
- Formatação de moeda: `/editor?context=theme&category=currency%20code`
- Estilos de variante: `/editor?context=theme&category=variants`

## Idiomas

O tema inclui traduções para:
- Inglês
- Espanhol (es)
- Português (pt-BR)
- Italiano (it)
- Turco (tr)

## Requisitos

- Loja Shopify
- Para o botão "Siga no Shop", o canal Shop deve estar instalado e o Shop Pay habilitado

## Desenvolvimento Local

Para executar e testar o tema localmente, você pode usar o Shopify CLI. Isso permite que você visualize e teste as alterações do tema sem precisar fazer upload para sua loja a cada modificação.

### Pré-requisitos

1. [Node.js](https://nodejs.org/) (versão LTS recomendada)
2. [Shopify CLI](https://shopify.dev/themes/tools/cli) instalado
3. Uma loja de desenvolvimento Shopify ou [loja de parceiro](https://partners.shopify.com)

### Configuração

1. Instale o Shopify CLI via npm:
   ```
   npm install -g @shopify/cli @shopify/theme
   ```

2. Autentique-se com sua conta Shopify:
   ```
   shopify auth login
   ```

3. Inicie o servidor de desenvolvimento no diretório do tema:
   ```
   cd caminho/para/Crowzy-Company
   shopify theme dev --store=sua-loja.myshopify.com
   ```

4. Acesse a visualização local do tema através do navegador no endereço fornecido pelo CLI (normalmente `http://127.0.0.1:9292`).

### Comandos Úteis

- Verificar alterações: `shopify theme check`
- Publicar alterações: `shopify theme push`
- Listar temas: `shopify theme list`
- Puxar tema remoto: `shopify theme pull`

O servidor de desenvolvimento sincronizará automaticamente as alterações que você fizer nos arquivos para a loja especificada em tempo real, permitindo testar completamente a funcionalidade Liquid, JavaScript e CSS.

## Licença

Copyright © Crowzy-Company. Todos os direitos reservados.
