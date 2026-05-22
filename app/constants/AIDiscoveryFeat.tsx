import { SearchIcon, ShieldIcon, BrainIcon, NetworkIcon, LayersIcon, HeartIcon } from "../components/icons";

export const AIDiscoveryfeatures = [
  {
    icon: <SearchIcon size={20} />,
    title: 'Semantic Search',
    description: 'Find anime by describing feelings, themes, or moments — not just titles and tags.',
    span: 'col-span-1 md:col-span-2',
  },
  {
    icon: <ShieldIcon size={20} />,
    title: 'Spoiler-Safe AI',
    description: 'Get deep recommendations without plot reveals. Our AI understands narrative without spoiling.',
    span: 'col-span-1',
  },
  {
    icon: <BrainIcon size={20} />,
    title: 'Narrative Intelligence',
    description: 'Story arcs, pacing, emotional depth — analyzed beyond surface level.',
    span: 'col-span-1',
  },
  {
    icon: <NetworkIcon size={20} />,
    title: 'Multi-Agent Recommendations',
    description: 'Multiple AI perspectives synthesize nuanced, personalized suggestions.',
    span: 'col-span-1 md:col-span-2',
  },
  {
    icon: <LayersIcon size={20} />,
    title: 'Scene-Level Search',
    description: 'Find specific moments across thousands of episodes — that one rainy rooftop scene.',
    span: 'col-span-1',
  },
  {
    icon: <HeartIcon size={20} />,
    title: 'Emotional Mapping',
    description: 'Discover based on the emotional journey you seek — catharsis, wonder, melancholy.',
    span: 'col-span-1 md:col-span-2',
  },
]

export const aiFeatures = [
  {
    title: 'Semantic Search',
    description: 'Find anime by describing feelings, themes, or moments — not just titles and tags. Our neural embedding search maps concept relevance directly.',
    badge: 'Neural Search',
    href: '/ai-discovery/semantic-search',
    image: '/ai-1.webp',
  },
  {
    title: 'Spoiler-Safe AI',
    description: 'Get deep recommendations without plot reveals. Our AI understands narrative context, emotional beats, and thematic depth without spoiling the story.',
    badge: 'Safe Guard',
    href: '/ai-discovery/spoiler-safe',
    image: '/ai-2.webp',
  },
  {
    title: 'Narrative Intelligence',
    description: 'Analyze story arcs, pacing, emotional trajectories, and complexity beyond surface level tags using language models trained on story architectures.',
    badge: 'Deep Analysis',
    href: '/ai-discovery/narrative-intelligence',
    image: '/ai-3.webp',
  },
  {
    title: 'Multi-Agent Recs',
    description: 'Experience customized anime discovery where multiple specialized AI agents debate, critique, and synthesize recommendations tailored for you.',
    badge: 'Collaborative AI',
    href: '/ai-discovery/multi-agent',
    image: '/ai-4.webp',
  },
  {
    title: 'Scene-Level Search',
    description: 'Pinpoint specific moments across thousands of episodes. Describe visual elements like "that one rainy rooftop scene" or "sunset confession".',
    badge: 'Visual Search',
    href: '/ai-discovery/scene-search',
    image: '/ai-5.webp',
  },
  {
    title: 'Emotional Mapping',
    description: 'Discover anime based on the emotional journey you seek — catharsis, wonder, melancholy, or tension. Align search results to your feelings.',
    badge: 'Sentiment Engine',
    href: '/ai-discovery/emotional-mapping',
    image: '/ai-6.webp',
  }
]
