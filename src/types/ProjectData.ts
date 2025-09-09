export interface ProjectData {
  projectName: string;
  projectType: string;
  location: string;
  laborCount: number;
  timeline: number;
  budget: number;
  existingTools: string[];
  blueprint: File | null;
  specialRequirements: string;
  projectComplexity: 'low' | 'medium' | 'high';
}

export interface ToolRecommendation {
  name: string;
  model: string;
  description: string;
  quantity: number;
  monthlyCost: number;
  totalCost: number;
  rentalDuration: number;
  justification: string[];
  category: string;
  productUrl: string;
  specifications: string[];
  competitiveAdvantages?: string[];
  id?: string;
}

export interface FleetContract {
  totalCost: number;
  monthlyCost: number;
  duration: number;
  estimatedSavings: number;
  benefits: string[];
  terms: string[];
}