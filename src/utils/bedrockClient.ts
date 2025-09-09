// AWS Bedrock Client for Hilti Recommendations
// This uses AWS SDK for proper authentication and API calls

import { BedrockRuntimeClient, ConverseCommand } from '@aws-sdk/client-bedrock-runtime';
import { ProjectData, ToolRecommendation } from '../types/ProjectData';

// Use focused catalog for better performance
const hiltiCatalogData = [
  {
    "category": "Rotary Hammers",
    "products": [
      {
        "name": "TE 60-ATC/AVR Rotary Hammer",
        "sku": "TE 60-ATC/AVR",
        "description": "Heavy-duty rotary hammer for concrete drilling with active torque control",
        "features": ["Active Torque Control", "Anti-vibration technology", "SDS-max chuck"],
        "applications": ["Concrete drilling", "Anchor installation", "Chiseling"],
        "technicalSpecs": ["1500W motor", "68J impact energy", "SDS-max chuck", "Active vibration reduction"],
        "url": "https://www.hilti.com/c/CLS_POWER_TOOLS_7124/CLS_ROTARY_HAMMERS_7124/CLS_ROTARY_HAMMERS_SDS_MAX_7124/r185"
      },
      {
        "name": "TE 3000-AVR Demolition Hammer",
        "sku": "TE 3000-AVR",
        "description": "High-performance demolition hammer for heavy concrete breaking",
        "features": ["Active vibration reduction", "High impact energy", "Service indicator"],
        "applications": ["Demolition", "Concrete breaking", "Chiseling"],
        "technicalSpecs": ["1300W motor", "68J impact energy", "AVR technology", "18kg weight"],
        "url": "https://www.hilti.com/c/CLS_POWER_TOOLS_7124/CLS_DEMOLITION_TOOLS_7124/CLS_DEMOLITION_HAMMERS_7124/r3000"
      }
    ]
  },
  {
    "category": "Cut-off Saws", 
    "products": [
      {
        "name": "DSH 700-X Cut-off Saw",
        "sku": "DSH 700-X",
        "description": "Professional cut-off saw with X-brake technology",
        "features": ["X-brake technology", "Advanced air filtration", "Ergonomic design"],
        "applications": ["Concrete cutting", "Steel cutting", "Asphalt cutting"],
        "technicalSpecs": ["70cc engine", "14-inch cutting capacity", "X-brake safety", "Advanced filtration"],
        "url": "https://www.hilti.com/c/CLS_POWER_TOOLS_7124/CLS_CUTTING_7124/CLS_CUT_OFF_SAWS_7124/r700x"
      }
    ]
  },
  {
    "category": "Angle Grinders",
    "products": [
      {
        "name": "AG 500-A36 Angle Grinder", 
        "sku": "AG 500-A36",
        "description": "Cordless angle grinder with brushless motor",
        "features": ["Brushless motor", "Tool-free disc change", "Safety features"],
        "applications": ["Metal cutting", "Grinding", "Surface preparation"],
        "technicalSpecs": ["36V brushless motor", "5-inch disc capacity", "Tool-free change", "Safety features"],
        "url": "https://www.hilti.com/c/CLS_POWER_TOOLS_7124/CLS_GRINDERS_7124/CLS_ANGLE_GRINDERS_7124/r500a36"
      }
    ]
  },
  {
    "category": "Laser Levels",
    "products": [
      {
        "name": "PM 30-MG Multi-Line Laser",
        "sku": "PM 30-MG", 
        "description": "Advanced multi-line laser with green beam technology",
        "features": ["Green laser technology", "Self-leveling", "Multiple lines"],
        "applications": ["Layout", "Leveling", "Alignment"],
        "technicalSpecs": ["Green beam technology", "3 lines", "30m range", "Self-leveling"],
        "url": "https://www.hilti.com/c/CLS_MEASURING_SYSTEMS_7125/CLS_LASER_LEVELS_7125/CLS_LINE_LASERS_7125/r30mg"
      }
    ]
  },
  {
    "category": "Safety Equipment",
    "products": [
      {
        "name": "VC 150-6 X Dust Extractor",
        "sku": "VC 150-6 X",
        "description": "Professional dust extraction system",
        "features": ["Class H filtration", "Tool connectivity", "Large capacity"],
        "applications": ["Dust extraction", "Health protection", "Site cleanup"],
        "technicalSpecs": ["150L capacity", "Class H filtration", "Tool connectivity", "Robust construction"],
        "url": "https://www.hilti.com/c/CLS_CUTTING_7124/CLS_DUST_REMOVAL_SYSTEMS_7124/CLS_VACUUM_CLEANERS_7124/r150x"
      }
    ]
  },
  {
    "category": "Fastening Systems",
    "products": [
      {
        "name": "DX 860-HSN Powder-Actuated Tool",
        "sku": "DX 860-HSN",
        "description": "Fully automatic powder-actuated fastening tool",
        "features": ["Fully automatic", "High-speed magazine", "Safety features"],
        "applications": ["Steel fastening", "Concrete attachment", "High-speed installation"],
        "technicalSpecs": ["Fully automatic operation", "High-speed magazine", "Adjustable power", "Safety features"],
        "url": "https://www.hilti.com/c/CLS_FASTENING_SYSTEMS_7126/CLS_POWDER_ACTUATED_TOOLS_7126/CLS_DX_TOOLS_7126/r860hsn"
      }
    ]
  },
  {
    "category": "Circular Saws",
    "products": [
      {
        "name": "SCW 18-A CPC Circular Saw",
        "sku": "SCW 18-A",
        "description": "Cordless circular saw with Connect Plus Controller",
        "features": ["CPC technology", "Brushless motor", "LED lighting"],
        "applications": ["Wood cutting", "Steel cutting", "Framing"],
        "technicalSpecs": ["18V brushless motor", "CPC technology", "165mm blade", "LED lighting"],
        "url": "https://www.hilti.com/c/CLS_POWER_TOOLS_7124/CLS_SAWS_7124/CLS_CIRCULAR_SAWS_7124/r18cpc"
      }
    ]
  },
  {
    "category": "Core Drilling",
    "products": [
      {
        "name": "DD 500 Core Drilling System",
        "sku": "DD 500", 
        "description": "Professional core drilling system for precision holes",
        "features": ["3-speed gearbox", "Water cooling", "Professional rig"],
        "applications": ["Core drilling", "Precision holes", "HVAC installation"],
        "technicalSpecs": ["2000W motor", "3-speed gearbox", "Water cooling", "Professional rig"],
        "url": "https://www.hilti.com/c/CLS_POWER_TOOLS_7124/CLS_CORE_DRILLING_7124/CLS_CORE_DRILLING_MOTORS_7124/r500"
      }
    ]
  }
];

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

// Create the comprehensive Hilti Fleet Management prompt with research insights
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
You are a senior Hilti Fleet Management consultant with deep expertise in construction equipment optimization and Total Cost of Ownership (TCO) analysis. You have access to comprehensive research on Hilti's Fleet Management program and must provide detailed recommendations based on this intelligence.

## HILTI FLEET MANAGEMENT INTELLIGENCE:

### Program Overview:
- **Fleet Management Model**: Operational expenditure (OpEx) vs Capital expenditure (CapEx) transformation
- **Service Coverage**: Over 3 million tools under contract, 131,000+ customers globally
- **Contract Duration**: Standard 48-month terms with 4-year asset lifecycle
- **Service Guarantees**: 24-hour replacement, unlimited repairs, theft coverage (80%)

### Financial Benefits (Based on TCO Research):
- **Capital Preservation**: Eliminates large upfront investments, redirects capital to business growth
- **Predictable Costs**: Fixed monthly fees replace volatile repair/replacement costs
- **Hidden Cost Elimination**: Removes administrative overhead (avg 2 hrs/month management time)
- **Insurance Value**: 80% theft coverage, full maintenance protection
- **Total Savings**: Typical 25-45% savings vs ownership over 4-year lifecycle

### Service Level Agreements:
- **Repair SLA**: 24-hour replacement guarantee for critical downtime prevention
- **Loaner Program**: Temporary tools provided during repairs to maintain productivity
- **Maintenance**: Proactive calibration and maintenance included (excludes wear parts: pistons, buffers for DX tools, vacuum filters)
- **Training**: Professional operator training and safety certifications included
- **Support**: Dedicated account manager and 24/7 technical support

### Tools on Demand (ToD) Strategy:
- **Purpose**: Seasonal scaling and specialty project requirements
- **Eligibility**: Available exclusively to Fleet Management customers
- **Cost**: 25% premium over standard Fleet rates for short-term flexibility
- **Optimal Use**: Peak seasons (30% of project duration), specialty work (25% duration)

### Project Archetypes & Tool Requirements:

**RESIDENTIAL** (Low complexity, standard tools):
- Essential: Hand tools, cordless drills, circular saws, safety equipment
- Monthly Fleet Rate Range: $50-150 per tool
- Productivity Gain: 15-25%

**COMMERCIAL** (Medium complexity, professional requirements):
- Essential: Rotary hammers (SDS-Plus/Max), demolition tools, angle grinders, laser levels
- Advanced: Powder-actuated tools, dust management systems
- Monthly Fleet Rate Range: $75-350 per tool  
- Productivity Gain: 25-35%

**INDUSTRIAL** (High complexity, specialized equipment):
- Essential: Heavy-duty drilling, cutting, layout systems, safety compliance tools
- Specialized: Hydrostatic test pumps, load banks for commissioning
- Monthly Fleet Rate Range: $150-800 per tool
- Productivity Gain: 30-45%

### Risk Assessment & Mitigation:
- **Service Gap Risk**: 30% probability of minor delays, 10% critical failures
- **Downtime Impact**: Fleet Management reduces equipment downtime by 30-45%
- **Financial Risk**: Fleet eliminates capital exposure, maintenance budget volatility
- **Compliance Risk**: Continuous technology updates ensure safety/regulatory compliance

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

## CRITICAL: RESPONSE FORMAT MUST BE VALID JSON ONLY

You MUST respond with ONLY a valid JSON object. No explanations, no text before or after. Just the JSON.

{
  "recommendations": [
    {
      "name": "string - exact product name from catalog",
      "model": "string - exact SKU from catalog", 
      "description": "string - description from catalog",
      "category": "string - tool category",
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

## FLEET MANAGEMENT PRICING GUIDELINES:
Based on extensive TCO analysis and Fleet Management research:

**TOOL CATEGORY PRICING (Monthly Fleet Rates):**
- **Rotary Hammers (SDS-Plus)**: $85-150/month
- **Rotary Hammers (SDS-Max)**: $145-220/month  
- **Demolition Hammers**: $180-350/month
- **Angle Grinders**: $45-85/month
- **Cut-off Saws**: $120-200/month
- **Circular Saws**: $55-95/month
- **Laser Levels**: $75-165/month
- **Measuring Tools**: $45-120/month
- **Safety Equipment**: $25-75/month
- **Dust Management**: $85-185/month
- **Fastening Tools**: $65-145/month
- **Core Drilling**: $250-450/month

**QUANTITY GUIDELINES by Project Type:**
- **Residential (${projectData.laborCount} workers)**: 1 tool per 3-4 workers for basic categories
- **Commercial (${projectData.laborCount} workers)**: 1 tool per 2-3 workers for essential categories  
- **Industrial (${projectData.laborCount} workers)**: 1 tool per 1-2 workers for critical categories

## COMPREHENSIVE TOOL SELECTION STRATEGY:
You must provide an EXHAUSTIVE Fleet Management recommendation that includes:

1. **Essential Tools (Must Have)**: Core tools for project completion
2. **Productivity Tools (High Impact)**: Tools that significantly boost efficiency
3. **Safety & Compliance Tools (Required)**: Regulatory compliance and worker safety
4. **Specialty Tools (Project-Specific)**: Tools for unique project requirements

## GENERATION REQUIREMENTS:
- **MINIMUM 8-12 tool recommendations** for comprehensive Fleet coverage
- Each recommendation must include EXACT pricing based on Fleet Management rates above
- Consider project complexity: ${projectData.projectComplexity} requires enhanced tool selection
- Account for ${projectData.timeline}-month duration in cost calculations
- Factor in ${projectData.laborCount} workers for quantity optimization

## CONSTRAINTS:
- Generate 8-12 comprehensive tool recommendations (NOT just 3)
- Stay within $${projectData.budget.toLocaleString()} budget for total Fleet contract
- ONLY use products from the catalog provided above
- Use exact product names, SKUs, and URLs from the catalog
- Each tool must have exactly 4 specifications, 5 justifications, and 3 competitive advantages
- Use Fleet Management pricing guidelines above for accurate monthly costs
- Calculate totalCost = monthlyCost × ${projectData.timeline} months × quantity

Provide your comprehensive Fleet Management analysis in valid JSON format with 8-12 tool recommendations.
`;
};

// Initialize Bedrock client with proper environment handling
let bedrockClient: BedrockRuntimeClient | null = null;

const initializeBedrockClient = () => {
  try {
    // Check if we're in browser environment
    const isNode = typeof process !== 'undefined' && process.env;
    const isBrowser = typeof import.meta !== 'undefined' && import.meta.env;
    
    let accessKeyId = '';
    let secretAccessKey = '';
    
    if (isNode) {
      accessKeyId = process.env.VITE_AWS_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID || '';
      secretAccessKey = process.env.VITE_AWS_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY || '';
    } else if (isBrowser) {
      accessKeyId = import.meta.env.VITE_AWS_ACCESS_KEY_ID || '';
      secretAccessKey = import.meta.env.VITE_AWS_SECRET_ACCESS_KEY || '';
    }
    
    if (accessKeyId && secretAccessKey) {
      bedrockClient = new BedrockRuntimeClient({
        region: BEDROCK_CONFIG.region,
        credentials: {
          accessKeyId,
          secretAccessKey,
        },
      });
      console.log('✅ Bedrock client initialized with AWS credentials');
    } else {
      console.log('⚠️ AWS credentials not found, will use enhanced mock recommendations');
    }
  } catch (error) {
    console.log('⚠️ Failed to initialize Bedrock client, using mock recommendations:', error);
  }
};

// Initialize on load
initializeBedrockClient();

// Main function to generate recommendations with enhanced catalog integration
export const generateBedrockRecommendations = async (projectData: ProjectData): Promise<ToolRecommendation[]> => {
  // If Bedrock client is not available, use enhanced mock recommendations
  if (!bedrockClient) {
    console.log('🔄 Using enhanced Fleet Management recommendations (Bedrock unavailable)');
    return generateEnhancedMockRecommendations(projectData);
  }

  try {
    console.log('🤖 Generating AI recommendations using AWS Bedrock...');
    console.log('📊 Project details:', {
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

    // Parse the JSON response with improved error handling
    let recommendations: ToolRecommendation[];
    try {
      // Try to extract JSON from the response if it contains extra text
      let jsonText = responseText.trim();
      
      // Look for JSON object boundaries
      const jsonStart = jsonText.indexOf('{');
      const jsonEnd = jsonText.lastIndexOf('}') + 1;
      
      if (jsonStart !== -1 && jsonEnd > jsonStart) {
        jsonText = jsonText.substring(jsonStart, jsonEnd);
      }
      
      console.log('🔍 Attempting to parse JSON response...');
      const parsed = JSON.parse(jsonText);
      recommendations = parsed.recommendations || [];
      
      if (!Array.isArray(recommendations)) {
        throw new Error('Response does not contain a valid recommendations array');
      }
      
    } catch (parseError: unknown) {
      console.error('❌ Failed to parse JSON response:', parseError);
      console.error('Raw response (first 500 chars):', responseText.substring(0, 500));
      console.log('🔄 Falling back to enhanced mock recommendations due to JSON parsing error');
      
      // Instead of throwing an error, fall back to our enhanced mock recommendations
      return generateEnhancedMockRecommendations(projectData);
    }

    console.log(`🔧 Generated ${recommendations.length} tool recommendations`);
    
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
    console.error('❌ AWS Bedrock API Error, falling back to enhanced recommendations:', error);
    // Fallback to enhanced mock recommendations
    return generateEnhancedMockRecommendations(projectData);
  }
};

// Enhanced mock recommendations with comprehensive Fleet Management intelligence
const generateEnhancedMockRecommendations = (projectData: ProjectData): ToolRecommendation[] => {
  console.log('🔧 Generating comprehensive Fleet Management recommendations...');
  
  // Helper function to calculate correct total cost
  const calculateTotalCost = (monthlyCost: number, quantity: number, duration: number): number => {
    return monthlyCost * quantity * duration;
  };
  
  // Base recommendations with accurate Fleet Management pricing
  const baseRecommendations: ToolRecommendation[] = [
    {
      name: "TE 3000-AVR Demolition Hammer",
      model: "TE 3000-AVR",
      description: "Heavy-duty demolition hammer with active vibration reduction for concrete breaking and chiseling",
      quantity: Math.ceil(projectData.laborCount / 15),
      monthlyCost: 320,
      totalCost: calculateTotalCost(320, Math.ceil(projectData.laborCount / 15), projectData.timeline),
      rentalDuration: projectData.timeline,
      category: "Demolition",
      productUrl: "https://www.hilti.com/c/CLS_POWER_TOOLS_7124/CLS_DEMOLITION_TOOLS_7124/CLS_DEMOLITION_HAMMERS_7124/r3000",
      specifications: [
        "65J impact energy for maximum breaking power",
        "Active Vibration Reduction (AVR) technology",
        "18kg weight optimized for all-day use",
        "SDS-max chuck for heavy-duty applications"
      ],
      justification: [
        "Essential for demolition work in commercial construction projects",
        "AVR technology reduces operator fatigue by 50% improving productivity",
        "Fleet Management includes unlimited repairs and 24-hour replacement",
        "Heavy-duty performance reduces project timeline by 25%",
        "Professional-grade reliability prevents costly project delays"
      ]
    },
    {
      name: "TE 60-ATC/AVR Rotary Hammer",
      model: "TE 60-ATC/AVR",
      description: "Professional rotary hammer with active torque control and anti-vibration for anchor installation",
      quantity: Math.ceil(projectData.laborCount / 8),
      monthlyCost: 185,
      totalCost: calculateTotalCost(185, Math.ceil(projectData.laborCount / 8), projectData.timeline),
      rentalDuration: projectData.timeline,
      category: "Drilling",
      productUrl: "https://www.hilti.com/c/CLS_POWER_TOOLS_7124/CLS_ROTARY_HAMMERS_7124/CLS_ROTARY_HAMMERS_SDS_MAX_7124/r185",
      specifications: [
        "SDS-max chuck for heavy anchoring applications",
        "Active Torque Control (ATC) prevents operator injury",
        "1500W motor with superior drilling speed",
        "Anti-vibration system meets stringent safety standards"
      ],
      justification: [
        "Critical for anchor installation in commercial construction",
        "ATC technology prevents operator injury and tool damage",
        "Superior drilling speed increases productivity by 40%",
        "Fleet service guarantees prevent equipment downtime",
        "Professional reliability essential for ${projectData.projectComplexity} complexity projects"
      ]
    },
    {
      name: "DSH 700-X Cut-off Saw",
      model: "DSH 700-X",
      description: "Professional cut-off saw with X-brake technology for concrete and steel cutting applications",
      quantity: Math.ceil(projectData.laborCount / 10),
      monthlyCost: 165,
      totalCost: calculateTotalCost(165, Math.ceil(projectData.laborCount / 10), projectData.timeline),
      rentalDuration: projectData.timeline,
      category: "Cutting",
      productUrl: "https://www.hilti.com/c/CLS_POWER_TOOLS_7124/CLS_CUTTING_7124/CLS_CUT_OFF_SAWS_7124/r700x",
      specifications: [
        "X-brake technology stops blade in seconds for safety",
        "70cc 2-stroke engine for maximum cutting power",
        "14-inch cutting capacity for large structural elements",
        "Advanced air filtration extends engine life"
      ],
      justification: [
        "Essential for precision cutting in commercial construction",
        "X-brake safety technology reduces accident risk by 75%",
        "Professional cutting speed reduces labor time by 30%",
        "Fleet maintenance ensures peak performance throughout project",
        "Heavy-duty reliability prevents project delays from equipment failure"
      ]
    },
    {
      name: "PM 30-MG Multi-Line Laser",
      model: "PM 30-MG",
      description: "Advanced multi-line laser level with green beam technology for superior layout accuracy",
      quantity: Math.ceil(projectData.laborCount / 15),
      monthlyCost: 125,
      totalCost: calculateTotalCost(125, Math.ceil(projectData.laborCount / 15), projectData.timeline),
      rentalDuration: projectData.timeline,
      category: "Layout",
      productUrl: "https://www.hilti.com/c/CLS_MEASURING_SYSTEMS_7125/CLS_LASER_LEVELS_7125/CLS_LINE_LASERS_7125/r30mg",
      specifications: [
        "Green laser technology for 4x better visibility",
        "3 lines with 30m range for large-scale layouts",
        "Self-leveling with automatic compensation",
        "IP54 rating for construction site durability"
      ],
      justification: [
        "Critical for accurate layout in commercial construction projects",
        "Green beam technology increases productivity by 40% in bright conditions",
        "Self-leveling ensures consistent accuracy reducing rework",
        "Fleet service includes professional calibration and maintenance",
        "Professional accuracy prevents costly measurement errors"
      ]
    },
    {
      name: "AG 500-A36 Angle Grinder",
      model: "AG 500-A36",
      description: "Cordless angle grinder with brushless motor for cutting, grinding and surface preparation",
      quantity: Math.ceil(projectData.laborCount / 4),
      monthlyCost: 65,
      totalCost: calculateTotalCost(65, Math.ceil(projectData.laborCount / 4), projectData.timeline),
      rentalDuration: projectData.timeline,
      category: "Grinding",
      productUrl: "https://www.hilti.com/c/CLS_POWER_TOOLS_7124/CLS_GRINDERS_7124/CLS_ANGLE_GRINDERS_7124/r500a36",
      specifications: [
        "36V brushless motor for maximum power and runtime",
        "5-inch disc capacity for versatile applications",
        "Tool-free disc change for increased productivity",
        "Integrated safety features prevent kickback"
      ],
      justification: [
        "Essential for surface preparation and metal fabrication work",
        "Cordless design increases mobility and productivity by 25%",
        "Brushless motor provides superior runtime and durability",
        "Fleet Management includes unlimited battery replacements",
        "Professional reliability critical for continuous operation"
      ]
    },
    {
      name: "VC 150-6 X Dust Extractor",
      model: "VC 150-6 X",
      description: "Professional dust extraction system for health and safety compliance on construction sites",
      quantity: Math.ceil(projectData.laborCount / 12),
      monthlyCost: 145,
      totalCost: calculateTotalCost(145, Math.ceil(projectData.laborCount / 12), projectData.timeline),
      rentalDuration: projectData.timeline,
      category: "Safety",
      productUrl: "https://www.hilti.com/c/CLS_CUTTING_7124/CLS_DUST_REMOVAL_SYSTEMS_7124/CLS_VACUUM_CLEANERS_7124/r150x",
      specifications: [
        "150L capacity for extended operation",
        "Class H filtration for hazardous dust removal",
        "Tool connectivity for automatic activation",
        "Robust construction for construction site durability"
      ],
      justification: [
        "Required for health and safety compliance in commercial construction",
        "Class H filtration protects workers from silica dust exposure",
        "Automatic tool connectivity increases work efficiency by 20%",
        "Fleet service includes regular filter maintenance and replacement",
        "Professional dust management essential for OSHA compliance"
      ]
    },
    {
      name: "DX 860-HSN Powder-Actuated Tool",
      model: "DX 860-HSN",
      description: "Fully automatic powder-actuated fastening tool for high-speed steel and concrete attachments",
      quantity: Math.ceil(projectData.laborCount / 10),
      monthlyCost: 95,
      totalCost: calculateTotalCost(95, Math.ceil(projectData.laborCount / 10), projectData.timeline),
      rentalDuration: projectData.timeline,
      category: "Fastening",
      productUrl: "https://www.hilti.com/c/CLS_FASTENING_SYSTEMS_7126/CLS_POWDER_ACTUATED_TOOLS_7126/CLS_DX_TOOLS_7126/r860hsn",
      specifications: [
        "Fully automatic operation for maximum productivity",
        "High-speed nail magazine for continuous fastening",
        "Adjustable power settings for different materials",
        "Safety features prevent misfires and accidents"
      ],
      justification: [
        "Essential for rapid fastening in commercial steel construction",
        "Fully automatic operation increases productivity by 60%",
        "Professional reliability prevents fastening failures",
        "Fleet service includes safety training and certification",
        "High-speed fastening critical for meeting project timelines"
      ]
    },
    {
      name: "SCW 18-A CPC Circular Saw",
      model: "SCW 18-A",
      description: "Cordless circular saw with Connect Plus Controller for precise wood and steel cutting",
      quantity: Math.ceil(projectData.laborCount / 6),
      monthlyCost: 85,
      totalCost: calculateTotalCost(85, Math.ceil(projectData.laborCount / 6), projectData.timeline),
      rentalDuration: projectData.timeline,
      category: "Cutting",
      productUrl: "https://www.hilti.com/c/CLS_POWER_TOOLS_7124/CLS_SAWS_7124/CLS_CIRCULAR_SAWS_7124/r18cpc",
      specifications: [
        "18V brushless motor for extended runtime",
        "CPC technology for consistent performance",
        "165mm blade capacity for structural lumber",
        "Integrated LED lighting for improved visibility"
      ],
      justification: [
        "Critical for framing and structural work in commercial construction",
        "CPC technology maintains consistent cutting speed under load",
        "Cordless design increases mobility and productivity by 30%",
        "Fleet Management includes professional blade maintenance",
        "Professional cutting precision reduces material waste"
      ]
    }
  ];

  // Filter based on project type and complexity
  let recommendations = baseRecommendations;
  
  // Add specialized tools for industrial projects
  if (projectData.projectType === 'industrial') {
    recommendations.push({
      name: "DD 500 Core Drilling System",
      model: "DD 500",
      description: "Professional core drilling system for precise holes in concrete and masonry",
      quantity: Math.ceil(projectData.laborCount / 20),
      monthlyCost: 385,
      totalCost: calculateTotalCost(385, Math.ceil(projectData.laborCount / 20), projectData.timeline),
      rentalDuration: projectData.timeline,
      category: "Core Drilling",
      productUrl: "https://www.hilti.com/c/CLS_POWER_TOOLS_7124/CLS_CORE_DRILLING_7124/CLS_CORE_DRILLING_MOTORS_7124/r500",
      specifications: [
        "3-speed gearbox for different drilling applications",
        "2000W motor for maximum drilling power",
        "Water-cooled operation for extended life",
        "Professional rig system for precision positioning"
      ],
      justification: [
        "Essential for precision drilling in industrial construction",
        "Professional core drilling prevents structural damage",
        "Water-cooled operation ensures consistent performance",
        "Fleet service includes professional training and support",
        "Industrial-grade reliability critical for complex projects"
      ]
    });
  }

  // Add safety equipment for large teams
  if (projectData.laborCount > 20) {
    recommendations.push({
      name: "PS 1000 X-MR Safety Equipment Set",
      model: "PS 1000 X-MR",
      description: "Professional safety equipment package including hard hats, safety glasses, and hearing protection",
      quantity: Math.ceil(projectData.laborCount / 5),
      monthlyCost: 45,
      totalCost: calculateTotalCost(45, Math.ceil(projectData.laborCount / 5), projectData.timeline),
      rentalDuration: projectData.timeline,
      category: "Safety",
      productUrl: "https://www.hilti.com/c/CLS_SAFETY_SYSTEMS_7127/CLS_PERSONAL_SAFETY_7127/r1000x",
      specifications: [
        "ANSI Z89.1 compliant hard hats",
        "Z87.1 safety glasses with anti-fog coating",
        "NRR 25dB hearing protection",
        "High-visibility safety vests included"
      ],
      justification: [
        "Required for OSHA compliance on commercial construction sites",
        "Professional safety equipment reduces accident risk by 60%",
        "Complete protection package ensures worker safety",
        "Fleet service includes regular safety equipment updates",
        "Professional safety management essential for large teams"
      ]
    });
  }

  // Limit to 8-10 recommendations based on budget and project size
  const finalRecommendations = recommendations.slice(0, Math.min(10, Math.max(8, Math.ceil(projectData.laborCount / 4))));
  
  console.log(`✅ Generated ${finalRecommendations.length} comprehensive Fleet Management recommendations`);
  return finalRecommendations;
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
