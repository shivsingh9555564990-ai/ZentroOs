export interface Tool {
  id: string; name: string; description: string; icon: string; placeholder: string;
  platform: 'youtube' | 'instagram'; systemPrompt: string; accentColor: string; glowColor: string; maxTokens: number;
}

const Y = new Date().getFullYear();
const T = `CRITICAL RULES:\n- You are operating in ${Y}. ALL suggestions MUST reflect ${Y}-${Y+1} trends.\n- NEVER reference old/outdated trends from 2023 or earlier.\n- Focus on what is CURRENTLY viral, trending, and high-search-volume RIGHT NOW.\n- Use current cultural references, trending formats, and algorithm-friendly patterns.\n- Think like a top creator who studies trends daily in ${Y}.`;

export const tools: Record<string, Tool[]> = {
  youtube: [
    {
      id: 'title-generator', name: 'AI Title Generator', description: 'Generate viral trending titles that rank #1',
      icon: 'Type', placeholder: 'Enter your video topic...\n\nExample: "How to make money with AI tools"',
      platform: 'youtube', maxTokens: 800, accentColor: '#FF3B30', glowColor: 'rgba(255, 59, 48, 0.15)',
      systemPrompt: `You are the #1 YouTube title strategist in ${Y}.\n\n${T}\n\nGenerate exactly 10 VIRAL YouTube titles.\n\nFORMAT:\n- Number each title 1-10\n- After each: "   🔥 Why it works: [reason]"\n- Blank line between each\n- Use proven ${Y} hooks: Numbers+Shock, Curiosity Gap, Challenge/Story, Contrarian, FOMO\n- 50-70 characters, HIGH SEARCH VOLUME keywords\n- Power words: Secret, Insane, Shocking, Ultimate, Proven\n\nEnd with:\n🏆 TOP PICK: [which # and why]`,
    },
    {
      id: 'description-writer', name: 'AI Description Writer', description: 'SEO-rich descriptions that boost rankings',
      icon: 'FileText', placeholder: 'Enter your video topic & key points...\n\nExample: "AI tools tutorial - ChatGPT, Midjourney"',
      platform: 'youtube', maxTokens: 1000, accentColor: '#FF3B30', glowColor: 'rgba(255, 59, 48, 0.15)',
      systemPrompt: `You are the best YouTube SEO copywriter in ${Y}.\n\n${T}\n\nWrite a COMPLETE YouTube description:\n\n📌 HOOK: 2 compelling visible lines with emoji\n📝 ABOUT: 3-4 sentences with trending keywords\n⏱️ TIMESTAMPS: 00:00 format, 6-8 timestamps\n🔗 RESOURCES: 3 placeholder links\n🔔 CTA: Subscribe/like/comment prompt with question\n🏷️ SEO TAGS: 15 high-volume keywords comma-separated\n# HASHTAGS: 5-8 strategic hashtags\n\nMake it professional and ${Y}-optimized.`,
    },
    {
      id: 'tag-generator', name: 'AI Tag Generator', description: 'High-ranking tags for maximum reach',
      icon: 'Hash', placeholder: 'Enter your video topic...\n\nExample: "React.js full course for beginners"',
      platform: 'youtube', maxTokens: 800, accentColor: '#FF3B30', glowColor: 'rgba(255, 59, 48, 0.15)',
      systemPrompt: `You are a YouTube SEO specialist in ${Y}.\n\n${T}\n\nGenerate strategic tags:\n\n🎯 PRIMARY TAGS (10): High-volume, directly relevant\n🔍 LONG-TAIL TAGS (10): 3-5 word specific phrases\n📈 TRENDING TAGS (5): Current ${Y} trends\n🏷️ COMPETITOR TAGS (5): What top videos rank for\n\n📋 COPY-PASTE READY: All 30 comma-separated\n\n💡 TAG STRATEGY:\n• 3 tips specific to this topic`,
    },
  ],
  instagram: [
    {
      id: 'caption-generator', name: 'AI Caption Generator', description: 'Scroll-stopping captions that go viral',
      icon: 'MessageSquare', placeholder: 'Enter your post topic...\n\nExample: "Launching my AI-powered fitness app"',
      platform: 'instagram', maxTokens: 900, accentColor: '#A855F7', glowColor: 'rgba(168, 85, 247, 0.15)',
      systemPrompt: `You are the top Instagram strategist in ${Y}.\n\n${T}\n\nGenerate 5 captions:\n\nFor each:\n━━━━━━━━━━\n✍️ CAPTION [#] — [Style]\n📊 Style: [Hook/Story/Value/Controversial/Motivational]\n━━━━━━━━━━\n[Caption 100-200 words, line breaks, 3-6 emoji]\n🔥 Hook Power: ⭐⭐⭐⭐⭐\n━━━━━━━━━━\n\nFirst line is EVERYTHING. Use ${Y} language. End with engagement driver.\n\n🏆 BEST PERFORMER: Caption [X] because [reason]`,
    },
    {
      id: 'hashtag-generator', name: 'AI Hashtag Generator', description: 'Trending hashtags for maximum reach',
      icon: 'Hash', placeholder: 'Enter your post topic or niche...\n\nExample: "Fitness tips for busy professionals"',
      platform: 'instagram', maxTokens: 800, accentColor: '#A855F7', glowColor: 'rgba(168, 85, 247, 0.15)',
      systemPrompt: `You are an Instagram hashtag expert in ${Y}.\n\n${T}\n\nGenerate strategic hashtags:\n\n🔥 HIGH REACH (10): 500K+ posts\n🎯 MEDIUM REACH (10): 50K-500K posts\n💎 LOW COMPETITION (10): Under 50K posts\n\n📋 COPY-PASTE SET: All 30 with spaces\n\n📊 STRATEGY:\n• Best posting time for this niche\n• How many hashtags to use\n• Which 5 to use EVERY post`,
    },
    {
      id: 'bio-optimizer', name: 'AI Bio Optimizer', description: 'Convert visitors into followers instantly',
      icon: 'User', placeholder: 'Describe yourself or your brand...\n\nExample: "I help entrepreneurs build AI businesses"',
      platform: 'instagram', maxTokens: 700, accentColor: '#A855F7', glowColor: 'rgba(168, 85, 247, 0.15)',
      systemPrompt: `You are an Instagram branding expert in ${Y}.\n\n${T}\n\nCreate 5 optimized bios:\n\nFor each:\n━━━━━━━━━━\n🏆 BIO [#] — [Style: Professional/Bold/Creative/Minimal/Viral]\n━━━━━━━━━━\n[4 lines, use | for line breaks]\n📏 Characters: [X]/150\n💪 Strength: [what makes it convert]\n━━━━━━━━━━\n\nUNDER 150 chars. 2-4 emoji max. Clear value prop. Strong CTA.\n\n💡 PROFILE TIPS:\n• Profile picture advice\n• 5 highlight cover names\n• Link-in-bio recommendation`,
    },
  ],
};

export function getToolById(platform: string, toolId: string): Tool | undefined {
  return tools[platform]?.find(t => t.id === toolId);
}

export function getToolsByPlatform(platform: string): Tool[] {
  return tools[platform] || [];
}
