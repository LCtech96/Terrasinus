"use client"

import { HeroSection } from "@/components/HeroSection"
import { MediaGallery } from "@/components/MediaGallery"
import { Navigation } from "@/components/Navigation"
import { Description } from "@/components/Description"
import { Address } from "@/components/Address"
import { Orari } from "@/components/Orari"
import { Footer } from "@/components/Footer"

// Immagini locali
const coverImage = "/cop.png"
const profileImage = "/profile.png"

// Gallery media with descriptions (0.png to 21.png = 22 images)
// You can mix images and videos, and add descriptions for each
const galleryMedia = [
  {
    id: 1,
    src: "/0.png",
    alt: "Antipasto di Mare",
    description: "Freschissimo antipasto di mare con polpo, gamberi e crudo di pesce locale, accompagnato da limone siciliano e olio extravergine d'oliva.",
    type: "image" as const,
  },
  {
    id: 2,
    src: "/1.png",
    alt: "Spaghetti alle Vongole",
    description: "Classico piatto della tradizione siciliana. Spaghetti freschi con vongole veraci, aglio, prezzemolo e un tocco di vino bianco.",
    type: "image" as const,
  },
  {
    id: 3,
    src: "/2.png",
    alt: "Grigliata di Pesce",
    description: "Selezione di pesce fresco grigliato alla perfezione: tonno, spada e orate, serviti con contorno di verdure grigliate e patate al forno.",
    type: "image" as const,
  },
  {
    id: 4,
    src: "/3.png",
    alt: "Risotto ai Frutti di Mare",
    description: "Crema di riso cremoso con un assortimento di frutti di mare freschi: cozze, vongole, gamberi e calamari. Un'esplosione di sapori del mare.",
    type: "image" as const,
  },
  {
    id: 5,
    src: "/4.png",
    alt: "Tonno alla Siciliana",
    description: "Filetto di tonno rosso freschissimo, marinato e servito con cipolle di Tropea, capperi di Pantelleria e olive nere siciliane.",
    type: "image" as const,
  },
  {
    id: 6,
    src: "/5.png",
    alt: "Calamari Ripieni",
    description: "Calamari teneri farciti con una prelibata farcia a base di pane, olive, capperi e prezzemolo, cotti al forno e serviti con salsa al pomodoro.",
    type: "image" as const,
  },
  {
    id: 7,
    src: "/6.png",
    alt: "Fritto Misto di Mare",
    description: "Croccante frittura di pesce e frutti di mare: calamari, gamberi, alici e verdure, serviti con limone e salsa tartara.",
    type: "image" as const,
  },
  {
    id: 8,
    src: "/7.png",
    alt: "Branzino al Sale",
    description: "Branzino fresco cotto sotto sale marino, un metodo di cottura che preserva tutta la delicatezza e il sapore del pesce.",
    type: "image" as const,
  },
  {
    id: 9,
    src: "/8.png",
    alt: "Pasta all'Astice",
    description: "Rafinato primo piatto con pasta fresca e astice intero, in un sugo cremoso preparato con il carapace dell'astice e pomodorini freschi.",
    type: "image" as const,
  },
  {
    id: 10,
    src: "/9.png",
    alt: "Carpaccio di Pesce Spada",
    description: "Fettine sottilissime di pesce spada crudo, marinato con limone, olio extravergine, capperi e rucola. Freschezza e delicatezza.",
    type: "image" as const,
  },
  {
    id: 11,
    src: "/10.png",
    alt: "Zuppa di Pesce",
    description: "Ricca zuppa di pesce della tradizione siciliana con un assortimento di pesci freschi, crostacei e molluschi in un brodo saporito.",
    type: "image" as const,
  },
  {
    id: 12,
    src: "/11.png",
    alt: "Gamberoni alla Griglia",
    description: "Gamberoni freschissimi grigliati e serviti con olio d'oliva, aglio, prezzemolo e una spruzzata di limone siciliano.",
    type: "image" as const,
  },
  {
    id: 13,
    src: "/12.png",
    alt: "Sarde a Beccafico",
    description: "Piatto tradizionale siciliano: sarde fresche farcite con pangrattato, pinoli, uvetta e prezzemolo, arrotolate e cotte al forno.",
    type: "image" as const,
  },
  {
    id: 14,
    src: "/13.png",
    alt: "Orata al Forno",
    description: "Orata fresca cotta al forno con patate, pomodorini, olive e capperi. Un piatto completo che celebra i sapori del Mediterraneo.",
    type: "image" as const,
  },
  {
    id: 15,
    src: "/14.png",
    alt: "Insalata di Mare",
    description: "Fresca insalata di mare con polpo, calamari, gamberi e verdure, condita con olio d'oliva, limone e prezzemolo fresco.",
    type: "image" as const,
  },
  {
    id: 16,
    src: "/15.png",
    alt: "Tartare di Tonno",
    description: "Tartare di tonno rosso freschissimo, tagliato a mano e condito con olio extravergine, lime, cipollotto e sesamo tostato.",
    type: "image" as const,
  },
  {
    id: 17,
    src: "/16.png",
    alt: "Bucatini alle Sarde",
    description: "Piatto iconico della cucina siciliana: bucatini con sarde fresche, finocchietto selvatico, uvetta, pinoli e pangrattato tostato.",
    type: "image" as const,
  },
  {
    id: 18,
    src: "/17.png",
    alt: "Cous Cous di Pesce",
    description: "Cous cous con brodo di pesce e un assortimento di pesce fresco, verdure e legumi. Influenze nordafricane nella tradizione siciliana.",
    type: "image" as const,
  },
  {
    id: 19,
    src: "/18.png",
    alt: "Scoglio",
    description: "Piatto abbondante con frutti di mare freschissimi: cozze, vongole, cannolicchi, telline e datteri di mare, conditi con olio e prezzemolo.",
    type: "image" as const,
  },
  {
    id: 20,
    src: "/19.png",
    alt: "Spigola in Crosta di Sale",
    description: "Spigola intera cotta sotto una crosta di sale marino grosso, un metodo che esalta la naturale dolcezza del pesce.",
    type: "image" as const,
  },
  {
    id: 21,
    src: "/20.png",
    alt: "Linguine ai Ricci",
    description: "Linguine fresche con ricci di mare freschissimi, un piatto che celebra il sapore intenso e caratteristico del riccio siciliano.",
    type: "image" as const,
  },
  {
    id: 22,
    src: "/21.png",
    alt: "Pesce Spada alla Siciliana",
    description: "Trancio di pesce spada fresco grigliato e servito con salsa agrodolce a base di capperi, olive, pomodorini e menta fresca.",
    type: "image" as const,
  },
]

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navigation />
      
      {/* Hero Section with Cover and Profile */}
      <div className="pt-0 md:pt-16">
        <HeroSection coverImage={coverImage} profileImage={profileImage} />
      </div>

      {/* Media Gallery Section */}
      <MediaGallery items={galleryMedia} />

      {/* Description Section */}
      <Description />

      {/* Orari Section */}
      <Orari />

      {/* Address Section */}
      <Address />

      {/* Footer */}
      <Footer />
    </main>
  )
}

