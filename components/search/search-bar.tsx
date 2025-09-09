"use client"

import type React from "react"

import { useState, useRef, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { getPopularSearches, searchProducts } from "@/lib/search"

interface SearchBarProps {
  initialQuery?: string
  onSearch?: (query: string) => void
  placeholder?: string
  showSuggestions?: boolean
}

export function SearchBar({
  initialQuery = "",
  onSearch,
  placeholder = "",
  showSuggestions = true,
}: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery)
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [isFocused, setIsFocused] = useState(false)

  // Animated placeholder state (cycles popular searches word-by-word)
  const popular = useMemo(() => getPopularSearches(), [])
  const [suggestionIndex, setSuggestionIndex] = useState(0)
  const [typedCharCount, setTypedCharCount] = useState(0)

  // Derived current animated text when input is empty
  const currentSuggestion = popular[suggestionIndex] || ""
  const animatedPlaceholder = useMemo(() => currentSuggestion.slice(0, typedCharCount), [currentSuggestion, typedCharCount])

  useEffect(() => {
    setQuery(initialQuery)
  }, [initialQuery])

  const handleSearch = (searchQuery: string = query) => {
    if (onSearch) {
      onSearch(searchQuery)
    } else {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  // Compute inline ghost completion when user is typing (async-safe)
  const [inlineSuggestion, setInlineSuggestion] = useState("")
  useEffect(() => {
    if (!showSuggestions || !query.trim()) {
      setInlineSuggestion("")
      return
    }
    let mounted = true
    ;(async () => {
      try {
        const result = await searchProducts(query)
        const best = result?.suggestions?.[0] ?? ""
        if (!mounted) return
        if (best && best.toLowerCase().startsWith(query.toLowerCase())) {
          setInlineSuggestion(best)
        } else {
          setInlineSuggestion("")
        }
      } catch {
        if (mounted) setInlineSuggestion("")
      }
    })()
    return () => {
      mounted = false
    }
  }, [query, showSuggestions])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
      return
    }
    // Accept inline ghost suggestion with Tab or ArrowRight
    if ((e.key === "Tab" || e.key === "ArrowRight") && inlineSuggestion) {
      e.preventDefault()
      setQuery(inlineSuggestion)
      // Move caret to end after update
      requestAnimationFrame(() => {
        const input = inputRef.current
        if (input) {
          input.setSelectionRange(inlineSuggestion.length, inlineSuggestion.length)
        }
      })
    }
  }

  const handleClear = () => {
    setQuery("")
    inputRef.current?.focus()
  }

  // Typing animation: letter-by-letter with delay after complete; always animate when input is empty
  useEffect(() => {
    if (!showSuggestions) return
    if (query.trim()) return // when user types, don't animate placeholder text

    let timeoutId: number | undefined
    const allChars = currentSuggestion.length

    if (typedCharCount < allChars) {
      // Type next character
      timeoutId = window.setTimeout(() => {
        setTypedCharCount((c) => Math.min(c + 1, allChars))
      }, 200) // per-character cadence (as configured)
    } else {
      // Completed this suggestion: wait 2s then move to next
      timeoutId = window.setTimeout(() => {
        setTypedCharCount(0)
        setSuggestionIndex((i) => (i + 1) % Math.max(popular.length, 1))
      }, 4000)
    }

    return () => {
      if (timeoutId) window.clearTimeout(timeoutId)
    }
  }, [typedCharCount, currentSuggestion.length, query, showSuggestions, popular.length])

  return (
    <div className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />

        {/* Ghost/animated suggestion layer */}
        {showSuggestions && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 flex items-center text-muted-foreground opacity-60"
          >
            <div className="pl-10 pr-10 w-full overflow-hidden whitespace-nowrap">
              {/* When typing, show inline full suggestion; otherwise show animated placeholder */}
              {query.trim() ? (
                inlineSuggestion ? (
                  <span>
                    {/* Show typed part transparent to align ghost tail visually */}
                    <span className="invisible">{query}</span>
                    <span className="">{inlineSuggestion.slice(query.length)}</span>
                  </span>
                ) : null
              ) : (
                <span className="">{animatedPlaceholder || placeholder}</span>
              )}
            </div>
          </div>
        )}

        <Input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          aria-label="Search"
          aria-live="polite"
          className="pl-10 pr-10 bg-white border border-black focus-visible:ring-1 focus-visible:ring-black"
        />

        {query && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
            onClick={handleClear}
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
