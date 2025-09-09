# AWS Bedrock Backend API

This is an example backend API for integrating AWS Bedrock with your Hilti recommendations app.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd backend-example
npm install
```

### 2. Set Up AWS Credentials
Create a `.env` file:
```bash
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
PORT=3001
```

### 3. Run the Server
```bash
npm start
# or for development
npm run dev
```

### 4. Update Frontend
In your `bedrockClient.ts`, change the API endpoint:
```typescript
const response = await fetch('http://localhost:3001/api/bedrock/recommendations', {
  // ... rest of the code
});
```

## 🔧 Configuration

### AWS Bedrock Setup
1. Enable Bedrock in your AWS account
2. Request access to Claude 3 models
3. Set up IAM permissions for Bedrock access

### Environment Variables
- `AWS_ACCESS_KEY_ID`: Your AWS access key
- `AWS_SECRET_ACCESS_KEY`: Your AWS secret key
- `PORT`: Server port (default: 3001)

## 📡 API Endpoints

### POST `/api/bedrock/recommendations`
Generates tool recommendations using AWS Bedrock.

**Request Body:**
```json
{
  "projectData": {
    "projectName": "Downtown Office Complex",
    "projectType": "commercial",
    "location": "Chicago, IL",
    "laborCount": 25,
    "timeline": 18,
    "budget": 500000,
    "projectComplexity": "high",
    "existingTools": ["Hammer Drills", "Measuring Tools"],
    "specialRequirements": "High-rise construction"
  },
  "prompt": "Your prompt here...",
  "config": {
    "modelId": "anthropic.claude-3-sonnet-20240229-v1:0",
    "maxTokens": 4000,
    "temperature": 0.3
  }
}
```

**Response:**
```json
{
  "success": true,
  "recommendations": [
    {
      "name": "TE 60-ATC/AVR Rotary Hammer",
      "model": "TE 60-ATC/AVR",
      "description": "Heavy-duty rotary hammer...",
      "quantity": 3,
      "monthlyCost": 145,
      "totalCost": 2610,
      "rentalDuration": 18,
      "justification": ["...", "...", "...", "...", "..."],
      "specifications": ["...", "...", "...", "..."],
      "competitiveAdvantages": ["...", "...", "..."]
    }
  ],
  "model": "claude-3-sonnet",
  "usage": {
    "input_tokens": 1500,
    "output_tokens": 800
  }
}
```

### GET `/api/health`
Health check endpoint.

## 🛡️ Security

- Never expose AWS credentials in frontend code
- Use environment variables for sensitive data
- Implement proper CORS policies
- Add authentication/authorization as needed

## 🚀 Deployment

### AWS Lambda
```bash
# Package for Lambda
zip -r bedrock-api.zip . -x "node_modules/.cache/*"
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

### AWS ECS/Fargate
Use the Docker image above with AWS ECS for scalable deployment.

## 📊 Monitoring

- Add CloudWatch logging
- Monitor API response times
- Track Bedrock usage and costs
- Set up alerts for errors

## 🔄 Integration with Frontend

1. Update `bedrockClient.ts` to use your backend URL
2. Remove mock implementation
3. Add proper error handling
4. Test with real Bedrock calls

## 💡 Benefits

- ✅ **Secure**: AWS credentials stay on server
- ✅ **Scalable**: Can handle multiple concurrent requests
- ✅ **Cost Effective**: Pay only for what you use
- ✅ **Enterprise Ready**: Built-in AWS security and compliance
- ✅ **Flexible**: Easy to add more models or features
