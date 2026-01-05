"use client"

import { useState } from "react"
import type { ReactNode } from "react"
import { Navigation } from "@/components/Navigation"
import { Footer } from "@/components/Footer"
import { AlertCircle, Info, ChevronDown, ChevronUp, MapPin, Clock, Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface MenuItem {
  name: string
  description?: string
  price: string
  glutenFree?: boolean
  menuItem?: boolean
}

interface MenuSection {
  title: string
  items: MenuItem[]
}

// Menù Fisso
const menuFisso = {
  title: "🌿 Menù Fisso Invernale – €35 🌿",
  description: "Disponibile tutti i giorni, a pranzo e a cena (esclusi la domenica ed i giorni festivi)",
  warning: "⚠️ Il menù fisso è personale e non può essere condiviso o diviso tra più persone.",
  courses: {
    antipasti: [
      "Insalata di mare",
      "Cocktail di gamberi",
      "Arancininetta",
      "Caponata di pesce"
    ],
    primi: [
      "Busiate con pesce spada e melanzane",
      "oppure",
      "Pacchero al ragù di cernia"
    ],
    secondo: [
      "Frittura mista"
    ],
    bevanda: [
      "Acqua",
      "+ a scelta:",
      "• 1 calice di vino",
      "o",
      "• Coca-Cola 33 cl",
      "o",
      "• Birra 33 cl"
    ]
  }
}

// Sezioni del menu alla carta (già esistenti)
const menuSections: MenuSection[] = [
  {
    title: "Antipasti",
    items: [
      {
        name: "TerraSinus",
        description: "Selezione di crudi",
        price: "€ 30",
        menuItem: true,
      },
      {
        name: "Trinacria",
        description: "Caponata di pesce con mandorle tostate, Cocktail di Gamberi, Insalata di mare",
        price: "€ 16",
      },
      {
        name: "Insalata di mare no glutine",
        description: "Polpo, calamari, gamberi, sedano, carote",
        price: "€ 15",
        glutenFree: true,
      },
      {
        name: "Bruschette di mare",
        description: "Ricci, tartare di gambero / salmone / tonno",
        price: "€ 18",
      },
      {
        name: "Polpo grigliato con purè di patate no glutine",
        price: "€ 16",
        glutenFree: true,
      },
      {
        name: "Caponata di Pesce",
        price: "€ 15",
      },
      {
        name: "Soutè di Vongole no glutine",
        price: "€ 18",
        glutenFree: true,
      },
      {
        name: "Zuppa di Cozze con Crostini",
        price: "€ 14",
      },
      {
        name: "Cocktail di Gamberi",
        price: "€ 15",
      },
      {
        name: "Bruschetta Siciliana",
        description: "Trapanese, patè di olive, fonduta di formaggi",
        price: "€ 10",
      },
      {
        name: "Caprese no glutine",
        description: "Mozzarella, pomodoro e basilico fresco",
        price: "€ 10",
        glutenFree: true,
      },
      {
        name: "Tortino di Patate ripieno",
        description: "Funghi, salsiccia e mozzarella con fonduta di parmigiano",
        price: "€ 15",
      },
    ],
  },
  {
    title: "Primi Piatti",
    items: [
      {
        name: "Fusilloni TerraSinus",
        description: "Tonno fresco, pomodorini, Zucchina, Menta, Crumble di Tarallo su Fonduta di Pecorino",
        price: "€ 22",
        menuItem: true,
      },
      {
        name: "Linguine all'aragosta",
        price: "€ 30",
        menuItem: true,
      },
      {
        name: "Busiate al Gambero Rosso, Ricci e Crema di Pistacchio",
        description: "Gambero Rosso, Ricci, crema di Pistacchio",
        price: "€ 24",
      },
      {
        name: "Tonnarelli mantecati con Vongole, Bottarga al profumo di Limone",
        price: "€ 18",
      },
      {
        name: "Tonnarelli alla Carbonara di Mare",
        description: "Pesce spada marinato e affumicato, cozze, tuorlo d'uovo, pecorino romano",
        price: "€ 18",
      },
      {
        name: "Tonnarelli Cacio e Pepe con Tartare di Gambero",
        description: "Pecorino romano, pepe nero macinato fresco, Gambero",
        price: "€ 18",
      },
      {
        name: "Risotto con Crema di Patate e Zafferano, Cozze e Asparagi di Mare no glutine",
        price: "€ 16",
        glutenFree: true,
      },
      {
        name: "Ravioli ripieni di Scampi con Ragù di Cernia",
        price: "€ 22",
      },
      {
        name: "Tonnarelli all'Amatriciana",
        description: "Guanciale, pomodoro",
        price: "€ 14",
      },
      {
        name: "Busiate alla Norma",
        description: "Pomodoro, melanzane, ricotta salata",
        price: "€ 14",
      },
      {
        name: "Busiate Boscaiola",
        description: "Bolognese, prosciutto, funghi, panna",
        price: "€ 14",
      },
    ],
  },
  {
    title: "Secondi Piatti",
    items: [
      {
        name: "Pescato del Giorno no glutine",
        description: "€ 60 kg - Cottura a scelta: alla griglia, al forno, fritto, in zuppa, all'acqua pazza, al sale",
        price: "€ 60/kg",
        glutenFree: true,
      },
      {
        name: "Aragosta o Astice no glutine",
        description: "€ 120 kg",
        price: "€ 120/kg",
        glutenFree: true,
        menuItem: true,
      },
      {
        name: "Gamberoni alla Griglia no glutine",
        price: "€ 25",
        glutenFree: true,
      },
      {
        name: "Tagliata di Tonno in Crosta di Pistacchio o Sesamo no glutine",
        price: "€ 20",
        glutenFree: true,
      },
      {
        name: "Frittura Mista di Paranza",
        price: "€ 18",
      },
      {
        name: "Calamaro Arrosto o Fritto",
        price: "€ 18",
      },
      {
        name: "Pesce Spada alla Griglia no glutine",
        price: "€ 18",
        glutenFree: true,
      },
      {
        name: "Filetto di Manzo no glutine",
        description: "A scelta tra: pepe verde, al formaggio, ai funghi",
        price: "€ 18",
        glutenFree: true,
      },
    ],
  },
  {
    title: "Insalatone",
    items: [
      {
        name: "Terrasinus",
        description: "Misticanza, gamberi croccanti fritti, salsa dressing, crostini di pane",
        price: "€ 15",
      },
      {
        name: "Insalatona con Tartare di Tonno o di Salmone",
        description: "Iceberg, pomodorino, mais, radicchio, rucola, crostini di pane",
        price: "€ 15",
      },
      {
        name: "Cesar Salad",
        description: "Iceberg, carota, rucola, pomodorino, mais, pollo croccante, salsa dressing",
        price: "€ 13",
      },
      {
        name: "Italiana no glutine",
        description: "Iceberg, funghi freschi, rucola, pomodorini, mozzarella di bufala, scaglie di grana",
        price: "€ 10",
        glutenFree: true,
      },
    ],
  },
  {
    title: "Contorni",
    items: [
      {
        name: "Insalata Mista no glutine",
        description: "Iceberg, pomodoro, radicchio, mais, rucola",
        price: "€ 5",
        glutenFree: true,
      },
      {
        name: "Insalata verde no glutine",
        description: "Iceberg, valeriana, rucola",
        price: "€ 4",
        glutenFree: true,
      },
      {
        name: "Insalata Favarottara no glutine",
        description: "Pomodoro, cipolla, acciughe, olive, origano",
        price: "€ 5",
        glutenFree: true,
      },
      {
        name: "Patate al Forno no glutine",
        price: "€ 5",
        glutenFree: true,
      },
      {
        name: "Verdure Grigliate no glutine",
        price: "€ 6",
        glutenFree: true,
      },
    ],
  },
]

const dessertSection: MenuSection = {
  title: "Dessert",
  items: [
    {
      name: "Semifreddo alle mandorle",
      price: "€ 6",
      menuItem: true,
    },
    {
      name: "Tortino cuore caldo al cioccolato",
      price: "€ 6",
      menuItem: true,
    },
    {
      name: "Cannolo siciliano",
      price: "€ 8",
      menuItem: true,
    },
    {
      name: "Tiramisù no glutine",
      price: "€ 6",
      menuItem: true,
      glutenFree: true,
    },
    {
      name: "Panna cotta vari gusti",
      description: "Caramello, cioccolato, pistacchio, frutti di bosco",
      price: "€ 6",
      menuItem: true,
    },
    {
      name: "Sorbetto al limone vegan no glutine",
      price: "€ 4",
      menuItem: true,
      glutenFree: true,
    },
    {
      name: "Frutta di Stagione",
      price: "€ 4",
    },
  ],
}

const bevandeSection: MenuSection = {
  title: "Bevande",
  items: [
    {
      name: "Coca cola",
      description: "33 cl",
      price: "€ 3",
    },
    {
      name: "Coca cola zero",
      description: "33 cl",
      price: "€ 3",
    },
    {
      name: "Fanta",
      description: "33 cl",
      price: "€ 3",
    },
    {
      name: "Sprite",
      description: "33 cl",
      price: "€ 3",
    },
    {
      name: "The pesca - limone",
      description: "33 cl",
      price: "€ 3",
    },
    {
      name: "Acqua naturale - frizzante",
      price: "€ 3",
    },
    {
      name: "Ferrarelle",
      price: "€ 3",
    },
  ],
}

const viniSection: MenuSection = {
  title: "Vini",
  items: [
    {
      name: "Maria Costanza",
      description: "Inzolia - Chardonnay",
      price: "€ 36",
      menuItem: true,
    },
    {
      name: "Selezione di Famiglia",
      description: "Chardonnay",
      price: "€ 50",
      menuItem: true,
    },
    {
      name: "Maria Costanza Rosso",
      description: "Nero d'avola",
      price: "€ 50",
      menuItem: true,
    },
    {
      name: "Vignavella",
      description: "Catarratto",
      price: "€ 45",
      menuItem: true,
    },
    {
      name: "White label tola",
      description: "Insolia, Chardonnay",
      price: "€ 24",
      menuItem: true,
    },
    {
      name: "GranDuca",
      description: "Chardonnay",
      price: "€ 28",
      menuItem: true,
    },
    {
      name: "Festa D'agosto",
      description: "Catarratto Frizzante",
      price: "€ 24",
      menuItem: true,
    },
    {
      name: "La segreta",
      description: "Grecanico, Chardonnay, Viogrer, Fiano",
      price: "€ 24",
      menuItem: true,
    },
    {
      name: "La Fuga",
      description: "Chardonnay DOC",
      price: "€ 28",
      menuItem: true,
    },
    {
      name: "Anthilia",
      description: "Prevalenza Catarratto",
      price: "€ 25",
      menuItem: true,
    },
    {
      name: "Damarino",
      description: "Prevalenza Ansonica",
      price: "€ 25",
      menuItem: true,
    },
    {
      name: "Leone",
      description: "Catarratto - Pinot bianco - Sauvignon - Traminer",
      price: "€ 27",
      menuItem: true,
    },
    {
      name: "Regaleali",
      description: "Grecanico - Catarratto - Insolia - Chardonnay",
      price: "€ 25",
      menuItem: true,
    },
    {
      name: "Cavallo delle Fate",
      description: "Grillo",
      price: "€ 27",
      menuItem: true,
    },
    {
      name: "Lunario",
      description: "Grillo",
      price: "€ 23",
      menuItem: true,
    },
    {
      name: "Babbio",
      description: "Vitigno: assemblaggio di vitigni autoctoni a bacca bianca (Grillo, Zibibbo, Damaschino)",
      price: "€ 25",
      menuItem: true,
    },
    {
      name: "Kebrilla",
      description: "Grillo",
      price: "€ 22",
      menuItem: true,
    },
    {
      name: "Kikè",
      description: "Traminer - Sauvignon Blanc",
      price: "€ 24",
      menuItem: true,
    },
    {
      name: "Makisè",
      description: "Varietà Autoctone",
      price: "€ 25",
      menuItem: true,
    },
    {
      name: "Etna Bianco",
      description: "Carricante, Catarratto",
      price: "€ 45",
      menuItem: true,
    },
    {
      name: "Etna Rosso",
      description: "Nerello Mascalesr, Nerello Cappuccio",
      price: "€ 45",
      menuItem: true,
    },
    {
      name: "Ajbbaria",
      price: "€ 24",
      menuItem: true,
    },
    {
      name: "Kàrima",
      description: "Grillo DOC",
      price: "€ 20",
      menuItem: true,
    },
    {
      name: "Rayàn",
      description: "Chardonnay IGT",
      price: "€ 20",
      menuItem: true,
    },
    {
      name: "Aisha",
      description: "Catarratto IGT",
      price: "€ 22",
      menuItem: true,
    },
    {
      name: "Amàl",
      description: "Sirah IGT",
      price: "€ 12",
      menuItem: true,
    },
    {
      name: "Rabàh",
      description: "Nero D'avola DOC",
      price: "€ 12",
      menuItem: true,
    },
    {
      name: "Tarìq",
      description: "Merlot IGT",
      price: "€ 12",
      menuItem: true,
    },
  ],
}

const bollicineSection: MenuSection = {
  title: "Bollicine",
  items: [
    {
      name: "Bianco di Nera",
      description: "Nero cappuccio - Chardonnay - Inzolia",
      price: "€ 30",
      menuItem: true,
    },
    {
      name: "Rosè di Rosa",
      description: "Prevalenza Inzolia Rosa, Chardonnay",
      price: "€ 30",
      menuItem: true,
    },
    {
      name: "Charme",
      description: "Blend Uve Bianche Autoctone",
      price: "€ 27",
      menuItem: true,
    },
    {
      name: "Metodo Classico Brut",
      description: "Catarratto, Lucido, Chardonnay",
      price: "€ 37",
      menuItem: true,
    },
    {
      name: "TAURUS",
      description: "IGT",
      price: "€ 25",
      menuItem: true,
    },
    {
      name: "Anymus",
      description: "Catarratto - Grecanico",
      price: "€ 24",
      menuItem: true,
    },
    {
      name: "San jenì Couveèn Brut",
      description: "Chardonnay, Pinot, Pinot Nero",
      price: "€ 20",
      menuItem: true,
    },
    {
      name: "Berlucchi 61",
      description: "Chardonnay - Pinot Nero",
      price: "€ 40",
      menuItem: true,
    },
    {
      name: "Berlucchi 61 Rose'",
      description: "Chardonnay - Pinot Nero",
      price: "€ 40",
      menuItem: true,
    },
  ],
}

const champagneSection: MenuSection = {
  title: "Champagne",
  items: [
    {
      name: "Reserve Imperial",
      description: "Pinot Nero - Pinot Meunier - Chardonnay",
      price: "€ 80",
      menuItem: true,
    },
    {
      name: "Veuve Clicquot Brut",
      description: "Pinot Nero - Pinot Meunier - Chardonnay",
      price: "€ 85",
      menuItem: true,
    },
  ],
}

const birreSection: MenuSection = {
  title: "BIRRE",
  items: [
    {
      name: "HEINEKEN",
      description: "33 cl 5%Vol",
      price: "€ 4",
    },
    {
      name: "BECK'S",
      description: "33 cl 5%Vol",
      price: "€ 4",
    },
    {
      name: "CERES STRONG ALE",
      description: "33 cl 7,7%Vol",
      price: "€ 5",
    },
    {
      name: "CORONA",
      description: "33cl 4,5% Vol",
      price: "€ 5",
    },
    {
      name: "MESSINA",
      description: "33 cl 5%Vol",
      price: "€ 4",
    },
    {
      name: "PERONI",
      description: "33 cl 5%Vol",
      price: "€ 4",
    },
  ],
}

interface ExpandableSectionProps {
  title: string
  section: MenuSection | MenuSection[]
  isOpen: boolean
  onToggle: () => void
  customContent?: ReactNode
}

function ExpandableSection({ title, section, isOpen, onToggle, customContent }: ExpandableSectionProps) {
  const sections = Array.isArray(section) ? section : [section]
  
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 md:p-6 hover:bg-accent transition-colors text-card-foreground"
      >
        <h3 className="text-xl md:text-2xl font-bold">{title}</h3>
        {isOpen ? (
          <ChevronUp className="w-5 h-5" />
        ) : (
          <ChevronDown className="w-5 h-5" />
        )}
      </button>
      {isOpen && (
        <>
          {customContent ? (
            customContent
          ) : (
            <div className="border-t border-border p-4 md:p-6 space-y-8">
              {sections.map((sec, secIndex) => (
                <div key={secIndex} className="space-y-4">
                  <h4 className="text-lg md:text-xl font-bold border-b-2 border-primary/30 pb-2 text-card-foreground">
                    {sec.title}
                  </h4>
                  {sec.items.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 pb-4 border-b border-border/50 last:border-0 last:pb-0"
                    >
                      <div className="flex-1">
                        <div className="flex items-start gap-2 mb-1 flex-wrap">
                          <h5 className="text-base md:text-lg font-semibold text-card-foreground">{item.name}</h5>
                          {item.menuItem && (
                            <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded whitespace-nowrap font-medium">
                              Piatto menù
                            </span>
                          )}
                          {item.glutenFree && (
                            <span className="text-xs bg-green-600 text-white px-2 py-1 rounded whitespace-nowrap font-medium">
                              no glutine
                            </span>
                          )}
                        </div>
                        {item.description && (
                          <p className="text-sm md:text-base text-card-foreground/80 mt-1 leading-relaxed">
                            {item.description}
                          </p>
                        )}
                      </div>
                      <div className="text-base md:text-lg font-bold text-primary whitespace-nowrap md:ml-4">
                        {item.price}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default function MenuPage() {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    menuAllaCarta: false,
    dessert: false,
    bevande: false,
    vini: false,
    birre: false,
    allergeni: false,
  })

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  return (
    <main className="min-h-screen">
      <Navigation />
      
      <div className="container mx-auto px-4 py-24 md:py-32">
        <div className="max-w-4xl mx-auto space-y-12 md:space-y-16">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">Menù Terrasinus</h1>
          </div>

          {/* Menù Fisso */}
          <div className="bg-card border-2 border-primary/30 rounded-2xl p-6 md:p-8 space-y-6 shadow-lg">
            <div className="text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-2 text-card-foreground">{menuFisso.title}</h2>
              <p className="text-card-foreground/80 mb-4">{menuFisso.description}</p>
              <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                <p className="text-sm text-amber-900 dark:text-amber-200 font-semibold">
                  {menuFisso.warning}
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-3 text-card-foreground">Antipasti</h3>
                <ul className="space-y-2">
                  {menuFisso.courses.antipasti.map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-card-foreground/90">
                      <span className="text-primary mt-1 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3 text-card-foreground">Primi</h3>
                <ul className="space-y-2">
                  {menuFisso.courses.primi.map((item, index) => (
                    <li key={index} className={item === "oppure" ? "italic text-center py-2 text-card-foreground/70" : "flex items-start gap-2 text-card-foreground/90"}>
                      {item !== "oppure" && <span className="text-primary mt-1 font-bold">•</span>}
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3 text-card-foreground">Secondo</h3>
                <ul className="space-y-2">
                  {menuFisso.courses.secondo.map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-card-foreground/90">
                      <span className="text-primary mt-1 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3 text-card-foreground">Bevanda</h3>
                <ul className="space-y-2">
                  {menuFisso.courses.bevanda.map((item, index) => (
                    <li key={index} className={item.includes("a scelta") || item === "o" ? "italic text-center py-1 text-card-foreground/70" : "flex items-start gap-2 text-card-foreground/90"}>
                      {!item.includes("a scelta") && item !== "o" && <span className="text-primary mt-1 font-bold">•</span>}
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Sezioni Espandibili */}
          <div className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">I Nostri Menù</h2>
            
            <ExpandableSection
              title="Menù alla carta"
              section={menuSections}
              isOpen={openSections.menuAllaCarta}
              onToggle={() => toggleSection("menuAllaCarta")}
            />

            <ExpandableSection
              title="DESSERT"
              section={dessertSection}
              isOpen={openSections.dessert}
              onToggle={() => toggleSection("dessert")}
            />

            <ExpandableSection
              title="Bevande"
              section={bevandeSection}
              isOpen={openSections.bevande}
              onToggle={() => toggleSection("bevande")}
            />

            <ExpandableSection
              title="Vini"
              section={[viniSection, bollicineSection, champagneSection]}
              isOpen={openSections.vini}
              onToggle={() => toggleSection("vini")}
            />

            <ExpandableSection
              title="BIRRE"
              section={birreSection}
              isOpen={openSections.birre}
              onToggle={() => toggleSection("birre")}
            />
          </div>

          {/* Lista degli Allergeni - Sezione Espandibile */}
          <ExpandableSection
            title="Lista degli allergeni"
            section={{
              title: "Lista degli allergeni",
              items: [],
            }}
            isOpen={openSections.allergeni}
            onToggle={() => toggleSection("allergeni")}
            customContent={
              <div className="border-t border-border p-4 md:p-6 space-y-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-card-foreground/90 leading-relaxed mb-4">
                      <strong className="text-card-foreground">Regolamento CEE 1169/2011 D.L. n.109 del 27 gennaio 992 sezione III - D.L. n.114/2006</strong>
                    </p>
                    <p className="text-sm font-semibold text-amber-900 dark:text-amber-200 mb-6">
                      I nostri piatti possono contenere allergeni.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1">
                      <h4 className="font-semibold text-lg text-card-foreground">Glutine</h4>
                      <p className="text-sm text-card-foreground/85">cereali, grano, segale, orzo, avena, farro, kamut, inclusi ibridati derivati.</p>
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-semibold text-lg text-card-foreground">Crostacei e derivati</h4>
                      <p className="text-sm text-card-foreground/85">marini e d&apos;acqua dolce: gamberi, scampi, granchi e simili.</p>
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-semibold text-lg text-card-foreground">Uova</h4>
                      <p className="text-sm text-card-foreground/85">uova e prodotti che le contengono: maionese, emulsionanti, pasta all&apos;uovo.</p>
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-semibold text-lg text-card-foreground">Pesce e derivati</h4>
                      <p className="text-sm text-card-foreground/85">prodotti alimentari in cui è presente il pesce, anche in piccole percentuali.</p>
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-semibold text-lg text-card-foreground">Arachidi e derivati</h4>
                      <p className="text-sm text-card-foreground/85">Snack confezionati, creme e condimenti in cui vi sia anche in piccole dosi.</p>
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-semibold text-lg text-card-foreground">Soia e derivati</h4>
                      <p className="text-sm text-card-foreground/85">prodotti derivati come latte di soia, tofu, spaghetti di soia e simili</p>
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-semibold text-lg text-card-foreground">Molluschi e derivati</h4>
                      <p className="text-sm text-card-foreground/85">canestrello, cannolicchio, capasanta, cozza, ostrica, patella, vongola, tellina, ecc…</p>
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-semibold text-lg text-card-foreground">Sedano e derivati</h4>
                      <p className="text-sm text-card-foreground/85">sia in pezzi che all&apos;interno di preparati per zuppe, salse e concentrati vegetali.</p>
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-semibold text-lg text-card-foreground">Latte e derivati</h4>
                      <p className="text-sm text-card-foreground/85">ogni prodotto in cui viene usato il latte: yogurt, biscotti, torte, gelato e creme varie.</p>
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-semibold text-lg text-card-foreground">Anidride solforosa e solfiti</h4>
                      <p className="text-sm text-card-foreground/85">anidride solforosa e solfiti in concentrazione superiori a 10 mg/kg o 10 mg/l espressi come SO2 – usati come conservanti, possiamo trovarli in: conserve di prodotti ittici, in cibi sott&apos;aceto, sott&apos;olio e in salamoia, nelle marmellate, nell&apos;aceto, nei funghi secchi e nelle bibite analcoliche e succhi di frutta.</p>
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-semibold text-lg text-card-foreground">Frutta a guscio e derivati</h4>
                      <p className="text-sm text-card-foreground/85">mandorle, nocciole, noci comuni, noci di acagiù, noci pecan, anacardi, pistacchi</p>
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-semibold text-lg text-card-foreground">Lupini e derivati</h4>
                      <p className="text-sm text-card-foreground/85">presenti in cibi vegan sotto forma di: arrosti, salamini, farine e similari.</p>
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-semibold text-lg text-card-foreground">Semi di sesamo e derivati</h4>
                      <p className="text-sm text-card-foreground/85">semi interi usati per il pane, farine che lo contengono in minima percentuale.</p>
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-semibold text-lg text-card-foreground">Senape e derivati</h4>
                      <p className="text-sm text-card-foreground/85">si può trovare nelle salse e nei condimenti, specie nella mostarda</p>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-border">
                    <h4 className="font-semibold text-lg mb-4">Legenda dettagli dei piatti</h4>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <span className="text-lg">🌶️</span>
                        <div>
                          <strong className="text-card-foreground">Piccante</strong>
                          <p className="text-sm text-card-foreground/85">Il piatto è speziato e piccante</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="text-lg">🌱</span>
                        <div>
                          <strong className="text-card-foreground">Vegan</strong>
                          <p className="text-sm text-card-foreground/85">Il piatto è vegano</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="text-lg">✅</span>
                        <div>
                          <strong className="text-card-foreground">Senza Glutine</strong>
                          <p className="text-sm text-card-foreground/85">Il piatto è senza glutine e quindi adatto a tutte le persone intolleranti</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="text-lg">🆕</span>
                        <div>
                          <strong className="text-card-foreground">Novità</strong>
                          <p className="text-sm text-card-foreground/85">Il piatto è una novità appena aggiunta sul menù</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="text-lg">❄️</span>
                        <div>
                          <strong className="text-card-foreground">Prodotto abbattuto all&apos;origine o surgelato</strong>
                          <p className="text-sm text-card-foreground/85">Il piatto contiene un ingrediente surgelato o stato abbattuto all&apos;origine</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-border">
                    <p className="text-sm text-card-foreground/90 leading-relaxed">
                      Per evitare spiacevoli inconvenienti si prega di informare preventivamente il nostro personale nel caso di allergie o intolleranze alimentari o nel caso in cui si stia seguendo una dieta vegetariana. Siamo preparati per consigliarti nel migliore dei modi.
                    </p>
                  </div>
                </div>
              </div>
            }
          />

          {/* Lascia una Recensione */}
          <div className="text-center">
            <a
              href="https://www.google.com/search?hl=it-IT&gl=it&q=Ristorante+TerraSinus,+Piazzale+del+Mediterraneo,+6,+90049+Terrasini+PA&ludocid=14074348536276687501&lsig=AB86z5VVwP9PVMGVIb72M-YlVKSd#lrd=0x131991a49e22749f:0xc352216cb5cf9a8d,3"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-lg font-semibold shadow-lg"
          >
              <Star className="w-5 h-5" />
              <span>Lascia una Recensione</span>
            </a>
          </div>

          {/* Mappa */}
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="aspect-video w-full bg-muted relative">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.285346!2d13.0849444!3d38.1469444!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x131991a49e22749f%3A0xc352216cb5cf9a8d!2sRistorante%20TerraSinus!5e0!3m2!1sit!2sit!4v1698765432109!5m2!1sit!2sit"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
                title="Mappa Ristorante Terrasinus - Piazzale del Mediterraneo, 6, 90049 Terrasini PA"
              />
              {/* Fallback se l'iframe non carica */}
              <div className="absolute inset-0 flex items-center justify-center bg-muted/50 pointer-events-none opacity-0 hover:opacity-100 transition-opacity">
                <a
                  href="https://maps.app.goo.gl/HHESm7FGt7BpV1zJ8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pointer-events-auto px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
                >
                  Apri in Google Maps
                </a>
              </div>
            </div>
            <div className="p-4 text-center border-t border-border bg-card">
              <a
                href="https://maps.app.goo.gl/HHESm7FGt7BpV1zJ8"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary hover:underline font-medium transition-colors"
              >
                <MapPin className="w-5 h-5" />
                <span>Apri in Google Maps</span>
              </a>
            </div>
          </div>

          {/* Orari */}
          <div className="bg-card border border-border rounded-lg p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <Clock className="w-6 h-6 text-primary" />
              <h2 className="text-2xl md:text-3xl font-bold text-card-foreground">Orario</h2>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="font-semibold text-card-foreground">Lunedì</span>
                <span className="text-card-foreground/80 font-medium">CHIUSO</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="font-semibold text-card-foreground">Martedì</span>
                <span className="text-card-foreground/80 font-medium">12:00 - 15:00 | 19:00 - 23:00</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="font-semibold text-card-foreground">Mercoledì</span>
                <span className="text-card-foreground/80 font-medium">12:00 - 15:00 | 19:00 - 23:00</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="font-semibold text-card-foreground">Giovedì</span>
                <span className="text-card-foreground/80 font-medium">12:00 - 15:00 | 19:00 - 23:00</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="font-semibold text-card-foreground">Venerdì</span>
                <span className="text-card-foreground/80 font-medium">12:00 - 15:00 | 19:00 - 23:00</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="font-semibold text-card-foreground">Sabato</span>
                <span className="text-card-foreground/80 font-medium">12:00 - 15:00 | 19:00 - 23:00</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="font-semibold text-card-foreground">Domenica</span>
                <span className="text-card-foreground/80 font-medium">12:00 - 15:00 | 19:00 - 23:00</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
