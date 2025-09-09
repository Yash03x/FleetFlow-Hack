```
You are a construction equipment expert specializing in Hilti tools and equipment. Analyze this construction project and recommend the optimal tool selection.

## PROJECT INPUT:
- **Project Name**: Downtown Office Complex
- **Project Type**: commercial
- **Project Location**: Chicago, IL
- **Number of Laborers**: 25
- **Timeline (months)**: 18
- **Budget Range ($)**: $500000
- **Project Complexity**: high
- **Existing Tools & Equipment**: Hammer Drills, Measuring Tools, Safety Equipment
- **Special Requirements or Notes**: High-rise construction, strict safety requirements, dust management needed

## AVAILABLE HILTI PRODUCTS:
**TE 2 Rotary hammer** (r3682)
- Category: Rotary hammers
- Description: Compact dual-mode, pistol-grip SDS Plus (TE-C) rotary hammer – for hammer drilling and rotary-only drilling
- URL: https://www.hilti.com/c/CLS_POWER_TOOLS_7125/CLS_ROTARY_HAMMERS_7125/r3682
- Technical Data: TE 2 Rotary hammer Compact dual-mode, pistol-grip SDS Plus (TE-C) rotary hammer – for hammer drilling and rotary-only drilling ### Categories: Home > Products > Power tools > Rotary hammers- - - ### FEATURES:Features Two-mode SDS Plus (TE-C) rotary hammer – for hammer drilling and rotary-only drilling Sturdy motor with high load rating for maximum reliability Quick-change TE-C Click chuck and user-friendly selector switch for high working convenience Electronic switch for precise drilling 360° side handle adjusts easily for preference or use in tight spaces Applications Daily hammer drilling in concrete, masonry and natural stone Ocassional drilling in steel, wood and plastics using optional chuck adaptor Driving screws using optional bit holder Reverse feature assists in the removal of stuck drill bits Drilling in solid metal Ø 3-13 mm / sheet metal up to Ø 20 mm ### TECHNICAL DATA: Weight according EPTA-Procedure 01/2003 without battery: 6 lb. Optimum Hammer drilling range: 5/32 - 15/32 in Single impact energy: 1.3 ft-lbs Technical Data | Weight according EPTA-Procedure 01/2003 without battery | 6 lb | Optimum Hammer drilling range | 5/32 - 15/32 in | Single impact energy | 1.3 ft-lbs | Working mode | Hammer drilling, Drilling | Hammer drilling diameter range | 5/32 - 7/8 in | Hammer drilling RPM | 1200 rpm | Full hammering frequency | 4600 impacts/minute | Functionality | Reverse mode, Depth gauge | Triaxial vibration value for hammer drilling into concrete (ah,HD) | 12.1 m/s² | 1 | A-weighted emission sound pressure level | 94 dB (A) | 2 | Dimensions (LxWxH) | 13.9 x 3.5 x 8 mm | According to the applicable product standard (see the Operating Instruction for more details) | According to the applicable product standard (see the Operating Instruction for more details) ### ITEMS- 3497789 - Rotary hammer perf pkg TE 2 - Package Size 1 pc Package Contents: - 1x TE 2 120V USA Rotary hammer - 1x TE 2 Tool case assy - 1x Hilti Grease 50ml - 1x Hammer drill bit TE-CX 3/8 x 6 - 1x Hammer drill bit TE-CX 1/4 x 6 - 1x Hammer drill bit TE-CX 3/16 x 6 - 6x Hammer drill bit TE-C 1/4-4 - 3952952 - TE 2 Performance Package - Package Size 1 pc Package Contents: - 1x TE 2 120V USA Rotary hammer - 1x TE 2 Tool case assy - 1x Hilti Grease 50ml - 1x TE-CX 3/16-6 Hammer drill bit - 1x TE-CX 1/4- 4 Hammer drill bit - 1x TE-CX 1/4-6 Hammer drill bit - 1x TE-CX 3/8-6 Hammer drill bit - 1x TE-CX(5) 1/2-6 Hammer drill bit - 1x TE-CX 5/16-6 Hammer drill bit

[Additional products would be included here from the full catalog]

## TASK:
Select the most appropriate tools for this commercial project with 25 workers over 18 months. This is a high-rise construction project with strict safety requirements and dust management needs.

## RESPONSE FORMAT (JSON):
{
  "executiveSummary": {
    "projectType": "commercial",
    "projectLocation": "Chicago, IL",
    "timeline": 18,
    "recommendation": "string - brief summary of recommendation approach",
    "productivityIncrease": "25%",
    "equipmentDowntimeReduction": "30%"
  },
  "recommendations": [
    {
      "name": "string - tool name",
      "model": "string - model number",
      "description": "string - brief description",
      "quantity": number,
      "rentalDuration": 18,
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
  ],
  "fleetContract": {
    "totalCost": number,
    "monthlyCost": number,
    "estimatedSavings": number,
    "duration": 18
  },
  "roiAnalysis": {
    "equipmentCostSavings": number,
    "productivityIncrease": number,
    "reducedDowntimeSavings": number,
    "totalROI": number
  }
}

## CONSTRAINTS:
- Maximum 10 tool recommendations
- Stay within $500000 budget
- Avoid duplicating existing tools: Hammer Drills, Measuring Tools, Safety Equipment
- Match complexity level: high
- Consider team size: 25 workers
- Address special requirements: High-rise construction, strict safety requirements, dust management needed
- Each tool must have exactly 4 specifications, 5 justifications, and 3 competitive advantages

## TOOL SELECTION CRITERIA:
For commercial construction with 25 workers over 18 months:
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
- Calculate ROI based on productivity gains and downtime reduction

Provide your analysis in valid JSON format that matches the structure above exactly.
```

## Expected Response Format

```json
{
  "executiveSummary": {
    "projectType": "commercial",
    "projectLocation": "Chicago, IL",
    "timeline": 18,
    "recommendation": "Comprehensive Hilti fleet solution optimized for high-rise commercial construction with 25-person team over 18 months",
    "productivityIncrease": "25%",
    "equipmentDowntimeReduction": "30%"
  },
  "recommendations": [
    {
      "name": "TE 2 Rotary hammer",
      "model": "r3682",
      "description": "Compact dual-mode, pistol-grip SDS Plus (TE-C) rotary hammer – for hammer drilling and rotary-only drilling",
      "quantity": 8,
      "rentalDuration": 18,
      "monthlyCost": 85,
      "totalCost": 1530,
      "productUrl": "https://www.hilti.com/c/CLS_POWER_TOOLS_7125/CLS_ROTARY_HAMMERS_7125/r3682",
      "specifications": [
        "Weight: 6 lb - suitable for overhead work in high-rise construction",
        "Impact energy: 1.3 ft-lbs - adequate for commercial concrete drilling",
        "Dual-mode operation: hammer drilling and rotary-only drilling",
        "1200 RPM with 4600 impacts/minute for efficient concrete work"
      ],
      "justification": [
        "Essential for anchor installation in high-rise construction",
        "Lightweight design reduces operator fatigue for 25-person team",
        "Dual-mode operation increases versatility and productivity",
        "Quick-change TE-C Click chuck for fast bit changes",
        "Electronic switch provides precise drilling control"
      ],
      "competitiveAdvantages": [
        "Industry-leading safety with anti-vibration technology",
        "40% higher productivity compared to standard drills",
        "Minimal downtime with reliable Hilti engineering"
      ]
    }
  ],
  "fleetContract": {
    "totalCost": 45000,
    "monthlyCost": 2500,
    "estimatedSavings": 120000,
    "duration": 18
  },
  "roiAnalysis": {
    "equipmentCostSavings": 120000,
    "productivityIncrease": 75000,
    "reducedDowntimeSavings": 40000,
    "totalROI": 235000
  }
}
```

## How to Use This in Your Current Setup

### 1. **Immediate Integration** (No code changes needed)

You can test this prompt right now by:

1. **Copy the prompt** from above
2. **Go to OpenAI Playground** (https://platform.openai.com/playground)
3. **Paste the prompt** and run it
4. **See the AI recommendations** in real-time

### 2. **Integration with Your App**

Add this to your `RecommendationReport.tsx`:

```typescript
const [useAI, setUseAI] = useState(false); // Start with false for testing
const [executiveSummary, setExecutiveSummary] = useState(null);
const [roiAnalysis, setRoiAnalysis] = useState(null);

const generateAIRecommendations = async () => {
  const prompt = `[PASTE THE FULL PROMPT HERE]`;
  
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo-preview',
        messages: [
          { role: 'system', content: 'You are a construction equipment expert. Always respond with valid JSON.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 4000
      })
    });

    const data = await response.json();
    const aiResponse = JSON.parse(data.choices[0].message.content);
    
    // Map AI response to your existing UI structure
    setRecommendations(aiResponse.recommendations);
    setFleetContract(aiResponse.fleetContract);
    setExecutiveSummary(aiResponse.executiveSummary);
    setRoiAnalysis(aiResponse.roiAnalysis);
  } catch (error) {
    console.error('AI recommendations failed:', error);
    // Fallback to existing system
  }
};
```

### 3. **Environment Setup**

Add to your `.env.local`:
```
REACT_APP_OPENAI_API_KEY=your_openai_api_key_here
```

### 4. **UI Toggle**

Add a toggle button in your form:
```typescript
<label className="flex items-center space-x-2 mb-4">
  <input
    type="checkbox"
    checked={useAI}
    onChange={(e) => setUseAI(e.target.checked)}
    className="text-red-600"
  />
  <span>Use AI-powered recommendations</span>
</label>
```

## Benefits of This Approach

✅ **Matches Your UI Exactly**: Output structure matches your existing RecommendationReport component  
✅ **No UI Changes Needed**: AI generates data in the exact format your UI expects  
✅ **Real Product Data**: Uses actual Hilti catalog structure  
✅ **Intelligent Selection**: AI understands project context and requirements  
✅ **Fallback Safe**: Can always use existing rule-based system  
✅ **Cost Effective**: Only calls LLM when needed  
✅ **Scalable**: Easy to add more products from the catalog  

## What You Get

The AI will generate output that maps directly to your existing UI sections:

- **Header**: Project Name, Number of Laborers, Timeline, Project Complexity
- **Executive Summary**: Project Type, Location, Timeline, Recommendation, Productivity Increase, Equipment Downtime Reduction
- **Recommended Tools**: Tool Type, Model, Quantity, Duration, Monthly Cost, Total Cost, View Product Link
- **Tool Details**: Key Specifications (4 points), Why This Tool (5 points), Competitive Advantages (3 points)
- **Fleet Contract**: Total Contract Value, Monthly Payment, Estimated Savings vs Purchase
- **ROI Analysis**: Equipment Cost Savings, Productivity Increase, Reduced Downtime Savings, Total ROI

## Next Steps

1. **Test the prompt** in OpenAI Playground
2. **Get an OpenAI API key** if you don't have one
3. **Add the integration code** to your RecommendationReport.tsx
4. **Extract more products** from the catalog for better recommendations
5. **Add pricing data** to make recommendations more accurate

This gives you a working AI-powered recommendation system that generates output in the exact format your UI expects!
