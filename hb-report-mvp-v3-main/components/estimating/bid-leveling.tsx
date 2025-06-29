"use client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"
import type { RFP } from "@/types/estimating"
import { useEstimating } from "./estimating-context"
import { BidLevelingContent } from "./bid-leveling-content" // Import the renamed component

interface BidLevelingProps {
  selectedRFP: RFP | null
}

interface Bid {
  id: string
  vendor: string
  amount: number
  status: "received" | "reviewed" | "selected" | "rejected"
  confidence: number
  notes?: string
  inclusions: string[]
  exclusions: string[]
  submittedAt: Date
}

interface TradeBids {
  tradeId: string
  tradeName: string
  bids: Bid[]
  selectedBid?: string
  aiRecommendation?: string
  riskLevel: "low" | "medium" | "high"
  variance: number
}

const mockTradeBids: TradeBids[] = [
  {
    tradeId: "concrete",
    tradeName: "Concrete",
    riskLevel: "low",
    variance: 12.5,
    aiRecommendation: "ABC Concrete offers the best value with proven track record",
    bids: [
      {
        id: "b1",
        vendor: "ABC Concrete",
        amount: 485000,
        status: "selected",
        confidence: 95,
        inclusions: ["Materials", "Labor", "Equipment", "Cleanup"],
        exclusions: ["Permits", "Site prep"],
        submittedAt: new Date("2024-01-15"),
      },
      {
        id: "b2",
        vendor: "XYZ Construction",
        amount: 520000,
        status: "reviewed",
        confidence: 88,
        inclusions: ["Materials", "Labor", "Basic cleanup"],
        exclusions: ["Permits", "Site prep", "Equipment rental"],
        submittedAt: new Date("2024-01-16"),
      },
      {
        id: "b3",
        vendor: "Premier Concrete",
        amount: 465000,
        status: "reviewed",
        confidence: 78,
        notes: "Lowest bid but limited availability",
        inclusions: ["Materials", "Labor"],
        exclusions: ["Permits", "Site prep", "Equipment", "Cleanup"],
        submittedAt: new Date("2024-01-17"),
      },
    ],
  },
  {
    tradeId: "plumbing",
    tradeName: "Plumbing",
    riskLevel: "medium",
    variance: 28.3,
    aiRecommendation: "Pro Plumbing recommended despite higher cost due to schedule reliability",
    bids: [
      {
        id: "p1",
        vendor: "Pro Plumbing",
        amount: 320000,
        status: "selected",
        confidence: 92,
        inclusions: ["Materials", "Labor", "Permits", "Testing"],
        exclusions: ["Fixtures above standard grade"],
        submittedAt: new Date("2024-01-14"),
      },
      {
        id: "p2",
        vendor: "Budget Plumbing",
        amount: 285000,
        status: "reviewed",
        confidence: 65,
        notes: "Significant exclusions noted",
        inclusions: ["Basic materials", "Labor"],
        exclusions: ["Permits", "Testing", "Premium fixtures", "Warranty"],
        submittedAt: new Date("2024-01-18"),
      },
    ],
  },
  {
    tradeId: "electrical",
    tradeName: "Electrical",
    riskLevel: "high",
    variance: 45.2,
    bids: [
      {
        id: "e1",
        vendor: "Spark Electric",
        amount: 425000,
        status: "received",
        confidence: 85,
        inclusions: ["Materials", "Labor", "Basic testing"],
        exclusions: ["Permits", "Specialty lighting"],
        submittedAt: new Date("2024-01-19"),
      },
      {
        id: "e2",
        vendor: "Voltage Solutions",
        amount: 380000,
        status: "received",
        confidence: 70,
        inclusions: ["Materials", "Labor"],
        exclusions: ["Permits", "Testing", "Conduit", "Panel upgrades"],
        submittedAt: new Date("2024-01-20"),
      },
      {
        id: "e3",
        vendor: "Elite Electrical",
        amount: 550000,
        status: "received",
        confidence: 98,
        inclusions: ["All materials", "Labor", "Permits", "Testing", "Warranty", "Specialty work"],
        exclusions: [],
        submittedAt: new Date("2024-01-21"),
      },
    ],
  },
]

export default function BidLeveling() {
  const { selectedRFP, projectEstimate, selectVendorBid, updateVendorBid, updateBidLevelingNotes } = useEstimating()

  // Extract relevant data from projectEstimate for BidLevelingContent
  const tradeBids = projectEstimate.vendorBids
  const selectedBids = projectEstimate.selectedBids
  const levelingNotes = projectEstimate.bidLevelingNotes || ""

  // Callback to update leveling notes in context
  const handleLevelingNotesChange = (notes: string) => {
    updateBidLevelingNotes(notes)
  }

  return (
    <Card className="p-6" data-tour="bid-leveling-tab">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <TrendingUp className="h-6 w-6" /> Bid Leveling
        </CardTitle>
        <CardDescription>Compare and analyze vendor bids to make informed selection decisions.</CardDescription>
      </CardHeader>
      <CardContent>
        <BidLevelingContent
          selectedRFP={selectedRFP}
          tradeBids={tradeBids}
          selectedBids={selectedBids}
          onSelectBid={selectVendorBid}
          onUpdateVendorBid={updateVendorBid}
          levelingNotes={levelingNotes}
          onLevelingNotesChange={handleLevelingNotesChange}
        />
      </CardContent>
    </Card>
  )
}
