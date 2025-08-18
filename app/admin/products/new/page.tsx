"use client"

import { useState, FormEvent } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { createProduct } from "@/lib/admin-products"
import type { CreateProductInput } from "@/types/product"

export default function NewProductPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [form, setForm] = useState<CreateProductInput>({
    name: "",
    description: "",
    price: 0,
    originalPrice: undefined,
    images: [],
    category: "",
    subcategory: undefined,
    material: "",
    color: "",
    size: undefined,
    inStock: true,
    rating: 0,
    reviewCount: 0,
    tags: [],
    featured: false,
    bestseller: false,
    newArrival: false,
  })

  const [imagesInput, setImagesInput] = useState("")
  const [tagsInput, setTagsInput] = useState("")

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const payload: CreateProductInput = {
        ...form,
        images: imagesInput
          .split(/\n|,/) // allow comma or newline separated
          .map((s) => s.trim())
          .filter(Boolean),
        tags: tagsInput
          .split(/\n|,/) // allow comma or newline separated
          .map((s) => s.trim())
          .filter(Boolean),
      }

      // Remove undefined optional fields to keep payload clean
      const cleanPayload = Object.fromEntries(
        Object.entries(payload).filter(([_, v]) => v !== undefined)
      ) as CreateProductInput

      await createProduct(cleanPayload)

      toast({
        title: "Product created",
        description: `Successfully created ${payload.name}`,
      })
      router.push("/admin/products")
    } catch (err) {
      toast({
        title: "Failed to create product",
        description: err instanceof Error ? err.message : "",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="p-8">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Create New Product</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  min={0}
                  step="0.01"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="originalPrice">Original Price (optional)</Label>
                <Input
                  id="originalPrice"
                  type="number"
                  min={0}
                  step="0.01"
                  value={form.originalPrice ?? ""}
                  onChange={(e) =>
                    setForm({ ...form, originalPrice: e.target.value === "" ? undefined : Number(e.target.value) })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  placeholder="e.g. Ring"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subcategory">Subcategory (optional)</Label>
                <Input
                  id="subcategory"
                  placeholder="e.g. Cocktail Ring"
                  value={form.subcategory ?? ""}
                  onChange={(e) => setForm({ ...form, subcategory: e.target.value || undefined })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="material">Material</Label>
                <Input
                  id="material"
                  placeholder="e.g. Copper"
                  value={form.material}
                  onChange={(e) => setForm({ ...form, material: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="color">Color</Label>
                <Input
                  id="color"
                  placeholder="e.g. Gold"
                  value={form.color}
                  onChange={(e) => setForm({ ...form, color: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="size">Size (optional)</Label>
                <Input
                  id="size"
                  placeholder="e.g. 7 / Adjustable"
                  value={form.size ?? ""}
                  onChange={(e) => setForm({ ...form, size: e.target.value || undefined })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="images">Images (comma or newline separated URLs)</Label>
              <Textarea
                id="images"
                placeholder="https://...\nhttps://..."
                value={imagesInput}
                onChange={(e) => setImagesInput(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="inStock">In Stock</Label>
                <Switch id="inStock" checked={form.inStock} onCheckedChange={(v) => setForm({ ...form, inStock: v })} />
              </div>
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="featured">Featured</Label>
                <Switch id="featured" checked={form.featured ?? false} onCheckedChange={(v) => setForm({ ...form, featured: v })} />
              </div>
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="bestseller">Bestseller</Label>
                <Switch id="bestseller" checked={form.bestseller ?? false} onCheckedChange={(v) => setForm({ ...form, bestseller: v })} />
              </div>
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="newArrival">New Arrival</Label>
                <Switch id="newArrival" checked={form.newArrival ?? false} onCheckedChange={(v) => setForm({ ...form, newArrival: v })} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rating">Rating (0-5, optional)</Label>
                <Input
                  id="rating"
                  type="number"
                  min={0}
                  max={5}
                  step="0.1"
                  value={form.rating ?? 0}
                  onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reviewCount">Review Count (optional)</Label>
                <Input
                  id="reviewCount"
                  type="number"
                  min={0}
                  step="1"
                  value={form.reviewCount ?? 0}
                  onChange={(e) => setForm({ ...form, reviewCount: Number(e.target.value) })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma or newline separated)</Label>
              <Textarea
                id="tags"
                placeholder="e.g. string, elegant, gift"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => router.push("/admin/products")}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Creating..." : "Create Product"}</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
