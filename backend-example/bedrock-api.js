// Example Backend API for AWS Bedrock Integration
// This shows how to create a backend endpoint for Bedrock calls

const express = require('express');
const { BedrockRuntimeClient, ConverseCommand } = require('@aws-sdk/client-bedrock-runtime');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Bedrock client
const bedrockClient = new BedrockRuntimeClient({
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Bedrock API endpoint
app.post('/api/bedrock/recommendations', async (req, res) => {
  try {
    const { projectData, prompt, config } = req.body;

    // Create conversation with the user message
    const conversation = [
      {
        role: 'user',
        content: [{ text: prompt }]
      }
    ];

    // Create a command with the model ID, the message, and configuration
    const command = new ConverseCommand({
      modelId: 'anthropic.claude-3-sonnet-20240229-v1:0',
      messages: conversation,
      inferenceConfig: { 
        maxTokens: 4000, 
        temperature: 0.3,
        topP: 0.9
      }
    });

    // Send the command to the model and wait for the response
    const response = await bedrockClient.send(command);
    
    // Extract the response text
    const responseText = response.output.message.content[0].text;
    const recommendations = JSON.parse(responseText);

    res.json({
      success: true,
      recommendations: recommendations.recommendations,
      model: 'claude-3-sonnet',
      usage: responseBody.usage
    });

  } catch (error) {
    console.error('Bedrock API error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate recommendations',
      details: error.message
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', service: 'bedrock-api' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Bedrock API server running on port ${PORT}`);
  console.log(`📡 Endpoint: http://localhost:${PORT}/api/bedrock/recommendations`);
});

module.exports = app;
