import type React from "react"
import { 
  CheckCircle2, 
  Store, 
  Package, 
  Smartphone, 
  ArrowRight, 
  LayoutDashboard, 
  UserPlus, 
  RefreshCcw, 
  Zap, 
  ShieldCheck, 
  BarChart3,
  Search,
  ScanLine,
  Printer
} from "lucide-react"

function Badge({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="px-[14px] py-[6px] bg-white dark:bg-white/5 shadow-[0px_0px_0px_4px_rgba(55,50,47,0.05)] dark:shadow-none overflow-hidden rounded-[90px] flex justify-start items-center gap-[8px] border border-[rgba(2,6,23,0.08)] dark:border-white/10 transition-colors">
      <div className="w-[14px] h-[14px] relative overflow-hidden flex items-center justify-center dark:text-white transition-colors">{icon}</div>
      <div className="text-center flex justify-center flex-col text-[#37322F] dark:text-gray-300 text-xs font-medium leading-3 font-sans transition-colors">
        {text}
      </div>
    </div>
  )
}

const OnboardingStep = ({ 
  number, 
  title, 
  description, 
  icon: Icon,
  details,
  isLast = false 
}: { 
  number: string, 
  title: string, 
  description: string, 
  icon: any,
  details: string[],
  isLast?: boolean
}) => (
  <div className="flex flex-col items-start text-left group bg-white dark:bg-white/5 p-6 rounded-2xl border border-[rgba(55,50,47,0.1)] dark:border-white/10 hover:border-accent transition-all duration-300 shadow-sm hover:shadow-md">
    <div className="flex items-center gap-4 mb-4">
      <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
        <Icon className="w-6 h-6 text-accent" />
      </div>
      <div className="text-sm font-bold text-[#37322F] dark:text-white/50 font-mono">
        STEP {number}
      </div>
    </div>
    <h3 className="text-xl font-bold text-[#37322F] dark:text-white mb-3 font-sans tracking-tight">
      {title}
    </h3>
    <p className="text-sm text-[#605A57] dark:text-gray-400 font-normal font-sans leading-relaxed mb-4">
      {description}
    </p>
    <ul className="space-y-2">
      {details.map((detail, idx) => (
        <li key={idx} className="flex items-start gap-2 text-xs text-[#605A57] dark:text-gray-400">
          <Zap className="w-3 h-3 mt-0.5 text-accent flex-shrink-0" />
          <span>{detail}</span>
        </li>
      ))}
    </ul>
  </div>
)

const WorkflowCard = ({ title, steps, icon: Icon }: { title: string, steps: string[], icon: any }) => (
  <div className="bg-[#F7F5F3] dark:bg-white/5 border border-[rgba(55,50,47,0.1)] dark:border-white/10 p-8 rounded-3xl">
    <div className="flex items-center gap-3 mb-6">
      <Icon className="w-6 h-6 text-[#37322F] dark:text-white" />
      <h4 className="text-lg font-bold text-[#37322F] dark:text-white font-sans">{title}</h4>
    </div>
    <div className="space-y-4">
      {steps.map((step, idx) => (
        <div key={idx} className="flex gap-4 items-center">
          <div className="w-6 h-6 rounded-full bg-[#37322F] dark:bg-accent text-white dark:text-primary-foreground text-[10px] flex items-center justify-center flex-shrink-0 font-bold">
            {idx + 1}
          </div>
          <p className="text-sm text-[#49423D] dark:text-gray-300 font-medium">{step}</p>
        </div>
      ))}
    </div>
  </div>
)

export default function OnboardingSection() {
  const mainSteps = [
    {
      number: "01",
      title: "Workspace Activation",
      description: "Initialize your secure retail namespace in under 30 seconds. This is your private cloud environment where all data resides.",
      icon: UserPlus,
      details: ["Email verification required", "Domain-specific workspace", "Multi-user role assignment"]
    },
    {
      number: "02",
      title: "Store Architecture",
      description: "Define your physical footprint. NEXA supports complex hierarchies from single kiosks to continent-wide retail chains.",
      icon: Store,
      details: ["Geolocation tagging", "Branch-specific tax settings", "Independent inventory isolation"]
    },
    {
      number: "03",
      title: "Product Inflow",
      description: "Build your digital catalog. Use our bulk importer for legacy data or the smart entry form for new product lines.",
      icon: Package,
      details: ["CSV/Excel bulk import", "Category & Brand grouping", "Custom SKU & Barcode mapping"]
    },
    {
      number: "04",
      title: "Label Generation",
      description: "Bridge the gap between physical and digital. Generate industry-standard QR labels instantly for your entire stock.",
      icon: Printer,
      details: ["Auto-scaling QR graphics", "Print-ready A4 PDF layouts", "Item-level metadata encoding"]
    },
    {
      number: "05",
      title: "Device Registration",
      description: "Deploy your sales points. Any browser-capable device (iPad, Android, Laptop) becomes a powerful POS terminal.",
      icon: Smartphone,
      details: ["Zero-install PWA technology", "Camera permission handshake", "Local storage cache warming"]
    },
    {
      number: "06",
      title: "Operational Sync",
      description: "Go live with confidence. Your team can now sell, scan, and manage inventory with full offline autonomy.",
      icon: RefreshCcw,
      details: ["Conflict-free delta merging", "Background sync engine", "Action-level audit logging"]
    }
  ]

  return (
    <div id="how-it-works" className="w-full border-b border-[rgba(55,50,47,0.12)] dark:border-white/10 flex flex-col justify-center items-center py-24 bg-[#FBF9F7] dark:bg-black/20 scroll-mt-20">
      <div className="w-full max-w-[1060px] px-4 sm:px-6 md:px-8 flex flex-col items-center">
        <Badge
          icon={<ArrowRight className="w-3 h-3" />}
          text="Complete System Walkthrough"
        />
        
        <div className="mt-8 mb-16 text-center max-w-3xl">
          <h2 className="text-4xl md:text-6xl font-semibold text-[#49423D] dark:text-white mb-6 font-sans tracking-tighter leading-tight">
            Designed for precision. <br/>Built for scale.
          </h2>
          <p className="text-lg md:text-xl text-[#605A57] dark:text-gray-400 font-sans leading-relaxed">
            Nexa isn't just a POS—it's a complete retail operating system. Our onboarding process ensures your transition from legacy hardware to a modern software stack is seamless, verified, and data-driven.
          </p>
        </div>

        {/* 6-Step Detailed Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full mb-24">
          {mainSteps.map((step, index) => (
            <OnboardingStep 
              key={index}
              {...step}
            />
          ))}
        </div>

        {/* Detailed Explanation / How to Use Detail */}
        <div className="w-full bg-white dark:bg-white/5 rounded-[40px] border border-[rgba(55,50,47,0.12)] dark:border-white/10 p-8 md:p-16 shadow-sm overflow-hidden relative">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-[0.03] dark:opacity-[0.05] pointer-events-none">
             <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
               <defs>
                 <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                   <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
                 </pattern>
               </defs>
               <rect width="100%" height="100%" fill="url(#grid)" />
             </svg>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start relative z-10">
            <div>
              <Badge icon={<ShieldCheck className="w-3 h-3" />} text="System Integrity" />
              <h3 className="text-3xl md:text-4xl font-bold text-[#37322F] dark:text-white mt-6 mb-8 font-sans tracking-tight">
                Self-Explanatory Workflows
              </h3>
              
              <div className="space-y-10">
                <div className="flex gap-6">
                  <div className="w-12 h-12 rounded-2xl bg-accent flex items-center justify-center flex-shrink-0 text-primary-foreground shadow-lg shadow-accent/20">
                    <ScanLine className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-[#37322F] dark:text-white mb-2">Checkout Logic</h4>
                    <p className="text-[#605A57] dark:text-gray-400 leading-relaxed">
                      Simply navigate to the <span className="font-semibold text-accent">POS</span> tab, select your branch, and use the integrated <span className="font-semibold text-accent">Scanner</span>. The system automatically detects QR patterns, fetches pricing, and calculates totals instantly.
                    </p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="w-12 h-12 rounded-2xl bg-[#37322F] dark:bg-white/10 flex items-center justify-center flex-shrink-0 text-white shadow-lg">
                    <CloudLightning className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-[#37322F] dark:text-white mb-2">Zero-Connectivity Mode</h4>
                    <p className="text-[#605A57] dark:text-gray-400 leading-relaxed">
                      Nexa uses <span className="font-mono text-xs bg-[hsla(20,10%,90%,1)] dark:bg-white/5 px-1 py-0.5 rounded italic">IndexedDB</span> for local persistence. Your sales are never lost—they are securely stored in your browser's encrypted sandbox until a network connection is established for background synchronization.
                    </p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="w-12 h-12 rounded-2xl bg-accent/20 flex items-center justify-center flex-shrink-0 text-accent">
                    <BarChart3 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-[#37322F] dark:text-white mb-2">Global Reconciliation</h4>
                    <p className="text-[#605A57] dark:text-gray-400 leading-relaxed">
                      Administrators get a real-time feed of all synchronized transactions. Generate branch-specific reports or global tax summaries with a single click in the <span className="font-semibold text-accent">Analytics</span> dashboard.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <WorkflowCard 
                icon={Zap}
                title="Daily Sales Cycle"
                steps={[
                  "Staff logs into Branch POS",
                  "System verifies local product cache",
                  "Customer QR codes are scanned",
                  "Sale is logged locally (confirmed instantly)",
                  "Automatic Background Sync to Master Cloud"
                ]}
              />
              <WorkflowCard 
                icon={Search}
                title="Inventory Audit"
                steps={[
                  "Manager selects 'Inventory' from Dashboard",
                  "Filters by Branch or Category",
                  "Bulk edits stock levels via CSV",
                  "System flags low-stock items instantly",
                  "One-click PDF Label printing for restock"
                ]}
              />
            </div>
          </div>
        </div>

        {/* Final CTA for Onboarding */}
        <div className="mt-20 flex flex-col items-center">
            <p className="text-sm font-medium text-[#605A57] dark:text-gray-400 mb-6 font-sans">
                Still have questions? Check our detailed documentation or start your 14-day free trial.
            </p>
            <div className="flex gap-4 flex-wrap justify-center">
                <button className="px-8 py-3 bg-[#37322F] dark:bg-accent text-white dark:text-primary-foreground rounded-full font-bold hover:opacity-90 transition-opacity">
                    Create Workspace
                </button>
                <button className="px-8 py-3 bg-white dark:bg-white/5 border border-[rgba(55,50,47,0.12)] dark:border-white/10 text-[#37322F] dark:text-white rounded-full font-bold hover:bg-[#F7F5F3] dark:hover:bg-white/10 transition-all">
                    View Demo
                </button>
            </div>
        </div>
      </div>
    </div>
  )
}

function CloudLightning(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 16.326A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 .5 8.973" />
      <path d="m13 12-3 5h4l-3 5" />
    </svg>
  )
}
