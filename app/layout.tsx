import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Prestigia Agency - Agence Digital Marketing à Casablanca | SEO, Branding & Web Design",
  description:
    "Prestigia Agency : Agence de marketing digital à Casablanca spécialisée en SEO, branding, développement web et stratégie digitale. 150+ projets réalisés, 98% de clients satisfaits. Transformez votre présence online avec nos experts.",
  keywords: [
    "agence marketing digital Casablanca",
    "SEO Casablanca",
    "branding Maroc",
    "développement web Casablanca",
    "agence web Maroc",
    "marketing stratégique digital",
    "design graphique",
    "services digitaux Casablanca",
    "agence SEO Maroc",
    "création site web",
    "gestion réseaux sociaux",
    "digital marketing agency Morocco",
    "stratégie digitale entreprise",
    "référencement naturel Maroc",
    "community management Casablanca",
  ],
  generator: "Next.js",
  metadataBase: new URL("https://prestigia-agency.com"),
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://prestigia-agency.com",
    title: "Prestigia Agency - Excellence Digitale",
    description:
      "Transformez votre présence digitale avec notre agence de marketing digital spécialisée en SEO, branding et développement web.",
    siteName: "Prestigia Agency",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Prestigia Agency",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Prestigia Agency - Excellence Digitale",
    description: "Transformez votre présence digitale avec notre agence de marketing digital",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
  alternates: {
    canonical: "https://prestigia-agency.com",
    languages: {
      fr: "https://prestigia-agency.com/fr",
      en: "https://prestigia-agency.com/en",
    },
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  colorScheme: "dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: "Prestigia Agency",
              description: "Agence de marketing digital spécialisée en SEO, branding et développement web",
              url: "https://prestigia-agency.com",
              telephone: "+212652768993",
              email: "contact@prestigia-agency.com",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Bld Qods - The Gold Center, Étage 1, Bureau 2",
                addressLocality: "Casablanca",
                addressRegion: "Ain Chock",
                postalCode: "20000",
                addressCountry: "MA",
              },
              image: "https://prestigia-agency.com/logo.png",
              sameAs: [
                "https://www.facebook.com/prestigia",
                "https://www.instagram.com/prestigia",
                "https://www.linkedin.com/company/prestigia",
              ],
              areaServed: ["MA", "FR", "BE", "CH", "CA"],
              serviceType: ["SEO", "Web Development", "Branding", "Digital Marketing", "Digital Strategy"],
            }).replace(/[\u007F-\uFFFF]/g, (ch) => "\\u" + ("0000" + ch.charCodeAt(0).toString(16)).slice(-4)),
          }}
        />
      </head>
      <body className={`font-sans antialiased`}>
        {children}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </body>
    </html>
  )
}
