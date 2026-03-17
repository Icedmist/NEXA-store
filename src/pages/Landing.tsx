import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import SmartSimpleBrilliant from "../landing/smart-simple-brilliant"
import YourWorkInSync from "../landing/your-work-in-sync"
import EffortlessIntegration from "../landing/effortless-integration"
import NumbersThatSpeak from "../landing/numbers-that-speak"
import DocumentationSection from "../landing/documentation-section"
import TestimonialsSection from "../landing/testimonials-section"
import FAQSection from "../landing/faq-section"
import PricingSection from "../landing/pricing-section"
import CTASection from "../landing/cta-section"
import FooterSection from "../landing/footer-section"

// Reusable Badge Component
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

// Feature card with animated progress bar
function FeatureCard({
  title,
  description,
  isActive,
  progress,
  onClick,
}: {
  title: string
  description: string
  isActive: boolean
  progress: number
  onClick: () => void
}) {
  return (
    <div
      className={`w-full md:flex-1 self-stretch px-6 py-5 overflow-hidden flex flex-col justify-start items-start gap-2 cursor-pointer relative border-b md:border-b-0 last:border-b-0 ${
        isActive
          ? "bg-white shadow-[0px_0px_0px_0.75px_#E0DEDB_inset]"
          : "border-l-0 border-r-0 md:border border-[#E0DEDB]/80"
      }`}
      onClick={onClick}
    >
      {isActive && (
        <div className="absolute top-0 left-0 w-full h-0.5 bg-[rgba(50,45,43,0.08)]">
          <div
            className="h-full bg-[#322D2B] transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
      <div className="self-stretch flex justify-center flex-col text-[#49423D] text-sm md:text-sm font-semibold leading-6 md:leading-6 font-sans">
        {title}
      </div>
      <div className="self-stretch text-[#605A57] text-[13px] md:text-[13px] font-normal leading-[22px] md:leading-[22px] font-sans">
        {description}
      </div>
    </div>
  )
}

export default function LandingPage() {
  const navigate = useNavigate()
  const [activeCard, setActiveCard] = useState(0)
  const [progress, setProgress] = useState(0)
  const mountedRef = useRef(true)

  useEffect(() => {
    const progressInterval = setInterval(() => {
      if (!mountedRef.current) return
      setProgress((prev) => {
        if (prev >= 100) {
          if (mountedRef.current) {
            setActiveCard((current) => (current + 1) % 3)
          }
          return 0
        }
        return prev + 2
      })
    }, 100)
    return () => {
      clearInterval(progressInterval)
      mountedRef.current = false
    }
  }, [])

  useEffect(() => {
    return () => {
      mountedRef.current = false
    }
  }, [])

  const handleCardClick = (index: number) => {
    if (!mountedRef.current) return
    setActiveCard(index)
    setProgress(0)
  }

  // Dashboard hero images per active card
  const heroImages = [
    "/analytics-dashboard-with-charts-graphs-and-data-vi.png",
    "/modern-dashboard-interface-with-data-visualization.png",
    "/data-visualization-dashboard-with-interactive-char.png",
  ]

  return (
    <div className="w-full min-h-screen relative bg-[#F7F5F3] overflow-x-hidden flex flex-col justify-start items-center">
      <div className="relative flex flex-col justify-start items-center w-full">
        {/* Main container */}
        <div className="w-full max-w-none px-4 sm:px-6 md:px-8 lg:px-0 lg:max-w-[1060px] lg:w-[1060px] relative flex flex-col justify-start items-start min-h-screen">
          {/* Left vertical line */}
          <div className="w-[1px] h-full absolute left-4 sm:left-6 md:left-8 lg:left-0 top-0 bg-[rgba(55,50,47,0.12)] shadow-[1px_0px_0px_white] z-0"></div>
          {/* Right vertical line */}
          <div className="w-[1px] h-full absolute right-4 sm:right-6 md:right-8 lg:right-0 top-0 bg-[rgba(55,50,47,0.12)] shadow-[1px_0px_0px_white] z-0"></div>

          <div className="self-stretch pt-[9px] overflow-hidden border-b border-[rgba(55,50,47,0.06)] flex flex-col justify-center items-center gap-4 sm:gap-6 md:gap-8 lg:gap-[66px] relative z-10">

            {/* Navigation */}
            <div className="w-full h-12 sm:h-14 md:h-16 lg:h-[84px] absolute left-0 top-0 flex justify-center items-center z-20 px-6 sm:px-8 md:px-12 lg:px-0">
              <div className="w-full h-0 absolute left-0 top-6 sm:top-7 md:top-8 lg:top-[42px] border-t border-[rgba(55,50,47,0.12)] shadow-[0px_1px_0px_white]"></div>
              <div className="w-full max-w-[calc(100%-32px)] sm:max-w-[calc(100%-48px)] md:max-w-[calc(100%-64px)] lg:max-w-[700px] lg:w-[700px] h-10 sm:h-11 md:h-12 py-1.5 sm:py-2 px-3 sm:px-4 md:px-4 pr-2 sm:pr-3 bg-[#F7F5F3] backdrop-blur-sm shadow-[0px_0px_0px_2px_white] overflow-hidden rounded-[50px] flex justify-between items-center relative z-30">
                <div className="flex justify-center items-center">
                  <div className="flex justify-start items-center">
                    <div className="flex flex-col justify-center text-[#2F3037] text-sm sm:text-base md:text-lg lg:text-xl font-medium leading-5 font-sans">
                      Nexa
                    </div>
                  </div>
                  <div className="pl-3 sm:pl-4 md:pl-5 lg:pl-5 hidden sm:flex flex-row gap-2 sm:gap-3 md:gap-4 lg:gap-4">
                    <div className="flex justify-start items-center">
                      <div className="flex flex-col justify-center text-[rgba(49,45,43,0.80)] text-xs md:text-[13px] font-medium leading-[14px] font-sans cursor-pointer hover:text-[#37322F] transition-colors">Features</div>
                    </div>
                    <div className="flex justify-start items-center">
                      <div className="flex flex-col justify-center text-[rgba(49,45,43,0.80)] text-xs md:text-[13px] font-medium leading-[14px] font-sans cursor-pointer hover:text-[#37322F] transition-colors">Pricing</div>
                    </div>
                    <div className="flex justify-start items-center">
                      <div className="flex flex-col justify-center text-[rgba(49,45,43,0.80)] text-xs md:text-[13px] font-medium leading-[14px] font-sans cursor-pointer hover:text-[#37322F] transition-colors">Docs</div>
                    </div>
                  </div>
                </div>
                <div className="h-6 sm:h-7 md:h-8 flex justify-start items-start gap-2 sm:gap-3">
                  <div
                    onClick={() => navigate("/login")}
                    className="px-2 sm:px-3 md:px-[14px] py-1 sm:py-[6px] bg-white shadow-[0px_1px_2px_rgba(55,50,47,0.12)] overflow-hidden rounded-full flex justify-center items-center cursor-pointer hover:bg-[#f0ede9] transition-colors"
                  >
                    <div className="flex flex-col justify-center text-[#37322F] text-xs md:text-[13px] font-medium leading-5 font-sans">
                      Log in
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Hero Section */}
            <div className="pt-16 sm:pt-20 md:pt-24 lg:pt-[216px] pb-8 sm:pb-12 md:pb-16 flex flex-col justify-start items-center px-2 sm:px-4 md:px-8 lg:px-0 w-full">
              <div className="w-full max-w-[937px] lg:w-[937px] flex flex-col justify-center items-center gap-3 sm:gap-4 md:gap-5 lg:gap-6">
                <div className="self-stretch rounded-[3px] flex flex-col justify-center items-center gap-4 sm:gap-5 md:gap-6 lg:gap-8">
                  <div className="w-full max-w-[748px] text-center flex justify-center flex-col text-[#37322F] text-[24px] xs:text-[28px] sm:text-[36px] md:text-[52px] lg:text-[80px] font-normal leading-[1.1] sm:leading-[1.15] md:leading-[1.2] lg:leading-24 font-serif px-2 sm:px-4 md:px-0">
                    Retail management that works offline too
                  </div>
                  <div className="w-full max-w-[506px] text-center flex justify-center flex-col text-[rgba(55,50,47,0.80)] sm:text-lg md:text-xl leading-[1.4] sm:leading-[1.45] md:leading-[1.5] lg:leading-7 font-sans px-2 sm:px-4 md:px-0 lg:text-lg font-medium text-sm">
                    Run your store with confidence — sell, scan, and track inventory even when the internet goes down.
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <div className="w-full max-w-[497px] flex flex-col justify-center items-center gap-6 sm:gap-8 md:gap-10 lg:gap-12 relative z-10 mt-6 sm:mt-8 md:mt-10 lg:mt-12">
                <div className="backdrop-blur-[8.25px] flex justify-start items-center gap-4">
                  <div
                    onClick={() => navigate("/login")}
                    className="h-10 sm:h-11 md:h-12 px-6 sm:px-8 md:px-10 lg:px-12 py-2 sm:py-[6px] relative bg-[#37322F] shadow-[0px_0px_0px_2.5px_rgba(255,255,255,0.08)_inset] overflow-hidden rounded-full flex justify-center items-center cursor-pointer hover:bg-[#2A2520] transition-colors"
                  >
                    <div className="w-20 sm:w-24 md:w-28 lg:w-44 h-[41px] absolute left-0 top-[-0.5px] bg-gradient-to-b from-[rgba(255,255,255,0)] to-[rgba(0,0,0,0.10)] mix-blend-multiply"></div>
                    <div className="flex flex-col justify-center text-white text-sm sm:text-base md:text-[15px] font-medium leading-5 font-sans">
                      Start for free
                    </div>
                  </div>
                </div>
              </div>

              {/* Background pattern */}
              <div className="absolute top-[232px] sm:top-[248px] md:top-[264px] lg:top-[320px] left-1/2 transform -translate-x-1/2 z-0 pointer-events-none">
                <img
                  src="/mask-group-pattern.svg"
                  alt=""
                  className="w-[936px] sm:w-[1404px] md:w-[2106px] lg:w-[2808px] h-auto opacity-30 sm:opacity-40 md:opacity-50 mix-blend-multiply"
                  style={{ filter: "hue-rotate(15deg) saturate(0.7) brightness(1.2)" }}
                />
              </div>

              {/* Dashboard Bento Feature Grid (Supabase style) */}
              <div className="w-full max-w-[1060px] mx-auto px-4 sm:px-6 md:px-8 relative z-10 grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-5 my-10 sm:my-14 mb-0">
                
                {/* Card 1: Core Dashboard (Wide) */}
                <div className="md:col-span-8 bg-[#0D0F10] text-[#E4E4E5] p-6 sm:p-8 rounded-2xl shadow-2xl border border-[rgba(255,255,255,0.03)] flex flex-col md:flex-row gap-6 aspect-[16/10] md:aspect-auto md:h-[320px] overflow-hidden group">
                  <div className="flex-1 flex flex-col justify-between text-left">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-5 h-5 rounded-md bg-[#1C1F22] flex items-center justify-center border border-[rgba(255,255,255,0.1)]">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 3h7v7H3V3zm11 0h7v7h-7V3zm-11 11h7v7H3v-7zm11 0h7v7h-7v-7z" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </div>
                        <h4 className="text-xs font-semibold text-[#8C8F93] tracking-wider uppercase font-sans">Command Center</h4>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-semibold font-sans mb-2 tracking-tight">Multi-Store Dashboard</h3>
                      <p className="text-sm text-[#9BA1A6] font-normal leading-relaxed">The single command center to oversee multiple locations, reconcile cashiers, and view global topline in real-time.</p>
                    </div>
                    <ul className="flex flex-col gap-1 text-[13px] text-[#8C8F93] mt-4">
                      <li className="flex items-center gap-2">✓ Cashier Reconciliation</li>
                      <li className="flex items-center gap-2">✓ Real-time Sales Feed</li>
                      <li className="flex items-center gap-2">✓ Location Data Isolations</li>
                    </ul>
                  </div>
                  <div className="flex-1 rounded-xl overflow-hidden border border-[rgba(255,255,255,0.05)] shadow-lg h-full self-center">
                    <img src={heroImages[0]} alt="Dashboard" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                </div>

                {/* Card 2: Inventory */}
                <div className="md:col-span-4 bg-[#0D0F10] text-[#E4E4E5] p-6 rounded-2xl shadow-xl border border-[rgba(255,255,255,0.03)] flex flex-col gap-4 aspect-[16/10] md:aspect-auto md:h-[320px] overflow-hidden group">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-md bg-[#1C1F22] flex items-center justify-center border border-[rgba(255,255,255,0.1)]">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 7l-8-4-8 4m16 4l-8 4-8-4m16 4l-8 4-8-4" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </div>
                      <h4 className="text-xs font-semibold text-[#8C8F93] uppercase font-sans">Inventory</h4>
                    </div>
                    <h3 className="text-lg font-semibold font-sans tracking-tight">Active Stock Alerts</h3>
                    <p className="text-sm text-[#9BA1A6] font-normal">Track low stock items and triggers sheet printing instantly.</p>
                  </div>
                  <div className="flex-1 rounded-xl overflow-hidden border border-[rgba(255,255,255,0.05)] shadow-lg">
                    <img src={heroImages[1]} alt="Stocks" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                </div>

                {/* Card 3: Offline Queue */}
                <div className="md:col-span-4 bg-[#0D0F10] text-[#E4E4E5] p-6 rounded-2xl shadow-xl border border-[rgba(255,255,255,0.03)] flex flex-col gap-4 aspect-[16/10] md:aspect-auto md:h-[300px] overflow-hidden group">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-md bg-[#1C1F22] flex items-center justify-center border border-[rgba(255,255,255,0.1)]">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22 12h-4l-3 9L9 3l-3 9H2" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </div>
                      <h4 className="text-xs font-semibold text-[#8C8F93] uppercase font-sans">Outage Resilience</h4>
                    </div>
                    <h3 className="text-lg font-semibold font-sans tracking-tight">Offline Sync Streams</h3>
                    <p className="text-sm text-[#9BA1A6] font-normal">Transitions sync automatically right after established links.</p>
                  </div>
                  <div className="flex-1 rounded-xl overflow-hidden border border-[rgba(255,255,255,0.05)] shadow-lg">
                    <img src={heroImages[2]} alt="Queue" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                </div>

                {/* Card 4: Hardware-Free (Description Heavy) */}
                <div className="md:col-span-8 bg-[#0D0F10] text-[#E4E4E5] p-6 sm:p-8 rounded-2xl shadow-2xl border border-[rgba(255,255,255,0.03)] flex flex-col md:flex-row gap-6 aspect-[16/10] md:aspect-auto md:h-[300px] overflow-hidden group">
                  <div className="flex-1 flex flex-col justify-between text-left">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-5 h-5 rounded-md bg-[#1C1F22] flex items-center justify-center border border-[rgba(255,255,255,0.1)]">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 4v1m-6.928 2l.5.866M4.072 12H5m1.072 5.134l.5-.866M12 20v-1m6.928-2l-.5-.866M19.928 12h-1m-1.072-5.134l-.5.866" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </div>
                        <h4 className="text-xs font-semibold text-[#8C8F93] uppercase font-sans">Zero Overhead</h4>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-semibold font-sans mb-2 tracking-tight">Hardware-Free Setup</h3>
                      <p className="text-sm text-[#9BA1A6] font-normal leading-relaxed">Save thousands on scanner hardware procurement. Scan in-app instantly with any browser loaded camera streams properly.</p>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {["No Laser Scanners", "Instant Setup", "Any Device"].map((tag) => (
                        <span key={tag} className="px-2 py-1 bg-[#1A1D20] rounded-md text-[11px] font-medium text-[#D1D5DB] border border-[rgba(255,255,255,0.05)]">{tag}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex-1 h-full flex items-center justify-center bg-[#111314] rounded-xl border border-[rgba(255,255,255,0.03)] relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#1A1D20]/50 to-transparent"></div>
                    <div className="flex flex-col items-center gap-2">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 4h4v4H4V4zm12 0h4v4h-4V4zM4 16h4v4H4v-4zm12 0h4v4h-4v-4z" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M9 12h6m-3-3v6" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      <span className="text-xs text-[#6B7280]">Universal Camera Scanning</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Feature Cards Strip */}
              <div className="self-stretch border-t border-[#E0DEDB] border-b border-[#E0DEDB] flex justify-center items-start">
                <div className="w-4 sm:w-6 md:w-8 lg:w-12 self-stretch relative overflow-hidden">
                  <div className="w-[120px] sm:w-[140px] md:w-[162px] left-[-40px] sm:left-[-50px] md:left-[-58px] top-[-120px] absolute flex flex-col justify-start items-start">
                    {Array.from({ length: 50 }).map((_, i) => (
                      <div key={i} className="self-stretch h-3 sm:h-4 rotate-[-45deg] origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"></div>
                    ))}
                  </div>
                </div>
                <div className="flex-1 px-0 sm:px-2 md:px-0 flex flex-col md:flex-row justify-center items-stretch gap-0">
                  <FeatureCard
                    title="Works offline"
                    description="Sell and scan without internet. Transactions sync automatically to the cloud once reconnected."
                    isActive={activeCard === 0}
                    progress={activeCard === 0 ? progress : 0}
                    onClick={() => handleCardClick(0)}
                  />
                  <FeatureCard
                    title="QR-driven inventory"
                    description="Scan products in seconds with any smartphone camera — no dedicated hardware needed."
                    isActive={activeCard === 1}
                    progress={activeCard === 1 ? progress : 0}
                    onClick={() => handleCardClick(1)}
                  />
                  <FeatureCard
                    title="Multi-store control"
                    description="Manage every location from one dashboard. Each store stays private and independent."
                    isActive={activeCard === 2}
                    progress={activeCard === 2 ? progress : 0}
                    onClick={() => handleCardClick(2)}
                  />
                </div>
                <div className="w-4 sm:w-6 md:w-8 lg:w-12 self-stretch relative overflow-hidden">
                  <div className="w-[120px] sm:w-[140px] md:w-[162px] left-[-40px] sm:left-[-50px] md:left-[-58px] top-[-120px] absolute flex flex-col justify-start items-start">
                    {Array.from({ length: 50 }).map((_, i) => (
                      <div key={i} className="self-stretch h-3 sm:h-4 rotate-[-45deg] origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"></div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Social Proof */}
              <div className="w-full border-b border-[rgba(55,50,47,0.12)] flex flex-col justify-center items-center">
                <div className="self-stretch px-4 sm:px-6 md:px-24 py-8 sm:py-12 md:py-16 border-b border-[rgba(55,50,47,0.12)] flex justify-center items-center gap-6">
                  <div className="w-full max-w-[586px] px-4 sm:px-6 py-4 sm:py-5 overflow-hidden rounded-lg flex flex-col justify-start items-center gap-3 sm:gap-4">
                    <Badge
                      icon={
                        <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect x="1" y="3" width="4" height="6" stroke="#37322F" strokeWidth="1" fill="none" />
                          <rect x="7" y="1" width="4" height="8" stroke="#37322F" strokeWidth="1" fill="none" />
                          <rect x="2" y="4" width="1" height="1" fill="#37322F" />
                          <rect x="3.5" y="4" width="1" height="1" fill="#37322F" />
                          <rect x="8" y="2" width="1" height="1" fill="#37322F" />
                          <rect x="9.5" y="2" width="1" height="1" fill="#37322F" />
                        </svg>
                      }
                      text="Trusted by retailers"
                    />
                    <div className="w-full max-w-[472px] text-center flex justify-center flex-col text-[#49423D] text-xl sm:text-2xl md:text-3xl lg:text-5xl font-semibold leading-tight md:leading-[60px] font-sans tracking-tight">
                      Built for retailers who can't afford downtime
                    </div>
                    <div className="self-stretch text-center text-[#605A57] text-sm sm:text-base font-normal leading-6 sm:leading-7 font-sans">
                      From corner shops to multi-location chains, Nexa keeps
                      <br className="hidden sm:block" />
                      your sales running no matter what.
                    </div>
                  </div>
                </div>

                {/* Logo Grid */}
                <div className="self-stretch border-[rgba(55,50,47,0.12)] flex justify-center items-start border-t">
                  <div className="w-4 sm:w-6 md:w-8 lg:w-12 self-stretch relative overflow-hidden">
                    <div className="w-[120px] sm:w-[140px] md:w-[162px] left-[-40px] sm:left-[-50px] md:left-[-58px] top-[-120px] absolute flex flex-col justify-start items-start">
                      {Array.from({ length: 50 }).map((_, i) => (
                        <div key={i} className="self-stretch h-3 sm:h-4 rotate-[-45deg] origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]" />
                      ))}
                    </div>
                  </div>

                  <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 gap-0 border-l border-r border-[rgba(55,50,47,0.12)]">
                    {[
                      { label: "QuickSell", sub: "Retail Chain" },
                      { label: "MartHub", sub: "Grocery" },
                      { label: "ShopPro", sub: "Fashion" },
                      { label: "UrbanCart", sub: "General" },
                      { label: "GrocerX", sub: "Fresh Foods" },
                      { label: "PocketMart", sub: "Convenience" },
                      { label: "StoreSync", sub: "Electronics" },
                      { label: "RetailOS", sub: "Multi-Store" },
                    ].map((item, index) => {
                      const isMobileFirstColumn = index % 2 === 0
                      const isDesktopFirstColumn = index % 4 === 0
                      const isDesktopLastColumn = index % 4 === 3
                      const isDesktopTopRow = index < 4
                      const isDesktopBottomRow = index >= 4

                      return (
                        <div
                          key={index}
                          className={`
                            h-24 xs:h-28 sm:h-32 md:h-36 lg:h-40 flex flex-col justify-center items-center gap-1
                            border-b border-[rgba(227,226,225,0.5)]
                            ${index < 6 ? "sm:border-b-[0.5px]" : "sm:border-b"}
                            ${index >= 6 ? "border-b" : ""}
                            ${isMobileFirstColumn ? "border-r-[0.5px]" : ""}
                            sm:border-r-[0.5px] sm:border-l-0
                            ${isDesktopFirstColumn ? "md:border-l" : "md:border-l-[0.5px]"}
                            ${isDesktopLastColumn ? "md:border-r" : "md:border-r-[0.5px]"}
                            ${isDesktopTopRow ? "md:border-b-[0.5px]" : ""}
                            ${isDesktopBottomRow ? "md:border-t-[0.5px] md:border-b" : ""}
                            border-[#E3E2E1]
                          `}
                        >
                          <div className="text-center flex justify-center flex-col text-[#37322F] text-sm xs:text-base sm:text-lg md:text-xl font-medium leading-tight font-sans">
                            {item.label}
                          </div>
                          <div className="text-center text-[rgba(55,50,47,0.50)] text-[10px] sm:text-xs font-normal font-sans">
                            {item.sub}
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  <div className="w-4 sm:w-6 md:w-8 lg:w-12 self-stretch relative overflow-hidden">
                    <div className="w-[120px] sm:w-[140px] md:w-[162px] left-[-40px] sm:left-[-50px] md:left-[-58px] top-[-120px] absolute flex flex-col justify-start items-start">
                      {Array.from({ length: 50 }).map((_, i) => (
                        <div key={i} className="self-stretch h-3 sm:h-4 rotate-[-45deg] origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bento Grid Section */}
              <div className="w-full border-b border-[rgba(55,50,47,0.12)] flex flex-col justify-center items-center">
                {/* Bento Header */}
                <div className="self-stretch px-4 sm:px-6 md:px-8 lg:px-0 lg:max-w-[1060px] lg:w-[1060px] py-8 sm:py-12 md:py-16 border-b border-[rgba(55,50,47,0.12)] flex justify-center items-center gap-6">
                  <div className="w-full max-w-[616px] lg:w-[616px] px-4 sm:px-6 py-4 sm:py-5 overflow-hidden rounded-lg flex flex-col justify-start items-center gap-3 sm:gap-4">
                    <Badge
                      icon={
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect x="1" y="1" width="4" height="4" stroke="#37322F" strokeWidth="1" fill="none" />
                          <rect x="7" y="1" width="4" height="4" stroke="#37322F" strokeWidth="1" fill="none" />
                          <rect x="1" y="7" width="4" height="4" stroke="#37322F" strokeWidth="1" fill="none" />
                          <rect x="7" y="7" width="4" height="4" stroke="#37322F" strokeWidth="1" fill="none" />
                        </svg>
                      }
                      text="Features"
                    />
                    <div className="w-full max-w-[598px] lg:w-[598px] text-center flex justify-center flex-col text-[#49423D] text-xl sm:text-2xl md:text-3xl lg:text-5xl font-semibold leading-tight md:leading-[60px] font-sans tracking-tight">
                      Every tool your store needs, built in
                    </div>
                    <div className="self-stretch text-center text-[#605A57] text-sm sm:text-base font-normal leading-6 sm:leading-7 font-sans">
                      From the sales floor to the stock room,
                      <br />
                      Nexa covers every corner of your retail operation.
                    </div>
                  </div>
                </div>

                {/* Bento Grid Content */}
                <div className="self-stretch flex justify-center items-start">
                  <div className="w-4 sm:w-6 md:w-8 lg:w-12 self-stretch relative overflow-hidden">
                    <div className="w-[120px] sm:w-[140px] md:w-[162px] left-[-40px] sm:left-[-50px] md:left-[-58px] top-[-120px] absolute flex flex-col justify-start items-start">
                      {Array.from({ length: 200 }).map((_, i) => (
                        <div key={i} className="self-stretch h-3 sm:h-4 rotate-[-45deg] origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]" />
                      ))}
                    </div>
                  </div>

                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-0 border-l border-r border-[rgba(55,50,47,0.12)]">
                    {/* Top Left */}
                    <div className="border-b border-r-0 md:border-r border-[rgba(55,50,47,0.12)] p-4 sm:p-6 md:p-8 lg:p-12 flex flex-col justify-start items-start gap-4 sm:gap-6">
                      <div className="flex flex-col gap-2">
                        <h3 className="text-[#37322F] text-lg sm:text-xl font-semibold leading-tight font-sans">
                          Smart. Simple. Instant.
                        </h3>
                        <p className="text-[#605A57] text-sm md:text-base font-normal leading-relaxed font-sans">
                          Your stock is always organized. Cashiers ring up sales in seconds with QR scanning on any phone camera.
                        </p>
                      </div>
                      <div className="w-full h-[200px] sm:h-[250px] md:h-[300px] rounded-lg flex items-center justify-center overflow-hidden">
                        <SmartSimpleBrilliant width="100%" height="100%" theme="light" className="scale-50 sm:scale-65 md:scale-75 lg:scale-90" />
                      </div>
                    </div>

                    {/* Top Right */}
                    <div className="border-b border-[rgba(55,50,47,0.12)] p-4 sm:p-6 md:p-8 lg:p-12 flex flex-col justify-start items-start gap-4 sm:gap-6">
                      <div className="flex flex-col gap-2">
                        <h3 className="text-[#37322F] font-semibold leading-tight font-sans text-lg sm:text-xl">
                          Your team, in sync
                        </h3>
                        <p className="text-[#605A57] text-sm md:text-base font-normal leading-relaxed font-sans">
                          Cashier changes, stock alerts, and manager approvals flow in real-time — even across multiple stores.
                        </p>
                      </div>
                      <div className="w-full h-[200px] sm:h-[250px] md:h-[300px] rounded-lg flex overflow-hidden text-right items-center justify-center">
                        <YourWorkInSync width="400" height="250" theme="light" className="scale-60 sm:scale-75 md:scale-90" />
                      </div>
                    </div>

                    {/* Bottom Left */}
                    <div className="border-r-0 md:border-r border-[rgba(55,50,47,0.12)] p-4 sm:p-6 md:p-8 lg:p-12 flex flex-col justify-start items-start gap-4 sm:gap-6 bg-transparent">
                      <div className="flex flex-col gap-2">
                        <h3 className="text-[#37322F] text-lg sm:text-xl font-semibold leading-tight font-sans">
                          Offline-First Syncing
                        </h3>
                        <p className="text-[#605A57] text-sm md:text-base font-normal leading-relaxed font-sans">
                          Transactions save locally in a secure silo and stream automatically to your master dashboard as soon as you are reconnected.
                        </p>
                      </div>
                      <div className="w-full h-[200px] sm:h-[250px] md:h-[300px] rounded-lg flex overflow-hidden justify-center items-center relative bg-transparent">
                        <div className="w-full h-full flex items-center justify-center bg-transparent">
                          <EffortlessIntegration width={400} height={250} className="max-w-full max-h-full" />
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#F7F5F3] to-transparent pointer-events-none"></div>
                      </div>
                    </div>

                    {/* Bottom Right */}
                    <div className="p-4 sm:p-6 md:p-8 lg:p-12 flex flex-col justify-start items-start gap-4 sm:gap-6">
                      <div className="flex flex-col gap-2">
                        <h3 className="text-[#37322F] text-lg sm:text-xl font-semibold leading-tight font-sans">
                          Numbers that speak
                        </h3>
                        <p className="text-[#605A57] text-sm md:text-base font-normal leading-relaxed font-sans">
                          Track sales by store, by payment method, by day — and export it all for your accountant in one click.
                        </p>
                      </div>
                      <div className="w-full h-[200px] sm:h-[250px] md:h-[300px] rounded-lg flex overflow-hidden items-center justify-center relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <NumbersThatSpeak width="100%" height="100%" theme="light" className="w-full h-full object-contain" />
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#F7F5F3] to-transparent pointer-events-none"></div>
                      </div>
                    </div>
                  </div>

                  <div className="w-4 sm:w-6 md:w-8 lg:w-12 self-stretch relative overflow-hidden">
                    <div className="w-[120px] sm:w-[140px] md:w-[162px] left-[-40px] sm:left-[-50px] md:left-[-58px] top-[-120px] absolute flex flex-col justify-start items-start">
                      {Array.from({ length: 200 }).map((_, i) => (
                        <div key={i} className="self-stretch h-3 sm:h-4 rotate-[-45deg] origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Remaining Sections */}
              <DocumentationSection />
              <TestimonialsSection />
              <PricingSection />
              <FAQSection />
              <CTASection />
              <FooterSection />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
