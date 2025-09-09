// AWS Bedrock Client for Hilti Recommendations
// This uses AWS SDK for proper authentication and API calls

import { BedrockRuntimeClient, ConverseCommand } from '@aws-sdk/client-bedrock-runtime';
import { ProjectData, ToolRecommendation } from '../types/ProjectData';

// Import the processed Hilti catalog
import hiltiCatalogData from '../data/hiltiCatalogLLM.json';

// AWS Bedrock configuration
const BEDROCK_CONFIG = {
  region: 'eu-central-1',
  modelId: 'anthropic.claude-3-5-sonnet-20240620-v1:0', // Using Claude 3.5 Sonnet (direct access)
  maxTokens: 4000,
  temperature: 0.3,
  topP: 0.9
};

// Filter products by project relevance
const getRelevantProducts = (projectData: ProjectData): any[] => {
  const { projectType } = projectData;
  
  // Define relevant categories based on project type
  const categoryMap: Record<string, string[]> = {
    'residential': [
      'Rotary hammers', 'Hammer drills', 'Circular saws', 'Angle grinders',
      'Measuring tools', 'Safety equipment', 'Fastening systems'
    ],
    'commercial': [
      'Rotary hammers', 'Demolition hammers', 'Cut-off saws', 'Angle grinders',
      'Laser levels', 'Measuring tools', 'Safety equipment', 'Fastening systems',
      'Dust management systems', 'Core drilling'
    ],
    'infrastructure': [
      'Demolition hammers', 'Cut-off saws', 'Core drilling', 'Rotary hammers',
      'Heavy-duty equipment', 'Safety equipment', 'Measuring tools'
    ],
    'industrial': [
      'Heavy-duty equipment', 'Industrial tools', 'Safety equipment',
      'Measuring tools', 'Fastening systems', 'Dust management systems'
    ],
    'renovation': [
      'Demolition hammers', 'Rotary hammers', 'Dust management systems',
      'Safety equipment', 'Measuring tools', 'Cut-off saws'
    ],
    'roadwork': [
      'Cut-off saws', 'Core drilling', 'Heavy-duty equipment',
      'Safety equipment', 'Measuring tools'
    ]
  };

  const relevantCategories = categoryMap[projectType] || categoryMap['commercial'];
  
  // Filter products by relevant categories
  const relevantProducts: any[] = [];
  
  hiltiCatalogData.forEach(categoryData => {
    const isRelevantCategory = relevantCategories.some(relCat => 
      categoryData.category.toLowerCase().includes(relCat.toLowerCase()) ||
      relCat.toLowerCase().includes(categoryData.category.toLowerCase())
    );
    
    if (isRelevantCategory) {
      // Add top products from this category
      const topProducts = categoryData.products
        .filter(product => product.description && product.technicalSpecs.length > 0)
        .slice(0, 3); // Limit to top 3 products per category to manage prompt size
      
      relevantProducts.push(...topProducts.map(product => ({
        ...product,
        category: categoryData.category
      })));
    }
  });

  return relevantProducts.slice(0, 30); // Limit total products to manage prompt size
};

// Create the enhanced prompt for Bedrock with actual product data
const createBedrockPrompt = (projectData: ProjectData): string => {
  const relevantProducts = getRelevantProducts(projectData);
  
  // Build product catalog section
  const productCatalogSection = relevantProducts.map(product => `
**${product.name}** (${product.sku})
- Category: ${product.category}
- Description: ${product.description}
- URL: ${product.url}
${product.features.length > 0 ? `- Features: ${product.features.join('; ')}` : ''}
${product.applications.length > 0 ? `- Applications: ${product.applications.join('; ')}` : ''}
${product.technicalSpecs.length > 0 ? `- Technical Specs: ${product.technicalSpecs.slice(0, 3).join('; ')}` : ''}
`).join('\n');

  return `
You are a construction equipment expert specializing in Hilti tools and equipment. Analyze this construction project and recommend the optimal tool selection from the ACTUAL HILTI PRODUCT CATALOG provided below.

## PROJECT INPUT:
- **Project Name**: ${projectData.projectName}
- **Project Type**: ${projectData.projectType}
- **Project Location**: ${projectData.location}
- **Number of Laborers**: ${projectData.laborCount}
- **Timeline (months)**: ${projectData.timeline}
- **Budget Range ($)**: $${projectData.budget.toLocaleString()}
- **Project Complexity**: ${projectData.projectComplexity}
- **Existing Tools & Equipment**: ${projectData.existingTools.join(', ') || 'None specified'}
- **Special Requirements**: ${projectData.specialRequirements || 'None specified'}

## AVAILABLE HILTI PRODUCTS:
${productCatalogSection}

## TASK:
From the ACTUAL HILTI PRODUCTS listed above, select the most appropriate tools for this ${projectData.projectType} project with ${projectData.laborCount} workers over ${projectData.timeline} months. 

## SELECTION CRITERIA:
1. **Match project requirements**: Choose tools that directly address the project type and complexity
2. **Avoid existing tools**: Do not recommend tools already owned: ${projectData.existingTools.join(', ') || 'None'}
3. **Budget constraints**: Stay within the $${projectData.budget.toLocaleString()} budget
4. **Team efficiency**: Consider ${projectData.laborCount} workers and ${projectData.timeline} month timeline
5. **Real Hilti products**: ONLY recommend products from the catalog above

## RESPONSE FORMAT (JSON):
{
  "recommendations": [
    {
      "name": "string - exact product name from catalog",
      "model": "string - exact SKU from catalog", 
      "description": "string - description from catalog",
      "quantity": number,
      "rentalDuration": ${projectData.timeline},
      "monthlyCost": number,
      "totalCost": number,
      "productUrl": "string - exact URL from catalog",
      "specifications": [
        "string - technical spec 1",
        "string - technical spec 2", 
        "string - technical spec 3",
        "string - technical spec 4"
      ],
      "justification": [
        "string - why this tool fits project requirements",
        "string - how it addresses project complexity",
        "string - productivity benefit for team size",
        "string - timeline efficiency benefit",
        "string - competitive advantage"
      ],
      "competitiveAdvantages": [
        "string - Hilti advantage 1",
        "string - Hilti advantage 2", 
        "string - Hilti advantage 3"
      ]
    }
  ]
}

## CONSTRAINTS:
- Maximum 8 tool recommendations
- Stay within $${projectData.budget.toLocaleString()} budget
- ONLY use products from the catalog provided above
- Use exact product names, SKUs, and URLs from the catalog
- Each tool must have exactly 4 specifications, 5 justifications, and 3 competitive advantages
- Consider monthly rental rates: Basic tools $50-150, Professional tools $150-400, Heavy equipment $400-800

Provide your analysis in valid JSON format that matches the structure above exactly.
`;
};

// Initialize Bedrock client
const bedrockClient = new BedrockRuntimeClient({
  region: BEDROCK_CONFIG.region,
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID || '',
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY || '',
  },
});

// Main function to generate recommendations with enhanced catalog integration
export const generateBedrockRecommendations = async (projectData: ProjectData): Promise<ToolRecommendation[]> => {
  try {
    console.log('🤖 Generating AI recommendations using AWS Bedrock...');
    console.log('� Project details:', {
      type: projectData.projectType,
      workers: projectData.laborCount,
      timeline: projectData.timeline,
      budget: projectData.budget
    });

    // Create enhanced prompt with actual product catalog
    const prompt = createBedrockPrompt(projectData);
    console.log('📝 Enhanced prompt created with real Hilti product catalog');

    // Create conversation with the user message
    const conversation = [
      {
        role: 'user' as const,
        content: [{ text: prompt }]
      }
    ];

    // Create a command with the model ID, the message, and configuration
    const command = new ConverseCommand({
      modelId: BEDROCK_CONFIG.modelId,
      messages: conversation,
      inferenceConfig: { 
        maxTokens: BEDROCK_CONFIG.maxTokens, 
        temperature: BEDROCK_CONFIG.temperature,
        topP: BEDROCK_CONFIG.topP
      }
    });

    // Send the command to the model and wait for the response
    console.log('🚀 Sending request to AWS Bedrock...');
    const response = await bedrockClient.send(command);
    
    // Extract the response text
    const responseText = response.output?.message?.content?.[0]?.text;
    if (!responseText) {
      throw new Error('No response text received from Bedrock');
    }

    console.log('✅ Received response from AWS Bedrock');
    console.log('📄 Response length:', responseText.length, 'characters');

    // Parse the JSON response
    let recommendations: ToolRecommendation[];
    try {
      const parsed = JSON.parse(responseText);
      recommendations = parsed.recommendations || [];
    } catch (parseError: unknown) {
      console.error('❌ Failed to parse JSON response:', parseError);
      console.error('Raw response:', responseText.substring(0, 500));
      const errorMessage = parseError instanceof Error ? parseError.message : 'Unknown parsing error';
      throw new Error(`Failed to parse JSON response: ${errorMessage}`);
    }

    console.log(`� Generated ${recommendations.length} tool recommendations`);
    
    // Validate and enhance recommendations
    const validatedRecommendations = recommendations.map((rec, index) => ({
      ...rec,
      id: `bedrock-rec-${index}`,
      quantity: rec.quantity || 1,
      rentalDuration: rec.rentalDuration || projectData.timeline,
      monthlyCost: rec.monthlyCost || 200, // Default fallback
      totalCost: rec.totalCost || (rec.monthlyCost || 200) * (rec.rentalDuration || projectData.timeline),
      specifications: rec.specifications || [],
      justification: rec.justification || [],
      competitiveAdvantages: rec.competitiveAdvantages || []
    }));

    return validatedRecommendations;

  } catch (error: unknown) {
    console.error('❌ AWS Bedrock API Error:', error);
    if (error instanceof Error) {
      console.error('Error type:', error.constructor.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    if (typeof error === 'object' && error !== null && '$metadata' in error) {
      console.error('AWS metadata:', (error as any).$metadata);
    }
    
    throw new Error(`AWS Bedrock API failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export default generateBedrockRecommendations;

// Option 2: Direct Bedrock call (requires proper AWS SDK setup)
export const generateBedrockRecommendationsDirect = async (projectData: ProjectData): Promise<ToolRecommendation[]> => {
  // This would require AWS SDK setup and proper authentication
  // For now, we'll use a mock response to demonstrate the structure
  
  console.log('🤖 Using AWS Bedrock (mock response for demo)');
  
  // Mock response that matches your UI structure
  const mockRecommendations: ToolRecommendation[] = [
    {
      name: "TE 60-ATC/AVR Rotary Hammer",
      model: "TE 60-ATC/AVR",
      description: "Heavy-duty rotary hammer for concrete drilling and chiseling with active torque control and anti-vibration technology",
      quantity: Math.ceil(projectData.laborCount / 8),
      monthlyCost: 145,
      totalCost: 145 * projectData.timeline,
      rentalDuration: projectData.timeline,
      justification: [
        "Essential for anchor installation in high-rise construction",
        "Active torque control prevents operator injury and tool damage",
        "Anti-vibration technology reduces operator fatigue by 40%",
        "Superior drilling speed reduces project timeline by 20%",
        "Perfect for ${projectData.projectType} construction requirements"
      ],
      category: "Drilling",
      productUrl: "https://www.hilti.com/c/CLS_POWER_TOOLS_7124/CLS_ROTARY_HAMMERS_7124/CLS_ROTARY_HAMMERS_SDS_MAX_7124/r185",
      specifications: [
        "SDS-max chuck for heavy-duty applications",
        "1500W motor with high load rating",
        "Active Torque Control (ATC) technology",
        "Anti-vibration system reduces operator fatigue"
      ]
    },
    {
      name: "PM 30-MG Multi-Line Laser",
      model: "PM 30-MG",
      description: "Advanced multi-line laser level with green beam technology for superior visibility",
      quantity: Math.ceil(projectData.laborCount / 12),
      monthlyCost: 95,
      totalCost: 95 * projectData.timeline,
      rentalDuration: projectData.timeline,
      justification: [
        "Accurate layout prevents costly measurement errors and rework",
        "Advanced laser technology increases productivity by 40%",
        "Self-leveling capability ensures consistent accuracy",
        "Green beam technology provides superior visibility",
        "Essential for precision work in ${projectData.projectType} projects"
      ],
      category: "Layout",
      productUrl: "https://www.hilti.com/c/CLS_MEASURING_SYSTEMS_7125/CLS_LASER_LEVELS_7125/CLS_LINE_LASERS_7125/r30mg",
      specifications: [
        "Green laser technology for superior visibility",
        "3 lines with 30m range capability",
        "Self-leveling with automatic compensation",
        "IP54 rating for dust and water protection"
      ]
    }
  ];

  // Filter based on existing tools
  const filteredRecommendations = mockRecommendations.filter(rec => 
    !projectData.existingTools.some(existing => 
      rec.name.toLowerCase().includes(existing.toLowerCase()) ||
      existing.toLowerCase().includes(rec.category.toLowerCase())
    )
  );

  return filteredRecommendations.slice(0, 10);
};

// Configuration for different Bedrock models
export const BEDROCK_MODELS = {
  claude3Sonnet: 'anthropic.claude-3-sonnet-20240229-v1:0',
  claude3Haiku: 'anthropic.claude-3-haiku-20240307-v1:0',
  claude3Opus: 'anthropic.claude-3-opus-20240229-v1:0',
  titanText: 'amazon.titan-text-express-v1',
  titanTextLite: 'amazon.titan-text-lite-v1'
};

// Usage instructions
export const BEDROCK_SETUP_INSTRUCTIONS = `
## AWS Bedrock Setup Instructions

### Option 1: Backend Proxy (Recommended)
1. Create a backend API endpoint that handles Bedrock calls
2. Set up AWS credentials on your server
3. Call the backend from your frontend

### Option 2: Direct Frontend Integration
1. Install AWS SDK: npm install @aws-sdk/client-bedrock-runtime
2. Set up AWS credentials (not recommended for production)
3. Use the direct Bedrock client

### Option 3: Mock Implementation (Current)
- Uses mock data that matches your UI structure
- Perfect for testing and development
- Can be easily replaced with real Bedrock calls

### Environment Variables Needed:
- VITE_AWS_ACCESS_KEY_ID
- VITE_AWS_SECRET_ACCESS_KEY
- VITE_AWS_REGION (default: us-east-1)

### Benefits of Bedrock:
- ✅ Enterprise-grade security
- ✅ Multiple model options (Claude, Titan)
- ✅ Cost-effective pricing
- ✅ No data leaving AWS ecosystem
- ✅ Built-in compliance and governance
`;
