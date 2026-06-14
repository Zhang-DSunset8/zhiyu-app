import type { FruitType } from '../../types'

export interface FruitPalette {
  name: string
  fruit: string
  fruitLight: string
  fruitDark: string
  leaf: string
  leafDark: string
}

export const FRUIT_PALETTE: Record<FruitType, FruitPalette> = {
  apple: { name: '苹果', fruit: '#e07068', fruitLight: '#f4a8a2', fruitDark: '#c45a52', leaf: '#8fbc8f', leafDark: '#6fa56a' },
  pear: { name: '梨', fruit: '#d4c96a', fruitLight: '#ebe4a0', fruitDark: '#b8ad4a', leaf: '#9fc79a', leafDark: '#7aad75' },
  peach: { name: '桃', fruit: '#f4a88a', fruitLight: '#ffd4c4', fruitDark: '#e08870', leaf: '#a8d4a0', leafDark: '#7cb87c' },
  orange: { name: '橘子', fruit: '#f0a84a', fruitLight: '#ffd090', fruitDark: '#d89030', leaf: '#8fc48a', leafDark: '#6aaa65' },
  strawberry: { name: '草莓', fruit: '#e85868', fruitLight: '#ff98a8', fruitDark: '#c84050', leaf: '#7ec87e', leafDark: '#5aaa5a' },
  lemon: { name: '柠檬', fruit: '#f3d77c', fruitLight: '#fff0b0', fruitDark: '#d4b850', leaf: '#9fd49a', leafDark: '#78b872' },
  cherry: { name: '樱桃', fruit: '#d84858', fruitLight: '#f07888', fruitDark: '#b03040', leaf: '#88c088', leafDark: '#68a868' },
}
