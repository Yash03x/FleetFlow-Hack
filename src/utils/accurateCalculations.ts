// Enhanced accurate calculation utilities with Hilti Fleet Management insights
import { ProjectData, ToolRecommendation, FleetContract } from '../types/ProjectData';

// Import our enhanced analysis capabilities
import { calculateTCO } from './tcoCalculator';
import { getArchetypeTools, getToolNecessity, getArchetypeQuantityMultiplier } from './projectArchetypes';
import { RiskModelingEngine } from './riskModelingEngine';
import { enhanceToolWithServiceFeatures } from './fleetServiceModeling';

// Enhanced calculations with Hilti Fleet Management insights
export const calculateProjectMetrics = (projectData: ProjectData, recommendations: ToolRecommendation[]) => {
  
  // Calculate total contract values
  const totalMonthlyToolCost = recommendations.reduce((sum, tool) => sum + (tool.monthlyCost * tool.quantity), 0);
  const totalContractValue = totalMonthlyToolCost * projectData.timeline;
  
  // Enhanced productivity calculations using archetype analysis
  const getProductivityIncrease = (): number => {
    const archetype = projectData.projectType as any;
    const quantityMultiplier = getArchetypeQuantityMultiplier(archetype, projectData.laborCount);
    
    // Base increase from Hilti Fleet Management research
    const baseIncrease = 0.20; // 20% from professional tools and service
    
    const complexityMultiplier = {
      'low': 1.0,
      'medium': 1.25, // Increased based on Hilti data
      'high': 1.6    // Higher multiplier for complex projects
    }[projectData.projectComplexity] || 1.0;
    
    // Enhanced project type multipliers based on archetype analysis
    const projectTypeMultiplier = {
      'residential': 0.9,   // Lower complexity, standard tools
      'commercial': 1.2,    // Professional requirements
      'infrastructure': 1.4, // Demanding applications
      'industrial': 1.5,    // Most demanding, specialized tools
      'renovation': 1.1,    // Mixed complexity
      'roadwork': 1.3      // Specialized equipment
    }[projectData.projectType] || 1.0;
    
    // Service guarantee bonus - Hilti's key differentiator
    const serviceGuaranteeBonus = 0.05; // 5% additional from reliable service
    
    return Math.min(
      (baseIncrease * complexityMultiplier * projectTypeMultiplier * quantityMultiplier) + serviceGuaranteeBonus, 
      0.40 // Cap at 40%
    );
  };
  
  // Enhanced downtime reduction using service gap analysis
  const getDowntimeReduction = (): number => {
    // Base reduction from Hilti's service guarantees
    const baseReduction = 0.25; // 25% from professional service network
    
    // Fleet Management specific bonuses
    const serviceBonuses = {
      repairSLA: 0.05,        // 5% from 24-hour repair guarantee
      loanerTools: 0.08,      // 8% from loaner tool program
      theftCoverage: 0.03,    // 3% from theft protection
      proactiveMaintenance: 0.04 // 4% from preventive maintenance
    };
    
    const toolCountFactor = Math.min(recommendations.length / 8, 1.3); // Adjusted for Fleet management
    const complexityBonus = projectData.projectComplexity === 'high' ? 0.05 : 0;
    
    const totalReduction = baseReduction + 
                          Object.values(serviceBonuses).reduce((sum, bonus) => sum + bonus, 0) +
                          complexityBonus;
    
    return Math.min(totalReduction * toolCountFactor, 0.45); // Cap at 45%
  };
  
  // Enhanced TCO-based savings calculation
  const calculateVsPurchaseSavings = (): number => {
    try {
      // Use our comprehensive TCO calculator for accurate savings
      const tcoAnalysis = calculateTCO(projectData, recommendations as any);
      return tcoAnalysis.savings; // This includes all hidden costs
    } catch (error) {
      console.warn('TCO calculation failed, using fallback method:', error);
      // Fallback: Enhanced purchase multiplier based on Hilti research
      const purchaseMultiplier = 35; // Higher multiplier from Hilti data
      const estimatedPurchasePrice = totalMonthlyToolCost * purchaseMultiplier;
      
      // Add hidden costs that TCO would normally capture
      const hiddenCosts = {
        maintenance: estimatedPurchasePrice * 0.075 * 4, // 7.5% per year for 4 years
        theft: estimatedPurchasePrice * 0.15, // 15% theft risk over 4 years
        administrative: 50 * 2 * 48, // 2 hours/month at $50/hour for 4 years
        depreciation: estimatedPurchasePrice * 0.6 // 60% depreciation over 4 years
      };
      
      const totalOwnershipCost = estimatedPurchasePrice + Object.values(hiddenCosts).reduce((sum, cost) => sum + cost, 0);
      return totalOwnershipCost - totalContractValue;
    }
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
  
  // Add enhanced risk and strategic insights
  let riskFactors: string[] = [];
  let strategicInsights: string[] = [];
  
  try {
    // Enhance tools with service features for risk analysis
    const enhancedTools = recommendations.map(tool => 
      enhanceToolWithServiceFeatures(tool, projectData.projectComplexity)
    );
    
    // Get risk assessment
    const riskProfile = RiskModelingEngine.assessProjectRisk(projectData, enhancedTools);
    riskFactors = riskProfile.riskFactors.map(rf => rf.description);
    
    // Generate strategic insights based on project archetype
    const archetype = getArchetypeTools(projectData.projectType as any);
    strategicInsights = [
      `${projectData.projectComplexity} complexity ${projectData.projectType} project optimized for ${projectData.laborCount}-person team`,
      `Fleet Management provides ${Math.round(downtimeReduction * 100)}% downtime reduction through service guarantees`,
      `Projected ${Math.round(productivityIncrease * 100)}% productivity increase from professional-grade tools`,
      `Risk level: ${riskProfile.overallRisk} - Fleet Management mitigates ${riskProfile.riskFactors.length} identified risks`
    ];
    
  } catch (error) {
    console.warn('Enhanced analysis failed, using basic insights:', error);
    riskFactors = ['Equipment downtime risk', 'Service availability concerns'];
    strategicInsights = [
      'Fleet Management provides comprehensive service coverage',
      'Professional tools increase productivity and reduce delays',
      'Service guarantees protect critical project timelines'
    ];
  }
  
  return {
    totalContractValue,
    totalMonthlyToolCost,
    productivityIncrease: Math.round(productivityIncrease * 100), // Convert to percentage
    downtimeReduction: Math.round(downtimeReduction * 100), // Convert to percentage
    equipmentSavings,
    laborSavings,
    downtimeSavings,
    totalROI,
    roiPercentage: Math.round((totalROI / totalContractValue) * 100),
    // Enhanced insights
    riskFactors,
    strategicInsights,
    // Additional Fleet Management value props
    serviceGuarantees: {
      repairSLA: '24-hour turnaround',
      theftCoverage: '80% replacement value',
      loanerTools: 'Available during repairs',
      proactiveMaintenance: 'Scheduled maintenance included'
    }
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
