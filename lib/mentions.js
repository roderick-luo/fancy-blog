// 提取 @用户名（字母数字下划线，3-32 位）
export const extractMentions = (s) => [...new Set([...String(s).matchAll(/(^|[^\w@])@([a-zA-Z0-9_]{3,32})/g)].map(m => m[2].toLowerCase()))]
