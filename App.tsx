@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Newsreader:ital,opsz,wght@0,6..72,200..800;1,6..72,200..800&family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap');
@import "tailwindcss";

@theme {
  --font-serif: "Playfair Display", serif;
  --font-body: "Newsreader", serif;
  --font-sans: "Plus Jakarta Sans", sans-serif;
  
  --color-wine: #340001;
  --color-wine-deep: #250001;
  --color-beige: #fff8f5;
  --color-beige-dark: #f0e9e6;
  --color-gold: #b08872;
}

@layer base {
  body {
    @apply bg-beige text-wine font-body;
  }
}

.editorial-gradient {
  background: linear-gradient(135deg, #5b0002 0%, #340001 100%);
}

.glass {
  @apply bg-white/10 backdrop-blur-md border border-white/20;
}

.sidebar-item {
  @apply flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 hover:bg-wine/5 hover:text-wine;
}

.sidebar-item.active {
  @apply bg-wine text-beige shadow-lg;
}

