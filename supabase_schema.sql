-- ============================================
-- Schema SQL per Supabase - Progetto Terrasinus
-- ============================================

-- Abilita estensioni necessarie
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- Tabella: site_content
-- Contiene il contenuto principale del sito
-- ============================================
CREATE TABLE IF NOT EXISTS site_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL DEFAULT 'Terrasinus',
  subtitle TEXT DEFAULT 'Tra i faraglioni e la vista del mare',
  description TEXT,
  description2 TEXT,
  cover_image TEXT DEFAULT '/cop.png',
  profile_image TEXT DEFAULT '/profile.png',
  address TEXT DEFAULT 'Piazzale del Mediterraneo, 6, 90049 Terrasini PA',
  phone TEXT DEFAULT '3206380567',
  whatsapp TEXT DEFAULT '3206380567',
  google_maps_link TEXT,
  review_link TEXT,
  instagram_link TEXT DEFAULT 'https://www.instagram.com/terrasinus_ristorante/',
  facebook_link TEXT DEFAULT '#',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT single_row CHECK (id = '00000000-0000-0000-0000-000000000000'::uuid)
);

-- ============================================
-- Tabella: gallery_media
-- Contiene gli elementi della gallery (immagini e video)
-- ============================================
CREATE TABLE IF NOT EXISTS gallery_media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_content_id UUID NOT NULL REFERENCES site_content(id) ON DELETE CASCADE,
  media_id INTEGER NOT NULL,
  src TEXT NOT NULL,
  alt TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('image', 'video')),
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(site_content_id, media_id)
);

-- ============================================
-- Tabella: menu_content
-- Contiene il contenuto del menu (JSON opzionale)
-- ============================================
CREATE TABLE IF NOT EXISTS menu_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_content_id UUID NOT NULL REFERENCES site_content(id) ON DELETE CASCADE,
  content JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Tabella: admin_users
-- Utenti admin per l'autenticazione
-- ============================================
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Trigger per aggiornare updated_at automaticamente
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_site_content_updated_at
  BEFORE UPDATE ON site_content
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_gallery_media_updated_at
  BEFORE UPDATE ON gallery_media
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_menu_content_updated_at
  BEFORE UPDATE ON menu_content
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_users_updated_at
  BEFORE UPDATE ON admin_users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Inserimento dati iniziali
-- ============================================

-- Inserisci un solo record per site_content (con ID fisso)
INSERT INTO site_content (id, title, subtitle, description, description2, cover_image, profile_image, address, phone, whatsapp, google_maps_link, review_link, instagram_link, facebook_link)
VALUES (
  '00000000-0000-0000-0000-000000000000'::uuid,
  'Terrasinus',
  'Tra i faraglioni e la vista del mare',
  'Nel cuore di Terrasini, affacciato sul mare cristallino della Sicilia, Terrasinus vi accoglie in un''atmosfera elegante e raffinata. La nostra cucina di pesce celebra le tradizioni siciliane con ingredienti freschissimi del territorio, selezionati ogni giorno dai nostri pescatori locali.',
  'Ogni piatto racconta una storia di passione, sapori autentici e dedizione all''eccellenza culinaria. Venite a scoprire l''essenza del mare siciliano, servita con eleganza e calore mediterraneo.',
  '/cop.png',
  '/profile.png',
  'Piazzale del Mediterraneo, 6, 90049 Terrasini PA',
  '3206380567',
  '3206380567',
  'https://maps.app.goo.gl/HHESm7FGt7BpV1zJ8',
  'https://www.google.com/search?hl=it-IT&gl=it&q=Ristorante+TerraSinus,+Piazzale+del+Mediterraneo,+6,+90049+Terrasini+PA&ludocid=14074348536276687501&lsig=AB86z5VVwP9PVMGVIb72M-YlVKSd#lrd=0x131991a49e22749f:0xc352216cb5cf9a8d,3',
  'https://www.instagram.com/terrasinus_ristorante/',
  '#'
)
ON CONFLICT (id) DO NOTHING;

-- Inserisci i dati iniziali della gallery
INSERT INTO gallery_media (site_content_id, media_id, src, alt, description, type, display_order)
VALUES 
  ('00000000-0000-0000-0000-000000000000'::uuid, 1, '/0.png', 'Antipasto di Mare', 'Freschissimo antipasto di mare con polpo, gamberi e crudo di pesce locale, accompagnato da limone siciliano e olio extravergine d''oliva.', 'image', 1),
  ('00000000-0000-0000-0000-000000000000'::uuid, 2, '/1.png', 'Spaghetti alle Vongole', 'Classico piatto della tradizione siciliana. Spaghetti freschi con vongole veraci, aglio, prezzemolo e un tocco di vino bianco.', 'image', 2),
  ('00000000-0000-0000-0000-000000000000'::uuid, 3, '/2.png', 'Grigliata di Pesce', 'Selezione di pesce fresco grigliato alla perfezione: tonno, spada e orate, serviti con contorno di verdure grigliate e patate al forno.', 'image', 3),
  ('00000000-0000-0000-0000-000000000000'::uuid, 4, '/3.png', 'Risotto ai Frutti di Mare', 'Crema di riso cremoso con un assortimento di frutti di mare freschi: cozze, vongole, gamberi e calamari. Un''esplosione di sapori del mare.', 'image', 4),
  ('00000000-0000-0000-0000-000000000000'::uuid, 5, '/4.png', 'Tonno alla Siciliana', 'Filetto di tonno rosso freschissimo, marinato e servito con cipolle di Tropea, capperi di Pantelleria e olive nere siciliane.', 'image', 5),
  ('00000000-0000-0000-0000-000000000000'::uuid, 6, '/5.png', 'Calamari Ripieni', 'Calamari teneri farciti con una prelibata farcia a base di pane, olive, capperi e prezzemolo, cotti al forno e serviti con salsa al pomodoro.', 'image', 6),
  ('00000000-0000-0000-0000-000000000000'::uuid, 7, '/6.png', 'Fritto Misto di Mare', 'Croccante frittura di pesce e frutti di mare: calamari, gamberi, alici e verdure, serviti con limone e salsa tartara.', 'image', 7),
  ('00000000-0000-0000-0000-000000000000'::uuid, 8, '/7.png', 'Branzino al Sale', 'Branzino fresco cotto sotto sale marino, un metodo di cottura che preserva tutta la delicatezza e il sapore del pesce.', 'image', 8),
  ('00000000-0000-0000-0000-000000000000'::uuid, 9, '/8.png', 'Pasta all''Astice', 'Rafinato primo piatto con pasta fresca e astice intero, in un sugo cremoso preparato con il carapace dell''astice e pomodorini freschi.', 'image', 9),
  ('00000000-0000-0000-0000-000000000000'::uuid, 10, '/9.png', 'Carpaccio di Pesce Spada', 'Fettine sottilissime di pesce spada crudo, marinato con limone, olio extravergine, capperi e rucola. Freschezza e delicatezza.', 'image', 10),
  ('00000000-0000-0000-0000-000000000000'::uuid, 11, '/10.png', 'Zuppa di Pesce', 'Ricca zuppa di pesce della tradizione siciliana con un assortimento di pesci freschi, crostacei e molluschi in un brodo saporito.', 'image', 11),
  ('00000000-0000-0000-0000-000000000000'::uuid, 12, '/11.png', 'Gamberoni alla Griglia', 'Gamberoni freschissimi grigliati e serviti con olio d''oliva, aglio, prezzemolo e una spruzzata di limone siciliano.', 'image', 12),
  ('00000000-0000-0000-0000-000000000000'::uuid, 13, '/12.png', 'Sarde a Beccafico', 'Piatto tradizionale siciliano: sarde fresche farcite con pangrattato, pinoli, uvetta e prezzemolo, arrotolate e cotte al forno.', 'image', 13),
  ('00000000-0000-0000-0000-000000000000'::uuid, 14, '/13.png', 'Orata al Forno', 'Orata fresca cotta al forno con patate, pomodorini, olive e capperi. Un piatto completo che celebra i sapori del Mediterraneo.', 'image', 14),
  ('00000000-0000-0000-0000-000000000000'::uuid, 15, '/14.png', 'Insalata di Mare', 'Fresca insalata di mare con polpo, calamari, gamberi e verdure, condita con olio d''oliva, limone e prezzemolo fresco.', 'image', 15),
  ('00000000-0000-0000-0000-000000000000'::uuid, 16, '/15.png', 'Tartare di Tonno', 'Tartare di tonno rosso freschissimo, tagliato a mano e condito con olio extravergine, lime, cipollotto e sesamo tostato.', 'image', 16),
  ('00000000-0000-0000-0000-000000000000'::uuid, 17, '/16.png', 'Bucatini alle Sarde', 'Piatto iconico della cucina siciliana: bucatini con sarde fresche, finocchietto selvatico, uvetta, pinoli e pangrattato tostato.', 'image', 17),
  ('00000000-0000-0000-0000-000000000000'::uuid, 18, '/17.png', 'Cous Cous di Pesce', 'Cous cous con brodo di pesce e un assortimento di pesce fresco, verdure e legumi. Influenze nordafricane nella tradizione siciliana.', 'image', 18),
  ('00000000-0000-0000-0000-000000000000'::uuid, 19, '/18.png', 'Scoglio', 'Piatto abbondante con frutti di mare freschissimi: cozze, vongole, cannolicchi, telline e datteri di mare, conditi con olio e prezzemolo.', 'image', 19),
  ('00000000-0000-0000-0000-000000000000'::uuid, 20, '/19.png', 'Spigola in Crosta di Sale', 'Spigola intera cotta sotto una crosta di sale marino grosso, un metodo che esalta la naturale dolcezza del pesce.', 'image', 20),
  ('00000000-0000-0000-0000-000000000000'::uuid, 21, '/20.png', 'Linguine ai Ricci', 'Linguine fresche con ricci di mare freschissimi, un piatto che celebra il sapore intenso e caratteristico del riccio siciliano.', 'image', 21),
  ('00000000-0000-0000-0000-000000000000'::uuid, 22, '/21.png', 'Pesce Spada alla Siciliana', 'Trancio di pesce spada fresco grigliato e servito con salsa agrodolce a base di capperi, olive, pomodorini e menta fresca.', 'image', 22)
ON CONFLICT (site_content_id, media_id) DO NOTHING;

-- ============================================
-- Row Level Security (RLS) Policies
-- ============================================

-- Abilita RLS su tutte le tabelle
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Policy per site_content: tutti possono leggere, solo admin può modificare
CREATE POLICY "Anyone can read site_content"
  ON site_content FOR SELECT
  USING (true);

CREATE POLICY "Only authenticated users can update site_content"
  ON site_content FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Policy per gallery_media: tutti possono leggere, solo admin può modificare
CREATE POLICY "Anyone can read gallery_media"
  ON gallery_media FOR SELECT
  USING (true);

CREATE POLICY "Only authenticated users can manage gallery_media"
  ON gallery_media FOR ALL
  USING (auth.role() = 'authenticated');

-- Policy per menu_content: tutti possono leggere, solo admin può modificare
CREATE POLICY "Anyone can read menu_content"
  ON menu_content FOR SELECT
  USING (true);

CREATE POLICY "Only authenticated users can manage menu_content"
  ON menu_content FOR ALL
  USING (auth.role() = 'authenticated');

-- Policy per admin_users: solo admin può leggere e modificare
CREATE POLICY "Only authenticated users can read admin_users"
  ON admin_users FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Only authenticated users can manage admin_users"
  ON admin_users FOR ALL
  USING (auth.role() = 'authenticated');

-- ============================================
-- Funzioni utili
-- ============================================

-- Funzione per ottenere il contenuto del sito completo
CREATE OR REPLACE FUNCTION get_site_content()
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'title', sc.title,
    'subtitle', sc.subtitle,
    'description', sc.description,
    'description2', sc.description2,
    'coverImage', sc.cover_image,
    'profileImage', sc.profile_image,
    'address', sc.address,
    'phone', sc.phone,
    'whatsapp', sc.whatsapp,
    'googleMapsLink', sc.google_maps_link,
    'reviewLink', sc.review_link,
    'instagramLink', sc.instagram_link,
    'facebookLink', sc.facebook_link,
    'galleryMedia', (
      SELECT json_agg(
        json_build_object(
          'id', gm.media_id,
          'src', gm.src,
          'alt', gm.alt,
          'description', gm.description,
          'type', gm.type
        ) ORDER BY gm.display_order
      )
      FROM gallery_media gm
      WHERE gm.site_content_id = sc.id
    )
  )
  INTO result
  FROM site_content sc
  WHERE sc.id = '00000000-0000-0000-0000-000000000000'::uuid;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Funzione per aggiornare il contenuto del sito
CREATE OR REPLACE FUNCTION update_site_content(
  p_title TEXT,
  p_subtitle TEXT,
  p_description TEXT,
  p_description2 TEXT,
  p_cover_image TEXT,
  p_profile_image TEXT,
  p_address TEXT,
  p_phone TEXT,
  p_whatsapp TEXT,
  p_google_maps_link TEXT,
  p_review_link TEXT,
  p_instagram_link TEXT,
  p_facebook_link TEXT
)
RETURNS VOID AS $$
BEGIN
  UPDATE site_content
  SET
    title = COALESCE(p_title, title),
    subtitle = COALESCE(p_subtitle, subtitle),
    description = COALESCE(p_description, description),
    description2 = COALESCE(p_description2, description2),
    cover_image = COALESCE(p_cover_image, cover_image),
    profile_image = COALESCE(p_profile_image, profile_image),
    address = COALESCE(p_address, address),
    phone = COALESCE(p_phone, phone),
    whatsapp = COALESCE(p_whatsapp, whatsapp),
    google_maps_link = COALESCE(p_google_maps_link, google_maps_link),
    review_link = COALESCE(p_review_link, review_link),
    instagram_link = COALESCE(p_instagram_link, instagram_link),
    facebook_link = COALESCE(p_facebook_link, facebook_link),
    updated_at = NOW()
  WHERE id = '00000000-0000-0000-0000-000000000000'::uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- Indici per performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_gallery_media_site_content_id ON gallery_media(site_content_id);
CREATE INDEX IF NOT EXISTS idx_gallery_media_display_order ON gallery_media(display_order);
CREATE INDEX IF NOT EXISTS idx_menu_content_site_content_id ON menu_content(site_content_id);
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);

-- ============================================
-- Fine dello schema
-- ============================================

