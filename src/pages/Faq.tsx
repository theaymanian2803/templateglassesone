import { ChevronDown, MessageCircle } from 'lucide-react'
import { useState } from 'react'

// Internal Accordion Component
function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border-b border-[#0f172a]/10">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex justify-between items-center text-left focus:outline-none group">
        <span className="font-serif text-lg md:text-xl group-hover:text-[#334155] transition-colors pr-8">
          {question}
        </span>
        <ChevronDown
          size={20}
          className={`shrink-0 text-[#0f172a] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100 pb-6' : 'max-h-0 opacity-0'}`}>
        <p className="text-sm md:text-base font-sans text-[#334155] leading-relaxed">{answer}</p>
      </div>
    </div>
  )
}

export default function Faq() {
  const faqs = [
    {
      category: 'Essai à Domicile',
      questions: [
        {
          q: "L'essai à domicile est-il vraiment gratuit ?",
          a: "Oui, totalement gratuit. Nous exigeons une empreinte bancaire pour des raisons de sécurité, mais vous n'êtes débité que des montures que vous décidez de conserver à l'issue des 5 jours.",
        },
        {
          q: "Combien de temps puis-je garder le coffret d'essai ?",
          a: 'Vous disposez de 5 jours entiers à compter de la date de livraison pour essayer vos montures avant de devoir renvoyer le coffret.',
        },
      ],
    },
    {
      category: 'Verres Correcteurs',
      questions: [
        {
          q: 'Comment vous transmettre mon ordonnance ?',
          a: "Vous pouvez télécharger une photo ou un scan de votre ordonnance directement lors de la commande, ou nous l'envoyer par email plus tard. Notre équipe d'opticiens diplômés s'occupe du reste.",
        },
        {
          q: 'Faites-vous les verres progressifs ?',
          a: 'Absolument. Nous proposons des verres progressifs de haute qualité, équipés de série de traitements anti-reflets et anti-rayures.',
        },
      ],
    },
    {
      category: 'Entretien & Garantie',
      questions: [
        {
          q: 'Vos lunettes sont-elles garanties ?',
          a: "Oui, toutes nos montures et verres sont couverts par une garantie d'un an contre tout défaut de fabrication.",
        },
        {
          q: 'Comment nettoyer mes verres sans les rayer ?',
          a: "Utilisez toujours le chiffon en microfibre fourni dans votre étui. En cas de traces tenaces, utilisez un peu d'eau tiède avec un savon doux sans lotion, puis essuyez délicatement.",
        },
      ],
    },
  ]

  return (
    <main className="min-h-screen bg-[#e8edf2] text-[#0f172a] pt-24 pb-32">
      <div className="container mx-auto px-6 md:px-12 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
            <MessageCircle size={28} strokeWidth={1.2} className="text-[#0f172a]" />
          </div>
          <h1 className="font-serif text-5xl md:text-7xl leading-tight mb-6">
            Questions Fréquentes
          </h1>
          <p className="text-base font-sans text-[#334155] max-w-xl mx-auto">
            Trouvez rapidement des réponses à vos questions concernant nos produits, nos services et
            votre vision.
          </p>
        </div>

        {/* FAQ Content */}
        <div className="bg-white p-8 md:p-12 shadow-2xl border border-black/5">
          {faqs.map((group, index) => (
            <div key={index} className="mb-12 last:mb-0">
              <h2 className="text-[11px] font-sans font-bold tracking-[0.2em] uppercase text-[#0f172a]/50 mb-4">
                {group.category}
              </h2>
              <div>
                {group.questions.map((faq, idx) => (
                  <FaqItem key={idx} question={faq.q} answer={faq.a} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Still need help? */}
        <div className="mt-16 text-center">
          <p className="text-sm font-sans text-[#334155] mb-4">
            Vous ne trouvez pas la réponse que vous cherchez ?
          </p>
          <a
            href="mailto:hello@opticmodern.com"
            className="inline-block border-b border-[#0f172a] text-sm font-sans font-bold tracking-widest uppercase hover:text-[#0f172a]/60 hover:border-[#0f172a]/60 transition-all pb-1">
            Contactez notre équipe
          </a>
        </div>
      </div>
    </main>
  )
}
