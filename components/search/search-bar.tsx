"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { getPopularSearches } from "@/lib/search"

interface SearchBarProps {
  initialQuery?: string
  onSearch?: (query: string) => void
  placeholder?: string
  showSuggestions?: boolean
}

export function SearchBar({
  initialQuery = "",
  onSearch,
  placeholder = "Search jewelry...",
  showSuggestions = true,
}: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery)
  const [showDropdown, setShowDropdown] = useState(false)
  const [suggestions] = useState(getPopularSearches())
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setQuery(initialQuery)
  }, [initialQuery])

  const handleSearch = (searchQuery: string = query) => {
    if (onSearch) {
      onSearch(searchQuery)
    } else {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
    setShowDropdown(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    } else if (e.key === "Escape") {
      setShowDropdown(false)
    }
  }

  const handleClear = () => {
    setQuery("")
    inputRef.current?.focus()
  }

  return (
    <div className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => showSuggestions && setShowDropdown(true)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
          placeholder={placeholder}
          className="pl-10 pr-10 bg-muted/50 border-0 focus-visible:ring-1"
        />
        {query && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
            onClick={handleClear}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {showDropdown && showSuggestions && (
        <Card className="absolute top-full left-0 right-0 mt-1 z-50 max-h-64 overflow-y-auto">
          <div className="p-2">
            <div className="text-xs font-medium text-muted-foreground mb-2 px-2">Popular Searches</div>
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                className="w-full text-left px-2 py-2 text-sm hover:bg-muted rounded-sm transition-colors"
                onClick={() => handleSearch(suggestion)}
              >
                <Search className="h-3 w-3 inline mr-2 text-muted-foreground" />
                {suggestion}
              </button>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
