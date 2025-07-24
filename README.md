# NoirVest - AI-Powered Investment Assistant

[![Python](https://img.shields.io/badge/python-3.9+-blue.svg)](https://www.python.org/downloads/)
[![Next.js](https://img.shields.io/badge/Next.js-13+-black.svg)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-green.svg)](https://fastapi.tiangolo.com/)

NoirVest is an intelligent investment platform that leverages AI to simplify and enhance your investment journey. Whether you're a seasoned investor or just getting started, NoirVest provides personalized investment recommendations, market analysis, and portfolio management tools powered by advanced AI agents.

I had the idea to build this because I recently earned some money and was like "I should invest this money", but I am lazy and didn't want to do research so I build this app instead.

## 🚀 Features

- **Personalized Portfolio Recommendations**: Receive tailored investment suggestions based on your risk profile and financial goals
- **Multi-Agent System**: Utilizes specialized AI agents for different aspects of investment management
- **Interactive Dashboards**: Visualize your portfolio performance and market trends with beautiful, interactive charts
- **Real-time Market Data**: Stay updated with the latest market information and price movements

## 🛠️ Tech Stack

### Frontend
- **Next.js 13+** - React framework for building the user interface
- **TypeScript** - Type-safe JavaScript for better developer experience
- **Radix UI** - Accessible, unstyled UI components
- **Tailwind CSS** - Utility-first CSS framework for styling
- **Chart.js** - Interactive data visualization
- **Next Themes** - For dark/light mode support

### Backend
- **Python 3.9+** - Core programming language
- **FastAPI** - Modern, fast web framework for building APIs
- **Google Cloud AI** - For advanced AI/ML capabilities
- **Google Gemini** - AI models for natural language understanding and generation
- **Google Cloud Services** - For storage, logging, and deployment
- **Uvicorn** - ASGI server for running FastAPI applications

### Infrastructure
- **Docker** - Containerization for consistent development and deployment
- **Google Cloud Platform** - Hosting and cloud services
- **Firebase** - Authentication and real-time database (if applicable)

## 🏗️ Project Structure

```
NoirVest/
├── backend/                  # Backend services
│   ├── investment_agent/     # AI investment agent implementation
│   │   ├── agent.py          # Main agent definitions
│   │   ├── helper_tool.py    # Helper functions and tools
│   │   └── instructions/     # Agent instructions and prompts
│   ├── main.py               # FastAPI application entry point
│   ├── requirements.txt      # Python dependencies
│   └── Dockerfile            # Container configuration
│
├── frontend/                 # Frontend application
│   ├── components/           # Reusable UI components
│   ├── pages/                # Next.js pages
│   ├── public/               # Static assets
│   ├── styles/               # Global styles
│   ├── package.json          # Frontend dependencies
│   └── next.config.js        # Next.js configuration
│
└── README.md                 # Project documentation (you are here)
```

## 🚀 Getting Started

### Prerequisites

- Python 3.9 or higher
- Node.js 18+ and npm/yarn
- Google Cloud SDK (for deployment)
- Docker (optional, for containerized development)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/NoirVest.git
   cd NoirVest
   ```

2. **Set up the backend**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: .\venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Set up the frontend**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Configure environment variables**

   Create `.env` files in both the backend and frontend directories with the required environment variables.

   **Frontend (`.env.local`):**
   ```env
   # Firebase Configuration
   NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   
   # API Configuration
   NEXT_PUBLIC_AGENT_API_URL=your_backend_api_url
   ```

   **Backend (`.env` in the backend directory):**
   ```env
   # Google Cloud & AI Configuration
   GOOGLE_GENAI_USE_VERTEXAI=false
   GOOGLE_API_KEY=your_google_api_key
   
   # Financial Data API
   FINANCIAL_PREP_API_KEY=your_financial_prep_api_key
   
   # Server Configuration
   PORT=8000
   DEBUG=true
   ```

   > **Note**: Replace all placeholder values with your actual configuration. Never commit the actual `.env` files to version control.

5. **Run the development servers**
   - Backend:
     ```bash
     cd backend
     uvicorn main:app --reload
     ```
   - Frontend:
     ```bash
     cd frontend
     npm run dev
     ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - API Docs: http://localhost:8000/docs

## 🤖 AI Agents Overview

NoirVest utilizes a multi-agent system where each agent specializes in a specific aspect of investment management:

1. **Planner Agent**: Develops the overall investment strategy
2. **Asset Selector**: Identifies promising investment opportunities
3. **Market Analyzer**: Analyzes market conditions and trends
4. **Portfolio Recommender**: Suggests optimal portfolio allocations
5. **Explainer Agent**: Provides clear explanations of investment concepts
6. **Graph Generator**: Creates visual representations of data and trends

## 🌟 Why NoirVest?

- **Democratizing Investment**: Makes sophisticated investment strategies accessible to everyone
- **Data-Driven Decisions**: Leverages real-time market data and AI analysis
- **Transparent**: Clear explanations for all recommendations
- **Customizable**: Adapts to your unique financial situation and goals
- **Secure**: Built with security best practices in mind

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with ❤️ using cutting-edge AI and web technologies
- Special thanks to the open-source community for their invaluable contributions

## 🤝 Contributing

Contributions are welcome! Please read our [contributing guidelines](CONTRIBUTING.md) to get started.

## 📧 Contact

For any inquiries or support, please contact [sparshj2003@gmail.com](mailto:sparshj2003@gmail.com).

---

<div align="center">
  Made with 💙 by Sparsh Jain
</div>
