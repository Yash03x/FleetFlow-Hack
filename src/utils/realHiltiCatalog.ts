// Real Hilti Catalog Integration
// This file shows how to integrate the actual product_data_en_us.zip with your existing system

import { ProjectData, ToolRecommendation } from '../types/ProjectData';

// Interface for the actual Hilti product data structure
interface HiltiProduct {
  tag_heading: string;
  tag_public_url: string;
  content: string;
  tag_name: string;
  tag_description: string;
  tag_source: string;
  tag_author: string;
  tag_created_at: string;
  tag_ingestion_date: string;
  tag_categories_leaf: string;
  tag_categories_branch: string;
  tag_item_numbers: string;
  tag_related_files: string;
  tag_sidelinks: string;
  tag_language: string;
  tag_country: string;
  tag_keywords: string;
  tag_page_number: string;
  tag_sku: string;
  tag_file_type: string;
  tag_file_extension: string;
}

// Cache for loaded products
let productCatalog: HiltiProduct[] | null = null;

// Load the product catalog from the extracted JSON files
export const loadHiltiCatalog = async (): Promise<HiltiProduct[]> => {
  if (productCatalog) {
    return productCatalog;
  }

  try {
    // In a real implementation, you'd load from the extracted JSON files
    // For now, we'll simulate loading a few products
    const sampleProducts: HiltiProduct[] = [
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
      // Add more sample products here or load from actual files
    ];

    productCatalog = sampleProducts;
    return productCatalog;
  } catch (error) {
    console.error('Failed to load Hilti catalog:', error);
    return [];
  }
};

// Create LLM prompt with real product data
export const createLLMPrompt = (projectData: ProjectData, products: HiltiProduct[]): string => {
  return `
You are a construction equipment expert specializing in Hilti tools. Analyze this project and recommend optimal tools from the Hilti catalog.

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

## AVAILABLE HILTI PRODUCTS:
${products.map(p => `
**${p.tag_name}** (${p.tag_sku})
- Category: ${p.tag_categories_leaf}
- Description: ${p.tag_description}
- URL: ${p.tag_public_url}
- Technical Data: ${p.content.substring(0, 500)}...
`).join('\n')}

## TASK:
Select the most appropriate tools for this ${projectData.projectType} project with ${projectData.laborCount} workers over ${projectData.timeline} months.

## RESPONSE FORMAT (JSON):
{
  "recommendations": [
    {
      "productSku": "string (from tag_sku)",
      "productName": "string (from tag_name)",
      "description": "string (from tag_description)",
      "quantity": number,
      "monthlyRentalCost": number,
      "totalRentalCost": number,
      "justification": ["string", "string", "string"],
      "priority": "high|medium|low",
      "category": "string (from tag_categories_leaf)",
      "productUrl": "string (from tag_public_url)",
      "specifications": ["string", "string"]
    }
  ],
  "reasoning": "string - explain your approach",
  "totalCost": number,
  "budgetUtilization": "percentage"
}

## CONSTRAINTS:
- Maximum 15 recommendations
- Stay within $${projectData.budget} budget
- Avoid duplicating existing tools: ${projectData.existingTools.join(', ')}
- Match complexity level: ${projectData.projectComplexity}
- Consider team size: ${projectData.laborCount} workers

Provide your analysis in valid JSON format.
`;
};

// Call OpenAI API with the prompt
export const callOpenAI = async (prompt: string, apiKey: string): Promise<string> => {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: 'You are a construction equipment expert. Always respond with valid JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 4000
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API call failed:', error);
    throw error;
  }
};

// Convert LLM response to ToolRecommendation format
export const convertLLMResponse = (llmResponse: any, projectData: ProjectData): ToolRecommendation[] => {
  try {
    const response = typeof llmResponse === 'string' ? JSON.parse(llmResponse) : llmResponse;
    
    return response.recommendations.map((rec: any) => ({
      name: rec.productName,
      model: rec.productSku,
      description: rec.description,
      quantity: rec.quantity,
      monthlyCost: rec.monthlyRentalCost,
      totalCost: rec.totalRentalCost,
      rentalDuration: projectData.timeline,
      justification: rec.justification,
      category: rec.category,
      productUrl: rec.productUrl,
      specifications: rec.specifications
    }));
  } catch (error) {
    console.error('Failed to convert LLM response:', error);
    return [];
  }
};

// Main function to generate AI recommendations
export const generateAIRecommendations = async (
  projectData: ProjectData, 
  apiKey: string
): Promise<ToolRecommendation[]> => {
  try {
    // Load the product catalog
    const products = await loadHiltiCatalog();
    
    // Create the prompt
    const prompt = createLLMPrompt(projectData, products);
    
    // Call OpenAI
    const llmResponse = await callOpenAI(prompt, apiKey);
    
    // Convert to our format
    return convertLLMResponse(llmResponse, projectData);
  } catch (error) {
    console.error('AI recommendation generation failed:', error);
    throw error;
  }
};

// Integration with your existing system
export const integrateWithCurrentSystem = () => {
  return `
## How to integrate with your current setup:

1. **Add to RecommendationReport.tsx**:
\`\`\`typescript
import { generateAIRecommendations } from '../utils/realHiltiCatalog';

const [useAI, setUseAI] = useState(true);
const [isLoading, setIsLoading] = useState(false);

const generateRecommendations = async () => {
  setIsLoading(true);
  try {
    if (useAI) {
      const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
      if (!apiKey) throw new Error('No API key');
      
      const aiRecs = await generateAIRecommendations(projectData, apiKey);
      setRecommendations(aiRecs);
    } else {
      // Use existing rule-based system
      const ruleRecs = generateRecommendations(projectData);
      setRecommendations(ruleRecs);
    }
  } catch (error) {
    console.error('Recommendation generation failed:', error);
    // Fallback to rule-based
    const fallbackRecs = generateRecommendations(projectData);
    setRecommendations(fallbackRecs);
  } finally {
    setIsLoading(false);
  }
};
\`\`\`

2. **Add environment variable**:
\`\`\`bash
# .env.local
REACT_APP_OPENAI_API_KEY=your_openai_api_key_here
\`\`\`

3. **Add UI toggle**:
\`\`\`typescript
<div className="mb-4">
  <label className="flex items-center space-x-2">
    <input
      type="checkbox"
      checked={useAI}
      onChange={(e) => setUseAI(e.target.checked)}
      className="text-red-600"
    />
    <span>Use AI-powered recommendations</span>
  </label>
</div>
\`\`\`

4. **Load actual product catalog**:
\`\`\`typescript
// In loadHiltiCatalog function, replace sample data with:
const response = await fetch('/product_data_en_us/products.json');
const products = await response.json();
\`\`\`

## Benefits:
- ✅ Uses real Hilti product data (2,410+ products)
- ✅ Intelligent AI recommendations
- ✅ Fallback to existing system
- ✅ Easy to integrate
- ✅ Cost-effective (only calls LLM when needed)
- ✅ Maintains existing UI and business logic

## Next Steps:
1. Extract the full product catalog from product_data_en_us.zip
2. Add your OpenAI API key
3. Test with different project scenarios
4. Add pricing data extraction
5. Implement caching for better performance
`;
};
