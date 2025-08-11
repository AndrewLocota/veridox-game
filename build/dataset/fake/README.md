# Fake/Forged Documents Dataset

Place your fake/forged document images in this folder.

## File Naming Convention

- Use descriptive names like: `passport_fake_001.jpg`, `license_fake_001.png`, etc.
- Include the type of forgery if known: `passport_fake_photoshop_001.jpg`
- Supported formats: `.jpg`, `.jpeg`, `.png`, `.webp`

## Image Requirements

- Recommended size: 400x600 pixels (or similar aspect ratio)
- File size: Under 2MB for optimal loading
- Format: JPEG or PNG preferred

## Forgery Documentation

Each fake document should have corresponding metadata that includes:

- Type of forgery (digital manipulation, physical alteration, etc.)
- Specific areas that are forged
- Difficulty level for detection
- Educational notes about what makes it fake

## Adding New Images

1. Place image files in this folder
2. Update the dataset configuration in `src/data/documents.js`
3. Add detailed forgery information and annotations
