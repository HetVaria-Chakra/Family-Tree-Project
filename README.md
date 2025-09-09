# Family Tree Project

A simple, interactive web-based family tree application that allows you to build, visualize, and manage your family relationships.

## Features

- 🌳 **Interactive Family Tree Visualization**: Visual representation of family relationships across generations
- 👥 **Add Family Members**: Easy-to-use form to add new family members with details
- 💑 **Relationship Management**: Support for parent-child and spouse relationships
- 🎨 **Gender-Based Styling**: Different color schemes for male, female, and other gender identities
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile devices
- 💾 **Data Persistence**: Automatically saves your family tree data in browser localStorage
- 📤 **Export/Import**: Export your family tree as JSON or import existing data
- ✏️ **Member Management**: Edit and delete family members (basic version)

## How to Use

1. **Getting Started**: Open `index.html` in your web browser
2. **Add Your First Member**: Click "Add Family Member" to start building your tree
3. **Fill in Details**: 
   - Enter name (required)
   - Select birth date (optional)
   - Choose gender for color coding
   - Select parent to establish family relationships
   - Select spouse to show marriage relationships
4. **Build Your Tree**: Continue adding family members to create your complete family tree
5. **Manage Your Data**:
   - Your tree is automatically saved in your browser
   - Use "Export Data" to save a backup file
   - Use "Import Data" to restore from a backup

## File Structure

```
Family-Tree-Project/
├── index.html          # Main HTML structure
├── styles.css          # CSS styling and layout
├── script.js           # JavaScript functionality
└── README.md           # Project documentation
```

## Technical Details

- **Frontend**: Pure HTML5, CSS3, and JavaScript (ES6+)
- **Storage**: Browser localStorage for data persistence
- **Compatibility**: Modern browsers supporting ES6+
- **No Dependencies**: Self-contained application with no external libraries

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Installation

1. Clone or download this repository
2. Open `index.html` in your web browser
3. Start building your family tree!

No server setup or installation required - it's a pure client-side application.

## Data Format

The application stores data in JSON format with the following structure:

```json
{
  "familyTree": [
    ["member_id", {
      "id": "unique_id",
      "name": "Member Name",
      "birthDate": "YYYY-MM-DD",
      "gender": "male|female|other",
      "parentId": "parent_id_or_null",
      "spouseId": "spouse_id_or_null",
      "children": ["child_id_array"]
    }]
  ],
  "exportDate": "2024-01-01T00:00:00.000Z",
  "version": "1.0"
}
```

## Future Enhancements

- Advanced editing capabilities
- Photo support for family members
- Family tree printing
- Multiple family tree support
- Advanced relationship types (siblings, grandparents, etc.)
- Search and filter functionality
- Family statistics and reports

## Contributing

This is a simple educational project. Feel free to fork and enhance it with additional features!

## License

This project is open source and available under the MIT License.