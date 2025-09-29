# 🎯 PR Quality Scoring System

## Overview

Our enhanced PR metrics system now includes comprehensive code quality analysis
that scores PRs from 1-10 based on multiple factors including **spelling, naming
conventions, and file naming standards**.

## 📊 Scoring Components

### 1. **Size Score** (10-2 points)

- **XS** (< 50 changes): 10 points - Quick review
- **S** (50-200 changes): 8 points - Easy review
- **M** (200-500 changes): 6 points - Moderate effort
- **L** (500-1000 changes): 4 points - Hard to review
- **XL** (> 1000 changes): 2 points - Consider splitting

### 2. **Quality Score** (10-1 points)

Comprehensive code analysis including:

#### 🅰️ **Spelling Errors** (-3 points per error)

Scans for common misspellings in code and comments:

- `recieve` → `receive`
- `seperate` → `separate`
- `definately` → `definitely`
- `lenght` → `length`
- `sucessful` → `successful`
- And 25+ more common programming typos

#### 📝 **Naming Convention Violations** (-2 points)

- **JavaScript/TypeScript Variables**: Should use `camelCase`
  - ❌ `user_name` (snake_case)
  - ✅ `userName` (camelCase)
- **Functions**: Should use `camelCase`
  - ❌ `get_user_data()`
  - ✅ `getUserData()`
- **Constants**: Can use `SCREAMING_SNAKE_CASE`
  - ✅ `const API_BASE_URL = 'https://api.example.com'`
- **Consistency**: Mixing camelCase and snake_case in same file

#### 📁 **File Naming Issues** (-2 points per issue)

- **React Components**: Should use `PascalCase`
  - ❌ `userProfile.jsx`
  - ✅ `UserProfile.jsx`
- **Regular JS/TS Files**: Should use `camelCase` or `kebab-case`
  - ✅ `userService.js`
  - ✅ `user-service.js`
  - ❌ `UserService.js` (for non-components)
- **CSS Files**: Should use `kebab-case`
  - ✅ `user-profile.css`
  - ❌ `userProfile.css`
- **No Spaces**: Files should not contain spaces
  - ❌ `user profile.js`
  - ✅ `user-profile.js`

#### 📊 **Other Code Issues** (-1 point each)

- **Unused Variables**: Variables declared but not used
- **Duplicate Code Patterns**: Repeated if/for/while structures
- **Long Functions**: Functions over 50 lines
- **TODO/FIXME Comments**: Unfinished work indicators
- **Missing Empty Lines**: Functions without proper spacing

### 3. **Commit Score** (10-3 points)

- **1-5 commits**: 10 points - Focused changes
- **6-10 commits**: 6 points - Consider squashing
- **>10 commits**: 3 points - Too many commits

### 4. **File Score** (10-3 points)

- **1-10 files**: 10 points - Focused changes
- **11-20 files**: 6 points - Moderate scope
- **>20 files**: 3 points - Large scope

### 5. **Freshness Score** (10-4 points)

- **< 24 hours**: 10 points - Fast turnaround
- **24-48 hours**: 7 points - Good timing
- **> 48 hours**: 4 points - Consider smaller PRs

## 🏆 Final Score Ranges

### 🎆 **9-10 Points: EXCELLENT**

- Perfect or near-perfect PR
- Small size, high quality code
- Proper naming conventions
- No spelling errors
- Fast review cycle

### 🚀 **7-8 Points: GREAT**

- Very good PR with minor issues
- Good size and code quality
- Maybe 1-2 small violations
- Reasonable review time

### 💪 **5-6 Points: GOOD**

- Solid PR with room for improvement
- Acceptable size but some quality issues
- Several naming or spelling violations
- Could be better organized

### ⚠️ **3-4 Points: NEEDS WORK**

- Multiple issues to address
- Large size or many quality problems
- Significant naming convention issues
- Poor code organization

### 🔴 **1-2 Points: POOR**

- Major improvements needed
- Very large PR or serious quality issues
- Many spelling/naming violations
- Likely needs to be broken up
- **🖕 Triggers "shame image"** - motivational reminder to improve

## 🖕 "Shame Image" Feature

When a PR scores **5 or below**, the system automatically posts an additional
comment with:

- 🖼️ **Visual reminder** from `/docs/5fingers.jpeg`
- 🎯 **Specific improvement tips** based on detected issues
- 💪 **Motivational message** to encourage better practices

This feature serves as:

- **Immediate feedback** on code quality issues
- **Learning opportunity** with specific suggestions
- **Team culture** builder - everyone gets better together
- **Visual motivation** to maintain high standards

_Remember: This is meant to be motivational, not punitive! 🚀_

## 🎯 How to Improve Your Score

### ✅ **Quick Wins**

1. **Use spell check** in your editor for comments and strings
2. **Follow naming conventions**:
   - camelCase for JS/TS variables and functions
   - PascalCase for React components
   - kebab-case for CSS files
3. **Keep PRs small** - aim for < 200 changes
4. **Review your code** before submitting
5. **Clean up TODOs** and unused variables

### 🛠️ **Editor Setup**

Configure your editor to help catch issues:

#### VS Code Extensions:

```json
{
  "recommendations": [
    "streetsidesoftware.code-spell-checker",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-eslint"
  ]
}
```

#### ESLint Rules:

```json
{
  "rules": {
    "camelcase": "error",
    "no-unused-vars": "error",
    "@typescript-eslint/naming-convention": [
      "error",
      {
        "selector": "variable",
        "format": ["camelCase", "UPPER_CASE"]
      }
    ]
  }
}
```

## 📈 Team Goals

### Monthly Targets

- **Average PR Score**: > 7.0
- **Spelling Errors**: 0 per PR
- **Naming Violations**: < 2 per PR
- **PR Size**: 80% of PRs should be S or XS

### Recognition

- **Perfect 10s**: Celebrated in team standup
- **Most Improved**: Monthly recognition
- **Quality Champion**: Quarterly award for highest average score

## 🔍 Example Quality Issues

### Spelling Errors

```javascript
// ❌ Bad
const sucessfulResponse = true;
const userRecievedData = false;

// ✅ Good
const successfulResponse = true;
const userReceivedData = false;
```

### Naming Violations

```javascript
// ❌ Bad (snake_case in JS)
const user_name = "john";
const get_user_data = () => {};

// ✅ Good (camelCase)
const userName = "john";
const getUserData = () => {};
```

### File Naming

```
❌ Bad:
- UserProfile.js (should be component or camelCase)
- user profile.css (has spaces)
- MyButton.css (should be kebab-case)

✅ Good:
- UserProfile.jsx (React component)
- userProfile.js (regular JS file)
- user-profile.css (CSS file)
- my-button.scss (SCSS file)
```

---

**Remember**: These metrics are meant to help improve code quality and
maintainability, not to punish developers. Use them as learning tools to write
better, more consistent code! 🚀
