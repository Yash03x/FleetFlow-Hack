# Environment Variables Setup

## AWS Bedrock Configuration

Create a `.env.local` file in your project root with the following variables:

```bash
# AWS Access Key ID
VITE_AWS_ACCESS_KEY_ID=your_aws_access_key_id_here

# AWS Secret Access Key  
VITE_AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key_here

# AWS Region (optional, defaults to us-east-1)
VITE_AWS_REGION=us-east-1
```

## How to Get AWS Credentials:

1. **Go to AWS Console** → IAM → Users
2. **Select your user** (or create a new one)
3. **Go to Security Credentials** tab
4. **Create Access Key** → Command Line Interface (CLI)
5. **Download the credentials** or copy them

## Required IAM Permissions:

Your AWS user needs the following permissions for Bedrock:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "bedrock:InvokeModel"
            ],
            "Resource": [
                "arn:aws:bedrock:us-east-1::foundation-model/anthropic.claude-3-sonnet-20240229-v1:0"
            ]
        }
    ]
}
```

## Security Notes:

- ✅ **Never commit** `.env.local` to version control
- ✅ **Use IAM roles** in production instead of access keys
- ✅ **Rotate credentials** regularly
- ✅ **Use least privilege** principle for permissions

## Testing Without Credentials:

If you don't have AWS credentials set up yet, the app will:
1. Show an error message when you try to use Bedrock
2. Automatically fall back to rule-based recommendations
3. Still work perfectly for testing the UI and flow
