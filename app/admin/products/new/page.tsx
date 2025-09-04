"use client"

import { useState, FormEvent, useEffect, useMemo, useRef } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { createAdminProduct, type CreateAdminProductInput } from "@/lib/admin-products"
import { fetchAdminCategories } from "@/lib/admin-categories"
import type { ProductCategory, ProductSubcategory } from "@/types/product"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function NewProductPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [categories, setCategories] = useState<ProductCategory[]>([])
  const [catLoading, setCatLoading] = useState<boolean>(true)
  const [categoryId, setCategoryId] = useState<string>("")
  const [subcategoryId, setSubcategoryId] = useState<string>("")

  // Product fields excluding category/subcategory which now use IDs
  const [form, setForm] = useState<Omit<CreateAdminProductInput, "categoryId" | "subcategoryId">>({
    name: "",
    description: "",
    price: 0,
    originalPrice: undefined,
    images: [],
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
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [cloudName, setCloudName] = useState<string | null>(null)
  const [uploadPreset, setUploadPreset] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      setCatLoading(true)
      try {
        const list = await fetchAdminCategories()
        setCategories(list)
      } catch (err) {
        toast({ title: "Failed to load categories", description: err instanceof Error ? err.message : "", variant: "destructive" })
      } finally {
        setCatLoading(false)
      }
    }
    load()
    // Initialize Cloudinary config from env (compiled) or localStorage as fallback
    const envCloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || ""
    const envPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || ""
    const lsCloud = typeof window !== "undefined" ? localStorage.getItem("cloudinary_cloud_name") || "" : ""
    const lsPreset = typeof window !== "undefined" ? localStorage.getItem("cloudinary_upload_preset") || "" : ""
    setCloudName(envCloud || lsCloud || null)
    setUploadPreset(envPreset || lsPreset || null)
  }, [toast])

  // Upload a single file to Cloudinary (unsigned) and append URL to imagesInput
  const handleImageUpload = async (file: File) => {
    if (!cloudName || !uploadPreset) {
      toast({
        title: "Missing Cloudinary config",
        description: "Provide Cloudinary Cloud Name and Unsigned Upload Preset below or set NEXT_PUBLIC_* envs and restart.",
        variant: "destructive",
      })
      return
    }

    const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`
    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", uploadPreset)

    setIsUploading(true)
    try {
      const res = await fetch(url, { method: "POST", body: formData })
      if (!res.ok) {
        let message = `Upload failed (${res.status})`
        try {
          const err = await res.json()
          message = err?.error?.message || JSON.stringify(err) || message
        } catch {}
        throw new Error(message)
      }
      const data = await res.json()
      const secureUrl: string | undefined = data?.secure_url
      if (!secureUrl) throw new Error("No secure_url in Cloudinary response")
      setImagesInput((prev) => (prev ? `${prev}\n${secureUrl}` : secureUrl))
      toast({ title: "Image uploaded", description: "Added to Images list" })
    } catch (err) {
      toast({
        title: "Upload error",
        description: err instanceof Error ? err.message : "",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const subcategories: ProductSubcategory[] = useMemo(() => {
    const cat = categories.find((c) => c.id === categoryId)
    return cat?.subcategories || []
  }, [categories, categoryId])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const payload: CreateAdminProductInput = {
        ...form,
        images: imagesInput
          .split(/\n|,/) // allow comma or newline separated
          .map((s) => s.trim())
          .filter(Boolean),
        tags: tagsInput
          .split(/\n|,/) // allow comma or newline separated
          .map((s) => s.trim())
          .filter(Boolean),
        categoryId,
        subcategoryId: subcategoryId || undefined,
      }

      // Remove undefined optional fields to keep payload clean
      const cleanPayload = Object.fromEntries(
        Object.entries(payload).filter(([_, v]) => v !== undefined)
      ) as CreateAdminProductInput

      if (!cleanPayload.categoryId) {
        throw new Error("Please select a category")
      }

      await createAdminProduct(cleanPayload)

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
                <Select value={categoryId} onValueChange={(val) => { setCategoryId(val); setSubcategoryId("") }}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={catLoading ? "Loading..." : "Select category"} />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subcategory">Subcategory (optional)</Label>
                <Select value={subcategoryId} onValueChange={setSubcategoryId} disabled={!categoryId}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={!categoryId ? "Select category first" : (subcategories.length ? "Select subcategory" : "No subcategories") } />
                  </SelectTrigger>
                  <SelectContent>
                    {subcategories.map((s) => (
                      <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
              {/* Cloudinary config helper - shown if not configured via env or localStorage */}
              {(!cloudName || !uploadPreset) && (
                <div className="p-3 border rounded-md bg-amber-50 text-amber-900 space-y-2">
                  <p className="text-sm font-medium">Cloudinary configuration required</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <Label htmlFor="cloudName">Cloud Name</Label>
                      <Input
                        id="cloudName"
                        placeholder="your_cloud_name"
                        value={cloudName ?? ""}
                        onChange={(e) => setCloudName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="uploadPreset">Unsigned Upload Preset</Label>
                      <Input
                        id="uploadPreset"
                        placeholder="your_unsigned_preset"
                        value={uploadPreset ?? ""}
                        onChange={(e) => setUploadPreset(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => {
                        if (typeof window !== "undefined") {
                          if (cloudName) localStorage.setItem("cloudinary_cloud_name", cloudName)
                          if (uploadPreset) localStorage.setItem("cloudinary_upload_preset", uploadPreset)
                        }
                        toast({ title: "Cloudinary config saved" })
                      }}
                    >
                      Save
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        if (typeof window !== "undefined") {
                          localStorage.removeItem("cloudinary_cloud_name")
                          localStorage.removeItem("cloudinary_upload_preset")
                        }
                        setCloudName(process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || null)
                        setUploadPreset(process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || null)
                        toast({ title: "Cleared local Cloudinary config" })
                      }}
                    >
                      Reset
                    </Button>
                  </div>
                  <p className="text-xs text-amber-700">Tip: add NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET to .env.local and restart dev server for a permanent setup.</p>
                </div>
              )}
              <div className="flex items-center gap-3">
                {/* Hidden native file input to ensure proper file picker behavior */}
                <input
                  ref={fileInputRef}
                  id="image-file"
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={async () => {
                    const files = Array.from(fileInputRef.current?.files || [])
                    for (const f of files) {
                      await handleImageUpload(f)
                    }
                    // Reset the input so same file(s) can be selected again if needed
                    if (fileInputRef.current) fileInputRef.current.value = ""
                  }}
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading || !cloudName || !uploadPreset}
                >
                  {isUploading ? "Uploading..." : "Upload from device"}
                </Button>
              </div>
              {imagesInput && (
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2 pt-2">
                  {imagesInput
                    .split(/\n|,/)
                    .map((s) => s.trim())
                    .filter(Boolean)
                    .map((src, idx) => (
                      <div key={idx} className="relative w-full aspect-square overflow-hidden rounded border">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={src} alt={`img-${idx}`} className="h-full w-full object-cover" />
                      </div>
                    ))}
                </div>
              )}
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
