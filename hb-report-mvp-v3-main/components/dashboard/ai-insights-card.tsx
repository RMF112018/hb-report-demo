import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';

/**
 * AiInsightsCard Component
 * @description A reusable card component designed to display AI-generated insights in a concise and visually
 *              appealing format. Intended for use within dashboards to highlight key insights with a distinctive
 *              orange left border. Addresses rendering degradation by ensuring consistent Tailwind styling.
 * @features
 * - Displays a title and a list of insights
 * - Uses a unique border color for visual distinction
 * - Client-side compatible for dynamic content
 */
interface AiInsightsCardProps {
  title: string; // The title of the insights card, displayed prominently
  insights: string[]; // An array of strings, each representing an AI-generated insight
}

/**
 * AiInsightsCard Component
 * @description Renders a card with a title and a bulleted list of AI-generated insights.
 * @param {AiInsightsCardProps} props - The props for the component, including title and insights.
 * @returns {JSX.Element} A card displaying the title and insights list.
 */
export function AiInsightsCard({ title, insights }: AiInsightsCardProps) {
  return (
    <Card className="border-l-4 border-[#FF6B35] shadow-md rounded-lg"> {/* Ensure rounded corners */}
      <CardHeader className="flex flex-row items-center space-x-2 pb-2">
        <Lightbulb className="h-5 w-5 text-[#FF6B35]" /> {/* Icon with matching border color */}
        <CardTitle className="text-lg font-semibold text-gray-800">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
          {insights.map((insight, index) => (
            <li key={index}>{insight}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}