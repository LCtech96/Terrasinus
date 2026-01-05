"use client"

import { useState } from "react"
import { EditableText } from "./EditableText"
import { Plus, Trash2 } from "lucide-react"

interface MenuFisso {
  title: string
  description: string
  warning: string
  courses: {
    antipasti: string[]
    primi: string[]
    secondo: string[]
    bevanda: string[]
  }
}

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

interface MenuEditorProps {
  menuFisso: MenuFisso
  menuSections: MenuSection[]
  onMenuFissoChange: (menuFisso: MenuFisso) => void
  onMenuSectionsChange: (sections: MenuSection[]) => void
}

export function MenuEditor({
  menuFisso,
  menuSections,
  onMenuFissoChange,
  onMenuSectionsChange,
}: MenuEditorProps) {
  const [activeTab, setActiveTab] = useState<"fisso" | "carta">("fisso")

  const updateMenuFisso = (key: keyof MenuFisso, value: any) => {
    onMenuFissoChange({ ...menuFisso, [key]: value })
  }

  const updateMenuFissoCourse = (course: keyof MenuFisso["courses"], index: number, value: string) => {
    const updatedCourses = { ...menuFisso.courses }
    updatedCourses[course] = [...updatedCourses[course]]
    updatedCourses[course][index] = value
    updateMenuFisso("courses", updatedCourses)
  }

  const addMenuFissoCourseItem = (course: keyof MenuFisso["courses"]) => {
    const updatedCourses = { ...menuFisso.courses }
    updatedCourses[course] = [...updatedCourses[course], "Nuovo elemento"]
    updateMenuFisso("courses", updatedCourses)
  }

  const removeMenuFissoCourseItem = (course: keyof MenuFisso["courses"], index: number) => {
    const updatedCourses = { ...menuFisso.courses }
    updatedCourses[course] = updatedCourses[course].filter((_, i) => i !== index)
    updateMenuFisso("courses", updatedCourses)
  }

  const updateMenuItem = (sectionIndex: number, itemIndex: number, field: keyof MenuItem, value: any) => {
    const updatedSections = [...menuSections]
    updatedSections[sectionIndex] = {
      ...updatedSections[sectionIndex],
      items: updatedSections[sectionIndex].items.map((item, i) =>
        i === itemIndex ? { ...item, [field]: value } : item
      ),
    }
    onMenuSectionsChange(updatedSections)
  }

  const addMenuItem = (sectionIndex: number) => {
    const updatedSections = [...menuSections]
    updatedSections[sectionIndex] = {
      ...updatedSections[sectionIndex],
      items: [
        ...updatedSections[sectionIndex].items,
        { name: "Nuovo piatto", price: "€ 0", description: "" },
      ],
    }
    onMenuSectionsChange(updatedSections)
  }

  const removeMenuItem = (sectionIndex: number, itemIndex: number) => {
    const updatedSections = [...menuSections]
    updatedSections[sectionIndex] = {
      ...updatedSections[sectionIndex],
      items: updatedSections[sectionIndex].items.filter((_, i) => i !== itemIndex),
    }
    onMenuSectionsChange(updatedSections)
  }

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2 border-b border-border">
        <button
          onClick={() => setActiveTab("fisso")}
          className={`px-4 py-2 font-semibold transition-colors ${
            activeTab === "fisso"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Menù Fisso
        </button>
        <button
          onClick={() => setActiveTab("carta")}
          className={`px-4 py-2 font-semibold transition-colors ${
            activeTab === "carta"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Menù alla Carta
        </button>
      </div>

      {/* Menu Fisso Editor */}
      {activeTab === "fisso" && (
        <div className="space-y-6 p-4 bg-card border border-border rounded-lg">
          <EditableText
            value={menuFisso.title}
            onSave={(value) => updateMenuFisso("title", value)}
            tag="h3"
            className="text-2xl font-bold"
          />
          <EditableText
            value={menuFisso.description}
            onSave={(value) => updateMenuFisso("description", value)}
            tag="p"
            className="text-muted-foreground"
            multiline
          />
          <EditableText
            value={menuFisso.warning}
            onSave={(value) => updateMenuFisso("warning", value)}
            tag="p"
            className="text-sm text-amber-600"
            multiline
          />

          {/* Antipasti */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">Antipasti</h4>
              <button
                onClick={() => addMenuFissoCourseItem("antipasti")}
                className="p-1 bg-primary text-primary-foreground rounded"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            {menuFisso.courses.antipasti.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <EditableText
                  value={item}
                  onSave={(value) => updateMenuFissoCourse("antipasti", index, value)}
                  tag="span"
                  className="flex-1"
                />
                <button
                  onClick={() => removeMenuFissoCourseItem("antipasti", index)}
                  className="p-1 bg-red-600 text-white rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Primi */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">Primi</h4>
              <button
                onClick={() => addMenuFissoCourseItem("primi")}
                className="p-1 bg-primary text-primary-foreground rounded"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            {menuFisso.courses.primi.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <EditableText
                  value={item}
                  onSave={(value) => updateMenuFissoCourse("primi", index, value)}
                  tag="span"
                  className="flex-1"
                />
                <button
                  onClick={() => removeMenuFissoCourseItem("primi", index)}
                  className="p-1 bg-red-600 text-white rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Secondo */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">Secondo</h4>
              <button
                onClick={() => addMenuFissoCourseItem("secondo")}
                className="p-1 bg-primary text-primary-foreground rounded"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            {menuFisso.courses.secondo.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <EditableText
                  value={item}
                  onSave={(value) => updateMenuFissoCourse("secondo", index, value)}
                  tag="span"
                  className="flex-1"
                />
                <button
                  onClick={() => removeMenuFissoCourseItem("secondo", index)}
                  className="p-1 bg-red-600 text-white rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Bevanda */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">Bevanda</h4>
              <button
                onClick={() => addMenuFissoCourseItem("bevanda")}
                className="p-1 bg-primary text-primary-foreground rounded"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            {menuFisso.courses.bevanda.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <EditableText
                  value={item}
                  onSave={(value) => updateMenuFissoCourse("bevanda", index, value)}
                  tag="span"
                  className="flex-1"
                />
                <button
                  onClick={() => removeMenuFissoCourseItem("bevanda", index)}
                  className="p-1 bg-red-600 text-white rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Menu alla Carta Editor */}
      {activeTab === "carta" && (
        <div className="space-y-6">
          {menuSections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="p-4 bg-card border border-border rounded-lg space-y-4">
              <div className="flex items-center justify-between">
                <EditableText
                  value={section.title}
                  onSave={(value) => {
                    const updated = [...menuSections]
                    updated[sectionIndex] = { ...section, title: value }
                    onMenuSectionsChange(updated)
                  }}
                  tag="h4"
                  className="text-xl font-bold"
                />
                <button
                  onClick={() => addMenuItem(sectionIndex)}
                  className="p-2 bg-primary text-primary-foreground rounded"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                {section.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="p-3 bg-background border border-border rounded space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <EditableText
                        value={item.name}
                        onSave={(value) => updateMenuItem(sectionIndex, itemIndex, "name", value)}
                        tag="h4"
                        className="font-semibold flex-1"
                      />
                      <button
                        onClick={() => removeMenuItem(sectionIndex, itemIndex)}
                        className="p-1 bg-red-600 text-white rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <EditableText
                      value={item.description || ""}
                      onSave={(value) => updateMenuItem(sectionIndex, itemIndex, "description", value)}
                      tag="p"
                      className="text-sm text-muted-foreground"
                      multiline
                    />
                    <EditableText
                      value={item.price}
                      onSave={(value) => updateMenuItem(sectionIndex, itemIndex, "price", value)}
                      tag="span"
                      className="font-bold text-primary"
                    />
                    <div className="flex gap-2">
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={item.glutenFree || false}
                          onChange={(e) => updateMenuItem(sectionIndex, itemIndex, "glutenFree", e.target.checked)}
                        />
                        Senza Glutine
                      </label>
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={item.menuItem || false}
                          onChange={(e) => updateMenuItem(sectionIndex, itemIndex, "menuItem", e.target.checked)}
                        />
                        Piatto Menù
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

