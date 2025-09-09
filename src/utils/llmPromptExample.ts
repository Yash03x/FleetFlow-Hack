// Sample LLM Prompt for Hilti Tool Recommendations
// This shows how to use the real product_data_en_us.zip catalog with an LLM

export const createHiltiRecommendationPrompt = (projectData: any, productCatalog: any[]) => {
  return `
You are a construction equipment expert specializing in Hilti tools and equipment. Analyze this construction project and recommend the optimal tool selection from the comprehensive Hilti product catalog.

## PROJECT DETAILS:
- **Project Name**: ${projectData.projectName}
- **Project Type**: ${projectData.projectType}
- **Location**: ${projectData.location}
- **Labor Count**: ${projectData.laborCount} workers
- **Timeline**: ${projectData.timeline} months
- **Budget Range**: $${projectData.budget}
- **Project Complexity**: ${projectData.projectComplexity}
- **Existing Tools**: ${projectData.existingTools.join(', ')}
- **Special Requirements**: ${projectData.specialRequirements}

## AVAILABLE HILTI PRODUCT CATALOG:
${JSON.stringify(productCatalog.slice(0, 50), null, 2)} // First 50 products for context
... and ${productCatalog.length - 50} more products available

## TASK:
Analyze the project requirements and select the most appropriate Hilti tools from the catalog. Consider:

1. **Project Type Matching**: Select tools suitable for ${projectData.projectType} construction
2. **Team Size Optimization**: Recommend quantities based on ${projectData.laborCount} workers
3. **Timeline Efficiency**: Choose tools that maximize productivity over ${projectData.timeline} months
4. **Budget Constraints**: Stay within $${projectData.budget} budget range
5. **Complexity Requirements**: Match tool sophistication to ${projectData.projectComplexity} complexity
6. **Avoid Duplicates**: Don't recommend tools already owned: ${projectData.existingTools.join(', ')}
7. **Special Requirements**: Address: ${projectData.specialRequirements}

## RESPONSE FORMAT (JSON):
{
  "recommendations": [
    {
      "productId": "string (from tag_sku)",
      "productName": "string (from tag_name)",
      "description": "string (from tag_description)",
      "quantity": number,
      "monthlyRentalCost": number,
      "totalRentalCost": number,
      "justification": [
        "string - why this tool is needed",
        "string - specific benefit for this project",
        "string - productivity impact"
      ],
      "priority": "high|medium|low",
      "category": "string (from tag_categories_leaf)",
      "productUrl": "string (from tag_public_url)",
      "specifications": [
        "string - key technical specs from content",
        "string - performance characteristics"
      ],
      "alternativeOptions": ["string - similar products if needed"]
    }
  ],
  "reasoning": "string - explain your overall approach and tool selection strategy",
  "costOptimization": {
    "totalMonthlyCost": number,
    "totalProjectCost": number,
    "budgetUtilization": "percentage of budget used",
    "suggestedAdjustments": ["string - cost optimization suggestions"],
    "potentialSavings": number
  },
  "productivityImpact": {
    "estimatedTimeSavings": "percentage",
    "efficiencyGains": ["string - specific productivity improvements"],
    "riskReduction": ["string - safety and quality benefits"]
  }
}

## CONSTRAINTS:
- Maximum 15 tool recommendations
- Prioritize tools that directly match project type and complexity
- Consider existing tools to avoid unnecessary duplicates
- Balance cost vs productivity gains
- Ensure safety and compliance requirements are met
- Provide realistic quantity estimates based on team size
- Include both primary tools and essential accessories

## EVALUATION CRITERIA:
- **Relevance**: How well does the tool match the project requirements?
- **Efficiency**: Will this tool significantly improve productivity?
- **Cost-Effectiveness**: Is the rental cost justified by the benefits?
- **Team Fit**: Is the quantity appropriate for the team size?
- **Safety**: Does the tool meet safety standards for the project type?

Please provide your analysis and recommendations in the specified JSON format.
`;
};

// Example usage with the actual product catalog
export const loadProductCatalog = async (): Promise<any[]> => {
  // This would load the actual product_data_en_us.zip contents
  // For now, returning a sample structure
  return [
    {
      "tag_heading": "na",
      "tag_public_url": "https://www.hilti.com/c/CLS_POWER_TOOLS_7125/CLS_ROTARY_HAMMERS_7125/r3682",
      "content": "TE 2 Rotary hammer Compact dual-mode, pistol-grip SDS Plus (TE-C) rotary hammer – for hammer drilling and rotary-only drilling ### Categories: Home > Products > Power tools > Rotary hammers- - - ### FEATURES:Features Two-mode SDS Plus (TE-C) rotary hammer – for hammer drilling and rotary-only drilling Sturdy motor with high load rating for maximum reliability Quick-change TE-C Click chuck and user-friendly selector switch for high working convenience Electronic switch for precise drilling 360° side handle adjusts easily for preference or use in tight spaces Applications Daily hammer drilling in concrete, masonry and natural stone Ocassional drilling in steel, wood and plastics using optional chuck adaptor Driving screws using optional bit holder Reverse feature assists in the removal of stuck drill bits Drilling in solid metal Ø 3-13 mm / sheet metal up to Ø 20 mm ### TECHNICAL DATA: Weight according EPTA-Procedure 01/2003 without battery: 6 lb. Optimum Hammer drilling range: 5/32 - 15/32 in Single impact energy: 1.3 ft-lbs Technical Data | Weight according EPTA-Procedure 01/2003 without battery | 6 lb | Optimum Hammer drilling range | 5/32 - 15/32 in | Single impact energy | 1.3 ft-lbs | Working mode | Hammer drilling, Drilling | Hammer drilling diameter range | 5/32 - 7/8 in | Hammer drilling RPM | 1200 rpm | Full hammering frequency | 4600 impacts/minute | Functionality | Reverse mode, Depth gauge | Triaxial vibration value for hammer drilling into concrete (ah,HD) | 12.1 m/s² | 1 | A-weighted emission sound pressure level | 94 dB (A) | 2 | Dimensions (LxWxH) | 13.9 x 3.5 x 8 mm | According to the applicable product standard (see the Operating Instruction for more details) | According to the applicable product standard (see the Operating Instruction for more details) ### ITEMS- 3497789 - Rotary hammer perf pkg TE 2 - Package Size 1 pc Package Contents: - 1x TE 2 120V USA Rotary hammer - 1x TE 2 Tool case assy - 1x Hilti Grease 50ml - 1x Hammer drill bit TE-CX 3/8 x 6 - 1x Hammer drill bit TE-CX 1/4 x 6 - 1x Hammer drill bit TE-CX 3/16 x 6 - 6x Hammer drill bit TE-C 1/4-4 - 3952952 - TE 2 Performance Package - Package Size 1 pc Package Contents: - 1x TE 2 120V USA Rotary hammer - 1x TE 2 Tool case assy - 1x Hilti Grease 50ml - 1x TE-CX 3/16-6 Hammer drill bit - 1x TE-CX 1/4- 4 Hammer drill bit - 1x TE-CX 1/4-6 Hammer drill bit - 1x TE-CX 3/8-6 Hammer drill bit - 1x TE-CX(5) 1/2-6 Hammer drill bit - 1x TE-CX 5/16-6 Hammer drill bit",
      "tag_name": "TE 2 Rotary hammer",
      "tag_description": "Compact dual-mode, pistol-grip SDS Plus (TE-C) rotary hammer – for hammer drilling and rotary-only drilling",
      "tag_source": "HOL: Products",
      "tag_author": "na",
      "tag_created_at": "na",
      "tag_ingestion_date": "2025-05-20T13:55:10.063077",
      "tag_categories_leaf": "Rotary hammers",
      "tag_categories_branch": "Home > Products > Power tools > Rotary hammers",
      "tag_item_numbers": "['3497789', '3952952']",
      "tag_related_files": "[{'category': 'Documentation', 'url': 'https://productdata.hilti.com/APQ_HC_RAW/ASSET_DOC_LOC_8055627.pdf', 'description': 'Download OSHA 1926.1153, Section VII (1)'}, {'category': 'Material safety datasheet', 'url': 'https://productdata.hilti.com/APQ_HC_RAW/IBD_WWI-00000000000006452587_000.pdf', 'description': 'Download Material safety datasheet Hilti Grease (EN)'}, {'category': 'Material safety datasheet', 'url': 'https://productdata.hilti.com/APQ_HC_RAW/IBD_WWI-00000000000006452588_000.pdf', 'description': 'Download Material safety datasheet Hilti Grease (ES)'}]",
      "tag_sidelinks": "na",
      "tag_language": "en",
      "tag_country": "us",
      "tag_keywords": "na",
      "tag_page_number": "na",
      "tag_sku": "r3682",
      "tag_file_type": "product_page",
      "tag_file_extension": "html"
    }
    // ... more products would be loaded here
  ];
};

// Integration with your existing system
export const integrateWithExistingSystem = () => {
  return `
## Integration Steps:

1. **Load Product Catalog**: 
   - Extract product_data_en_us.zip
   - Parse all 2,410 JSON files
   - Create searchable index by category, application, etc.

2. **Update Recommendation Engine**:
   - Replace hardcoded 20 tools with full catalog
   - Use LLM for intelligent selection
   - Keep existing business logic for cost calculations

3. **Environment Setup**:
   - Add OPENAI_API_KEY to environment variables
   - Implement rate limiting and error handling
   - Add caching for common recommendations

4. **Cost Integration**:
   - Extract pricing from product content or separate API
   - Apply existing rental cost calculations
   - Maintain fleet contract generation logic

5. **UI Updates**:
   - Add loading states for LLM processing
   - Show AI vs rule-based toggle
   - Display more detailed product information

## Sample Implementation:

\`\`\`typescript
// In your RecommendationReport component
const [useAI, setUseAI] = useState(true);
const [isLoading, setIsLoading] = useState(false);

const generateRecommendations = async () => {
  if (useAI) {
    setIsLoading(true);
    try {
      const catalog = await loadProductCatalog();
      const prompt = createHiltiRecommendationPrompt(projectData, catalog);
      const response = await callOpenAI(prompt);
      const recommendations = JSON.parse(response);
      setRecommendations(recommendations.recommendations);
    } catch (error) {
      // Fallback to rule-based
      setRecommendations(generateRecommendations(projectData));
    } finally {
      setIsLoading(false);
    }
  } else {
    setRecommendations(generateRecommendations(projectData));
  }
};
\`\`\`

## Benefits of This Approach:

1. **Real Product Data**: Uses actual Hilti catalog with 2,410+ products
2. **Intelligent Selection**: LLM understands context and makes smart recommendations
3. **Scalable**: Easy to add new products or update existing ones
4. **Flexible**: Can adjust recommendations based on project specifics
5. **Fallback Safe**: Always has rule-based system as backup
6. **Cost Effective**: Only calls LLM when needed, caches results

## Next Steps:

1. Extract and parse the full product catalog
2. Implement the LLM integration
3. Add pricing data extraction
4. Test with various project scenarios
5. Deploy with proper error handling and monitoring
`;
};
