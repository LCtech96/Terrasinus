import { readFile, writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

const CONTENT_FILE = join(process.cwd(), 'data', 'site-content.json')

export interface SiteContent {
  title: string
  subtitle: string
  description: string
  description2: string
  coverImage: string
  profileImage: string
  galleryMedia: Array<{
    id: number
    src: string
    alt: string
    description: string
    type: 'image' | 'video'
  }>
  address: string
  phone: string
  whatsapp: string
  googleMapsLink: string
  reviewLink: string
  instagramLink: string
  facebookLink: string
  menuContent?: any
}

const defaultContent: SiteContent = {
  title: 'Terrasinus',
  subtitle: 'Tra i faraglioni e la vista del mare',
  description: 'Nel cuore di Terrasini, affacciato sul mare cristallino della Sicilia, Terrasinus vi accoglie in un\'atmosfera elegante e raffinata. La nostra cucina di pesce celebra le tradizioni siciliane con ingredienti freschissimi del territorio, selezionati ogni giorno dai nostri pescatori locali.',
  description2: 'Ogni piatto racconta una storia di passione, sapori autentici e dedizione all\'eccellenza culinaria. Venite a scoprire l\'essenza del mare siciliano, servita con eleganza e calore mediterraneo.',
  coverImage: '/cop.png',
  profileImage: '/profile.png',
  galleryMedia: [
    {
      id: 1,
      src: "/0.png",
      alt: "Antipasto di Mare",
      description: "Freschissimo antipasto di mare con polpo, gamberi e crudo di pesce locale, accompagnato da limone siciliano e olio extravergine d'oliva.",
      type: "image",
    },
    {
      id: 2,
      src: "/1.png",
      alt: "Spaghetti alle Vongole",
      description: "Classico piatto della tradizione siciliana. Spaghetti freschi con vongole veraci, aglio, prezzemolo e un tocco di vino bianco.",
      type: "image",
    },
    {
      id: 3,
      src: "/2.png",
      alt: "Grigliata di Pesce",
      description: "Selezione di pesce fresco grigliato alla perfezione: tonno, spada e orate, serviti con contorno di verdure grigliate e patate al forno.",
      type: "image",
    },
    {
      id: 4,
      src: "/3.png",
      alt: "Risotto ai Frutti di Mare",
      description: "Crema di riso cremoso con un assortimento di frutti di mare freschi: cozze, vongole, gamberi e calamari. Un'esplosione di sapori del mare.",
      type: "image",
    },
    {
      id: 5,
      src: "/4.png",
      alt: "Tonno alla Siciliana",
      description: "Filetto di tonno rosso freschissimo, marinato e servito con cipolle di Tropea, capperi di Pantelleria e olive nere siciliane.",
      type: "image",
    },
    {
      id: 6,
      src: "/5.png",
      alt: "Calamari Ripieni",
      description: "Calamari teneri farciti con una prelibata farcia a base di pane, olive, capperi e prezzemolo, cotti al forno e serviti con salsa al pomodoro.",
      type: "image",
    },
    {
      id: 7,
      src: "/6.png",
      alt: "Fritto Misto di Mare",
      description: "Croccante frittura di pesce e frutti di mare: calamari, gamberi, alici e verdure, serviti con limone e salsa tartara.",
      type: "image",
    },
    {
      id: 8,
      src: "/7.png",
      alt: "Branzino al Sale",
      description: "Branzino fresco cotto sotto sale marino, un metodo di cottura che preserva tutta la delicatezza e il sapore del pesce.",
      type: "image",
    },
    {
      id: 9,
      src: "/8.png",
      alt: "Pasta all'Astice",
      description: "Rafinato primo piatto con pasta fresca e astice intero, in un sugo cremoso preparato con il carapace dell'astice e pomodorini freschi.",
      type: "image",
    },
    {
      id: 10,
      src: "/9.png",
      alt: "Carpaccio di Pesce Spada",
      description: "Fettine sottilissime di pesce spada crudo, marinato con limone, olio extravergine, capperi e rucola. Freschezza e delicatezza.",
      type: "image",
    },
    {
      id: 11,
      src: "/10.png",
      alt: "Zuppa di Pesce",
      description: "Ricca zuppa di pesce della tradizione siciliana con un assortimento di pesci freschi, crostacei e molluschi in un brodo saporito.",
      type: "image",
    },
    {
      id: 12,
      src: "/11.png",
      alt: "Gamberoni alla Griglia",
      description: "Gamberoni freschissimi grigliati e serviti con olio d'oliva, aglio, prezzemolo e una spruzzata di limone siciliano.",
      type: "image",
    },
    {
      id: 13,
      src: "/12.png",
      alt: "Sarde a Beccafico",
      description: "Piatto tradizionale siciliano: sarde fresche farcite con pangrattato, pinoli, uvetta e prezzemolo, arrotolate e cotte al forno.",
      type: "image",
    },
    {
      id: 14,
      src: "/13.png",
      alt: "Orata al Forno",
      description: "Orata fresca cotta al forno con patate, pomodorini, olive e capperi. Un piatto completo che celebra i sapori del Mediterraneo.",
      type: "image",
    },
    {
      id: 15,
      src: "/14.png",
      alt: "Insalata di Mare",
      description: "Fresca insalata di mare con polpo, calamari, gamberi e verdure, condita con olio d'oliva, limone e prezzemolo fresco.",
      type: "image",
    },
    {
      id: 16,
      src: "/15.png",
      alt: "Tartare di Tonno",
      description: "Tartare di tonno rosso freschissimo, tagliato a mano e condito con olio extravergine, lime, cipollotto e sesamo tostato.",
      type: "image",
    },
    {
      id: 17,
      src: "/16.png",
      alt: "Bucatini alle Sarde",
      description: "Piatto iconico della cucina siciliana: bucatini con sarde fresche, finocchietto selvatico, uvetta, pinoli e pangrattato tostato.",
      type: "image",
    },
    {
      id: 18,
      src: "/17.png",
      alt: "Cous Cous di Pesce",
      description: "Cous cous con brodo di pesce e un assortimento di pesce fresco, verdure e legumi. Influenze nordafricane nella tradizione siciliana.",
      type: "image",
    },
    {
      id: 19,
      src: "/18.png",
      alt: "Scoglio",
      description: "Piatto abbondante con frutti di mare freschissimi: cozze, vongole, cannolicchi, telline e datteri di mare, conditi con olio e prezzemolo.",
      type: "image",
    },
    {
      id: 20,
      src: "/19.png",
      alt: "Spigola in Crosta di Sale",
      description: "Spigola intera cotta sotto una crosta di sale marino grosso, un metodo che esalta la naturale dolcezza del pesce.",
      type: "image",
    },
    {
      id: 21,
      src: "/20.png",
      alt: "Linguine ai Ricci",
      description: "Linguine fresche con ricci di mare freschissimi, un piatto che celebra il sapore intenso e caratteristico del riccio siciliano.",
      type: "image",
    },
    {
      id: 22,
      src: "/21.png",
      alt: "Pesce Spada alla Siciliana",
      description: "Trancio di pesce spada fresco grigliato e servito con salsa agrodolce a base di capperi, olive, pomodorini e menta fresca.",
      type: "image",
    },
  ],
  address: 'Piazzale del Mediterraneo, 6, 90049 Terrasini PA',
  phone: '3206380567',
  whatsapp: '3206380567',
  googleMapsLink: 'https://maps.app.goo.gl/HHESm7FGt7BpV1zJ8',
  reviewLink: 'https://www.google.com/search?hl=it-IT&gl=it&q=Ristorante+TerraSinus,+Piazzale+del+Mediterraneo,+6,+90049+Terrasini+PA&ludocid=14074348536276687501&lsig=AB86z5VVwP9PVMGVIb72M-YlVKSd#lrd=0x131991a49e22749f:0xc352216cb5cf9a8d,3',
  instagramLink: 'https://www.instagram.com/terrasinus_ristorante/',
  facebookLink: '#',
}

export async function getSiteContent(): Promise<SiteContent> {
  try {
    if (!existsSync(CONTENT_FILE)) {
      // Create data directory if it doesn't exist
      const dataDir = join(process.cwd(), 'data')
      if (!existsSync(dataDir)) {
        await mkdir(dataDir, { recursive: true })
      }
      await saveSiteContent(defaultContent)
      return defaultContent
    }
    const content = await readFile(CONTENT_FILE, 'utf-8')
    return JSON.parse(content)
  } catch (error) {
    console.error('Error reading site content:', error)
    return defaultContent
  }
}

export async function saveSiteContent(content: SiteContent): Promise<void> {
  try {
    const dataDir = join(process.cwd(), 'data')
    if (!existsSync(dataDir)) {
      await mkdir(dataDir, { recursive: true })
    }
    await writeFile(CONTENT_FILE, JSON.stringify(content, null, 2), 'utf-8')
  } catch (error: any) {
    // On Vercel (read-only file system), we can't write files
    // Log the content for now - in production you'd use a database
    console.error('Error saving site content (file system may be read-only):', error)
    // In production, you should integrate with a database like Supabase
    // For now, we'll still throw the error so the admin knows something went wrong
    if (error?.code !== 'EROFS' && error?.code !== 'EACCES') {
      throw error
    }
    // If it's a read-only file system error, log but don't fail completely
    console.log('Content update received (file system not writable):', content)
  }
}

