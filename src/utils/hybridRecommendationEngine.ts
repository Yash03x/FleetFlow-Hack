import { ProjectData, ToolRecommendation, FleetContract } from '../types/ProjectData';
import { generateRecommendations as ruleBasedRecommendations } from './recommendationEngine';

interface LLMService {
  generateRecommendations(projectData: ProjectData): Promise<ToolRecommendation[]>;
}

class OpenAILLMService implements LLMService {
  constructor(private apiKey: string) {}

  async generateRecommendations(projectData: ProjectData): Promise<ToolRecommendation[]> {
    // Implementation similar to above
    // This would call OpenAI API with the full tool catalog
    throw new Error('Not implemented yet');
  }
}

class AnthropicLLMService implements LLMService {
  constructor(private apiKey: string) {}

  async generateRecommendations(projectData: ProjectData): Promise<ToolRecommendation[]> {
    // Implementation for Claude API
    throw new Error('Not implemented yet');
  }
}

export class HybridRecommendationEngine {
  private llmService: LLMService | null = null;
  private useLLM: boolean = true;

  constructor(llmService?: LLMService) {
    this.llmService = llmService || null;
  }

  async generateRecommendations(projectData: ProjectData): Promise<ToolRecommendation[]> {
    // Try LLM first, fallback to rule-based
    if (this.useLLM && this.llmService) {
      try {
        console.log('🤖 Using AI-powered recommendations...');
        const aiRecommendations = await this.llmService.generateRecommendations(projectData);
        
        // Validate and enhance AI recommendations with business logic
        return this.enhanceRecommendations(aiRecommendations, projectData);
      } catch (error) {
        console.warn('⚠️ AI recommendations failed, falling back to rule-based:', error);
        this.useLLM = false; // Temporarily disable LLM
      }
    }

    console.log('📊 Using rule-based recommendations...');
    return ruleBasedRecommendations(projectData);
  }

  private enhanceRecommendations(
    aiRecommendations: ToolRecommendation[], 
    projectData: ProjectData
  ): ToolRecommendation[] {
    // Apply business rules to AI recommendations
    return aiRecommendations
      .filter(rec => this.validateRecommendation(rec, projectData))
      .map(rec => this.applyBusinessRules(rec, projectData))
      .sort((a, b) => b.totalCost - a.totalCost)
      .slice(0, 15); // Limit to top 15
  }

  private validateRecommendation(rec: ToolRecommendation, projectData: ProjectData): boolean {
    // Validate AI recommendations against business rules
    if (rec.quantity <= 0) return false;
    if (rec.totalCost > projectData.budget * 0.3) return false; // Max 30% of budget
    return true;
  }

  private applyBusinessRules(rec: ToolRecommendation, projectData: ProjectData): ToolRecommendation {
    // Apply additional business logic
    const adjustedQuantity = Math.min(rec.quantity, Math.ceil(projectData.laborCount / 5));
    
    return {
      ...rec,
      quantity: adjustedQuantity,
      monthlyCost: rec.monthlyCost * (adjustedQuantity / rec.quantity),
      totalCost: rec.totalCost * (adjustedQuantity / rec.quantity)
    };
  }

  // Factory methods for different LLM providers
  static withOpenAI(apiKey: string): HybridRecommendationEngine {
    return new HybridRecommendationEngine(new OpenAILLMService(apiKey));
  }

  static withAnthropic(apiKey: string): HybridRecommendationEngine {
    return new HybridRecommendationEngine(new AnthropicLLMService(apiKey));
  }

  static ruleBasedOnly(): HybridRecommendationEngine {
    return new HybridRecommendationEngine();
  }
}
