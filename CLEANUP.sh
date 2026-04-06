#!/bin/bash

echo "🧹 Cleaning up duplicate folders..."

# Backup old folders (just in case)
echo "📦 Creating backups..."
mv client client.backup 2>/dev/null && echo "  ✓ Backed up client/ → client.backup/"
mv server server.backup 2>/dev/null && echo "  ✓ Backed up server/ → server.backup/"

# Clean up old node_modules if they competed
rm -rf client.backup/node_modules 2>/dev/null
rm -rf server.backup/node_modules 2>/dev/null

echo ""
echo "✅ Cleanup complete!"
echo ""
echo "📂 New structure:"
ls -la | grep -E "^d.*frontend|^d.*backend|^d.*shared|^d.*docs"
