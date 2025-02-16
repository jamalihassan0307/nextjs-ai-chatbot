<a href="https://chat.vercel.ai/">
  <img alt="Next.js 14 and App Router-ready AI chatbot." src="app/(chat)/opengraph-image.png">
  <h1 align="center">Next.js AI Chatbot</h1>
</a>

<p align="center">
  An Open-Source AI Chatbot Template Built With Next.js and the AI SDK by Vercel.
</p>

<p align="center">
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#model-providers"><strong>Model Providers</strong></a> ·
  <a href="#deploy-your-own"><strong>Deploy Your Own</strong></a> ·
  <a href="#running-locally"><strong>Running locally</strong></a>
</p>
<br/>

## Features

- [Next.js](https://nextjs.org) App Router
  - Advanced routing for seamless navigation and performance
  - React Server Components (RSCs) and Server Actions for server-side rendering and increased performance
- [AI SDK](https://sdk.vercel.ai/docs)
  - Unified API for generating text, structured objects, and tool calls with LLMs
  - Hooks for building dynamic chat and generative user interfaces
  - Supports OpenAI (default), Anthropic, Cohere, and other model providers
- [shadcn/ui](https://ui.shadcn.com)
  - Styling with [Tailwind CSS](https://tailwindcss.com)
  - Component primitives from [Radix UI](https://radix-ui.com) for accessibility and flexibility
- Data Persistence
  - [Vercel Postgres powered by Neon](https://vercel.com/storage/postgres) for saving chat history and user data
  - [Vercel Blob](https://vercel.com/storage/blob) for efficient file storage
- [NextAuth.js](https://github.com/nextauthjs/next-auth)
  - Simple and secure authentication

## Model Providers

This template ships with OpenAI `gpt-4o` as the default. However, with the [AI SDK](https://sdk.vercel.ai/docs), you can switch LLM providers to [OpenAI](https://openai.com), [Anthropic](https://anthropic.com), [Cohere](https://cohere.com/), and [many more](https://sdk.vercel.ai/providers/ai-sdk-providers) with just a few lines of code.

## Deploy Your Own

You can deploy your own version of the Next.js AI Chatbot to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fai-chatbot&env=AUTH_SECRET,OPENAI_API_KEY&envDescription=Learn%20more%20about%20how%20to%20get%20the%20API%20Keys%20for%20the%20application&envLink=https%3A%2F%2Fgithub.com%2Fvercel%2Fai-chatbot%2Fblob%2Fmain%2F.env.example&demo-title=AI%20Chatbot&demo-description=An%20Open-Source%20AI%20Chatbot%20Template%20Built%20With%20Next.js%20and%20the%20AI%20SDK%20by%20Vercel.&demo-url=https%3A%2F%2Fchat.vercel.ai&stores=[{%22type%22:%22postgres%22},{%22type%22:%22blob%22}])

## Running locally

You will need to use the environment variables [defined in `.env.example`](.env.example) to run Next.js AI Chatbot. It's recommended you use [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables) for this, but a `.env` file is all that is necessary.

> Note: You should not commit your `.env` file or it will expose secrets that will allow others to control access to your various OpenAI and authentication provider accounts.

1. Install Vercel CLI: `npm i -g vercel`
2. Link local instance with Vercel and GitHub accounts (creates `.vercel` directory): `vercel link`
3. Download your environment variables: `vercel env pull`

```bash
pnpm install
pnpm dev
```

Your app template should now be running on [localhost:3000](http://localhost:3000/).

<!-- <div align="center">
  <img src="screenshots/sdkai.png" alt="AI SDK Image Generator" width="800"/>
  <h1>AI SDK Image Generator</h1>
  <h3>A Modern AI Image Generation Platform</h3>
</div>

<p align="center">
    <a href="https://ai-sdk-image-generator.vercel.app" target="_blank">
        <img alt="" src="https://img.shields.io/badge/Website-EA4C89?style=normal&logo=vercel&logoColor=white" style="vertical-align:center" />
    </a>
    <a href="https://github.com/jamalihassan0307/ai-sdk-image-generator" target="_blank">
        <img alt="" src="https://img.shields.io/badge/GitHub-100000?style=normal&logo=github&logoColor=white" style="vertical-align:center" />
    </a>
</p>

# 📌 Overview

AI SDK Image Generator is a powerful web application that leverages multiple AI providers to generate images from text descriptions. Users can create unique images using different AI models and compare results across providers.

# 🛠️ Tech Stack

![Next.js](https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vercel AI SDK](https://img.shields.io/badge/Vercel%20AI%20SDK-000000?style=for-the-badge&logo=vercel&logoColor=white)

## 🔑 Key Features

### AI Model Integration

- Multiple AI providers (Replicate, Vertex AI, OpenAI, Fireworks)
- Simultaneous image generation across providers
- Model selection and customization

### User Interface

- Clean, modern design with shadcn/ui components
- Responsive layout for all devices
- Real-time generation progress indicators

### Image Generation

- Text-to-image generation
- Multiple style options
- Side-by-side provider comparison

## 📸 Screenshots & Workflow

### 1. Main Interface

<div align="center">
  <img src="screenshots/demo_image_generated.png" alt="Main Interface" width="800"/>
  <p>The main application interface showing generated penguin images across different AI providers</p>
</div>

### 2. Model Selection & Generation

#### Replicate Models

<div align="center">
  <img src="screenshots/replicate_model.png" alt="Replicate Models" width="800"/>
  <p>Stable Diffusion model options from Replicate</p>
</div>

#### Vertex AI Models

<div align="center">
  <img src="screenshots/vertex_aI_model.png.png" alt="Vertex AI Models" width="800"/>
  <p>Imagen model from Google Vertex AI</p>
</div>

#### OpenAI Models

<div align="center">
  <img src="screenshots/openAI_model.png" alt="OpenAI Models" width="800"/>
  <p>DALL-E 3 model from OpenAI</p>
</div>

#### Fireworks Models

<div align="center">
  <img src="screenshots/fireworks_models.png" alt="Fireworks Models" width="800"/>
  <p>Available models from Fireworks including flux-1-schnell-fp8</p>
</div>

### 3. Generated Results Example

<div align="center">
  <img src="screenshots/generated_images.png" alt="Generated Images" width="800"/>
  <p>Example of a cat in ukiyo-e style generated across different providers</p>
</div>

### 4. Loading States

<div align="center">
  <img src="screenshots/loading.png" alt="Loading State" width="800"/>
  <p>Generation progress indicators for each provider</p>
</div>

### 5. Error Handling

<div align="center">
  <img src="screenshots/image_generation_error.png" alt="Error Handling" width="800"/>
  <p>Error feedback when image generation fails</p>
</div>

## 🚀 Getting Started

1. Clone the repository:

```bash
git clone https://github.com/jamalihassan0307/ai-sdk-image-generator.git
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables in `.env.local`:

```env
OPENAI_API_KEY=your_openai_key
REPLICATE_API_TOKEN=your_replicate_token
FIREWORKS_API_KEY=your_fireworks_key
GOOGLE_CLIENT_EMAIL=your_google_email
GOOGLE_PRIVATE_KEY=your_google_key
GOOGLE_VERTEX_PROJECT=your_project_id
GOOGLE_VERTEX_LOCATION=your_location
```

4. Run the development server:

```bash
npm run dev
```

## 👨‍💻 Developer Contact

Feel free to reach out for questions or collaboration:

- GitHub: [@jamalihassan0307](https://github.com/jamalihassan0307)
- LinkedIn: [Jamali Hassan](https://www.linkedin.com/in/jamalihassan0307/)

## 🙏 Acknowledgments

Special thanks to:

- Vercel team for the AI SDK
- All AI provider partners (Replicate, OpenAI, Google, Fireworks)
- The open-source community -->
