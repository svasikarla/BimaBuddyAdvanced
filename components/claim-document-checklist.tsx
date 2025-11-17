"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  CheckCircle,
  XCircle,
  Upload,
  FileText,
  AlertCircle,
  Download
} from 'lucide-react'
import { motion } from 'framer-motion'
import type { ClaimDocument, ClaimType, DocumentType } from '@/lib/types/claim-intelligence'

interface ClaimDocumentChecklistProps {
  claimType: ClaimType
  documents?: ClaimDocument[]
  onDocumentUpload?: (docType: DocumentType, file: File) => void
}

const DOCUMENT_INFO: Record<DocumentType, { title: string; description: string; critical: boolean }> = {
  hospital_bill: {
    title: 'Hospital Final Bill',
    description: 'Detailed itemized bill from hospital',
    critical: true
  },
  discharge_summary: {
    title: 'Discharge Summary',
    description: 'Medical summary from doctor',
    critical: true
  },
  prescriptions: {
    title: 'Prescriptions',
    description: 'All medicine prescriptions',
    critical: false
  },
  diagnostic_reports: {
    title: 'Diagnostic Reports',
    description: 'Lab tests, X-rays, MRI, CT scans',
    critical: true
  },
  doctor_consultation: {
    title: 'Doctor Consultation Bills',
    description: 'Consultation receipts and notes',
    critical: false
  },
  pharmacy_bills: {
    title: 'Pharmacy Bills',
    description: 'Medicine purchase receipts',
    critical: false
  },
  ambulance_bill: {
    title: 'Ambulance Bill',
    description: 'Ambulance service receipt',
    critical: false
  },
  pre_auth_form: {
    title: 'Pre-Authorization Form',
    description: 'Approved pre-auth document',
    critical: false
  },
  claim_form: {
    title: 'Claim Form',
    description: 'Filled and signed claim form',
    critical: true
  },
  policy_copy: {
    title: 'Policy Copy',
    description: 'Health insurance policy document',
    critical: true
  },
  id_proof: {
    title: 'ID Proof',
    description: 'Aadhaar/PAN/Driver License',
    critical: true
  },
  cancelled_cheque: {
    title: 'Cancelled Cheque',
    description: 'For reimbursement',
    critical: true
  }
}

const CLAIM_TYPE_DOCUMENTS: Record<ClaimType, DocumentType[]> = {
  hospitalization: [
    'claim_form',
    'policy_copy',
    'id_proof',
    'hospital_bill',
    'discharge_summary',
    'diagnostic_reports',
    'prescriptions',
    'doctor_consultation',
    'pharmacy_bills',
    'cancelled_cheque'
  ],
  day_care: [
    'claim_form',
    'policy_copy',
    'id_proof',
    'hospital_bill',
    'discharge_summary',
    'diagnostic_reports',
    'prescriptions'
  ],
  pre_hospitalization: [
    'claim_form',
    'policy_copy',
    'diagnostic_reports',
    'doctor_consultation',
    'prescriptions',
    'pharmacy_bills'
  ],
  post_hospitalization: [
    'claim_form',
    'policy_copy',
    'discharge_summary',
    'prescriptions',
    'pharmacy_bills',
    'doctor_consultation'
  ],
  ambulance: [
    'claim_form',
    'policy_copy',
    'ambulance_bill',
    'hospital_bill',
    'discharge_summary'
  ],
  maternity: [
    'claim_form',
    'policy_copy',
    'id_proof',
    'hospital_bill',
    'discharge_summary',
    'diagnostic_reports',
    'prescriptions'
  ],
  critical_illness: [
    'claim_form',
    'policy_copy',
    'id_proof',
    'hospital_bill',
    'discharge_summary',
    'diagnostic_reports',
    'doctor_consultation',
    'prescriptions',
    'cancelled_cheque'
  ],
  organ_transplant: [
    'claim_form',
    'policy_copy',
    'id_proof',
    'hospital_bill',
    'discharge_summary',
    'diagnostic_reports',
    'doctor_consultation',
    'prescriptions',
    'pharmacy_bills',
    'cancelled_cheque'
  ]
}

export function ClaimDocumentChecklist({
  claimType,
  documents = [],
  onDocumentUpload
}: ClaimDocumentChecklistProps) {
  const requiredDocs = CLAIM_TYPE_DOCUMENTS[claimType] || []

  const uploadedCount = documents.filter(d => d.uploaded).length
  const completionPercentage = (uploadedCount / requiredDocs.length) * 100

  const criticalMissing = requiredDocs.filter(docType => {
    const doc = documents.find(d => d.type === docType)
    return DOCUMENT_INFO[docType]?.critical && (!doc || !doc.uploaded)
  })

  const handleFileUpload = (docType: DocumentType, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && onDocumentUpload) {
      onDocumentUpload(docType, file)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Document Checklist
        </CardTitle>
        <CardDescription>
          {claimType.replace('_', ' ').toUpperCase()} Claim - Upload all required documents
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress Summary */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Completion Progress</span>
            <span className="font-semibold">
              {uploadedCount} / {requiredDocs.length} documents
            </span>
          </div>
          <Progress value={completionPercentage} className="h-3" />

          {criticalMissing.length > 0 && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg mt-4">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-red-900">
                  {criticalMissing.length} Critical Document(s) Missing
                </p>
                <p className="text-xs text-red-700">
                  These documents are mandatory. Your claim may be rejected without them.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Document List */}
        <div className="space-y-3">
          {requiredDocs.map((docType) => {
            const doc = documents.find(d => d.type === docType)
            const info = DOCUMENT_INFO[docType]
            const isUploaded = doc?.uploaded || false
            const isVerified = doc?.verification_status === 'verified'
            const isRejected = doc?.verification_status === 'rejected'

            return (
              <motion.div
                key={docType}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 border rounded-lg transition-all ${
                  isUploaded
                    ? isVerified
                      ? 'border-green-200 bg-green-50'
                      : isRejected
                      ? 'border-red-200 bg-red-50'
                      : 'border-blue-200 bg-blue-50'
                    : info.critical
                    ? 'border-red-200 bg-red-50'
                    : 'border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold">{info.title}</h4>
                      {info.critical && !isUploaded && (
                        <Badge variant="destructive" className="text-xs">
                          Critical
                        </Badge>
                      )}
                      {isUploaded && (
                        <Badge
                          variant={isVerified ? 'default' : isRejected ? 'destructive' : 'secondary'}
                          className="text-xs"
                        >
                          {isVerified ? 'Verified' : isRejected ? 'Rejected' : 'Uploaded'}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{info.description}</p>

                    {isUploaded && doc && (
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-muted-foreground">{doc.file_name}</span>
                        {doc.upload_date && (
                          <span className="text-xs text-muted-foreground">
                            • {new Date(doc.upload_date).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    )}

                    {isRejected && doc?.rejection_reason && (
                      <div className="mt-2 p-2 bg-red-100 border border-red-200 rounded">
                        <p className="text-xs text-red-900">
                          <strong>Rejection Reason:</strong> {doc.rejection_reason}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="ml-4">
                    {isUploaded ? (
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    ) : (
                      <label htmlFor={`upload-${docType}`}>
                        <Button size="sm" asChild>
                          <span>
                            <Upload className="h-4 w-4 mr-2" />
                            Upload
                          </span>
                        </Button>
                        <input
                          id={`upload-${docType}`}
                          type="file"
                          className="hidden"
                          onChange={(e) => handleFileUpload(docType, e)}
                          accept=".pdf,.jpg,.jpeg,.png"
                        />
                      </label>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Tips */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">Document Tips</h4>
          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li>All documents should be clear and legible</li>
            <li>Upload PDF or high-quality images (JPG, PNG)</li>
            <li>Ensure all pages are included for multi-page documents</li>
            <li>File size should not exceed 5MB per document</li>
            <li>Documents should have your name and dates visible</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
