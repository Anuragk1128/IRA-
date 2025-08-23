"use client"

import { useState } from "react"
import { X, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import type { FilterGroup, ProductFilters } from "@/types/filters"

interface SearchFiltersProps {
  filterGroups: FilterGroup[]
  appliedFilters: ProductFilters
  onFiltersChange: (filters: ProductFilters) => void
  onClearFilters: () => void
}

export function SearchFilters({ filterGroups, appliedFilters, onFiltersChange, onClearFilters }: SearchFiltersProps) {
  const [priceRange, setPriceRange] = useState<[number, number]>(appliedFilters.priceRange || [0, 500])

  const handleMaterialChange = (material: string, checked: boolean) => {
    const currentMaterials = appliedFilters.materials || []
    const newMaterials = checked ? [...currentMaterials, material] : currentMaterials.filter((m) => m !== material)

    onFiltersChange({
      ...appliedFilters,
      materials: newMaterials.length > 0 ? newMaterials : undefined,
    })
  }

  const handleColorChange = (color: string, checked: boolean) => {
    const currentColors = appliedFilters.colors || []
    const newColors = checked ? [...currentColors, color] : currentColors.filter((c) => c !== color)

    onFiltersChange({
      ...appliedFilters,
      colors: newColors.length > 0 ? newColors : undefined,
    })
  }

  const handleSizeChange = (size: string, checked: boolean) => {
    const currentSizes = appliedFilters.sizes || []
    const newSizes = checked ? [...currentSizes, size] : currentSizes.filter((s) => s !== size)

    onFiltersChange({
      ...appliedFilters,
      sizes: newSizes.length > 0 ? newSizes : undefined,
    })
  }

  const handleRatingChange = (rating: string) => {
    onFiltersChange({
      ...appliedFilters,
      rating: rating ? Number.parseInt(rating) : undefined,
    })
  }

  const handlePriceRangeChange = (range: [number, number]) => {
    setPriceRange(range)
    onFiltersChange({
      ...appliedFilters,
      priceRange: range,
    })
  }

  const handleInStockChange = (checked: boolean) => {
    onFiltersChange({
      ...appliedFilters,
      inStock: checked ? true : undefined,
    })
  }

  const getActiveFilterCount = () => {
    let count = 0
    if (appliedFilters.materials?.length) count += appliedFilters.materials.length
    if (appliedFilters.colors?.length) count += appliedFilters.colors.length
    if (appliedFilters.sizes?.length) count += appliedFilters.sizes.length
    if (appliedFilters.rating) count += 1
    if (appliedFilters.priceRange) count += 1
    if (appliedFilters.inStock) count += 1
    return count
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {getActiveFilterCount() > 0 && <Badge variant="secondary">{getActiveFilterCount()}</Badge>}
          </CardTitle>
          {getActiveFilterCount() > 0 && (
            <Button variant="ghost" size="sm" onClick={onClearFilters}>
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Price Range */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Price Range</Label>
          <div className="px-2">
            <Slider
              value={priceRange}
              onValueChange={handlePriceRangeChange}
              max={500}
              min={0}
              step={10}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground mt-2">
              <span>₹{priceRange[0]}</span>
              <span>₹{priceRange[1]}</span>
            </div>
          </div>
        </div>

        {/* Availability */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Availability</Label>
          <div className="flex items-center space-x-2">
            <Checkbox id="inStock" checked={appliedFilters.inStock || false} onCheckedChange={handleInStockChange} />
            <Label htmlFor="inStock" className="text-sm">
              In Stock Only
            </Label>
          </div>
        </div>

        {/* Dynamic Filter Groups */}
        {filterGroups.map((group) => (
          <Collapsible key={group.id} defaultOpen>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-0 h-auto">
                <Label className="text-sm font-medium">{group.name}</Label>
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-2 mt-3">
              {group.type === "checkbox" && (
                <div className="space-y-2">
                  {group.options.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`${group.id}-${option.value}`}
                        checked={
                          group.id === "materials"
                            ? appliedFilters.materials?.includes(option.value) || false
                            : group.id === "colors"
                              ? appliedFilters.colors?.includes(option.value) || false
                              : group.id === "sizes"
                                ? appliedFilters.sizes?.includes(option.value) || false
                                : false
                        }
                        onCheckedChange={(checked) => {
                          if (group.id === "materials") handleMaterialChange(option.value, checked as boolean)
                          if (group.id === "colors") handleColorChange(option.value, checked as boolean)
                          if (group.id === "sizes") handleSizeChange(option.value, checked as boolean)
                        }}
                      />
                      <Label htmlFor={`${group.id}-${option.value}`} className="text-sm flex-1">
                        {option.label} ({option.count})
                      </Label>
                    </div>
                  ))}
                </div>
              )}

              {group.type === "radio" && group.id === "rating" && (
                <RadioGroup value={appliedFilters.rating?.toString() || ""} onValueChange={handleRatingChange}>
                  {group.options.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={option.value} id={`rating-${option.value}`} />
                      <Label htmlFor={`rating-${option.value}`} className="text-sm">
                        {option.label} ({option.count})
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}
            </CollapsibleContent>
          </Collapsible>
        ))}
      </CardContent>
    </Card>
  )
}
