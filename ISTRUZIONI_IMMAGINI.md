# Istruzioni per Aggiungere le Immagini

## Immagini da Aggiungere

1. **Immagine di Copertina** (coverImage)
   - Posizione: `public/cop.png`
   - Dimensione consigliata: 1200x400px
   - Immagine di copertina del ristorante Terrasinus

2. **Immagine Profilo** (profileImage)
   - Posizione: `public/profile.png`
   - Dimensione consigliata: 400x400px (quadrata)
   - Immagine del profilo del ristorante Terrasinus

3. **Immagini Gallery** (Specialità)
   - Posizione: `public/`
   - Nomi file: `0.png`, `1.png`, `2.png`, ... `21.png` (22 immagini totali)
   - Queste sono le immagini delle specialità del ristorante
   - Dimensione consigliata: 800x1200px (verticale)

4. **Immagini Staff**
   - Posizione: `public/staff.png`, `public/staff1.png`

5. **Immagini VIP Visits**
   - Posizione: `public/vip.png`, `public/vip1.png`, `public/vip2.png`

6. **Altre Immagini**
   - `public/22.png`, `public/23.png` - Immagini aggiuntive

## Come Sostituire le Immagini

1. Aggiungi le immagini nella cartella `public/`
2. Apri `app/page.tsx`
3. Sostituisci gli URL placeholder con i percorsi locali:

```typescript
// Sostituisci queste righe:
const coverImage = "https://images.unsplash.com/..."
const profileImage = "https://images.unsplash.com/..."

// Con:
const coverImage = "/cover-image.jpg"
const profileImage = "/profile-image.jpg"

// E per la gallery:
const galleryImages = [
  {
    id: 1,
    src: "/gallery/gallery-1.jpg",
    alt: "Descrizione immagine 1",
  },
  // ... altre immagini
]
```

## Note

- Le immagini devono essere ottimizzate per il web (formato JPG o WebP)
- Usa strumenti come TinyPNG o ImageOptim per ridurre le dimensioni
- Next.js ottimizza automaticamente le immagini con il componente Image

