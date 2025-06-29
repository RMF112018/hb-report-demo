export default {
    prompts: {
      default: `
  HB Report is a frontend-only web application built with Next.js (version 14.2.16) and React, designed as a demonstration UI for surveying company employees in the construction industry. It is developed on a macOS environment using a MacBook Pro with an Apple M2 Pro chip (12 cores: 8 performance, 4 efficiency) and 16 GB of memory. The application is deployed and tested on the Vercel platform, focusing on showcasing a modern, responsive UI powered by Tailwind CSS, Radix UI, and other dependencies listed in package.json. Unlike its previous iterations, this version does not integrate with any backend servers, APIs (e.g., Procore APIs), or databases (e.g., SQLite), and it operates solely as a client-side demonstration for user feedback collection.
  
  Key features include:
  - A modular dashboard interface (app/dashboard/*) with components like buyout-schedule, document-compliance, and financial-forecasting, using mock data from the data/ directory (e.g., mock-buyout.json, mock-projects.json).
  - Pre-construction (pre-con) and estimating tools (app/pre-con/*) with UI components for bid leveling, cost summaries, and quantity takeoffs, styled with Tailwind CSS and custom CSS modules.
  - Project reports customization (app/project-reports/*) with a report customizer and digital report viewer, relying on mock data for demonstration.
  - A responsive layout with client-side routing, leveraging Next.js App Router (app/layout.tsx, app/client-layout.tsx) and Radix UI components for accessibility.
  - Interactive UI elements (components/ui/*) such as tables, dialogs, and dropdowns, ensuring a consistent user experience across devices.
  
  Your role is to assist in enhancing HB Report with clean, organized, and well-documented code that prioritizes usability, accessibility, and maintainability for a demo application. Focus on the following:
  
  - **Component Development**: Ensure components (e.g., components/dashboard/*, components/estimating/*) are reusable, encapsulated, and use PropTypes or TypeScript interfaces (defined in types/*) for clear props documentation. Use React Context or hooks (hooks/*) for state management instead of Redux, as no backend sync is needed.
  - **Mock Data Usage**: All mock data must be stored in appropriately named JSON files in the data/ directory (e.g., data/mock-buyout.json, data/mock-constraints.json) and imported into relevant components for rendering. Components should gracefully handle edge cases (e.g., empty datasets, missing fields) and use TypeScript types (types/*) to enforce data structure. Suggest improvements to mock data structure for consistency and completeness if needed.
  - **Styling**: Adhere to Tailwind CSS conventions (tailwind.config.ts) and scoped CSS modules (e.g., app/pre-con/estimating/styles.module.css) for maintainable styling. Ensure responsive design for desktop and mobile views.
  - **Performance**: Optimize for Vercel deployment, minimizing bundle size (e.g., lazy loading with Next.js dynamic imports) and ensuring fast page loads on macOS with Apple M2 Pro.
  - **Accessibility**: Use Radix UI primitives (components/ui/*) and ARIA attributes to meet WCAG 2.1 standards, especially for interactive elements like dialogs and tables.
  - **Documentation**: For any code provided, include a comment block with the following items atop the script as well as robust documentation within the code for future management and maintenance:
  // {relative file path}
  // {brief description of code and its function}
  // {instructions for use of code}
  // Reference: {link to latest available documentation for packages used in code}
  
  Utilize up-to-date documentation for Next.js (https://nextjs.org/docs), React (https://react.dev/reference), Tailwind CSS (https://tailwindcss.com/docs), Radix UI (https://www.radix-ui.com/docs), and other dependencies in package.json. Provide actionable guidance with step-by-step instructions and trade-off explanations, tailored for a frontend-only demo app. Anticipate challenges like mock data inconsistencies, Vercel deployment limits, or accessibility issues, and offer proactive solutions.
  
  When ready to proceed, respond with the single word, "Ready".
      `,
      listMode: `
  HB Report is a frontend-only web application built with Next.js (version 14.2.16) and React, designed as a demonstration UI for surveying company employees in the construction industry. It is developed on a macOS environment using a MacBook Pro with an Apple M2 Pro chip (12 cores: 8 performance, 4 efficiency) and 16 GB of memory. The application is deployed and tested on the Vercel platform, focusing on showcasing a modern, responsive UI powered by Tailwind CSS, Radix UI, and other dependencies listed in package.json. Unlike its previous iterations, this version does not integrate with any backend servers, APIs (e.g., Procore APIs), or databases (e.g., SQLite), and it operates solely as a client-side demonstration for user feedback collection.
  
  Key features include:
  - A modular dashboard interface (app/dashboard/*) with components like buyout-schedule, document-compliance, and financial-forecasting, using mock data from the data/ directory (e.g., mock-buyout.json, mock-projects.json).
  - Pre-construction (pre-con) and estimating tools (app/pre-con/*) with UI components for bid leveling, cost summaries, and quantity takeoffs, styled with Tailwind CSS and custom CSS modules.
  - Project reports customization (app/project-reports/*) with a report customizer and digital report viewer, relying on mock data for demonstration.
  - A responsive layout with client-side routing, leveraging Next.js App Router (app/layout.tsx, app/client-layout.tsx) and Radix UI components for accessibility.
  - Interactive UI elements (components/ui/*) such as tables, dialogs, and dropdowns, ensuring a consistent user experience across devices.
  
  Your role is to assist in enhancing HB Report with clean, organized, and well-documented code that prioritizes usability, accessibility, and maintainability for a demo application. To begin, extract the contents of the attached zip file containing the HB Report project. Familiarize yourself with the base files of the package, including configuration files (e.g., package.json, tsconfig.json, tailwind.config.ts) and core application structure (e.g., app/layout.tsx, app/page.tsx). These files provide the foundation for the project’s setup and functionality.
  
  Focus on the following for development tasks:
  - **Component Development**: Ensure components (e.g., components/dashboard/*, components/estimating/*) are reusable, encapsulated, and use PropTypes or TypeScript interfaces (defined in types/*) for clear props documentation. Use React Context or hooks (hooks/*) for state management instead of Redux, as no backend sync is needed.
  - **Mock Data Usage**: All mock data must be stored in appropriately named JSON files in the data/ directory (e.g., data/mock-buyout.json, data/mock-constraints.json) and imported into relevant components for rendering. Components should gracefully handle edge cases (e.g., empty datasets, missing fields) and use TypeScript types (types/*) to enforce data structure. Suggest improvements to mock data structure for consistency and completeness if needed.
  - **Styling**: Adhere to Tailwind CSS conventions (tailwind.config.ts) and scoped CSS modules (e.g., app/pre-con/estimating/styles.module.css) for maintainable styling. Ensure responsive design for desktop and mobile views.
  - **Performance**: Optimize for Vercel deployment, minimizing bundle size (e.g., lazy loading with Next.js dynamic imports) and ensuring fast page loads on macOS with Apple M2 Pro.
  - **Accessibility**: Use Radix UI primitives (components/ui/*) and ARIA attributes to meet WCAG 2.1 standards, especially for interactive elements like dialogs and tables.
  - **Documentation**: For any code provided, include a comment block with the following items atop the script as well as robust documentation within the code for future management and maintenance:
  // {relative file path}
  // {brief description of code and its function}
  // {instructions for use of code}
  // Reference: {link to latest available documentation for packages used in code}
  
  Utilize up-to-date documentation for Next.js (https://nextjs.org/docs), React (https://react.dev/reference), Tailwind CSS (https://tailwindcss.com/docs), Radix UI (https://www.radix-ui.com/docs), and other dependencies in package.json. Provide actionable guidance with step-by-step instructions and trade-off explanations, tailored for a frontend-only demo app. Anticipate challenges like mock data inconsistencies, Vercel deployment limits, or accessibility issues, and offer proactive solutions.
  
  ### Referenced Files Prompt
  The following directory tree lists a filtered set of files specified by the user, which are believed to be the primary focus for the current chat session. These files include key configuration files, core application components, and specific UI elements or data structures relevant to the development tasks at hand. Thoroughly review and analyze these files to prepare for assisting with targeted development tasks. While these files are the primary focus, reference other files in the project as needed to provide comprehensive and accurate assistance for development, ensuring all relevant context is considered.
  
  When ready to proceed, respond with the single word, "Ready".
      `,
      update: 'Update prompt: Review the current state of HB Report and suggest UI/UX improvements for the demo application.',
      debug: 'Debug prompt: Investigate UI rendering or interaction issues in the HB Report demo application.',
      allFiles: ''
    },
    primary_files: [
      // Root configuration files
      '.eslintrc.json',
      'components.json',
      'next-env.d.ts',
      'next.config.mjs',
      'package.json',
      'postcss.config.mjs',
      'tailwind.config.ts',
      'tsconfig.json',
      // app/
      'app/globals.css',
      'app/layout.tsx',
      'app/page.tsx'
    ],
    additional_files: [
      // // app/dashboard/
      // 'app/dashboard/admin/page.tsx',
      // 'app/dashboard/buyout-schedule/loading.tsx',
      // 'app/dashboard/buyout-schedule/page.tsx',
      // 'app/dashboard/constraints-log/page.tsx',
      // 'app/dashboard/exec/page.tsx',
      // 'app/dashboard/field-reports/loading.tsx',
      // 'app/dashboard/field-reports/page.tsx',
      // 'app/dashboard/financial-hub/page.tsx',
      // 'app/dashboard/layout.tsx',
      // 'app/dashboard/permit-log/page.tsx',
      // 'app/dashboard/pm/dashboard-content.tsx',
      // 'app/dashboard/pm/page.tsx',
      // 'app/dashboard/px/dashboard-content.tsx',
      // 'app/dashboard/px/page.tsx',
      // 'app/dashboard/reports/page.tsx',
      // 'app/dashboard/responsibility-matrix/loading.tsx',
      // 'app/dashboard/responsibility-matrix/page.tsx',
      // 'app/dashboard/scheduler/page.tsx',
      // 'app/dashboard/staff-planning/loading.tsx',
      // // app/login/
      // 'app/login/page.tsx',
      // // app/operations/
      // 'app/operations/page.tsx',
      // // app/pre-con/
      // 'app/pre-con/page.tsx',
      // // app/warranty/
      // 'app/warranty/page.tsx',
      // // components/analytics/
      // 'components/analytics/area-chart.tsx',
      // 'components/analytics/bar-chart.tsx',
      // 'components/analytics/bubble-chart.tsx',
      // 'components/analytics/cash-position.tsx',
      // 'components/analytics/combo-chart.tsx',
      // 'components/analytics/competitive-analysis.tsx',
      // 'components/analytics/data-table.tsx',
      // 'components/analytics/donut-chart.tsx',
      // 'components/analytics/funnel-chart.tsx',
      // 'components/analytics/gantt-chart.tsx',
      // 'components/analytics/gauge-chart.tsx',
      // 'components/analytics/heatmap.tsx',
      // 'components/analytics/kpi-grid.tsx',
      // 'components/analytics/line-chart.tsx',
      // 'components/analytics/market-intelligence.tsx',
      // 'components/analytics/metric-card.tsx',
      // 'components/analytics/metric-grid.tsx',
      // 'components/analytics/portfolio-overview.tsx',
      // 'components/analytics/progress-chart.tsx',
      // 'components/analytics/project-pipeline.tsx',
      // 'components/analytics/radar-chart.tsx',
      // 'components/analytics/resource-utilization.tsx',
      // 'components/analytics/revenue-forecast.tsx',
      // 'components/analytics/safety-performance.tsx',
      // 'components/analytics/scatter-plot.tsx',
      // 'components/analytics/simple-cash-position.tsx',
      // 'components/analytics/simple-portfolio-overview.tsx',
      // 'components/analytics/simple-revenue-forecast.tsx',
      // 'components/analytics/waterfall-chart.tsx',
      // // components/auth/
      // 'components/auth/protected-route.tsx',
      // // components/buyout/
      // 'components/buyout/BidComparisonTool.tsx',
      // 'components/buyout/BuyoutAnalytics.tsx',
      // 'components/buyout/BuyoutDistributionModal.tsx',
      // 'components/buyout/BuyoutForm.tsx',
      // 'components/buyout/HbiBuyoutInsights.tsx',
      // 'components/buyout/MaterialProcurementForm.tsx',
      // 'components/buyout/MaterialProcurementTable.tsx',
      // // components/
      // 'components/card-components.tsx',
      // // components/cards/
      // 'components/cards/allowance-score.tsx',
      // 'components/cards/buyout-savings.tsx',
      // 'components/cards/buyout-status.tsx',
      // 'components/cards/cash-flow-score.tsx',
      // 'components/cards/cash-flow.tsx',
      // 'components/cards/change-order-impacts.tsx',
      // 'components/cards/closeout-metric.tsx',
      // 'components/cards/contingencies.tsx',
      // 'components/cards/contingency-usage.tsx',
      // 'components/cards/cpi-performance.tsx',
      // 'components/cards/critical-dates.tsx',
      // 'components/cards/daily-reports.tsx',
      // 'components/cards/earned-value-analysis.tsx',
      // 'components/cards/enhanced-hbi-insights.tsx',
      // 'components/cards/financial-forecast-score.tsx',
      // 'components/cards/financial-forecast.tsx',
      // 'components/cards/financial-overview.tsx',
      // 'components/cards/financial-performance.tsx',
      // 'components/cards/general-conditions.tsx',
      // 'components/cards/hbi-insights-card.tsx',
      // 'components/cards/hbi-insights.tsx',
      // 'components/cards/liquidated-damages.tsx',
      // 'components/cards/problems-exposures.tsx',
      // 'components/cards/profit-forecast.tsx',
      // 'components/cards/profit-margin-index.tsx',
      // 'components/cards/project-health.tsx',
      // 'components/cards/project-overview.tsx',
      // 'components/cards/reporting-status.tsx',
      // 'components/cards/responsibility-matrix.tsx',
      // 'components/cards/rfi-metric.tsx',
      // 'components/cards/rfi-overview.tsx',
      // 'components/cards/rfi-resolution-performance.tsx',
      // 'components/cards/risk-exposure-score.tsx',
      // 'components/cards/risk-exposure.tsx',
      // 'components/cards/safety-summary.tsx',
      // 'components/cards/schedule-overview.tsx',
      // 'components/cards/schedule-performance.tsx',
      // 'components/cards/schedule-variance.tsx',
      // 'components/cards/spi-performance.tsx',
      // 'components/cards/submittal-analysis.tsx',
      // 'components/cards/submittal-metric.tsx',
      // 'components/cards/system-stats.tsx',
      // 'components/cards/user-management.tsx',
      // // components/constraints/
      // 'components/constraints/ConstraintForm.tsx',
      // 'components/constraints/ConstraintWidgets.tsx',
      // 'components/constraints/EnhancedConstraintTable.tsx',
      // 'components/constraints/ExportModal.tsx',
      // 'components/constraints/ExportUtils.ts',
      // 'components/constraints/FilterPanel.tsx',
      // 'components/constraints/GanttChart.tsx',
      // 'components/constraints/HbiInsightsPanel.tsx',
      // // components/dashboard/
      // 'components/dashboard/accessible-card.tsx',
      // 'components/dashboard/card-toolbar.tsx',
      // 'components/dashboard/drill-down-dialog.tsx',
      // // components/field/
      // 'components/field/FieldExportModal.tsx',
      // 'components/field/FieldTable.tsx',
      // 'components/field/HBIFieldInsights.tsx',
      // // components/field-reports/
      // 'components/field-reports/FieldAnalytics.tsx',
      // 'components/field-reports/FieldExportModal.tsx',
      // 'components/field-reports/FieldTable.tsx',
      // 'components/field-reports/HBIFieldInsights.tsx',
      // // components/financial-hub/
      // 'components/financial-hub/ActivityFeed.tsx',
      // 'components/financial-hub/aia/AiaAnnotationPanel.tsx',
      // 'components/financial-hub/aia/AiaG702Form.tsx',
      // 'components/financial-hub/aia/AiaG703Table.tsx',
      // 'components/financial-hub/aia/AiaInsightsPanel.tsx',
      // 'components/financial-hub/aia/AiaPayApplicationForm.tsx',
      // 'components/financial-hub/aia/AiaPayApplicationHub.tsx',
      // 'components/financial-hub/aia/AiaPayApplicationList.tsx',
      // 'components/financial-hub/AiaDistributionModal.tsx',
      // 'components/financial-hub/AiaInsightsPanel.tsx',
      // 'components/financial-hub/budget/BudgetCharts.tsx',
      // 'components/financial-hub/budget/BudgetForm.tsx',
      // 'components/financial-hub/budget/BudgetPlanner.tsx',
      // 'components/financial-hub/budget/BudgetReview.tsx',
      // 'components/financial-hub/budget/ProcoreBudgetTable.tsx',
      // 'components/financial-hub/budget/SageJCHRTable.tsx',
      // 'components/financial-hub/cash-flow/CashFlowAnalysis.tsx',
      // 'components/financial-hub/cash-flow/CashFlowAnnotations.tsx',
      // 'components/financial-hub/cash-flow/CashFlowChart.tsx',
      // 'components/financial-hub/cash-flow/CashFlowExportModal.tsx',
      // 'components/financial-hub/cash-flow/CashFlowFilters.tsx',
      // 'components/financial-hub/cash-flow/CashFlowInsights.tsx',
      // 'components/financial-hub/cash-flow/CashFlowMetrics.tsx',
      // 'components/financial-hub/cash-flow/CashFlowTable.tsx',
      // 'components/financial-hub/CashFlowAnalysis.tsx',
      // 'components/financial-hub/CashFlowChart.tsx',
      // 'components/financial-hub/CashFlowExportModal.tsx',
      // 'components/financial-hub/CashFlowFilter.tsx',
      // 'components/financial-hub/CashFlowInsightsPanel.tsx',
      // 'components/financial-hub/CashFlowMetrics.tsx',
      // 'components/financial-hub/CashFlowTable.tsx',
      // 'components/financial-hub/ChangeManagement.tsx',
      // 'components/financial-hub/CostControl.tsx',
      // 'components/financial-hub/DashboardWidgets.tsx',
      // 'components/financial-hub/ExportUtils.ts',
      // 'components/financial-hub/FinancialHub.tsx',
      // 'components/financial-hub/Forecasting.tsx',
      // 'components/financial-hub/Invoicing.tsx',
      // 'components/financial-hub/Overview.tsx',
      // 'components/financial-hub/PayAuthorizations.tsx',
      // 'components/financial-hub/PaymentAnalytics.tsx',
      // 'components/financial-hub/shared/DataTable.tsx',
      // 'components/financial-hub/shared/ExportModal.tsx',
      // 'components/financial-hub/tabs/CashFlowTab.tsx',
      // 'components/financial-hub/tabs/ChangeManagementTab.tsx',
      // 'components/financial-hub/tabs/FinancialForecastingTab.tsx',
      // 'components/financial-hub/tabs/forecast/EnhancedForecastTable.tsx',
      // 'components/financial-hub/tabs/forecast/FilterPanel.tsx',
      // 'components/financial-hub/tabs/forecast/ForecastWidgets.tsx',
      // 'components/financial-hub/tabs/forecast/GanttChart.tsx',
      // 'components/financial-hub/tabs/forecast/HbiInsightsPanel.tsx',
      // 'components/financial-hub/tabs/InvoicingTab.tsx',
      // 'components/financial-hub/tabs/PayAuthorizationsTab.tsx',
      // // components/layout/
      // 'components/layout/app-header.tsx',
      // // components/permit-log/
      // 'components/permit-log/HBIPermitInsights.tsx',
      // 'components/permit-log/PermitAnalytics.tsx',
      // 'components/permit-log/PermitCalendar.tsx',
      // 'components/permit-log/PermitExportModal.tsx',
      // 'components/permit-log/PermitFilters.tsx',
      // 'components/permit-log/PermitForm.tsx',
      // 'components/permit-log/PermitTable.tsx',
      // // components/permits/
      // 'components/permits/HBIPermitInsights.tsx',
      // 'components/permits/PermitAnalytics.tsx',
      // 'components/permits/PermitCalendar.tsx',
      // 'components/permits/PermitExportModal.tsx',
      // 'components/permits/PermitFilters.tsx',
      // 'components/permits/PermitForm.tsx',
      // 'components/permits/PermitTable.tsx',
      // // components/reports/
      // 'components/reports/ApprovalWorkflow.tsx',
      // 'components/reports/enhanced-report-customizer.tsx',
      // 'components/reports/report-approval-workflow.tsx',
      // 'components/reports/report-dashboard.tsx',
      // 'components/reports/report-distribution.tsx',
      // 'components/reports/report-history.tsx',
      // 'components/reports/ReportCreator.tsx',
      // 'components/reports/ReportList.tsx',
      // 'components/reports/ReportStats.tsx',
      // 'components/reports/ReportViewer.tsx',
      // // components/responsibility/
      // 'components/responsibility/HbiResponsibilityInsights.tsx',
      // 'components/responsibility/InteractiveAssignmentCell.tsx',
      // 'components/responsibility/ResponsibilityAnalytics.tsx',
      // 'components/responsibility/ResponsibilityExportModal.tsx',
      // 'components/responsibility/ResponsibilityForm.tsx',
      // 'components/responsibility/ResponsibilityMatrix.tsx',
      // 'components/responsibility/ResponsibilitySettings.tsx',
      // // components/scheduler/
      // 'components/scheduler/schedule-generator.tsx',
      // 'components/scheduler/schedule-monitor.tsx',
      // // components/staff/
      // 'components/staff/ApprovalWorkflow.tsx',
      // 'components/staff/AvailableEmployeesModal.tsx',
      // 'components/staff/HBIStaffingInsights.tsx',
      // 'components/staff/SPCRForm.tsx',
      // 'components/staff/SPCRList.tsx',
      // 'components/staff/StaffAnalytics.tsx',
      // 'components/staff/StaffAssignmentModal.tsx',
      // 'components/staff/StaffOverview.tsx',
      // 'components/staff/StaffPlanningHub.tsx',
      // 'components/staff/StaffScheduleGantt.tsx',
      // 'components/staff/StaffSettings.tsx',
      // 'components/staff/StaffTable.tsx',
      // // components/
      // 'components/theme-provider.tsx',
      // // components/ui/
      // 'components/ui/accordion.tsx',
      // 'components/ui/alert-dialog.tsx',
      // 'components/ui/alert.tsx',
      // 'components/ui/aspect-ratio.tsx',
      // 'components/ui/avatar.tsx',
      // 'components/ui/badge.tsx',
      // 'components/ui/breadcrumb.tsx',
      // 'components/ui/button.tsx',
      // 'components/ui/calendar.tsx',
      // 'components/ui/card.tsx',
      // 'components/ui/carousel.tsx',
      // 'components/ui/chart.tsx',
      // 'components/ui/checkbox.tsx',
      // 'components/ui/collapsible.tsx',
      // 'components/ui/command.tsx',
      // 'components/ui/context-menu.tsx',
      // 'components/ui/dialog.tsx',
      // 'components/ui/drawer.tsx',
      // 'components/ui/dropdown-menu.tsx',
      // 'components/ui/form.tsx',
      // 'components/ui/hover-card.tsx',
      // 'components/ui/input-otp.tsx',
      // 'components/ui/input.tsx',
      // 'components/ui/label.tsx',
      // 'components/ui/menubar.tsx',
      // 'components/ui/navigation-menu.tsx',
      // 'components/ui/pagination.tsx',
      // 'components/ui/popover.tsx',
      // 'components/ui/progress.tsx',
      // 'components/ui/radio-group.tsx',
      // 'components/ui/resizable.tsx',
      // 'components/ui/scroll-area.tsx',
      // 'components/ui/select.tsx',
      // 'components/ui/separator.tsx',
      // 'components/ui/sheet.tsx',
      // 'components/ui/sidebar.tsx',
      // 'components/ui/skeleton.tsx',
      // 'components/ui/slider.tsx',
      // 'components/ui/sonner.tsx',
      // 'components/ui/switch.tsx',
      // 'components/ui/table.tsx',
      // 'components/ui/tabs.tsx',
      // 'components/ui/textarea.tsx',
      // 'components/ui/toast.tsx',
      // 'components/ui/toaster.tsx',
      // 'components/ui/toggle-group.tsx',
      // 'components/ui/toggle.tsx',
      // 'components/ui/tooltip.tsx',
      // 'components/ui/use-mobile.tsx',
      // 'components/ui/use-toast.ts',
      // // data/
      // 'data/admin-dashboard-data.json',
      // 'data/aia-email-templates.json',
      // 'data/aia-pay-application-schema.json',
      // 'data/aia-pay-applications.json',
      // 'data/aia-schedule-of-values.ts',
      // 'data/aia-validation-rules.json',
      // 'data/buyout-procurement-schema.json',
      // 'data/cash-flow-data.json',
      // 'data/cash-flow-schema.json',
      // 'data/constraints-log.json',
      // 'data/dashboard-layouts.json',
      // 'data/exec-dashboard-data.json',
      // 'data/field-reports-schema.json',
      // 'data/mock-aia-pay-applications.json',
      // 'data/mock-buyout-records.json',
      // 'data/mock-cash-flows.json',
      // 'data/mock-daily-logs.json',
      // 'data/mock-employees.json',
      // 'data/mock-hbi-insights.json',
      // 'data/mock-manpower.json',
      // 'data/mock-material-procurement.json',
      // 'data/mock-permits.json',
      // 'data/mock-procore-budget.json',
      // 'data/mock-procore-commitments.json',
      // 'data/mock-procurement-data.json',
      // 'data/mock-projects.json',
      // 'data/mock-quality-inspections.json',
      // 'data/mock-responsibility-tasks.json',
      // 'data/mock-role-assignments.json',
      // 'data/mock-safety-audits.json',
      // 'data/mock-sage-jchr.json',
      // 'data/mock-sage-vendor-payments.json',
      // 'data/mock-spcrs.json',
      // 'data/operations-data.json',
      // 'data/permit-log-schema.json',
      // 'data/pm-dashboard-data.json',
      // 'data/pre-con-data.json',
      // 'data/procurement-schema.json',
      // 'data/px-dashboard-data.json',
      // 'data/report-templates.json',
      // 'data/reports-data.json',
      // 'data/responsibility-schema.json',
      // 'data/scheduler.json',
      // 'data/staff-planning-schema.json',
      // 'data/warranty-data.json',
      // // docs/
      // 'docs/buyout-procurement.md',
      // 'docs/field-reports.md',
      // 'docs/permit-log.md',
      // 'docs/reporting-dashboard.md',
      // 'docs/responsibility-matrix.md',
      // 'docs/staff-planning.md',
      // // hooks/
      // 'hooks/use-dashboard-preferences.ts',
      // 'hooks/use-keyboard-navigation.ts',
      // 'hooks/use-mobile.tsx',
      // 'hooks/use-toast.ts',
      // // lib/
      'lib/auth-context.tsx',
      // 'lib/utils.ts',
      // // scripts/
      // 'scripts/deploy.sh',
      // // stories/buyout/
      // 'stories/buyout/bid-comparison-tool.stories.tsx',
      // 'stories/buyout/buyout-analytics.stories.tsx',
      // 'stories/buyout/buyout-distribution-modal.stories.tsx',
      // 'stories/buyout/buyout-schedule.stories.tsx',
      // 'stories/buyout/enhanced-buyout-form.stories.tsx',
      // 'stories/buyout/hbi-buyout-insights.stories.tsx',
      // 'stories/buyout/material-procurement-table.stories.tsx',
      // // stories/field/
      // 'stories/field/field-analytics.stories.tsx',
      // 'stories/field/field-export-modal.stories.tsx',
      // 'stories/field/field-reports-page.stories.tsx',
      // 'stories/field/field-table.stories.tsx',
      // 'stories/field/hbi-field-insights.stories.tsx',
      // 'stories/field/mock-data.ts',
      // 'stories/field/README.md',
      // // stories/permits/
      // 'stories/permits/hbi-permit-insights.stories.tsx',
      // 'stories/permits/permit-analytics.stories.tsx',
      // 'stories/permits/permit-calendar.stories.tsx',
      // 'stories/permits/permit-export-modal.stories.tsx',
      // 'stories/permits/permit-filters.stories.tsx',
      // 'stories/permits/permit-form.stories.tsx',
      // 'stories/permits/permit-log.stories.tsx',
      // 'stories/permits/permit-table.stories.tsx',
      // 'stories/permits/README.md',
      // // stories/reports/
      // 'stories/reports/enhanced-report-customizer.stories.tsx',
      // 'stories/reports/report-approval-workflow.stories.tsx',
      // 'stories/reports/report-dashboard.stories.tsx',
      // 'stories/reports/report-distribution.stories.tsx',
      // 'stories/reports/report-history.stories.tsx',
      // // stories/responsibility/
      // 'stories/responsibility/hbi-responsibility-insights.stories.tsx',
      // 'stories/responsibility/mock-data.ts',
      // 'stories/responsibility/responsibility-analytics.stories.tsx',
      // 'stories/responsibility/responsibility-export-modal.stories.tsx',
      // 'stories/responsibility/responsibility-form.stories.tsx',
      // 'stories/responsibility/responsibility-matrix-page.stories.tsx',
      // 'stories/responsibility/responsibility-matrix.stories.tsx',
      // 'stories/responsibility/responsibility-settings.stories.tsx',
      // // stories/staff/
      // 'stories/staff/approval-workflow.stories.tsx',
      // 'stories/staff/hbi-staffing-insights.stories.tsx',
      // 'stories/staff/spcr-form.stories.tsx',
      // 'stories/staff/spcr-list.stories.tsx',
      // 'stories/staff/staff-analytics.stories.tsx',
      // 'stories/staff/staff-planning.stories.tsx',
      // 'stories/staff/staff-table.stories.tsx',
      // // styles/
      // 'styles/globals.css',
      // // types/
      // 'types/aia-pay-application.ts',
      // 'types/cash-flow.ts',
      // 'types/constraint.ts',
      // 'types/dashboard.ts',
      // 'types/field-reports.ts',
      // 'types/financial-hub.ts',
      // 'types/index.ts',
      // 'types/permit-log.ts',
      // 'types/procurement.ts',
      // 'types/report-types.ts',
      // 'types/reporting.ts',
      // 'types/responsibility.ts',
      // 'types/scheduler.ts',
      // 'types/staff-planning.ts',
      // // utils/
      // 'utils/aia-api-utils.ts',
      // 'utils/buyout-api-utils.ts',
      // 'utils/data-fetcher.ts',
      // 'utils/field-api-utils.ts',
      // 'utils/pdf-generator.ts',
      // 'utils/permit-export-utils.ts',
      // 'utils/responsibility-data-utils.ts',
      // 'utils/responsibility-export-utils.ts',
      // 'utils/staff-planning-utils.ts',
      // 'utils/staff-sage-utils.ts'
    ]
  };