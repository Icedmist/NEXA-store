import { useState, useEffect } from "react"
import type React from "react"

function Badge({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="px-[14px] py-[6px] bg-white shadow-[0px_0px_0px_4px_rgba(55,50,47,0.05)] overflow-hidden rounded-[90px] flex justify-start items-center gap-[8px] border border-[rgba(2,6,23,0.08)]">
      <div className="w-[14px] h-[14px] relative overflow-hidden flex items-center justify-center">{icon}</div>
      <div className="text-center flex justify-center flex-col text-[#37322F] text-xs font-medium leading-3 font-sans">
        {text}
      </div>
    </div>
  )
}

export default function DocumentationSection() {
  const [activeCard, setActiveCard] = useState(0)
  const [animationKey, setAnimationKey] = useState(0)

  const cards = [
    {
      title: "QR-Driven Inventory & Labels",
      description: "Generate and print A4 sheets of QR code labels.\nTrack inventory levels and receive low stock alerts.",
      image: "/modern-dashboard-interface-with-data-visualization.png",
    },
    {
      title: "Hardware-Free QR Scanning",
      description: "Use any smartphone or tablet camera to scan\nitems instantly at checkout.",
      image: "/analytics-dashboard.png",
    },
    {
      title: "Bulk Data Imports & Exports",
      description: "Upload large inventories via CSV/Excel offline\nand sync without data loss.",
      image: "/team-collaboration-interface-with-shared-workspace.png",
    },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCard((prev) => (prev + 1) % cards.length)
      setAnimationKey((prev) => prev + 1)
    }, 5000)
    return () => clearInterval(interval)
  }, [cards.length])

  const handleCardClick = (index: number) => {
    setActiveCard(index)
    setAnimationKey((prev) => prev + 1)
  }

  return (
    <div className="w-full border-b border-[rgba(55,50,47,0.12)] flex flex-col justify-center items-center">
      {/* Header Section */}
      <div className="self-stretch px-6 md:px-24 py-12 md:py-16 border-b border-[rgba(55,50,47,0.12)] flex justify-center items-center gap-6">
        <div className="w-full max-w-[586px] px-6 py-5 overflow-hidden rounded-lg flex flex-col justify-start items-center gap-4">
          <Badge
            icon={
              <div className="w-[10.50px] h-[10.50px] outline outline-[1.17px] outline-[#37322F] outline-offset-[-0.58px] rounded-full"></div>
            }
            text="System Capabilities"
          />
          <div className="self-stretch text-center flex justify-center flex-col text-[#49423D] text-3xl md:text-5xl font-semibold leading-tight md:leading-[60px] font-sans tracking-tight">
            Resilient store management
          </div>
          <div className="self-stretch text-center text-[#605A57] text-base font-normal leading-7 font-sans">
            Offline-first architecture, hardware-free scanning, and 
            <br />
            multi-store hierarchy for complete oversight.
          </div>
        </div>
      </div>

      {/* Content Section (Alternating Feature Rows) */}
      <div className="w-full max-w-[1020px] mx-auto px-4 sm:px-6 md:px-8 flex flex-col gap-12 sm:gap-16 md:gap-20 mt-10 sm:mt-14 mb-14">
        {cards.map((card, index) => {
          const isReversed = index % 2 !== 0
          return (
            <div 
              key={index} 
              className={`flex flex-col ${isReversed ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-8 md:gap-16`}
            >
              {/* Text side */}
              <div className="flex-1 flex flex-col items-start text-left gap-3">
                <span className="text-[10px] font-semibold tracking-wider uppercase text-[#605A57] bg-[rgba(55,50,47,0.04)] px-2.5 py-1 rounded-md border border-[rgba(55,50,47,0.06)]">
                  {index === 0 ? "Inventory Operations" : index === 1 ? "Seamless POS" : "Data Management"}
                </span>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold font-sans text-[#37322F] tracking-tight">
                  {card.title}
                </h3>
                <p className="text-sm sm:text-base text-[#605A57] font-normal font-sans leading-relaxed whitespace-pre-line">
                  {card.description}
                </p>

              </div>

              {/* Graphic side with perspective bounding frame to fit crisp scale */}
              <div className="flex-1 w-full max-w-[480px] bg-[#F9F8F6] p-4 sm:p-6 rounded-2xl border border-[rgba(55,50,47,0.08)]">
                <div className="w-full aspect-[4/3] rounded-xl overflow-hidden shadow-md border border-[rgba(0,0,0,0.04)]">
                  <img 
                    src={card.image} 
                    alt={card.title} 
                    className="w-full h-full object-cover" 
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <style>{`
        @keyframes progressBar {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(0%); }
        }
      `}</style>
    </div>
  )
}
