"use client"

import { useState, useRef, useEffect } from "react"
import dynamic from "next/dynamic"

const QuoteModal = dynamic(() => import("./quote-modal"), { ssr: false })

interface Message {
  id: string
  text: string
  sender: "user" | "bot"
  timestamp: Date
  quickReplies?: Array<{ label: string; value: string; action?: "call" | "whatsapp" | "email" | "maps" }>
}

interface InternalTask {
  TYPE_DE_DEMANDE: string
  URGENCE: "basse" | "normale" | "élevée"
  ACTION_INTERNE: string
}

const KNOWLEDGE_BASE = {
  services: {
    keywords: ["service", "offre", "propose", "faire", "capabilities", "quoi", "que proposez", "devis", "help", "aide"],
    response: (task: InternalTask) => `✅ Je note votre demande :
• Type : ${task.TYPE_DE_DEMANDE}
• Urgence : ${task.URGENCE}
• Action agence : ${task.ACTION_INTERNE}

Nos services complètes :
🎨 Design Web & Branding
📱 Développement Mobile & Web
🔍 SEO & Optimisation Performance
📊 Publicités Facebook/Instagram/TikTok
📝 Création de Contenu & Copywriting
💼 Stratégie Marketing Digitale
⚡ Analyse & Optimisation Conversion

Quel service vous intéresse particulièrement ?`,
    quickReplies: [
      { label: "🎨 Design Web", value: "design web" },
      { label: "📱 Mobile", value: "développement mobile" },
      { label: "🔍 SEO", value: "SEO" },
      { label: "📊 Pub Digitale", value: "publicité" },
    ],
  },
  portfolio: {
    keywords: [
      "portfolio",
      "projet",
      "réalisation",
      "cas",
      "exemple",
      "travail",
      "clients",
      "montrer",
      "voir",
      "case study",
    ],
    response: (task: InternalTask) => `✅ Portfolio Prestigia :

Nous avons réalisé 150+ projets réussis pour :
💼 Startups technologiques
🏢 PME & Grandes entreprises
🏪 Boutiques e-commerce
🏥 Professionnels de santé

📈 Résultats moyens de nos clients :
• +250% augmentation du trafic
• +180% ROI sur publicités
• -35% coût par acquisition
• 4.9/5 ⭐ note client

Secteurs : Tech, Finance, E-commerce, Santé, Services

Aimeriez-vous voir des cas spécifiques ou discuter de votre projet ?`,
    quickReplies: [
      { label: "💻 Tech", value: "projets tech" },
      { label: "🛍️ E-commerce", value: "e-commerce" },
      { label: "🏥 Santé", value: "santé" },
      { label: "📞 Démarrer", value: "je veux commencer" },
    ],
  },
  strategie: {
    keywords: ["stratégie", "consultant", "consultation", "audit", "conseil", "diagnostic", "analyse", "planning"],
    response: (task: InternalTask) => `✅ Consultation Stratégique :

Notre approche :
1️⃣ Audit complet de votre présence digitale
2️⃣ Analyse concurrences & marché
3️⃣ Identification des opportunités
4️⃣ Plan d'action personalisé
5️⃣ Suivi & Optimisation

Cette consultation est gratuite et sans engagement.

Vous avez un problème spécifique ou vous cherchez une stratégie complète ?`,
    quickReplies: [
      { label: "🔍 Audit", value: "audit gratuit" },
      { label: "📊 Stratégie complète", value: "stratégie" },
      { label: "💰 Budget", value: "combien ça coûte" },
      { label: "☎️ Appel", value: "appel avec vous" },
    ],
  },
  pricing: {
    keywords: ["prix", "coût", "tarif", "budget", "combien", "devis", "offre", "package", "formule"],
    response: (task: InternalTask) => `✅ À propos du budget :

Nos tarifs dépendent de :
✓ Complexité du projet
✓ Durée (court/moyen/long terme)
✓ Services inclus
✓ Support & maintenance

📌 Exemples indicatifs :
• Design Web simple : À partir de 2,000 MAD
• Site e-commerce : À partir de 5,000 MAD
• Gestion pub mensuelle : À partir de 2,500 MAD
• Stratégie complète : À partir de 10,000 MAD

🎯 Le mieux ? Parlons de VOS besoins !

Voulez-vous un devis gratuit et sans engagement ?`,
    quickReplies: [
      { label: "📋 Devis Gratuit", value: "je veux un devis" },
      { label: "💬 Détails", value: "plus de détails" },
      { label: "👥 Consultation", value: "parler avec l'équipe" },
    ],
  },
  team: {
    keywords: [
      "équipe",
      "expert",
      "qui",
      "responsable",
      "personne",
      "consultant",
      "staff",
      "développeur",
      "designer",
      "founder",
    ],
    response: (task: InternalTask) => `✅ Notre Équipe Prestigia :

👨‍💼 Abelkader Naim - Développeur Informatique
Expérience : 5 ans | Spécialité : Full-Stack Web

👨‍💼 Ahmed Ghiwane - Directeur Stratégie Digitale
Expérience : 6 ans | Spécialité : Marketing & SEO

"Le marketing digital n'est pas une dépense, c'est un investissement dans votre croissance." - Ahmed Ghiwane

💪 Force de notre équipe :
• Experts certifiés et passionnés
• Équipe dédiée par projet
• Support 24/7
• Méthodologie agile & résultats mesurables

Prêt à rencontrer l'équipe ?`,
    quickReplies: [
      { label: "📞 Appel vidéo", value: "appel avec l'équipe" },
      { label: "🤝 Réunion", value: "rendez-vous" },
      { label: "💬 WhatsApp", value: "whatsapp" },
      { label: "📋 Devis", value: "devis" },
    ],
  },
  contact: {
    keywords: ["contact", "joindre", "appeler", "email", "téléphone", "adresse", "comment", "horaires", "localisation"],
    response: (task: InternalTask) => `✅ Comment nous joindre :

📱 Téléphone : +212 652 768 993
📧 Email : contact@prestigia-agency.com
💬 WhatsApp : Disponible 24/7
📍 Localisation : Casablanca, Ain Chock
    Bld Qods The Gold Center, Étage 1, Bureau 2

🕐 Horaires :
Lundi - Vendredi : 9h00 - 18h00
Samedi : 10h00 - 14h00
Dimanche : Fermé

Choisissez votre méthode de contact :`,
    quickReplies: [
      { label: "☎️ Appeler directement", value: "appeler", action: "call" },
      { label: "💬 Discuter sur WhatsApp", value: "whatsapp", action: "whatsapp" },
      { label: "📧 Envoyer un email", value: "email", action: "email" },
      { label: "🗺️ Voir notre localisation", value: "localisation", action: "maps" },
    ],
  },
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [showQuoteModal, setShowQuoteModal] = useState(false)
  const [conversationCount, setConversationCount] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setTimeout(() => {
        addBotMessage(
          "Bonjour 👋\n\nJe suis l'assistant Prestigia Agency. Comment puis-je vous aider aujourd'hui ?\n\nVous pouvez m'explorer sur :\n• Nos services\n• Nos projets\n• Notre équipe\n• Vos tarifs\n• Ou posez simplement votre question !",
          [
            { label: "🎨 Services", value: "services" },
            { label: "📂 Portfolio", value: "portfolio" },
            { label: "👥 Équipe", value: "équipe" },
            { label: "💰 Tarifs", value: "tarifs" },
          ],
        )
      }, 500)
    }
  }, [isOpen])

  const addBotMessage = (
    text: string,
    quickReplies?: Array<{ label: string; value: string; action?: "call" | "whatsapp" | "email" | "maps" }>,
  ) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: "bot",
      timestamp: new Date(),
      quickReplies,
    }
    setMessages((prev) => [...prev, newMessage])
    setIsTyping(false)
  }

  const addUserMessage = (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: "user",
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, newMessage])
    setConversationCount((prev) => prev + 1)
  }

  const identifyTask = (userInput: string): InternalTask => {
    const input = userInput.toLowerCase().trim()

    if (input.includes("devis") || input.includes("prix") || input.includes("tarif")) {
      return {
        TYPE_DE_DEMANDE: "Devis ou estimation de prix",
        URGENCE: "normale",
        ACTION_INTERNE: "Envoyer devis personnalisé après appel de qualification",
      }
    }

    if (input.includes("design") || input.includes("site") || input.includes("web") || input.includes("création")) {
      return {
        TYPE_DE_DEMANDE: "Projet Web ou Design",
        URGENCE: "normale",
        ACTION_INTERNE: "Audit technique et proposition de plan",
      }
    }

    if (input.includes("seo") || input.includes("référenc") || input.includes("google")) {
      return {
        TYPE_DE_DEMANDE: "Optimisation SEO ou visibilité Google",
        URGENCE: "normale",
        ACTION_INTERNE: "Audit SEO gratuit et recommandations",
      }
    }

    if (
      input.includes("publicité") ||
      input.includes("facebook") ||
      input.includes("instagram") ||
      input.includes("tiktok") ||
      input.includes("ads")
    ) {
      return {
        TYPE_DE_DEMANDE: "Gestion de campagnes publicitaires",
        URGENCE: "normal",
        ACTION_INTERNE: "Présenter cas d'études similaires et budgets estimés",
      }
    }

    if (
      input.includes("urgent") ||
      input.includes("rapidement") ||
      input.includes("immédiat") ||
      input.includes("asap")
    ) {
      return {
        TYPE_DE_DEMANDE: "Projet urgent",
        URGENCE: "élevée",
        ACTION_INTERNE: "Contact direct avec responsable équipe",
      }
    }

    return {
      TYPE_DE_DEMANDE: "Demande générale",
      URGENCE: "basse",
      ACTION_INTERNE: "Qualification et rendez-vous de découverte",
    }
  }

  const findBestMatch = (
    userInput: string,
  ): {
    response: string
    quickReplies?: Array<{ label: string; value: string; action?: "call" | "whatsapp" | "email" | "maps" }>
  } => {
    const input = userInput.toLowerCase().trim()
    const task = identifyTask(userInput)

    if (input.includes("devis") || input.includes("prix") || input.includes("tarif")) {
      setShowQuoteModal(true)
      return {
        response: `Je vais ouvrir le formulaire de devis pour vous ! 📋

Une fois complété, notre équipe vous contactera dans 24h avec une proposition personnalisée.

Vous avez aussi la possibilité de discuter directement avec nous par WhatsApp ou téléphone.`,
        quickReplies: [
          { label: "📞 Appel rapide", value: "appel" },
          { label: "💬 WhatsApp", value: "whatsapp direct" },
          { label: "🔙 Retour", value: "autres questions" },
        ],
      }
    }

    for (const [key, data] of Object.entries(KNOWLEDGE_BASE)) {
      for (const keyword of data.keywords) {
        if (input.includes(keyword)) {
          return {
            response: data.response(task),
            quickReplies: data.quickReplies,
          }
        }
      }
    }

    if (input.split(/\s+/).length <= 3) {
      const words = input.split(/\s+/)
      for (const word of words) {
        if (word.length >= 3) {
          for (const [key, data] of Object.entries(KNOWLEDGE_BASE)) {
            for (const keyword of data.keywords) {
              if (keyword.startsWith(word.substring(0, 3)) || word.includes(keyword.substring(0, 3))) {
                return {
                  response: data.response(task),
                  quickReplies: data.quickReplies,
                }
              }
            }
          }
        }
      }

      return {
        response: `Pour bien vous aider, je dois clarifier votre demande :

Vous cherchez :
1️⃣ Une solution digitale (site, app, design) ?
2️⃣ Une stratégie marketing ou pub ?
3️⃣ Une consultation ou audit ?
4️⃣ Simplement notre contact ?

Dites-moi en détail, je trouverai la meilleure solution ! 🚀`,
        quickReplies: [
          { label: "🎨 Solution Digitale", value: "création site web" },
          { label: "📊 Stratégie", value: "stratégie marketing" },
          { label: "📢 Pub", value: "gestion publicité" },
          { label: "☎️ Parler directement", value: "appel avec agence" },
        ],
      }
    }

    return {
      response: `J'ai bien noté votre question ! Pour vous offrir la meilleure réponse, je vais vous proposer nos services principaux :

📋 À partir de votre besoin, l'équipe Prestigia peut :
✓ Créer/Optimiser votre présence web
✓ Développer une stratégie marketing
✓ Gérer vos campagnes publicitaires
✓ Améliorer votre SEO

Quel aspect vous intéresse le plus ?`,
      quickReplies: [
        { label: "🎨 Créer/Optimiser", value: "création site" },
        { label: "📊 Stratégie", value: "stratégie marketing" },
        { label: "📢 Pub", value: "gestion publicité" },
        { label: "☎️ Parler directement", value: "appel avec agence" },
      ],
    }
  }

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    addUserMessage(inputValue)
    setInputValue("")
    setIsTyping(true)

    setTimeout(
      () => {
        const { response, quickReplies } = findBestMatch(inputValue)
        addBotMessage(response, quickReplies)

        if (conversationCount >= 5) {
          setTimeout(() => {
            addBotMessage(
              "💡 Conseil : Si vous avez une demande spécifique ou urgente, je vous propose directement un appel avec l'équipe Prestigia ! Ça sera plus efficace qu'un chat. 📞",
              [
                { label: "☎️ Appel", value: "je veux un appel" },
                { label: "📞 Téléphone direct", value: "+212 652 768 993" },
                { label: "💬 WhatsApp", value: "whatsapp" },
              ],
            )
          }, 1000)
        }
      },
      1000 + Math.random() * 600,
    )
  }

  const handleContactAction = (action: string) => {
    switch (action) {
      case "call":
        window.location.href = "tel:+212652768993"
        break
      case "whatsapp":
        window.location.href = "https://wa.me/212652768993?text=Bonjour%20Prestigia%20Agency"
        break
      case "email":
        window.location.href =
          "mailto:contact@prestigia-agency.com?subject=Demande%20d'information%20-%20Prestigia%20Agency&body=Bonjour%20Prestigia%20Agency"
        break
      case "maps":
        window.location.href = "https://maps.google.com/?q=Bld+Qods+The+Gold+Center+Casablanca+Ain+Chock"
        break
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-4">
      <button
        onClick={() => {
          setIsOpen(!isOpen)
          setIsMinimized(false)
        }}
        className="w-14 h-14 rounded-full bg-gradient-to-r from-accent to-purple-600 text-white shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200 flex items-center justify-center font-bold text-xl"
        aria-label="Ouvrir le chat"
      >
        {isOpen ? "✕" : "💬"}
      </button>

      {isOpen && (
        <div className="w-full max-w-md bg-background border border-accent/20 rounded-2xl shadow-2xl flex flex-col h-96 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-accent to-purple-600 text-white px-4 py-3 font-semibold text-center">
            Prestigia Assistant
          </div>

          {/* Messages area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === "bot" ? "justify-start" : "justify-end"}`}>
                <div
                  className={`max-w-xs rounded-lg px-3 py-2 text-sm whitespace-pre-wrap ${
                    message.sender === "bot"
                      ? "bg-accent/10 text-foreground border border-accent/20"
                      : "bg-accent text-white"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-accent/10 text-foreground px-3 py-2 rounded-lg border border-accent/20">
                  <span className="animate-pulse">Assistant est en train d'écrire...</span>
                </div>
              </div>
            )}

            {messages.length > 0 &&
              messages[messages.length - 1].sender === "bot" &&
              messages[messages.length - 1].quickReplies && (
                <div className="pt-2">
                  <div className="flex flex-wrap gap-2">
                    {messages[messages.length - 1].quickReplies!.map((reply) => {
                      const hasDirectAction = ["call", "whatsapp", "email", "maps"].includes(reply.action || "")

                      return (
                        <button
                          key={reply.value}
                          onClick={() => {
                            if (hasDirectAction) {
                              handleContactAction(reply.action!)
                            } else {
                              addUserMessage(reply.value)
                              setIsTyping(true)
                              setTimeout(
                                () => {
                                  const { response, quickReplies } = findBestMatch(reply.value)
                                  addBotMessage(response, quickReplies)
                                },
                                1000 + Math.random() * 600,
                              )
                            }
                          }}
                          className="px-3 py-1.5 bg-accent/10 hover:bg-accent/20 border border-accent/30 rounded-full text-xs font-medium text-foreground transition-all duration-200 hover:scale-105 whitespace-nowrap hover:border-accent/60"
                        >
                          {reply.label}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className="border-t border-accent/20 p-3 flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Votre message..."
              className="flex-1 px-3 py-2 bg-background border border-accent/20 rounded-lg text-sm focus:outline-none focus:border-accent/60 transition-colors"
            />
            <button
              onClick={handleSendMessage}
              disabled={isTyping}
              className="px-3 py-2 bg-accent hover:bg-accent/90 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
            >
              ➤
            </button>
          </div>
        </div>
      )}

      {showQuoteModal && <QuoteModal isOpen={showQuoteModal} onClose={() => setShowQuoteModal(false)} />}
    </div>
  )
}
