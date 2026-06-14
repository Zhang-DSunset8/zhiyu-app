import type { MeditationCourse, MeditationSeries, Topic, Achievement } from '../types'

export const MEDITATION_CATEGORIES = ['全部', '助眠', '减压', '成长', '情绪调节']

export const MEDITATION_COURSES: MeditationCourse[] = [
  {
    id: 'deep-breath',
    title: '深呼吸放松',
    duration: 5,
    description: '感受清凉的空气进入身体，释放紧张',
    category: '减压',
    breatheIn: 4,
    breatheOut: 6,
    sceneGradient: 'linear-gradient(180deg, #87CEEB 0%, #E0F4FF 50%, #B0D4E8 100%)',
    sceneIcon: '☁️',
    themeColor: '#3b82f6',
    recommendedSounds: ['ocean', 'rain'],
    guideTexts: [
      '吸气……感受清凉的空气……',
      '呼气……释放身体的紧张……',
      '让肩膀自然下沉……',
      '感受呼吸的节奏……',
      '你正在安全地休息……',
      '每一次呼气都带走一点压力……',
    ],
  },
  {
    id: 'focus-now',
    title: '专注当下',
    duration: 8,
    description: '注意你此刻的呼吸， gently 带回注意力',
    category: '成长',
    breatheIn: 3,
    breatheOut: 5,
    sceneGradient: 'linear-gradient(180deg, #2d5016 0%, #4a7c23 40%, #8fbc8f 100%)',
    sceneIcon: '🍃',
    themeColor: '#16a34a',
    recommendedSounds: ['forest', 'ocean'],
    guideTexts: [
      '注意你此刻的呼吸……',
      '如果走神了，轻轻带回来……',
      '感受树叶轻轻飘落……',
      '你只属于这个当下……',
      '不需要改变什么……',
      '只是观察，只是存在……',
    ],
  },
  {
    id: 'body-scan',
    title: '睡前身体扫描',
    duration: 10,
    description: '从脚趾到头顶，逐一放松每个部位',
    category: '助眠',
    breatheIn: 4,
    breatheOut: 8,
    sceneGradient: 'linear-gradient(180deg, #0f172a 0%, #1e3a5f 50%, #312e81 100%)',
    sceneIcon: '✨',
    themeColor: '#6366f1',
    recommendedSounds: ['rain', 'whitenoise'],
    guideTexts: [
      '将注意力带到你的脚趾……',
      '让它们完全放松……',
      '感受小腿的重量……',
      '肩膀自然下沉……',
      '额头变得 smooth……',
      '你正在沉入安全的休息……',
    ],
  },
  {
    id: 'emotion-hold',
    title: '情绪安放',
    duration: 6,
    description: '接纳此刻的感受，像对待一个朋友',
    category: '情绪调节',
    breatheIn: 5,
    breatheOut: 5,
    sceneGradient: 'linear-gradient(180deg, #f97316 0%, #fdba74 50%, #fed7aa 100%)',
    sceneIcon: '🪷',
    themeColor: '#ea580c',
    recommendedSounds: ['fire', 'ocean'],
    guideTexts: [
      '接纳此刻的感受……',
      '像对待一个朋友……',
      '允许它存在，不需要改变……',
      '你比任何情绪都更大……',
      '感受暖色湖水的包围……',
      '你正在温柔地安放自己……',
    ],
  },
  {
    id: 'morning-wake',
    title: '清晨唤醒',
    duration: 7,
    description: '迎接新的一天，给自己一个微笑',
    category: '成长',
    breatheIn: 3,
    breatheOut: 4,
    sceneGradient: 'linear-gradient(180deg, #fef3c7 0%, #fbbf24 40%, #f59e0b 100%)',
    sceneIcon: '🌅',
    themeColor: '#d97706',
    recommendedSounds: ['forest', 'ocean'],
    guideTexts: [
      '迎接新的一天……',
      '给自己一个微笑……',
      '感受光线逐渐变亮……',
      '吸气，带入新的能量……',
      '呼气，释放残留的困意……',
      '今天会是美好的一天……',
    ],
  },
  {
    id: 'anxiety-ease',
    title: '焦虑舒缓',
    duration: 9,
    description: '焦虑只是一股能量，让它流过你的身体',
    category: '情绪调节',
    breatheIn: 6,
    breatheOut: 8,
    sceneGradient: 'linear-gradient(180deg, #86efac 0%, #4ade80 50%, #22c55e 100%)',
    sceneIcon: '🌾',
    themeColor: '#15803d',
    recommendedSounds: ['rain', 'whitenoise'],
    guideTexts: [
      '焦虑只是一股能量……',
      '让它流过你的身体……',
      '你比它更大……',
      '感受微风吹过草原……',
      '不需要对抗，只需要观察……',
      '你正在安全地呼吸……',
    ],
  },
]

export const MEDITATION_SERIES: MeditationSeries[] = [
  {
    id: 'series-breath',
    title: '认识呼吸',
    description: '每天解锁一课，循序渐进认识呼吸的力量',
    lessons: [
      { id: 'sb-1', title: '觉察呼吸', duration: 5 },
      { id: 'sb-2', title: '延长呼气', duration: 6 },
      { id: 'sb-3', title: '呼吸与身体', duration: 7 },
      { id: 'sb-4', title: '呼吸与情绪', duration: 8 },
      { id: 'sb-5', title: '深度放松', duration: 10 },
      { id: 'sb-6', title: '整合练习', duration: 12 },
      { id: 'sb-7', title: '自由呼吸', duration: 12 },
    ],
  },
  {
    id: 'series-body',
    title: '觉察身体',
    description: '用身体感知回到当下',
    lessons: [
      { id: 'sb2-1', title: '感受双脚', duration: 5 },
      { id: 'sb2-2', title: '扫描双手', duration: 6 },
      { id: 'sb2-3', title: '放松肩颈', duration: 7 },
      { id: 'sb2-4', title: '腹部呼吸', duration: 8 },
      { id: 'sb2-5', title: '全身扫描', duration: 10 },
      { id: 'sb2-6', title: '深度觉察', duration: 12 },
      { id: 'sb2-7', title: '身心合一', duration: 12 },
    ],
  },
]

export const SELF_CARE_QUOTES = [
  '你已经足够好了，不需要向任何人证明。',
  '允许自己休息，这不是懒惰，是自我关怀。',
  '情绪没有对错，它们只是来拜访的客人。',
  '今天的小进步，也是值得庆祝的成长。',
  '你不需要"坚持"，只需要"回来看看"。',
  '温柔地对待自己，就像对待最好的朋友。',
  '不完美，恰恰是人性中最美的部分。',
]

export const SELF_CARE_TASKS = [
  '写下今天感激的一件事',
  '给自己一个拥抱',
  '深呼吸三次，感受空气进入身体',
  '对镜子里的自己微笑',
  '喝一杯温水，慢慢品味',
  '走到窗边，看看天空',
  '写下一句鼓励自己的话',
]

export const TOPICS: Topic[] = [
  {
    id: 'topic-spring',
    title: '春天情绪养护',
    cover: '',
    coverImage: '/topics/spring.jpg',
    coverGradient: 'linear-gradient(135deg, #fce7f3, #fef08a)',
    summary: '在万物复苏的季节，温柔照料你的内心',
    type: 'article',
    content: `春季情绪波动是正常生理心理反应（气候、节律、期待落差）。

• 允许情绪留白，不强迫自己积极
• 每天晒太阳15分钟，调节血清素
• 用"5分钟启动法"和"小胜利清单"行动
• 多接触自然，减少负面刺激

记住，情绪的起伏是自然的，就像春天的天气一样多变。`,
  },
  {
    id: 'topic-exam',
    title: '考前减压指南',
    cover: '',
    coverImage: '/topics/exam.jpg',
    coverGradient: 'linear-gradient(135deg, #ffedd5, #d9f99d)',
    summary: '在压力中找到平静的力量',
    type: 'article',
    content: `适度焦虑正常且有益，目标是调节而非消灭。

三个1分钟急救法：
• 4-7-8呼吸：吸气4秒，屏息7秒，呼气8秒
• 感官着陆：说出5样你能看到的东西
• 身体扫描：从头顶到脚尖逐一放松

拆解目标，用"清单思维"积累信心。

心态三原则：接纳情绪、合理目标、睡眠优先。

给考生：正常发挥即胜利。
给家长：多服务少指点。`,
  },
  {
    id: 'topic-anxiety',
    title: '与焦虑共处',
    cover: '',
    coverImage: '/topics/anxiety.jpg',
    coverGradient: 'linear-gradient(135deg, #dcfce7, #86efac)',
    summary: '学会与焦虑和平相处，而非对抗',
    type: 'article',
    content: `焦虑不是敌人。当我们试图"消灭"焦虑时，往往会让它更加顽固。

试试这样做：
• 给焦虑起个名字，像对待访客一样
• 观察身体的感觉，不评判
• 做一件小事：喝口水、走走

你不需要立刻感觉更好，尝试本身就值得肯定。`,
  },
]

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first-painting', name: '初次执笔', icon: 'painting', description: '保存第一幅画作' },
  { id: 'first-meditation', name: '静心初体验', icon: 'meditation', description: '完成第一次冥想' },
  { id: 'first-harvest', name: '初次收获', icon: 'harvest', description: '第一次收获果实' },
  { id: 'first-diary', name: '心情记录者', icon: 'diary', description: '写下第一篇心情日记' },
  { id: 'first-selfcare', name: '自我关怀', icon: 'selfcare', description: '完成第一个自我关怀任务' },
  { id: 'series-complete', name: '系列旅人', icon: 'series', description: '完成系列冥想全部课程' },
  { id: 'meditation-60', name: '冥想达人', icon: 'timer', description: '累计冥想60分钟' },
  { id: 'harvest-10', name: '丰收季节', icon: 'bounty', description: '累计收获10次' },
  { id: 'painting-10', name: '小小画家', icon: 'gallery', description: '保存10幅画作' },
  { id: 'streak-7', name: '七日连续', icon: 'streak', description: '连续冥想7天' },
]

/** @deprecated 主视觉已改用 TreeIllustration SVG，保留仅供兼容 */
export const TREE_STAGE_EMOJI: Record<string, Record<string, string>> = {
  apple: { seed: '🌰', seedling: '🌱', tree: '🌳', fruiting: '🍎' },
  pear: { seed: '🌰', seedling: '🌱', tree: '🌳', fruiting: '🍐' },
  peach: { seed: '🌰', seedling: '🌱', tree: '🌳', fruiting: '🍑' },
  orange: { seed: '🌰', seedling: '🌱', tree: '🌳', fruiting: '🍊' },
  strawberry: { seed: '🌰', seedling: '🌱', tree: '🌳', fruiting: '🍓' },
  lemon: { seed: '🌰', seedling: '🌱', tree: '🌳', fruiting: '🍋' },
  cherry: { seed: '🌰', seedling: '🌱', tree: '🌳', fruiting: '🍒' },
}

export const FAQ_ITEMS = [
  {
    q: '如何获得果币？',
    a: '完成疗愈行为可获得果币：收获成熟果实(+30)、每日首次心情日记(+10)、每日首次自我关怀任务(+10)。',
  },
  {
    q: '果树不结果怎么办？',
    a: '需要完成5次有效疗愈行为才能成熟：保存画作、完成冥想、每日首次心情日记、每日首次自我关怀。每日最多浇灌5次。',
  },
  {
    q: '如何切换果树种类？',
    a: '在果园页面底部的种子选择器中切换，每种水果独立存储成长进度，互不影响。',
  },
  {
    q: '数据会丢失吗？',
    a: '所有数据保存在本地浏览器中。建议定期在"我的"页面导出备份。',
  },
]
