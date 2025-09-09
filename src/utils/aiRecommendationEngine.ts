import { ProjectData, ToolRecommendation, FleetContract } from '../types/ProjectData';

// This would be your full Hilti catalog - much larger than current 20 tools
const FULL_HILTI_CATALOG = {
  // ... thousands of tools with detailed specs, pricing, compatibility, etc.
  drills: [
    {
      id: 'TE-60-ATC-AVR',
      name: 'TE 60-ATC/AVR Rotary Hammer',
      model: 'TE 60-ATC/AVR',
      category: 'Drilling',
      subcategory: 'Rotary Hammers',
      specifications: {
        power: '1500W',
        chuck: 'SDS-max',
        impactEnergy: '15J',
        weight: '6.2kg',
        voltage: '230V',
        features: ['Active Torque Control', 'Anti-vibration', 'Electronic speed control']
      },
      pricing: {
        monthlyRental: 145,
        dailyRental: 25,
        purchasePrice: 1200
      },
      applications: ['concrete drilling', 'anchor installation', 'structural connections'],
      projectTypes: ['commercial', 'industrial', 'infrastructure'],
      laborEfficiency: {
        minLaborers: 10,
        productivityIncrease: 0.25,
        skillLevel: 'intermediate'
      },
      compatibility: {
        accessories: ['TE-YX drill bits', 'Dust extraction systems'],
        powerRequirements: 'Standard 230V outlet',
        environmental: ['indoor', 'outdoor', 'dusty conditions']
      }
    }
    // ... hundreds more tools
  ]
  // ... other categories
};

interface LLMRecommendationRequest {
  projectData: ProjectData;
  toolCatalog: typeof FULL_HILTI_CATALOG;
  existingRecommendations?: ToolRecommendation[];
}

interface LLMRecommendationResponse {
  recommendations: {
    toolId: string;
    quantity: number;
    justification: string[];
    priority: 'high' | 'medium' | 'low';
    alternativeOptions?: string[];
  }[];
  reasoning: string;
  costOptimization: {
    suggestedAdjustments: string[];
    potentialSavings: number;
  };
}

export class AIRecommendationEngine {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string, baseUrl: string = 'https://api.openai.com/v1') {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  async generateRecommendations(projectData: ProjectData): Promise<ToolRecommendation[]> {
    const prompt = this.buildRecommendationPrompt(projectData);
    
    try {
      const response = await this.callLLM(prompt);
      const llmResponse: LLMRecommendationResponse = JSON.parse(response);
      
      return this.convertLLMResponseToRecommendations(llmResponse, projectData);
    } catch (error) {
      console.error('LLM recommendation failed, falling back to rule-based:', error);
      return this.fallbackRecommendations(projectData);
    }
  }

  private buildRecommendationPrompt(projectData: ProjectData): string {
    return `
You are a construction equipment expert specializing in Hilti tools. Analyze this project and recommend the optimal tool selection.

PROJECT DETAILS:
- Name: ${projectData.projectName}
- Type: ${projectData.projectType}
- Location: ${projectData.location}
- Labor Count: ${projectData.laborCount}
- Timeline: ${projectData.timeline} months
- Budget: $${projectData.budget}
- Complexity: ${projectData.projectComplexity}
- Existing Tools: ${projectData.existingTools.join(', ')}
- Special Requirements: ${projectData.specialRequirements}

AVAILABLE HILTI TOOLS CATALOG:
${JSON.stringify(FULL_HILTI_CATALOG, null, 2)}

TASK:
1. Analyze the project requirements
2. Select the most appropriate tools from the catalog
3. Calculate optimal quantities based on team size and project complexity
4. Provide detailed justifications for each recommendation
5. Consider cost optimization and efficiency

RESPONSE FORMAT (JSON):
{
  "recommendations": [
    {
      "toolId": "string",
      "quantity": number,
      "justification": ["string"],
      "priority": "high|medium|low",
      "alternativeOptions": ["string"] // optional
    }
  ],
  "reasoning": "string - explain your overall approach",
  "costOptimization": {
    "suggestedAdjustments": ["string"],
    "potentialSavings": number
  }
}

CONSTRAINTS:
- Maximum 15 recommendations
- Prioritize tools that match project type and complexity
- Consider existing tools to avoid duplicates
- Balance cost vs productivity
- Ensure safety and compliance requirements
`;
  }

  private async callLLM(prompt: string): Promise<string> {
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo-preview', // or gpt-3.5-turbo for cost efficiency
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
        temperature: 0.3, // Lower temperature for more consistent results
        max_tokens: 4000
      })
    });

    if (!response.ok) {
      throw new Error(`LLM API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  private convertLLMResponseToRecommendations(
    llmResponse: LLMRecommendationResponse, 
    projectData: ProjectData
  ): ToolRecommendation[] {
    return llmResponse.recommendations.map(rec => {
      const tool = this.findToolById(rec.toolId);
      if (!tool) {
        throw new Error(`Tool not found: ${rec.toolId}`);
      }

      const monthlyCost = tool.pricing.monthlyRental * rec.quantity;
      const totalCost = monthlyCost * projectData.timeline;

      return {
        name: tool.name,
        model: tool.model,
        description: tool.specifications.description || tool.name,
        quantity: rec.quantity,
        monthlyCost,
        totalCost,
        rentalDuration: projectData.timeline,
        justification: rec.justification,
        category: tool.category,
        productUrl: tool.productUrl || '#',
        specifications: Object.entries(tool.specifications).map(([key, value]) => 
          `${key}: ${value}`
        )
      };
    });
  }

  private findToolById(toolId: string): any {
    // Search through the catalog to find tool by ID
    for (const category of Object.values(FULL_HILTI_CATALOG)) {
      const tool = category.find((t: any) => t.id === toolId);
      if (tool) return tool;
    }
    return null;
  }

  private fallbackRecommendations(projectData: ProjectData): ToolRecommendation[] {
    // Fallback to your existing rule-based system
    // Import and use your current generateRecommendations function
    return [];
  }
}

// Usage example:
export const createAIRecommendationEngine = (apiKey: string) => {
  return new AIRecommendationEngine(apiKey);
};
