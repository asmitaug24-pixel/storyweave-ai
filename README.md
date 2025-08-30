# StoryWeave AI - From Idea to Widget in Seconds

Turn any plain-English idea into a fully functional, interactive web widget instantly. No coding required.

## 🚀 Features

- **⚡ Instant Generation** - Idea → Live widget in under 30 seconds
- **🧠 AI-Powered Logic** - Complex interactions handled automatically
- **💬 Conversational Editing** - Just ask for changes, no coding needed
- **🎨 Beautiful UI** - Modern, responsive design with Tailwind CSS
- **📱 Ready to Use** - Export as React components or embed code

## 🏗️ Architecture

### Frontend (React + Tailwind CSS)
- **Landing Screen** - Warm greeting with example prompts
- **Widget Generator** - Large input area for plain-English descriptions
- **Live Preview** - Real-time widget preview with full functionality
- **Conversational Editor** - Chat-style interface for iterative changes
- **Export Options** - Download code or embed widgets

### Backend (FastAPI + Python)
- **AI Service** - Meta-prompting for widget generation
- **Cache Service** - Redis integration for performance
- **Database** - PostgreSQL for user projects and widget states
- **REST API** - Clean endpoints for frontend integration

### AI Core
- **Meta-Prompting** - Structured JSON output for consistent results
- **Conversational Editing** - Incremental updates based on natural language
- **Widget Logic** - Automatic handling of complex interactions

## 🛠️ Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- OpenAI API Key

### 1. Clone and Setup
```bash
git clone <repository-url>
cd storyweave-ai
```

### 2. Backend Setup
```bash
cd backend
pip install -r requirements.txt
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

### 4. Environment Configuration
```bash
# Backend
cp backend/env.example backend/.env
# Edit backend/.env and add your OpenAI API key

# Frontend
cp frontend/env.example frontend/.env
```

### 5. Start the Application

**Windows:**
```bash
# Option 1: Use the batch script
start.bat

# Option 2: Manual start
cd backend && python main.py
# In another terminal:
cd frontend && npm start
```

**macOS/Linux:**
```bash
# Option 1: Use the PowerShell script
pwsh start.ps1

# Option 2: Manual start
cd backend && python main.py
# In another terminal:
cd frontend && npm start
```

### 6. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## 🎯 Usage

### 1. Describe Your Idea
Enter a plain-English description of what you want to create:
- "Make me a quiz for my friends"
- "A BMI calculator"
- "A feedback form with branching logic"
- "A countdown timer"

### 2. Instant Generation
Watch your widget appear in under 30 seconds with full functionality.

### 3. Edit Naturally
Use conversational edits to modify your widget:
- "Make the button green"
- "Add one more question"
- "Change the title to 'My Awesome Quiz'"
- "Make it bigger"

### 4. Export & Use
Download the React component code or copy the embed code to use anywhere.

## 📝 Example Prompts

Try these examples to get started:

- **Quiz**: "Make me a quiz for my friends"
- **Calculator**: "A BMI calculator"
- **Form**: "A feedback form with branching logic"
- **Timer**: "A countdown timer"
- **Todo**: "A todo list with categories"
- **Survey**: "A survey with multiple choice questions"
- **Contact**: "A contact form"
- **Calculator**: "A simple calculator"

## 🔧 Configuration

### Environment Variables

**Backend (.env):**
```bash
# Required
OPENAI_API_KEY=your_openai_api_key_here

# Optional
DATABASE_URL=postgresql://user:pass@localhost/storyweave
REDIS_URL=redis://localhost:6379
HOST=0.0.0.0
PORT=8000
```

**Frontend (.env):**
```bash
REACT_APP_API_URL=http://localhost:8000
```

### Database Setup

**PostgreSQL (Production):**
```bash
createdb storyweave
python -c "from database.database import init_db; init_db()"
```

**SQLite (Development):**
```bash
# Database will be created automatically
```

## 🚀 Deployment

### Frontend (Vercel)
```bash
cd frontend
npm run build
vercel --prod
```

### Backend (Railway/Render)
```bash
# Set environment variables
# Deploy with Docker or direct deployment
```

### Docker Deployment
```bash
docker-compose up -d
```

## 📊 API Endpoints

- `POST /api/generate-widget` - Generate widget from prompt
- `POST /api/edit-widget` - Apply conversational edits
- `POST /api/export-widget` - Export widget code
- `GET /api/examples` - Get example prompts

## 🎨 Widget Types

- **Quiz** - Multiple choice questions with scoring
- **Calculator** - Input fields with calculation logic
- **Form** - Various input types with validation
- **Timer** - Countdown with start/stop controls
- **Todo** - Task management with categories
- **Survey** - Multi-question surveys
- **Contact** - Contact forms with validation

## 🔮 Future Enhancements

- [ ] User authentication and project saving
- [ ] Advanced widget templates
- [ ] Real-time collaboration
- [ ] Widget marketplace
- [ ] Advanced AI models integration
- [ ] Mobile app support
- [ ] Custom CSS styling
- [ ] Widget analytics

## 🛠️ Development

### Project Structure
```
storyweave-ai/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── requirements.txt     # Python dependencies
│   ├── database/           # Database models
│   └── models/             # Pydantic schemas
├── frontend/
│   ├── src/
│   │   ├── App.js          # Main React component
│   │   ├── components/     # React components
│   │   └── index.css       # Tailwind styles
│   ├── package.json        # Node.js dependencies
│   └── tailwind.config.js  # Tailwind configuration
├── docker-compose.yml      # Docker setup
├── start.ps1              # PowerShell startup script
├── start.bat              # Windows batch startup script
└── README.md              # This file
```

### Running Tests
```bash
# Backend tests
cd backend
python -m pytest

# Frontend tests
cd frontend
npm test
```

### Code Style
- **Backend**: Black, isort, flake8
- **Frontend**: ESLint, Prettier

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with React, FastAPI, and modern web technologies
- Inspired by the need for accessible web development tools
- Special thanks to the open-source community

## 🆘 Support

If you encounter any issues:

1. Check the [Issues](https://github.com/your-repo/storyweave-ai/issues) page
2. Create a new issue with detailed information
3. Join our community discussions

---

**StoryWeave AI** - Making web development accessible to everyone, one widget at a time. ✨

