"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus, FolderTree, FolderPlus, ImageIcon } from "lucide-react"
import type { ProductCategory, ProductSubcategory } from "@/types/product"
import { categories as userCategories } from "@/lib/products"
import { useToast } from "@/hooks/use-toast"

export default function AdminCategoriesPage() {
  const { toast } = useToast()
  // Seed from user-side categories for now; admin can add locally (not persisted yet)
  const [categories, setCategories] = useState<ProductCategory[]>(userCategories)
  const [selectedId, setSelectedId] = useState<string | null>(categories[0]?.id ?? null)

  // New Category form state
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [description, setDescription] = useState("")
  const [image, setImage] = useState("")

  // New Subcategory form state
  const [subName, setSubName] = useState("")
  const [subSlug, setSubSlug] = useState("")
  const [subDescription, setSubDescription] = useState("")

  const selectedCategory = useMemo(() => categories.find((c) => c.id === selectedId) || null, [categories, selectedId])

  const handleAddCategory = () => {
    if (!name.trim() || !slug.trim()) {
      toast({ title: "Name and slug are required", variant: "destructive" })
      return
    }
    const newCat: ProductCategory = {
      id: crypto.randomUUID(),
      name: name.trim(),
      slug: slug.trim(),
      description: description.trim(),
      image: image.trim() || "/placeholder.svg",
      subcategories: [],
    }
    setCategories((prev) => [newCat, ...prev])
    setSelectedId(newCat.id)
    // Reset form
    setName("")
    setSlug("")
    setDescription("")
    setImage("")
    toast({ title: "Category added (UI only)", description: "Not yet saved to backend. Wire API to persist." })
  }

  const handleAddSubcategory = () => {
    if (!selectedCategory) return
    if (!subName.trim() || !subSlug.trim()) {
      toast({ title: "Subcategory name and slug are required", variant: "destructive" })
      return
    }
    const newSub: ProductSubcategory = {
      id: crypto.randomUUID(),
      name: subName.trim(),
      slug: subSlug.trim(),
      description: subDescription.trim(),
    }
    setCategories((prev) =>
      prev.map((c) => (c.id === selectedCategory.id ? { ...c, subcategories: [newSub, ...(c.subcategories || [])] } : c)),
    )
    setSubName("")
    setSubSlug("")
    setSubDescription("")
    toast({ title: "Subcategory added (UI only)", description: "Not yet saved to backend. Wire API to persist." })
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <FolderTree className="w-6 h-6 text-rose-600" /> Categories
        </h1>
        <p className="text-gray-600 mt-1">Manage categories and subcategories. UI is ready for backend integration.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar: Category list + create */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Create Category</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
              <Input placeholder="Slug" value={slug} onChange={(e) => setSlug(e.target.value)} />
              <Textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
              <div className="flex items-center gap-2">
                <Input placeholder="Image URL" value={image} onChange={(e) => setImage(e.target.value)} />
                <ImageIcon className="w-5 h-5 text-gray-500" />
              </div>
              <Button className="w-full" onClick={handleAddCategory}>
                <Plus className="w-4 h-4 mr-1" /> Add Category
              </Button>
              <p className="text-xs text-gray-500">This adds locally. Hook API to persist.</p>
            </CardContent>
          </Card>

          <Separator className="my-4" />

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Categories</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[420px]">
                <div className="flex flex-col">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedId(cat.id)}
                      className={`flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 ${
                        selectedId === cat.id ? "bg-rose-50" : ""
                      }`}
                    >
                      <div className="relative w-10 h-10 rounded-md overflow-hidden border">
                        <Image src={cat.image || "/placeholder.svg"} alt={cat.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{cat.name}</div>
                        <div className="text-xs text-gray-600">/{cat.slug}</div>
                      </div>
                      <Badge variant="secondary">{cat.subcategories?.length || 0}</Badge>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Main: Category detail & subcategories */}
        <div className="lg:col-span-3">
          {selectedCategory ? (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="relative w-16 h-16 rounded-md overflow-hidden border">
                    <Image
                      src={selectedCategory.image || "/placeholder.svg"}
                      alt={selectedCategory.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{selectedCategory.name}</CardTitle>
                    <div className="text-sm text-gray-600">/{selectedCategory.slug}</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium mb-1">Description</h3>
                  <p className="text-sm text-gray-700">{selectedCategory.description || "—"}</p>
                </div>

                <Separator />

                <div>
                  <h3 className="text-sm font-medium mb-3">Subcategories</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {(selectedCategory.subcategories || []).map((sub) => (
                      <div key={sub.id} className="border rounded-lg p-3">
                        <div className="font-medium">{sub.name}</div>
                        <div className="text-xs text-gray-600 mb-1">/{sub.slug}</div>
                        <p className="text-sm text-gray-700">{sub.description || "—"}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 border rounded-lg p-4">
                    <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                      <FolderPlus className="w-4 h-4" /> Add Subcategory (UI only)
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      <Input placeholder="Name" value={subName} onChange={(e) => setSubName(e.target.value)} />
                      <Input placeholder="Slug" value={subSlug} onChange={(e) => setSubSlug(e.target.value)} />
                      <Input
                        placeholder="Description"
                        value={subDescription}
                        onChange={(e) => setSubDescription(e.target.value)}
                      />
                    </div>
                    <div className="mt-2">
                      <Button size="sm" onClick={handleAddSubcategory}>
                        <Plus className="w-4 h-4 mr-1" /> Add Subcategory
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Adds locally. Wire API to persist.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-10 text-center text-gray-600">Select a category to view details</CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
