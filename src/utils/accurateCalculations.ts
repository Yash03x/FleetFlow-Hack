// Accurate calculation utilities for FleetFlow recommendations
import { ProjectData, ToolRecommendation, FleetContract } from '../types/ProjectData';

// Enhanced calculations based on real project data
export const calculateProjectMetrics = (projectData: ProjectData, recommendations: ToolRecommendation[]) => {
  
  // Calculate total contract values
  const totalMonthlyToolCost = recommendations.reduce((sum, tool) => sum + (tool.monthlyCost * tool.quantity), 0);
  const totalContractValue = totalMonthlyToolCost * projectData.timeline;
  
  // Calculate realistic productivity increase based on project type and tool quality
  const getProductivityIncrease = (): number => {
    const baseIncrease = 0.15; // 15% base increase
    const complexityMultiplier = {
      'low': 1.0,
      'medium': 1.2,
      'high': 1.5
    }[projectData.projectComplexity] || 1.0;
    
    const projectTypeMultiplier = {
      'residential': 1.0,
      'commercial': 1.3,
      'infrastructure': 1.4,
      'industrial': 1.5,
      'renovation': 1.2,
      'roadwork': 1.3
    }[projectData.projectType] || 1.0;
    
    return Math.min(baseIncrease * complexityMultiplier * projectTypeMultiplier, 0.35); // Cap at 35%
  };
  
  // Calculate equipment downtime reduction based on Hilti reliability
  const getDowntimeReduction = (): number => {
    const baseReduction = 0.20; // 20% base reduction
    const toolCountFactor = Math.min(recommendations.length / 5, 1.5); // More tools = better coverage
    return Math.min(baseReduction * toolCountFactor, 0.40); // Cap at 40%
  };
  
  // Calculate purchase vs rental savings
  const calculateVsPurchaseSavings = (): number => {
    // Industry standard: Purchase price is typically 25-35x monthly rental
    const purchaseMultiplier = 30;
    const estimatedPurchasePrice = totalMonthlyToolCost * purchaseMultiplier;
    return estimatedPurchasePrice - totalContractValue;
  };
  
  // Calculate labor cost savings from productivity increase
  const calculateLaborSavings = (): number => {
    const averageHourlyRate = 35; // Average construction worker hourly rate
    const hoursPerDay = 8;
    const workingDaysPerMonth = 22;
    const totalLaborHours = projectData.laborCount * hoursPerDay * workingDaysPerMonth * projectData.timeline;
    const totalLaborCost = totalLaborHours * averageHourlyRate;
    
    return totalLaborCost * getProductivityIncrease();
  };
  
  // Calculate downtime cost savings
  const calculateDowntimeSavings = (): number => {
    const downtimeHoursPerMonth = projectData.laborCount * 8; // Estimate 8 hours downtime per worker per month
    const downtimeCostPerHour = 50; // Cost of downtime including labor + project delays
    const totalDowntimeCost = downtimeHoursPerMonth * downtimeCostPerHour * projectData.timeline;
    
    return totalDowntimeCost * getDowntimeReduction();
  };
  
  const productivityIncrease = getProductivityIncrease();
  const downtimeReduction = getDowntimeReduction();
  const equipmentSavings = calculateVsPurchaseSavings();
  const laborSavings = calculateLaborSavings();
  const downtimeSavings = calculateDowntimeSavings();
  const totalROI = equipmentSavings + laborSavings + downtimeSavings;
  
  return {
    totalContractValue,
    totalMonthlyToolCost,
    productivityIncrease: Math.round(productivityIncrease * 100), // Convert to percentage
    downtimeReduction: Math.round(downtimeReduction * 100), // Convert to percentage
    equipmentSavings,
    laborSavings,
    downtimeSavings,
    totalROI,
    roiPercentage: Math.round((totalROI / totalContractValue) * 100)
  };
};

// Generate accurate fleet contract with real calculations
export const generateAccurateFleetContract = (
  projectData: ProjectData, 
  recommendations: ToolRecommendation[]
): FleetContract & {
  equipmentSavings: number;
  laborSavings: number;
  downtimeSavings: number;
  totalROI: number;
  roiPercentage: number;
} => {
  
  const metrics = calculateProjectMetrics(projectData, recommendations);
  
  const benefits = [
    'All maintenance and repairs included at no extra cost',
    '24/7 technical support and replacement guarantee within 24 hours',
    'Latest tool technology updates throughout contract period',
    'Comprehensive insurance coverage for all equipment and liability',
    'Free operator training and safety certification programs',
    'Flexible contract terms with seasonal adjustment options',
    'Priority access to new Hilti innovations and product launches',
    'Environmental compliance and sustainability reporting',
    'Dedicated account manager for personalized service',
    'Performance analytics and productivity optimization reports'
  ];

  const terms = [
    `Contract Duration: ${projectData.timeline} months`,
    'Monthly payment structure with no upfront costs or deposits',
    'Comprehensive maintenance and repair services included',
    'Equipment replacement within 24 hours if needed',
    'Contract can be adjusted based on project scope changes',
    'All safety training and certifications provided at no cost',
    'Flexible return policy for unused equipment',
    'Option to purchase equipment at contract end with credit applied'
  ];

  return {
    totalCost: metrics.totalContractValue,
    monthlyCost: metrics.totalMonthlyToolCost,
    duration: projectData.timeline,
    estimatedSavings: metrics.equipmentSavings,
    benefits,
    terms,
    equipmentSavings: metrics.equipmentSavings,
    laborSavings: metrics.laborSavings,
    downtimeSavings: metrics.downtimeSavings,
    totalROI: metrics.totalROI,
    roiPercentage: metrics.roiPercentage
  };
};

// Format currency values
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

// Format percentage values
export const formatPercentage = (value: number): string => {
  return `${value}%`;
};
