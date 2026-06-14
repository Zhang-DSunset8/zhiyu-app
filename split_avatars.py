#!/usr/bin/env python3
"""
将 9 宫格表情头像原图切分为独立 PNG（透明背景）。

用法:
    python split_avatars.py [输入图片路径]

默认读取同目录下的 48e6645e13259647d1597152931fbd9d_720.jpg，
输出到 ./avatars/avatar_1.png … avatar_9.png

依赖:
    pip install pillow numpy opencv-python-headless
"""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

import cv2
import numpy as np
from PIL import Image

# 纯黑背景判定阈值（RGB 均 <= 此值视为背景）
BLACK_THRESHOLD = 30
# 连通域最小面积，过滤文字笔画等碎块
MIN_COMPONENT_AREA = 15_000
# 行聚类：相邻头像中心 Y 差超过此值则视为新一行
ROW_Y_GAP = 120
# 未检测到文字间隙时的默认裁剪比例（保留上方主体）
DEFAULT_CROP_RATIO = 0.82
# 输出目录
OUTPUT_DIR = Path("avatars")


def remove_black_background(image: Image.Image, threshold: int = BLACK_THRESHOLD) -> Image.Image:
    """将纯黑背景替换为透明，保留白色描边与内部颜色。"""
    rgba = image.convert("RGBA")
    arr = np.array(rgba)
    rgb = arr[:, :, :3]
    is_black = np.all(rgb <= threshold, axis=2)
    arr[is_black, 3] = 0
    return Image.fromarray(arr)


def find_foreground_boxes(fg_mask: np.ndarray) -> list[dict]:
    """通过连通域分析定位 9 个头像（含下方文字的整体区域）。"""
    fg = (~fg_mask).astype(np.uint8) * 255
    _, _, stats, centroids = cv2.connectedComponentsWithStats(fg, connectivity=8)

    boxes: list[dict] = []
    for i in range(1, stats.shape[0]):
        area = stats[i, cv2.CC_STAT_AREA]
        if area < MIN_COMPONENT_AREA:
            continue
        boxes.append(
            {
                "x": int(stats[i, cv2.CC_STAT_LEFT]),
                "y": int(stats[i, cv2.CC_STAT_TOP]),
                "w": int(stats[i, cv2.CC_STAT_WIDTH]),
                "h": int(stats[i, cv2.CC_STAT_HEIGHT]),
                "cx": float(centroids[i][0]),
                "cy": float(centroids[i][1]),
            }
        )

    if len(boxes) != 9:
        raise RuntimeError(f"期望找到 9 个头像区域，实际找到 {len(boxes)} 个，请检查原图或调参。")

    # 按行（Y）再按列（X）排序：从左到右、从上到下
    boxes.sort(key=lambda b: b["cy"])
    rows: list[list[dict]] = []
    for box in boxes:
        if not rows or abs(box["cy"] - rows[-1][0]["cy"]) > ROW_Y_GAP:
            rows.append([box])
        else:
            rows[-1].append(box)
    for row in rows:
        row.sort(key=lambda b: b["cx"])

    return [box for row in rows for box in row]


def find_avatar_bottom(fg_mask: np.ndarray, x: int, y: int, w: int, h: int) -> int:
    """
    在连通域内寻找头像主体下缘，尽量裁掉下方中文标签。
    策略：在下半区寻找前景密度骤降的“间隙行”，否则按固定比例裁剪。
    """
    sub = fg_mask[y : y + h, x : x + w]
    row_counts = (~sub).sum(axis=1)
    if h == 0:
        return y + h

    peak = int(row_counts.max())
    if peak == 0:
        return y + int(h * DEFAULT_CROP_RATIO)

    search_start = int(h * 0.55)
    search_end = int(h * 0.92)
    cut = h

    for r in range(search_start, search_end):
        if row_counts[r] < peak * 0.35:
            window = row_counts[r : min(r + 4, h)]
            if window.mean() < peak * 0.4:
                cut = r
                break

    if cut == h:
        cut = int(h * DEFAULT_CROP_RATIO)

    return y + cut


def crop_square_avatar(
    rgba: Image.Image,
    fg_mask: np.ndarray,
    box: dict,
    padding: int = 4,
) -> Image.Image:
    """从头像区域裁出正方形，居中并保留少量边距。"""
    x, y, w, h = box["x"], box["y"], box["w"], box["h"]
    bottom = find_avatar_bottom(fg_mask, x, y, w, h)
    content_h = max(1, bottom - y)
    side = max(w, content_h) + padding * 2

    cx = x + w // 2
    cy = y + content_h // 2
    img_w, img_h = rgba.size

    left = max(0, cx - side // 2)
    top = max(0, cy - side // 2)
    right = min(img_w, left + side)
    bottom_c = min(img_h, top + side)
    left = max(0, right - side)
    top = max(0, bottom_c - side)

    crop = rgba.crop((left, top, right, bottom_c))
    cw, ch = crop.size
    if cw != ch:
        side2 = max(cw, ch)
        square = Image.new("RGBA", (side2, side2), (0, 0, 0, 0))
        square.paste(crop, ((side2 - cw) // 2, (side2 - ch) // 2))
        crop = square

    return crop


def resolve_input_path(cli_path: str | None) -> Path:
    if cli_path:
        path = Path(cli_path)
        if not path.exists():
            raise FileNotFoundError(f"找不到输入文件: {path}")
        return path

    candidates = [
        Path("48e6645e13259647d1597152931fbd9d_720.jpg"),
        Path("48e6645e13259647d1597152931fbd9d_720.png"),
    ]
    for path in candidates:
        if path.exists():
            return path

    raise FileNotFoundError(
        "未找到默认原图。请将 48e6645e13259647d1597152931fbd9d_720.jpg 放在脚本同目录，"
        "或通过命令行传入路径: python split_avatars.py /path/to/image.jpg"
    )


def main() -> int:
    parser = argparse.ArgumentParser(description="切分 9 宫格表情头像为透明 PNG")
    parser.add_argument("input", nargs="?", help="输入图片路径（可选）")
    parser.add_argument("-o", "--output", default=str(OUTPUT_DIR), help="输出目录，默认 avatars/")
    args = parser.parse_args()

    input_path = resolve_input_path(args.input)
    output_dir = Path(args.output)
    output_dir.mkdir(parents=True, exist_ok=True)

    print(f"读取: {input_path}")
    source = Image.open(input_path)
    print(f"尺寸: {source.size[0]}×{source.size[1]}, 模式: {source.mode}")

    rgb = source.convert("RGB")
    fg_mask = np.all(np.array(rgb) <= BLACK_THRESHOLD, axis=2)
    boxes = find_foreground_boxes(fg_mask)
    rgba = remove_black_background(rgb)

    for index, box in enumerate(boxes, start=1):
        avatar = crop_square_avatar(rgba, fg_mask, box)
        out_path = output_dir / f"avatar_{index}.png"
        avatar.save(out_path, format="PNG", optimize=True)
        print(f"  ✓ {out_path} ({avatar.size[0]}×{avatar.size[1]})")

    print(f"\n完成！共导出 9 张头像到: {output_dir.resolve()}")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as exc:
        print(f"错误: {exc}", file=sys.stderr)
        raise SystemExit(1)
