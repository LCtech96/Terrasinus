# Terrasinus - Sito Web

Sito web per Terrasinus, specializzato in cucina di pesce a Terrasini, Sicilia.

## Tecnologie Utilizzate

- **Next.js 14** - Framework React con App Router
- **TypeScript** - Tipizzazione statica
- **Tailwind CSS** - Styling utility-first
- **Framer Motion** - Animazioni fluide
- **Supabase** - Database backend
- **next-themes** - Gestione tema dark/light

## Funzionalità

- 🎨 Design responsive ottimizzato per mobile e desktop
- 🌓 Modalità dark/light
- 📸 Gallery verticale interattiva con immagini cliccabili
- 🧭 Navigation bar responsive (top su desktop, bottom su mobile)
- 📱 Ottimizzazione mobile-first

## Installazione

1. Installa le dipendenze:
```bash
pnpm install
```

2. Configura le variabili d'ambiente:
```bash
cp .env.local.example .env.local
```

Aggiungi le tue credenziali Supabase nel file `.env.local`.

3. Avvia il server di sviluppo:
```bash
pnpm dev
```

Apri [http://localhost:3000](http://localhost:3000) nel browser.

## Configurazione Supabase

1. Crea un progetto su [Supabase](https://supabase.com)
2. Copia l'URL del progetto e la chiave anonima
3. Inseriscile nel file `.env.local`

## Personalizzazione Immagini

Sostituisci le immagini placeholder in `app/page.tsx`:
- `coverImage` - Immagine di copertina
- `profileImage` - Immagine profilo
- `galleryImages` - Array di immagini per la gallery

## Build per Produzione

```bash
pnpm build
pnpm start
```

## Deploy su Vercel

Il progetto è configurato per il deploy automatico su Vercel.

### Opzione 1: Deploy tramite GitHub (Consigliato)

1. Vai su [Vercel](https://vercel.com) e accedi con il tuo account GitHub
2. Clicca su "Add New Project"
3. Seleziona il repository
4. Vercel rileverà automaticamente le impostazioni Next.js
5. Aggiungi le variabili d'ambiente (se necessario):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `GROQ_API_KEY`
   - `ADMIN_EMAIL`
   - `ADMIN_PASSWORD`
6. Clicca su "Deploy"

Il sito sarà disponibile su un URL tipo: `https://terrasinus.vercel.app`

### Opzione 2: Deploy tramite CLI

1. Installa Vercel CLI:
```bash
pnpm add -g vercel
```

2. Esegui il deploy:
```bash
vercel
```

3. Segui le istruzioni nella CLI per completare il deploy

### Variabili d'Ambiente su Vercel

Aggiungi queste variabili nelle impostazioni del progetto su Vercel:
- `NEXT_PUBLIC_SUPABASE_URL` - URL del tuo progetto Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Chiave anonima di Supabase
- `GROQ_API_KEY` - Chiave API Groq per funzionalità AI
- `ADMIN_EMAIL` - Email per accesso admin
- `ADMIN_PASSWORD` - Password per accesso admin

## Configurazione

### Groq API
Il progetto utilizza Groq API per funzionalità AI. Configura la chiave API nel file `.env.local`:
```
GROQ_API_KEY=your_groq_api_key_here
```

### Admin
Configura le credenziali di accesso admin nel file `.env.local`:
```
ADMIN_EMAIL=your_admin_email
ADMIN_PASSWORD=your_admin_password
```

## Area Admin

Il sito include un'area admin completa per gestire tutti i contenuti del sito.

### Accesso Admin

1. Vai su `http://localhost:3000/admin` (o `https://terrasinus.com/admin` in produzione)
2. Accedi con le credenziali:
   - Email: `terrasinussrl@gmail.com`
   - Password: (configurata tramite variabile d'ambiente `ADMIN_PASSWORD`)

### Funzionalità Admin

L'area admin (`/admin/dashboard`) permette di:

- ✏️ **Modificare testi**: Doppio click su qualsiasi testo per modificarlo
- 🖼️ **Gestire immagini**: 
  - Doppio click su qualsiasi immagine per modificarla
  - Caricare nuove immagini
  - Eliminare immagini esistenti
- 📸 **Gestire gallery**:
  - Aggiungere nuovi elementi alla gallery
  - Modificare titoli e descrizioni delle immagini
  - Rimuovere elementi dalla gallery
- 💾 **Salvare modifiche**: Clicca su "Salva" nella toolbar superiore per salvare tutte le modifiche

### Struttura Admin

- `/admin` - Pagina di login
- `/admin/dashboard` - Dashboard admin con modalità editing
- `/api/admin/login` - API per autenticazione
- `/api/admin/logout` - API per logout
- `/api/admin/content` - API per caricare/salvare contenuti
- `/api/admin/upload` - API per upload immagini
- `/api/admin/delete-image` - API per eliminare immagini

I contenuti modificati vengono salvati in `data/site-content.json` e vengono automaticamente caricati dal sito principale.

## Licenza

Proprietario: Terrasinus

