# Web Interface Mockup for Dysphagia Assessment Questionnaire

## Overall Layout

```
+-------------------------------------------------------+
|                                                       |
|  [Logo/Header] แบบประเมินภาวะกลืนลำบาก ของสถาบัน M    |
|                                                       |
+-------------------------------------------------------+
|                                                       |
|  [Progress Bar] Section X of Y                        |
|                                                       |
+-------------------------------------------------------+
|                                                       |
|  [Question Text in Thai]                              |
|                                                       |
|  [Read Aloud Button] 🔊                               |
|                                                       |
+-------------------------------------------------------+
|                                                       |
|  [Response Options]                                   |
|                                                       |
|  1     2     3     4     5                            |
|  ○     ○     ○     ○     ○                            |
|  เห็นด้วย  เห็นด้วย  ไม่มีความเห็น  ไม่เห็นด้วย  ไม่เห็นด้วย |
|  อย่างยิ่ง                             อย่างยิ่ง      |
|                                                       |
+-------------------------------------------------------+
|                                                       |
|  [Previous]                [Next]                     |
|                                                       |
+-------------------------------------------------------+
|                                                       |
|  [Save Progress]                                      |
|                                                       |
+-------------------------------------------------------+
```

## Key Components

### 1. Header Section
- Title in Thai: "แบบประเมินภาวะกลืนลำบาก ของสถาบัน M"
- Subtitle: "M.D. Anderson Dysphagia Inventory (MDADI)"
- Professional medical design with soft colors (light blue/green)

### 2. Navigation and Progress
- Progress bar showing current section/question
- Section labels clearly marked (Emotional, Functional, Physical, Global)
- Previous/Next buttons for navigation
- Save button to store progress for later review

### 3. Question Display
- Clear, large font for Thai text
- Read aloud button (🔊) next to each question
- Visual indication of current question

### 4. Response Selection
- Large, easy-to-click numbered buttons (1-5)
- Thai text labels under each number
- Visual feedback when option is selected
- Voice input capability (user can say number 1-5)

### 5. Results Page
- Automatically calculated scores for each section
- Visual representation of scores (charts/graphs)
- Interpretation of scores based on ranges
- Option to save/print results
- Clinical issues checklist

## Color Scheme
- Primary: #2C7BB6 (Professional blue)
- Secondary: #D7E4F5 (Light blue background)
- Accent: #16A085 (Teal for buttons/interactive elements)
- Text: #333333 (Dark gray for readability)
- Success: #27AE60 (Green for positive feedback)
- Warning: #F39C12 (Orange for alerts)

## Typography
- Primary Font: Sarabun (Thai-compatible font)
- Secondary Font: Roboto (for numbers and English text)
- Question Text: 18px
- Response Options: 16px
- Buttons: 16px bold

## Responsive Design
- Desktop: Full layout as shown above
- Tablet: Similar layout with adjusted proportions
- Mobile: Stacked layout with:
  - Question at top
  - Response options as vertical buttons
  - Navigation at bottom

## Special Features
1. **Read Aloud Functionality**
   - Thai text-to-speech for questions
   - Clear pronunciation of Thai text
   - Adjustable speed and volume

2. **Voice Input**
   - Microphone button to activate voice input
   - Recognition of Thai numbers 1-5
   - Visual feedback when voice is recognized

3. **Automatic Scoring**
   - Real-time calculation as questions are answered
   - Proper handling of reverse-scored items
   - Final score conversion to 20-100 scale

4. **Save & Resume**
   - Local storage for saving progress
   - Unique ID generation for retrieving saved sessions
   - Export option for clinical use

5. **Accessibility Features**
   - High contrast mode
   - Keyboard navigation
   - Screen reader compatibility
