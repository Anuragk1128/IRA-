import { Facebook, Instagram, Linkedin } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg/none border-t border-border/50">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Brand */}
        
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Link href="/">
              <div className="h-14 w-14 hover:scale-105">
                <img
                  src="/IRA-LOGO.PNG"
                  alt="IRA by House of Evolve logo"
                  className="h-full w-full object-cover"
                  loading="eager"
                />
              </div>
              </Link>
              <span className="sr-only">IRA by House of Evolve</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Crafting affordable luxury jewellery that celebrates your unique style and personality. Every piece is
              designed with love and attention to detail.
            </p>
            <div className="flex space-x-2">
              <a
              href="https://www.facebook.com/share/1Ap6LGNxbt/?mibextid=wwXIfr"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook - IRA by Evolve"
              >
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Facebook className="h-4 w-4" />
              </Button>
              </a>
              <Button asChild variant="ghost" size="icon" className="h-8 w-8">
                <a
                  href="https://www.instagram.com/ira_by_evolve/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram - IRA by Evolve"
                >
                  <Instagram className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <a
                href="https://www.linkedin.com/company/house-of-evolve/"
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Twitter - IRA by Evolve"
                >
                <Linkedin className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="/categories" className="text-muted-foreground hover:text-primary transition-colors">
                  Collections
                </a>
              </li>
              <li>
                <a href="/size-guide" className="text-muted-foreground hover:text-primary transition-colors">
                  Size Guide
                </a>
              </li>
              
            
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="font-semibold">Customer Service</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="/shipping" className="text-muted-foreground hover:text-primary transition-colors">
                  Shipping Info
                </a>
              </li>
              <li>
                <a href="/shipping" className="text-muted-foreground hover:text-primary transition-colors">
                  Replacements
                </a>
              </li>
              <li>
                <a href="/faq" className="text-muted-foreground hover:text-primary transition-colors">
                  FAQ
                </a>
              </li>
            
            </ul>
          </div>
        </div>

        <div className="border-t border-border/50 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground"> 2025 IRA — By House Of Evolve. All rights reserved.</p>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="/privacy" className="hover:text-primary transition-colors">
              Privacy Policy
            </a>
            <a href="/terms" className="hover:text-primary transition-colors">
              Terms of Service
            </a>
            <a href="/privacy" className="hover:text-primary transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
