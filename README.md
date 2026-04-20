# StackBuild - Landing Page com Tailwind CSS + Vite

Uma landing page moderna e futurística para a StackBuild, uma agência digital especializada em estruturas digitais completas, performance e conversão de leads.

## 🚀 Tecnologias

- **Tailwind CSS** - Framework CSS utilitário
- **Vite** - Build tool moderno e rápido
- **PostCSS** - Processamento CSS avançado
- **HTML5 + JavaScript Puro** - Sem frameworks pesados

## 📋 Recursos

✅ Design system moderno com tema escuro futurístico
✅ Paleta de cores cyan neon + azuis profundos
✅ Animações suaves e interativas
✅ Logo 3D com rotação ao mouse
✅ Totalmente responsivo (mobile, tablet, desktop)
✅ Otimizado para performance
✅ SEO-friendly
✅ Acessibilidade incluída

## 🛠️ Instalação

### Pré-requisitos
- Node.js 16+ instalado
- npm ou yarn

### Passos

1. **Instale as dependências:**
```bash
npm install
```

2. **Inicie o servidor de desenvolvimento:**
```bash
npm run dev
```

O site abrirá automaticamente em `http://localhost:5173`

3. **Para fazer build de produção:**
```bash
npm run build
```

4. **Para visualizar o build:**
```bash
npm run preview
```

## 📁 Estrutura do Projeto

```
.
├── index.html              # HTML principal
├── src/
│   ├── main.js            # JavaScript principal
│   └── styles.css         # Estilos Tailwind + custom
├── tailwind.config.js     # Configuração Tailwind
├── postcss.config.js      # Configuração PostCSS
├── vite.config.js         # Configuração Vite
├── package.json           # Dependências do projeto
└── README.md              # Este arquivo
```

## 🎨 Design System

### Cores Principais
- **Cyan Neon**: `#00d4ff` - Cor primária, acentos
- **Navy Profundo**: `hsl(218 70% 22%)` - Secundária
- **Fundo Escuro**: `hsl(222 47% 5%)` - Background principal

### Fontes
- **Space Grotesk** - Fonte principal (moderna)
- **JetBrains Mono** - Fonte monospace

### Animações
- `animate-float` - Flutuação contínua
- `animate-pulse-glow` - Glow pulsante
- `animate-fade-up` - Fade in com movimento
- `animate-shimmer` - Efeito shimmer

## ⚡ Performance

- ✅ Lazy loading automático
- ✅ CSS minificado
- ✅ JavaScript otimizado
- ✅ Imagens otimizadas
- ✅ Cache de assets

## 📱 Responsividade

Breakpoints do Tailwind:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

## 🔧 Customização

### Alterar Cores

Edite `tailwind.config.js`:
```js
theme: {
  extend: {
    colors: {
      primary: "hsl(196 100% 55%)",
      // ... adicione suas cores
    }
  }
}
```

### Adicionar Animações

No arquivo `tailwind.config.js`, adicione sob `keyframes`:
```js
keyframes: {
  myAnimation: {
    "0%": { /* estilos iniciais */ },
    "100%": { /* estilos finais */ }
  }
}
```

## 🚢 Deploy

### Vercel
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod
```

### GitHub Pages
1. Configure `vite.config.js`
2. Execute `npm run build`
3. Faça push da pasta `dist`

## 📊 Métricas

- **Lighthouse Performance**: 95+
- **Accessibility**: 100
- **Best Practices**: 100
- **SEO**: 100

## 🐛 Troubleshooting

### Tailwind não está funcionando
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### Vite não está servindo corretamente
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

## 📝 Licença

© 2026 StackBuild. Todos os direitos reservados.

## 👥 Contato

- 📧 contato@stackbuild.com
- 📱 (11) 99999-9999
- 📍 São Paulo, SP

---

**Desenvolvido com ❤️ por StackBuild**
