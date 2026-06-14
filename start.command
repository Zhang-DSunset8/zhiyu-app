#!/bin/bash
cd "$(dirname "$0")"

if [ ! -d "node_modules" ]; then
  echo "首次运行，正在安装依赖…"
  npm install
fi

echo ""
echo "🌳 情绪果园 开发服务器启动中…"
echo "   浏览器打开: http://localhost:5173/"
echo "   从头预览:   http://localhost:5173/?reset=1"
echo "   按 Ctrl+C 可停止"
echo ""

npm run dev
