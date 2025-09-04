"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { updateAdminCategory } from "@/lib/admin-categories"

type CategoryData = {
  name: string
  slug: string
  description: string
  image: string
}

export default function EditCategoryPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [category, setCategory] = useState<CategoryData>({
    name: '',
    slug: '',
    description: '',
    image: ''
  })

  // Fetch category data
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'https://ira-be.onrender.com/api'}/admin/categories/${params.id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
            'accept': 'application/json'
          }
        })
        if (!response.ok) throw new Error('Failed to fetch category')
        const data = await response.json()
        setCategory(data)
      } catch (error) {
        console.error('Error fetching category:', error)
        toast({
          title: "Error",
          description: "Failed to load category data",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchCategory()
    }
  }, [params.id, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      await updateAdminCategory(params.id as string, {
        name: category.name,
        slug: category.slug,
        description: category.description,
        image: category.image
      })

      toast({
        title: "Success",
        description: "Category updated successfully",
      })
      
      router.push('/admin/categories')
    } catch (error: any) {
      console.error('Error updating category:', error)
      toast({
        title: "Error",
        description: error?.message || "Failed to update category. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setCategory(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/categories">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold ml-2">Edit Category</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Category Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none" htmlFor="name">
                  Name
                </label>
                <Input
                  id="name"
                  name="name"
                  value={category.name}
                  onChange={handleChange}
                  placeholder="Category name"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium leading-none" htmlFor="slug">
                  Slug
                </label>
                <Input
                  id="slug"
                  name="slug"
                  value={category.slug}
                  onChange={handleChange}
                  placeholder="category-slug"
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium leading-none" htmlFor="description">
                  Description
                </label>
                <Textarea
                  id="description"
                  name="description"
                  value={category.description}
                  onChange={handleChange}
                  placeholder="Category description"
                  rows={4}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium leading-none" htmlFor="image">
                  Image URL
                </label>
                <Input
                  id="image"
                  name="image"
                  type="url"
                  value={category.image}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                />
                {category.image && (
                  <div className="mt-2">
                    <p className="text-sm text-muted-foreground mb-1">Preview:</p>
                    <div className="relative w-32 h-32 border rounded-md overflow-hidden">
                      <img
                        src={category.image}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = '/placeholder.svg'
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <Button type="button" variant="outline" onClick={() => router.push('/admin/categories')}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
