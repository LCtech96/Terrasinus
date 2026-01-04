export function Orari() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">Orari di Apertura</h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center py-2 border-b border-border">
            <span className="font-semibold">Lunedì</span>
            <span className="text-muted-foreground font-medium">CHIUSO</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-border">
            <span className="font-semibold">Martedì</span>
            <span className="text-muted-foreground font-medium">12:00 - 15:00 | 19:00 - 23:00</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-border">
            <span className="font-semibold">Mercoledì</span>
            <span className="text-muted-foreground font-medium">12:00 - 15:00 | 19:00 - 23:00</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-border">
            <span className="font-semibold">Giovedì</span>
            <span className="text-muted-foreground font-medium">12:00 - 15:00 | 19:00 - 23:00</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-border">
            <span className="font-semibold">Venerdì</span>
            <span className="text-muted-foreground font-medium">12:00 - 15:00 | 19:00 - 23:00</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-border">
            <span className="font-semibold">Sabato</span>
            <span className="text-muted-foreground font-medium">12:00 - 15:00 | 19:00 - 23:00</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="font-semibold">Domenica</span>
            <span className="text-muted-foreground font-medium">12:00 - 15:00 | 19:00 - 23:00</span>
          </div>
        </div>
      </div>
    </div>
  )
}

