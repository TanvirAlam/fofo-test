#!/bin/bash

echo "🚀 Setting up PR Productivity Metrics"

# Navigate to project root
cd "$(dirname "$0")"

echo "📁 Current directory: $(pwd)"

# Check if we have the workflows
if [ ! -f ".github/workflows/simple-pr-metrics.yml" ]; then
    echo "❌ simple-pr-metrics.yml not found!"
    exit 1
fi

echo "✅ Workflow files found"

# Add files to git
echo "📦 Adding files to git..."
git add .github/workflows/simple-pr-metrics.yml
git add docs/
git add setup-metrics.sh

# Check if there are changes to commit
if [ -n "$(git status --porcelain)" ]; then
    echo "📝 Committing changes..."
    git commit -m "🚀 Add simplified PR productivity metrics workflow

- Uses GitHub event context instead of CLI (fixes permissions issue)
- Provides real-time PR analysis on every push
- Calculates PR size, lead time, and complexity
- Posts helpful comments with recommendations
- Tracks metrics for team dashboard

Fixes: Resource not accessible by integration error"

    echo "⬆️  Pushing to remote..."
    git push

    echo "✅ Setup complete!"
    echo ""
    echo "🎯 Next steps:"
    echo "1. Create a test PR to see the metrics in action"
    echo "2. Push changes to see real-time updates"
    echo "3. Merge a PR to see completion metrics"
    echo ""
    echo "📊 The workflow will now run on every PR push and provide:"
    echo "   - PR size analysis (XS/S/M/L/XL)"
    echo "   - Lead time tracking"
    echo "   - Best practice recommendations"
    echo "   - Performance assessments"
    echo ""
    echo "🔗 Check your next PR for automated metrics comments!"

else
    echo "ℹ️  No changes to commit"
fi

echo ""
echo "🔧 To test the workflow:"
echo "   1. Create a new branch: git checkout -b test-metrics"
echo "   2. Make a small change: echo '# Test' >> README.md"
echo "   3. Commit and push: git add . && git commit -m 'test' && git push -u origin test-metrics"
echo "   4. Open a PR and watch the magic happen! ✨"