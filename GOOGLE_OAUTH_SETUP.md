# Google OAuth Setup Instructions

## Environment Variables Required

Create a `.env.local` file in your project root and add:

```
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here
NEXT_PUBLIC_BACKEND_URL=https://hoe-be.onrender.com
```

## How to Get Google Client ID

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Choose "Web application"
6. Add your domain to "Authorized JavaScript origins":
   - `http://localhost:3000` (for development)
   - `https://yourdomain.com` (for production)
7. Copy the Client ID and add it to your `.env.local` file

## Backend Integration

The Google login component expects your backend to have an endpoint at:
`POST /api/auth/google-login`

The endpoint should:
1. Receive the Google credential token
2. Verify it with Google
3. Return user data and authentication token

Response format expected:
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "Full Name",
    "email": "user@example.com",
    "firstName": "First",
    "lastName": "Last",
    "phone": "phone_number",
    "avatar": "avatar_url",
    "addresses": [],
    "preferences": {
      "emailNotifications": true,
      "smsNotifications": false,
      "marketingEmails": false,
      "currency": "INR",
      "language": "en"
    },
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
}
```
