# Dataset Setup Guide

## 📁 Folder Structure

```
public/dataset/
├── real/           # Authentic documents
├── fake/           # Forged/fake documents
├── SETUP_GUIDE.md  # This file
└── metadata.json   # Optional: Additional metadata
```

## 🚀 Quick Setup

### 1. Add Your Images

- Place real documents in `public/dataset/real/`
- Place fake documents in `public/dataset/fake/`
- Use descriptive filenames (e.g., `passport_real_001.jpg`)

### 2. Update Configuration

Edit `src/data/documents.js` to include your images:

```javascript
{
  id: 5,
  image: "/dataset/real/your_image.jpg",  // Update this path
  isReal: true,
  type: "Your Document Type",
  category: "passport", // passport, license, certificate, etc.
  difficulty: "medium", // easy, medium, hard, expert
  description: "Description of the document",
  educationalNotes: {
    whenWrong: "Educational message when user gets it wrong",
    keyIndicators: "What to look for in this type of document"
  }
}
```

### 3. For Fake Documents, Add Forgery Details

```javascript
{
  id: 6,
  image: "/dataset/fake/your_fake_image.jpg",
  isReal: false,
  type: "Forged Document Type",
  forgeryType: "digital_manipulation", // or "complete_fabrication"
  forgeryDetails: {
    alterations: ["What was changed"],
    techniques: ["How it was forged"],
    detectionClues: ["How to spot it's fake"]
  },
  educationalNotes: {
    whenWrong: "This is actually FAKE! Look for...",
    keyIndicators: "Key signs this document is forged"
  }
}
```

## 📋 Document Categories

- `passport` - Passports and travel documents
- `license` - Driver's licenses and permits
- `certificate` - Certificates and diplomas
- `id_card` - Government ID cards
- `contract` - Legal contracts and agreements
- `diploma` - Educational certificates

## 🎯 Difficulty Levels

- `easy` - Obvious forgeries, clear indicators
- `medium` - Moderate difficulty, some skill required
- `hard` - Subtle forgeries, expert eye needed
- `expert` - Very sophisticated forgeries

## 🔧 Image Requirements

- **Size**: 400x600 pixels recommended
- **Format**: JPG, PNG, or WebP
- **File size**: Under 2MB for optimal loading
- **Quality**: High enough to see details when zoomed

## 📊 Analytics Features

The system automatically tracks:

- Wrong answers for educational purposes
- User mistake patterns by category/difficulty
- Learning progress over time

## 🎓 Educational Features

- Automatic feedback when users make mistakes
- Detailed explanations of forgery techniques
- Security feature education for real documents
- Personalized learning based on mistake patterns
