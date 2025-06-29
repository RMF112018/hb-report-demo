"use client"

import { EnhancedGCsGRsForm } from "./enhanced-gcs-grs-form"
import type { RFP } from "@/types/estimating"

interface GCsGRsFormProps {
  selectedRFP: RFP | null
}

export function GCsGRsForm({ selectedRFP }: GCsGRsFormProps) {
  return <EnhancedGCsGRsForm selectedRFP={selectedRFP} />
}
