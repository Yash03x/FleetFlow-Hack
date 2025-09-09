// AWS Bedrock Client for Hilti Recommendations
// This uses AWS SDK for proper authentication and API calls

import { BedrockRuntimeClient, ConverseCommand } from '@aws-sdk/client-bedrock-runtime';
import { ProjectData, ToolRecommendation } from '../types/ProjectData';

// AWS Bedrock configuration
const BEDROCK_CONFIG = {
  region: 'eu-central-1',
  modelId: 'anthropic.claude-3-5-sonnet-20240620-v1:0', // Using Claude 3.5 Sonnet (direct access)
  maxTokens: 4000,
  temperature: 0.3,
  topP: 0.9
};

// Create the prompt for Bedrock
const createBedrockPrompt = (projectData: ProjectData): string => {
  return `
You are a construction equipment expert specializing in Hilti tools and equipment. Analyze this construction project and recommend the optimal tool selection.

## PROJECT INPUT:
- **Project Name**: ${projectData.projectName}
- **Project Type**: ${projectData.projectType}
- **Project Location**: ${projectData.location}
- **Number of Laborers**: ${projectData.laborCount}
- **Timeline (months)**: ${projectData.timeline}
- **Budget Range ($)**: $${projectData.budget}
- **Project Complexity**: ${projectData.projectComplexity}
- **Existing Tools & Equipment**: ${projectData.existingTools.join(', ')}
- **Special Requirements or Notes**: ${projectData.specialRequirements}

## TASK:
Select the most appropriate tools for this ${projectData.projectType} project with ${projectData.laborCount} workers over ${projectData.timeline} months.

## RESPONSE FORMAT (JSON):
{
  "recommendations": [
    {
      "name": "string - tool name",
      "model": "string - model number",
      "description": "string - brief description",
      "quantity": number,
      "rentalDuration": ${projectData.timeline},
      "monthlyCost": number,
      "totalCost": number,
      "productUrl": "string - Hilti product URL",
      "specifications": [
        "string - key spec 1",
        "string - key spec 2", 
        "string - key spec 3",
        "string - key spec 4"
      ],
      "justification": [
        "string - why this tool 1",
        "string - why this tool 2",
        "string - why this tool 3",
        "string - why this tool 4",
        "string - why this tool 5"
      ],
      "competitiveAdvantages": [
        "string - advantage 1",
        "string - advantage 2", 
        "string - advantage 3"
      ]
    }
  ]
}

## CONSTRAINTS:
- Maximum 10 tool recommendations
- Stay within $${projectData.budget} budget
- Avoid duplicating existing tools: ${projectData.existingTools.join(', ')}
- Match complexity level: ${projectData.projectComplexity}
- Consider team size: ${projectData.laborCount} workers
- Each tool must have exactly 4 specifications, 5 justifications, and 3 competitive advantages

## TOOL SELECTION CRITERIA:
For ${projectData.projectType} construction with ${projectData.laborCount} workers over ${projectData.timeline} months:
1. **Drilling Tools**: Rotary hammers, hammer drills for concrete work
2. **Cutting Tools**: Angle grinders, circular saws for material cutting
3. **Measuring Tools**: Laser levels, distance meters for precision work
4. **Fastening Tools**: Powder-actuated tools, anchor systems
5. **Safety Equipment**: Dust management, safety systems
6. **Accessories**: Drill bits, blades, consumables

## COST CALCULATIONS:
- Monthly rental rates: $50-300 per tool depending on type
- Calculate totalCost = monthlyCost × rentalDuration
- Ensure total fleet cost stays within budget

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

// Real AWS Bedrock integration using Converse API
export const generateBedrockRecommendations = async (projectData: ProjectData): Promise<ToolRecommendation[]> => {
  try {
    console.log('🤖 Using AWS Bedrock Converse API...');
    console.log('📍 Region:', BEDROCK_CONFIG.region);
    console.log('🎯 Model ID:', BEDROCK_CONFIG.modelId);
    
    const prompt = createBedrockPrompt(projectData);
    
    // Log the complete prompt being sent
    console.log('📤 PROMPT SENT TO MODEL:');
    console.log('=' .repeat(80));
    console.log(prompt);
    console.log('=' .repeat(80));
    
    // Create conversation with the user message
    const conversation = [
      {
        role: 'user' as const,
        content: [{ text: prompt }]
      }
    ];

    // Log the complete request payload
    const requestPayload = {
      modelId: BEDROCK_CONFIG.modelId,
      messages: conversation,
      inferenceConfig: { 
        maxTokens: BEDROCK_CONFIG.maxTokens, 
        temperature: BEDROCK_CONFIG.temperature,
        topP: BEDROCK_CONFIG.topP
      }
    };
    
    console.log('📦 REQUEST PAYLOAD:');
    console.log('=' .repeat(80));
    console.log(JSON.stringify(requestPayload, null, 2));
    console.log('=' .repeat(80));

    // Create a command with the model ID, the message, and configuration
    const command = new ConverseCommand(requestPayload);

    console.log('🚀 Sending request to AWS Bedrock...');
    const startTime = Date.now();
    
    // Send the command to the model and wait for the response
    const response = await bedrockClient.send(command);
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    console.log(`⏱️ Response received in ${duration}ms`);
    
    // Log the complete response
    console.log('📥 COMPLETE RESPONSE FROM MODEL:');
    console.log('=' .repeat(80));
    console.log(JSON.stringify(response, null, 2));
    console.log('=' .repeat(80));
    
    // Extract the response text with proper null checks
    if (!response.output?.message?.content?.[0]?.text) {
      console.error('❌ Invalid response format - missing text content');
      console.error('Response structure:', response);
      throw new Error('Invalid response format from Bedrock');
    }
    
    const responseText = response.output.message.content[0].text;
    console.log('📝 RAW TEXT RESPONSE:');
    console.log('=' .repeat(80));
    console.log(responseText);
    console.log('=' .repeat(80));
    
    // Parse the JSON response
    let llmResponse;
    try {
      llmResponse = JSON.parse(responseText);
      console.log('✅ Successfully parsed JSON response');
    } catch (parseError) {
      console.error('❌ Failed to parse JSON response:');
      console.error('Parse error:', parseError);
      console.error('Raw text that failed to parse:', responseText);
      throw new Error(`Failed to parse JSON response: ${parseError.message}`);
    }
    
    console.log('📊 PARSED RECOMMENDATIONS:');
    console.log('=' .repeat(80));
    console.log(JSON.stringify(llmResponse, null, 2));
    console.log('=' .repeat(80));
    
    // Validate the response structure
    if (!llmResponse.recommendations || !Array.isArray(llmResponse.recommendations)) {
      console.error('❌ Invalid response structure - missing recommendations array');
      console.error('Response structure:', llmResponse);
      throw new Error('Invalid response structure - missing recommendations array');
    }
    
    console.log(`✅ Successfully received ${llmResponse.recommendations.length} recommendations`);
    
    return llmResponse.recommendations;
    
  } catch (error) {
    console.error('❌ AWS Bedrock Converse API error:');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    if (error.$metadata) {
      console.error('AWS metadata:', error.$metadata);
    }
    throw error;
  }
};

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
