# Setup Supabase per Terrasinus

## 📋 Istruzioni per configurare Supabase

### 1. Crea un progetto Supabase

1. Vai su [https://supabase.com](https://supabase.com)
2. Accedi o crea un account
3. Clicca su "New Project"
4. Inserisci i dettagli:
   - **Name**: Terrasinus
   - **Database Password**: scegli una password sicura
   - **Region**: scegli la regione più vicina (es. West Europe)
5. Clicca su "Create new project"

### 2. Esegui lo schema SQL

1. Nel dashboard di Supabase, vai su **SQL Editor** (icona nella sidebar sinistra)
2. Clicca su **New Query**
3. Copia tutto il contenuto del file `supabase_schema.sql`
4. Incolla nel SQL Editor
5. Clicca su **Run** (o premi `Ctrl+Enter`)

Lo schema creerà:
- ✅ Tabella `site_content` - contenuto principale del sito
- ✅ Tabella `gallery_media` - immagini e video della gallery
- ✅ Tabella `menu_content` - contenuto del menu (opzionale)
- ✅ Tabella `admin_users` - utenti admin
- ✅ Trigger per aggiornare `updated_at` automaticamente
- ✅ Funzioni utili per gestire i dati
- ✅ Row Level Security (RLS) policies
- ✅ Indici per performance

### 3. Configura le credenziali

1. Nel dashboard Supabase, vai su **Settings** → **API**
2. Copia:
   - **Project URL** → questa sarà `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → questa sarà `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 4. Configura le variabili d'ambiente

Nel file `.env.local` (o su Vercel), aggiungi:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tuo-progetto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tua-chiave-anon-public
```

### 5. Verifica i dati iniziali

Dopo aver eseguito lo schema SQL, puoi verificare che i dati siano stati inseriti:

1. Vai su **Table Editor** nel dashboard Supabase
2. Controlla la tabella `site_content` - dovrebbe avere 1 riga
3. Controlla la tabella `gallery_media` - dovrebbe avere 22 righe

## 📊 Struttura Database

### Tabella: `site_content`
Contiene il contenuto principale del sito. Solo una riga (singleton pattern).

**Campi principali:**
- `title` - Titolo del ristorante
- `subtitle` - Sottotitolo
- `description` - Descrizione principale
- `description2` - Seconda descrizione
- `cover_image` - Immagine di copertina
- `profile_image` - Immagine profilo
- `address` - Indirizzo
- `phone` - Telefono
- `whatsapp` - Numero WhatsApp
- `google_maps_link` - Link Google Maps
- `review_link` - Link recensioni Google
- `instagram_link` - Link Instagram
- `facebook_link` - Link Facebook

### Tabella: `gallery_media`
Contiene gli elementi della gallery (immagini e video).

**Campi principali:**
- `media_id` - ID numerico dell'elemento
- `src` - Percorso/URL dell'immagine o video
- `alt` - Testo alternativo
- `description` - Descrizione dell'elemento
- `type` - Tipo: 'image' o 'video'
- `display_order` - Ordine di visualizzazione

### Tabella: `menu_content`
Contiene il contenuto del menu in formato JSON (opzionale per future estensioni).

### Tabella: `admin_users`
Contiene gli utenti admin (per autenticazione avanzata in futuro).

## 🔐 Row Level Security (RLS)

Lo schema include RLS policies:
- ✅ Tutti possono **leggere** `site_content` e `gallery_media` (pubblico)
- ✅ Solo utenti autenticati possono **modificare** i dati (admin)

## 🛠️ Funzioni Utili

### `get_site_content()`
Restituisce tutto il contenuto del sito in formato JSON, incluso la gallery.

```sql
SELECT get_site_content();
```

### `update_site_content(...)`
Aggiorna il contenuto del sito.

```sql
SELECT update_site_content(
  'Nuovo Titolo',
  'Nuovo Sottotitolo',
  'Nuova Descrizione',
  ...
);
```

## 📝 Note

- Lo schema è progettato per funzionare con l'admin panel esistente
- I dati iniziali vengono inseriti automaticamente
- Le policies RLS possono essere modificate secondo le tue esigenze di sicurezza
- Il sistema attualmente usa file JSON, ma questo schema permette di migrare a Supabase in futuro

## 🔄 Migrazione da File JSON a Supabase

Se vuoi migrare completamente da file JSON a Supabase, dovrai:

1. Modificare `lib/admin-content.ts` per usare Supabase invece di file system
2. Creare API routes che usano Supabase
3. Aggiornare l'admin dashboard per usare le nuove API

Per ora, lo schema è pronto e può essere usato in parallelo o come sostituzione futura.

