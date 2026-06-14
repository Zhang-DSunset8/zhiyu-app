import type { FruitType } from '../types'

/** 果种配色 — 用于 SVG 插画，非 emoji */
export const FRUIT_PALETTE: Record<
  FruitType,
  { name: string; fruit: string; fruitLight: string; leaf: string; blossom?: string }
> = {
  apple: { name: '苹果', fruit: '#d96a5c', fruitLight: '#f0a098', leaf: '#6fa56a' },
  pear: { name: '梨', fruit: '#c8d96f', fruitLight: '#e4eca8', leaf: '#7aad62' },
  peach: { name: '桃', fruit: '#f4a88a', fruitLight: '#ffd4c4', leaf: '#6fa56a', blossom: '#f8c4d0' },
  orange: { name: '橘子', fruit: '#f0a030', fruitLight: '#ffd080', leaf: '#5f9a52' },
  strawberry: { name: '草莓', fruit: '#e8505b', fruitLight: '#ff8a92', leaf: '#6fa56a' },
  lemon: { name: '柠檬', fruit: '#f3d77c', fruitLight: '#fff0a8', leaf: '#7aad62' },
  cherry: { name: '樱桃', fruit: '#d64545', fruitLight: '#ff7a7a', leaf: '#6fa56a' },
}
