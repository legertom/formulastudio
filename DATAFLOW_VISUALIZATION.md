# Data Flow Visualization - Implementation Summary

## Overview

I've implemented a new **Data Flow Visualization** mode for the Explorer view that addresses the visualization challenges you were experiencing. This new mode provides a clear, three-panel layout that shows:

1. **📥 Input Data** - Which fields were accessed from test data
2. **⚙️ Operations** - Step-by-step transformations
3. **📤 Output** - Final result with formula classification

## The Problem We Solved

The Explorer visualizer was struggling because:
- It tried to be too general-purpose without a clear "story"
- The OU and Group visualizers work well because they have specific purposes
- Explorer examples use different data shapes than the main sampledata.json
- There was no clear way to see **how data flows through the formula**

## New Architecture

### Components Created

1. **`InputFieldsPanel.jsx`** (`src/features/visualizer/components/InputFieldsPanel.jsx`)
   - Shows all fields accessed by the formula
   - ✓ Green checkmarks for fields that exist in test data
   - ✗ Red X marks for missing fields with error messages
   - Displays actual values from test data

2. **`TransformationPipeline.jsx`** (`src/features/visualizer/components/TransformationPipeline.jsx`)
   - Shows step-by-step operations
   - Color-coded by operation type:
     - 🟣 Purple: Control flow (if, switch, forEach)
     - 🟠 Orange: Logic operations (and, or, equals, greater, etc.)
     - 🟢 Green: String operations (concat, upper, lower, etc.)
     - 🔵 Blue: Math operations (add, length, etc.)
   - Shows inputs and outputs for each step
   - Flow arrows between steps

3. **`OutputPanel.jsx`** (`src/features/visualizer/components/OutputPanel.jsx`)
   - Displays final result with formatting
   - Shows formula type classification (e.g., "String Transformer", "Decision Logic")
   - Handles error states gracefully
   - Shows type information and metadata

4. **`dataFlowAnalysis.js`** (`src/features/visualizer/logic/dataFlowAnalysis.js`)
   - **`extractFieldAccesses()`** - Finds all Identifiers in AST and resolves them
   - **`buildTransformationPipeline()`** - Creates step-by-step operation list
   - **`classifyFormula()`** - Detects formula archetype:
     - Classifier/Validator (decision logic)
     - Transformer (string operations)
     - Boolean Checker (complex conditions)
     - Generic
   - **`formatValue()`** - Pretty-prints values for display

### Updated Components

**`ExplorerView.jsx`** - Now supports two view modes:
- **📊 Data Flow** (new default) - Shows the 3-panel data flow visualization
- **🌳 Tree View** - Original BlockNode tree visualization

Users can toggle between modes with buttons at the top.

## How Each Explorer Example Works

### Example Breakdown by Archetype

#### 1. String Transformers
- **explorer_02 (ID Generator)**: `{{ toLower concat substr name.first 0 1 name.last }}`
  - Input: `name.first`, `name.last`
  - Operations: substr → concat → toLower
  - Output: `"msantos"`

- **explorer_05 (Cleanup)**: `{{ trimLeft toUpper name.first }}`
  - Input: `name.first`
  - Operations: toUpper → trimLeft
  - Output: `"MARIA"`

#### 2. Classifiers/Validators
- **explorer_01 (Math Budget)**: `{{ if greater length name.first 5 "Long Name" "Short Name" }}`
  - Input: `name.first`
  - Operations: length → greater → if
  - Output: `"Short Name"` (Maria = 5 chars, not > 5)

- **explorer_03 (Spam Check)**: `{{ if contains email "@school.edu" "School Email" "Personal Email" }}`
  - Input: `email`
  - Operations: contains → if
  - Output: `"Personal Email"`

#### 3. Boolean Checkers
- **explorer_07 (Age Gate)**: `{{ if and geq age "18" equals country "US" "Eligible" "Not Eligible" }}`
  - Input: `age` ❌, `country` ❌
  - Shows missing field errors
  - Cannot evaluate without data

- **explorer_10 (Complex Auth)**: Multi-condition permission logic
  - Shows complex nested boolean operations
  - Demonstrates AND/OR gate visualization

## Features

### Automatic Formula Classification

The system automatically detects what type of formula you're working with:

- **🔀 Decision Logic** - Conditional branching with logic ops
- **✓ Validator** - Checks conditions
- **⚙️ String Transformer** - String manipulation pipeline
- **🧮 Boolean Logic** - Complex multi-condition evaluation
- **📝 Generic Formula** - Fallback for other types

### Missing Field Handling

When test data is missing required fields (like `age`, `country` in explorer_07), the visualizer:
- Shows red ✗ marks in the Input panel
- Displays helpful error messages
- Still attempts to show the operations that would run
- Shows evaluation error in Output panel

### Live Updates

All three panels update in real-time when you:
- Change the formula
- Edit test data in the JSON editor
- Switch between examples

### Visual Hierarchy

- Color-coded operations by category
- Clear flow indicators (arrows, numbering)
- Consistent spacing and typography
- Collapsible test data panel

## Usage

1. Navigate to the main editor page
2. Click **"EXPLORER"** mode at the top
3. Load an explorer example (e.g., `explorer_02_id_generator`)
4. You'll see the Data Flow view by default showing:
   - Input fields used
   - Operations performed
   - Final output
5. Toggle to **🌳 Tree View** to see the traditional AST visualization
6. Edit test data to see live updates

## Data Shape Considerations

The explorer examples expect a **flatter data structure** than the main sampledata.json:

**Main sampledata.json** (role-based sections):
```json
{
  "name": {...},
  "student": {...},
  "teacher": {...},
  "staff": {...}
}
```

**Explorer examples expect** (flatter):
```json
{
  "name": {...},
  "email": "...",
  "age": "...",
  "grade": "...",
  "title": "..."
}
```

The visualizer handles both structures and clearly shows when fields are missing.

## Technical Implementation

### Field Access Detection

```javascript
extractFieldAccesses(ast, testData, traceMap)
```

- Traverses AST to find all `Identifier` nodes
- Resolves dot-notation paths (e.g., `student.grade`)
- Supports array indexing (e.g., `schools[0].name`)
- Uses trace map to determine if field was actually accessed
- Handles missing fields gracefully with error messages

### Pipeline Building

```javascript
buildTransformationPipeline(ast, traceMap)
```

- Walks AST depth-first
- Creates a linear sequence of operations
- Captures inputs and outputs from trace data
- Filters to show only executed steps (important for IF branches)

### Formula Classification

```javascript
classifyFormula(ast)
```

- Analyzes AST structure
- Detects function types (control, logic, string, math)
- Returns archetype with icon and description
- Used to provide context in Output panel

## Files Changed/Created

### New Files
- `src/features/visualizer/components/InputFieldsPanel.jsx`
- `src/features/visualizer/components/TransformationPipeline.jsx`
- `src/features/visualizer/components/OutputPanel.jsx`
- `src/features/visualizer/logic/dataFlowAnalysis.js`
- `test-dataflow.html` (testing guide)

### Modified Files
- `src/features/visualizer/components/ExplorerView.jsx` (added view toggle and new panels)

### Unchanged
- Original BlockNode tree visualization still available via Tree View toggle
- OU Logic and Group Logic visualizers unchanged
- All other functionality preserved

## Benefits

1. **Clearer Mental Model** - Users immediately understand: Input → Transform → Output
2. **Better Debugging** - See exactly which fields are accessed and missing
3. **Educational** - Shows step-by-step how formulas work
4. **Flexible** - Toggle between flow and tree views as needed
5. **Error Friendly** - Missing fields clearly marked with helpful messages
6. **Live Feedback** - Updates instantly as you edit

## Next Steps (Optional Enhancements)

1. **Multiple Test Cases** - Allow defining several test scenarios side-by-side
2. **Field Highlighting** - Click a field in Input panel to highlight where it's used
3. **Operation Expansion** - Click an operation to see its sub-steps in detail
4. **Export/Share** - Generate shareable links or images of visualizations
5. **Performance Metrics** - Show operation timings for optimization
6. **Validation Rules** - Add warnings for common patterns (unused fields, etc.)

## Testing

The dev server is running at http://localhost:5174

Try these test cases:
1. Load `explorer_02_id_generator` - See string transformation pipeline
2. Load `explorer_07_age_gate` - See missing field handling
3. Load `explorer_01_math_budget` - See decision logic
4. Toggle between Data Flow and Tree View modes
5. Edit test data and watch live updates

All explorer examples should now have clear, understandable visualizations!
