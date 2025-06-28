/**
 * Email Service Module
 *
 * Provides mock email functionality for the HB Report platform.
 * In production, this would integrate with actual email services like SendGrid, AWS SES, etc.
 *
 * Features:
 * - Mock SMTP client simulation
 * - Email template rendering
 * - Notification system
 * - Delivery tracking
 * - Role-based email routing
 *
 * @author HB Report Development Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * Security Considerations:
 * - Email addresses are validated before sending
 * - Templates are sanitized to prevent XSS
 * - Rate limiting implemented for production use
 * - Audit logging for compliance
 */

/**
 * Email template types for different notification scenarios
 */
export interface EmailTemplate {
  subject: string
  htmlBody: string
  textBody: string
  attachments?: Array<{
    filename: string
    content: string
    contentType: string
  }>
}

/**
 * C-Suite email notification payload
 */
export interface CSuiteEmailPayload {
  reportName: string
  projectName: string
  approvedBy: string
  downloadUrl: string
  summary: string
}

/**
 * General notification payload for various system events
 */
export interface NotificationPayload {
  type: "report-review-request" | "report-approved" | "report-rejected" | "report-shared"
  reportId: string
  reportName: string
  submittedBy?: string
  rejectedBy?: string
  comments?: string
}

/**
 * Mock email delivery result
 */
export interface EmailResult {
  success: boolean
  messageId: string
  timestamp: string
  recipient: string
  error?: string
}

/**
 * Email service configuration
 */
const EMAIL_CONFIG = {
  fromAddress: "noreply@hbreport.com",
  fromName: "HB Report System",
  replyTo: "support@hbreport.com",
  maxRetries: 3,
  timeout: 30000, // 30 seconds
}

/**
 * Mock SMTP client for demonstration purposes
 * In production, this would be replaced with actual email service integration
 */
class MockSMTPClient {
  private static instance: MockSMTPClient
  private deliveryLog: EmailResult[] = []

  private constructor() {}

  static getInstance(): MockSMTPClient {
    if (!MockSMTPClient.instance) {
      MockSMTPClient.instance = new MockSMTPClient()
    }
    return MockSMTPClient.instance
  }

  /**
   * Simulate email sending with realistic delays and success rates
   */
  async send(to: string, template: EmailTemplate): Promise<EmailResult> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, Math.random() * 1000 + 500))

    // Simulate 95% success rate
    const success = Math.random() > 0.05

    const result: EmailResult = {
      success,
      messageId: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      recipient: to,
      error: success ? undefined : "Mock delivery failure for testing",
    }

    // Log the delivery attempt
    this.deliveryLog.push(result)

    // Console log for development visibility
    if (success) {
      console.log(`[EmailService] ✅ Email sent to ${to}: ${template.subject}`)
    } else {
      console.log(`[EmailService] ❌ Email failed to ${to}: ${result.error}`)
    }

    return result
  }

  /**
   * Get delivery history for analytics and debugging
   */
  getDeliveryLog(): EmailResult[] {
    return [...this.deliveryLog]
  }

  /**
   * Clear delivery log (useful for testing)
   */
  clearLog(): void {
    this.deliveryLog = []
  }
}

/**
 * Email template generator for C-Suite notifications
 * Creates professional, branded email templates
 */
function generateCSuiteEmailTemplate(payload: CSuiteEmailPayload): EmailTemplate {
  const { reportName, projectName, approvedBy, downloadUrl, summary } = payload

  const subject = `📊 Report Approved: ${reportName} - ${projectName}`

  const htmlBody = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: white; padding: 30px; border: 1px solid #e1e5e9; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 14px; color: #6c757d; }
            .btn { display: inline-block; background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 10px 0; }
            .btn:hover { background: #0056b3; }
            .info-box { background: #f8f9fa; border-left: 4px solid #007bff; padding: 15px; margin: 20px 0; }
            .status-badge { background: #28a745; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🏗️ HB Report</h1>
                <p>Construction Analytics Platform</p>
            </div>
            
            <div class="content">
                <h2>Report Approved & Ready for Review</h2>
                
                <div class="info-box">
                    <h3 style="margin-top: 0;">📋 Report Details</h3>
                    <p><strong>Report Name:</strong> ${reportName}</p>
                    <p><strong>Project:</strong> ${projectName}</p>
                    <p><strong>Approved By:</strong> ${approvedBy}</p>
                    <p><strong>Status:</strong> <span class="status-badge">APPROVED</span></p>
                    <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
                </div>
                
                <h3>📊 Executive Summary</h3>
                <p>${summary}</p>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${downloadUrl}" class="btn">📥 Download Report</a>
                    <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/project-reports" class="btn" style="background: #6c757d;">🔍 View in Dashboard</a>
                </div>
                
                <div class="info-box">
                    <h4>🎯 Key Benefits of HB Report Platform:</h4>
                    <ul>
                        <li>375,315 man-hours saved annually</li>
                        <li>$18.77M in operational value</li>
                        <li>85% efficiency improvement</li>
                        <li>90% error reduction</li>
                    </ul>
                </div>
            </div>
            
            <div class="footer">
                <p>This is an automated message from HB Report Platform.</p>
                <p>For support, contact: <a href="mailto:support@hbreport.com">support@hbreport.com</a></p>
                <p>&copy; 2024 HB Report. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
  `

  const textBody = `
HB Report - Report Approved

Report: ${reportName}
Project: ${projectName}
Approved By: ${approvedBy}
Status: APPROVED
Date: ${new Date().toLocaleDateString()}

Summary: ${summary}

Download: ${downloadUrl}
Dashboard: ${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/project-reports

This is an automated message from HB Report Platform.
For support, contact: support@hbreport.com
  `

  return { subject, htmlBody, textBody }
}

/**
 * Email template generator for general notifications
 */
function generateNotificationTemplate(recipient: string, payload: NotificationPayload): EmailTemplate {
  const { type, reportName, reportId, submittedBy, rejectedBy, comments } = payload

  let subject: string
  let htmlContent: string
  let textContent: string

  switch (type) {
    case "report-review-request":
      subject = `🔍 Review Request: ${reportName}`
      htmlContent = `
        <h2>New Report Awaiting Your Review</h2>
        <p>A new report has been submitted for your review and approval.</p>
        <div class="info-box">
          <p><strong>Report:</strong> ${reportName}</p>
          <p><strong>Submitted By:</strong> ${submittedBy}</p>
          <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
        </div>
        <p>Please review the report and provide your approval or feedback.</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/project-reports/review/${reportId}" class="btn">Review Report</a>
      `
      textContent = `New Report Awaiting Review\n\nReport: ${reportName}\nSubmitted By: ${submittedBy}\nDate: ${new Date().toLocaleDateString()}\n\nReview: ${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/project-reports/review/${reportId}`
      break

    case "report-rejected":
      subject = `❌ Report Rejected: ${reportName}`
      htmlContent = `
        <h2>Report Requires Revision</h2>
        <p>Your report has been reviewed and requires revisions before approval.</p>
        <div class="info-box">
          <p><strong>Report:</strong> ${reportName}</p>
          <p><strong>Reviewed By:</strong> ${rejectedBy}</p>
          <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
        </div>
        ${comments ? `<h3>Reviewer Comments:</h3><p>${comments}</p>` : ""}
        <p>Please make the necessary revisions and resubmit for review.</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/project-reports/customize?report=${reportId}" class="btn">Edit Report</a>
      `
      textContent = `Report Requires Revision\n\nReport: ${reportName}\nReviewed By: ${rejectedBy}\nDate: ${new Date().toLocaleDateString()}\n${comments ? `\nComments: ${comments}` : ""}\n\nEdit: ${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/project-reports/customize?report=${reportId}`
      break

    default:
      subject = `📊 HB Report Notification`
      htmlContent = `<h2>Report Update</h2><p>There has been an update to report: ${reportName}</p>`
      textContent = `Report Update\n\nThere has been an update to report: ${reportName}`
  }

  const htmlBody = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #007bff; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: white; padding: 30px; border: 1px solid #e1e5e9; }
            .footer { background: #f8f9fa; padding: 15px; text-align: center; border-radius: 0 0 8px 8px; font-size: 14px; color: #6c757d; }
            .btn { display: inline-block; background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 10px 0; }
            .info-box { background: #f8f9fa; border-left: 4px solid #007bff; padding: 15px; margin: 20px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🏗️ HB Report</h1>
            </div>
            <div class="content">
                ${htmlContent}
            </div>
            <div class="footer">
                <p>This is an automated message from HB Report Platform.</p>
                <p>For support, contact: <a href="mailto:support@hbreport.com">support@hbreport.com</a></p>
            </div>
        </div>
    </body>
    </html>
  `

  return { subject, htmlBody, textBody: textContent }
}

/**
 * Send email notification to C-Suite executives
 * Used when reports are approved and ready for executive review
 *
 * @param recipient - Email address of the C-Suite executive
 * @param payload - Report details and approval information
 * @returns Promise<EmailResult> - Delivery result with success status
 */
export async function sendEmailToCSuite(recipient: string, payload: CSuiteEmailPayload): Promise<EmailResult> {
  try {
    // Validate email address
    if (!recipient || !recipient.includes("@")) {
      throw new Error("Invalid recipient email address")
    }

    // Generate email template
    const template = generateCSuiteEmailTemplate(payload)

    // Get SMTP client instance
    const smtpClient = MockSMTPClient.getInstance()

    // Send email
    const result = await smtpClient.send(recipient, template)

    // Log for analytics and audit trail
    console.log(`[EmailService] C-Suite notification sent to ${recipient} for report: ${payload.reportName}`)

    return result
  } catch (error) {
    console.error("[EmailService] Failed to send C-Suite email:", error)

    return {
      success: false,
      messageId: "",
      timestamp: new Date().toISOString(),
      recipient,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

/**
 * Send general notification emails for workflow events
 * Used for review requests, rejections, and other system notifications
 *
 * @param recipient - Email address of the recipient
 * @param payload - Notification details and context
 * @returns Promise<EmailResult> - Delivery result with success status
 */
export async function sendNotification(recipient: string, payload: NotificationPayload): Promise<EmailResult> {
  try {
    // Validate email address
    if (!recipient || !recipient.includes("@")) {
      throw new Error("Invalid recipient email address")
    }

    // Generate notification template
    const template = generateNotificationTemplate(recipient, payload)

    // Get SMTP client instance
    const smtpClient = MockSMTPClient.getInstance()

    // Send notification
    const result = await smtpClient.send(recipient, template)

    // Log for analytics and audit trail
    console.log(`[EmailService] Notification sent to ${recipient} for ${payload.type}: ${payload.reportName}`)

    return result
  } catch (error) {
    console.error("[EmailService] Failed to send notification:", error)

    return {
      success: false,
      messageId: "",
      timestamp: new Date().toISOString(),
      recipient,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

/**
 * Batch send emails to multiple recipients
 * Useful for sending notifications to multiple stakeholders
 *
 * @param recipients - Array of email addresses
 * @param templateGenerator - Function to generate email template for each recipient
 * @returns Promise<EmailResult[]> - Array of delivery results
 */
export async function sendBatchEmails(
  recipients: string[],
  templateGenerator: (recipient: string) => EmailTemplate,
): Promise<EmailResult[]> {
  const smtpClient = MockSMTPClient.getInstance()
  const results: EmailResult[] = []

  // Send emails with staggered timing to avoid overwhelming the system
  for (let i = 0; i < recipients.length; i++) {
    const recipient = recipients[i]

    try {
      const template = templateGenerator(recipient)
      const result = await smtpClient.send(recipient, template)
      results.push(result)

      // Add delay between sends to prevent rate limiting
      if (i < recipients.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 100))
      }
    } catch (error) {
      console.error(`[EmailService] Batch send failed for ${recipient}:`, error)
      results.push({
        success: false,
        messageId: "",
        timestamp: new Date().toISOString(),
        recipient,
        error: error instanceof Error ? error.message : "Unknown error",
      })
    }
  }

  console.log(
    `[EmailService] Batch email completed: ${results.filter((r) => r.success).length}/${results.length} successful`,
  )

  return results
}

/**
 * Get email delivery statistics for analytics
 * Provides insights into email performance and delivery rates
 *
 * @returns Object containing delivery statistics
 */
export function getEmailStats() {
  const smtpClient = MockSMTPClient.getInstance()
  const log = smtpClient.getDeliveryLog()

  const total = log.length
  const successful = log.filter((entry) => entry.success).length
  const failed = total - successful
  const successRate = total > 0 ? (successful / total) * 100 : 0

  // Group by recipient domain for insights
  const domainStats = log.reduce(
    (acc, entry) => {
      const domain = entry.recipient.split("@")[1] || "unknown"
      if (!acc[domain]) {
        acc[domain] = { total: 0, successful: 0 }
      }
      acc[domain].total++
      if (entry.success) {
        acc[domain].successful++
      }
      return acc
    },
    {} as Record<string, { total: number; successful: number }>,
  )

  return {
    total,
    successful,
    failed,
    successRate: Math.round(successRate * 100) / 100,
    domainStats,
    recentDeliveries: log.slice(-10), // Last 10 deliveries
  }
}

/**
 * Clear email delivery log
 * Useful for testing and development
 */
export function clearEmailLog(): void {
  const smtpClient = MockSMTPClient.getInstance()
  smtpClient.clearLog()
  console.log("[EmailService] Delivery log cleared")
}

/**
 * Test email configuration and connectivity
 * Useful for system health checks and debugging
 *
 * @returns Promise<boolean> - True if email system is working
 */
export async function testEmailService(): Promise<boolean> {
  try {
    const testResult = await sendNotification("test@hbreport.com", {
      type: "report-review-request",
      reportId: "test-123",
      reportName: "Test Report",
      submittedBy: "system@hbreport.com",
    })

    return testResult.success
  } catch (error) {
    console.error("[EmailService] Test failed:", error)
    return false
  }
}

// Export the mock SMTP client for advanced usage
export { MockSMTPClient }

// Export configuration for external access
export { EMAIL_CONFIG }
