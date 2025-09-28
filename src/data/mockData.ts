import { Quote, Author, Category } from '../types';

export const mockQuotes: Quote[] = [
  {
    id: '1',
    text: 'The only way to do great work is to love what you do.',
    author: 'Steve Jobs',
    category: 'Success',
    tags: ['work', 'passion', 'greatness'],
    likes: 1247,
    date: '2024-01-15'
  },
  {
    id: '2',
    text: 'Innovation distinguishes between a leader and a follower.',
    author: 'Steve Jobs',
    category: 'Leadership',
    tags: ['innovation', 'leadership', 'technology'],
    likes: 892,
    date: '2024-01-14'
  },
  {
    id: '3',
    text: 'Life is what happens to you while you\'re busy making other plans.',
    author: 'John Lennon',
    category: 'Life',
    tags: ['life', 'planning', 'mindfulness'],
    likes: 2103,
    date: '2024-01-13'
  },
  {
    id: '4',
    text: 'The future belongs to those who believe in the beauty of their dreams.',
    author: 'Eleanor Roosevelt',
    category: 'Dreams',
    tags: ['dreams', 'future', 'belief'],
    likes: 1567,
    date: '2024-01-12'
  },
  {
    id: '5',
    text: 'It is during our darkest moments that we must focus to see the light.',
    author: 'Aristotle',
    category: 'Hope',
    tags: ['hope', 'perseverance', 'darkness'],
    likes: 1834,
    date: '2024-01-11'
  },
  {
    id: '6',
    text: 'The way to get started is to quit talking and begin doing.',
    author: 'Walt Disney',
    category: 'Action',
    tags: ['action', 'beginning', 'achievement'],
    likes: 1423,
    date: '2024-01-10'
  },
  {
    id: '7',
    text: 'Don\'t let yesterday take up too much of today.',
    author: 'Will Rogers',
    category: 'Wisdom',
    tags: ['wisdom', 'present', 'past'],
    likes: 1156,
    date: '2024-01-09'
  },
  {
    id: '8',
    text: 'You learn more from failure than from success. Don\'t let it stop you. Failure builds character.',
    author: 'Unknown',
    category: 'Failure',
    tags: ['failure', 'learning', 'character'],
    likes: 987,
    date: '2024-01-08'
  },
  {
    id: '9',
    text: 'If you are not willing to risk the usual, you will have to settle for the ordinary.',
    author: 'Jim Rohn',
    category: 'Risk',
    tags: ['risk', 'extraordinary', 'comfort-zone'],
    likes: 1289,
    date: '2024-01-07'
  },
  {
    id: '10',
    text: 'Trust because you are willing to accept the risk, not because it\'s safe or certain.',
    author: 'Anonymous',
    category: 'Trust',
    tags: ['trust', 'risk', 'relationships'],
    likes: 756,
    date: '2024-01-06'
  },
  {
    id: '11',
    text: 'Be yourself; everyone else is already taken.',
    author: 'Oscar Wilde',
    category: 'Authenticity',
    tags: ['authenticity', 'individuality', 'identity'],
    likes: 2456,
    date: '2024-01-05'
  },
  {
    id: '12',
    text: 'Two things are infinite: the universe and human stupidity; and I\'m not sure about the universe.',
    author: 'Albert Einstein',
    category: 'Humor',
    tags: ['humor', 'intelligence', 'universe'],
    likes: 3421,
    date: '2024-01-04'
  }
];

export const mockAuthors: Author[] = [
  {
    id: '1',
    name: 'Steve Jobs',
    bio: 'Co-founder of Apple Inc. and a pioneer in the personal computer revolution.',
    birthYear: 1955,
    deathYear: 2011,
    quoteCount: 47,
    nationality: 'American',
    profession: ['Entrepreneur', 'Inventor', 'Business Magnate']
  },
  {
    id: '2',
    name: 'John Lennon',
    bio: 'English singer, songwriter, and peace activist who gained worldwide fame as the founder of The Beatles.',
    birthYear: 1940,
    deathYear: 1980,
    quoteCount: 23,
    nationality: 'British',
    profession: ['Musician', 'Singer', 'Songwriter', 'Activist']
  },
  {
    id: '3',
    name: 'Eleanor Roosevelt',
    bio: 'American political figure, diplomat, human rights activist, and longest-serving First Lady of the United States.',
    birthYear: 1884,
    deathYear: 1962,
    quoteCount: 31,
    nationality: 'American',
    profession: ['Diplomat', 'Activist', 'Author']
  },
  {
    id: '4',
    name: 'Aristotle',
    bio: 'Ancient Greek philosopher and polymath whose writings cover many subjects including physics, biology, zoology, metaphysics, logic, ethics, and aesthetics.',
    birthYear: -384,
    deathYear: -322,
    quoteCount: 89,
    nationality: 'Greek',
    profession: ['Philosopher', 'Scientist', 'Teacher']
  },
  {
    id: '5',
    name: 'Walt Disney',
    bio: 'American entrepreneur, animator, writer, voice actor, and film producer who was a pioneer of the American animation industry.',
    birthYear: 1901,
    deathYear: 1966,
    quoteCount: 19,
    nationality: 'American',
    profession: ['Animator', 'Entrepreneur', 'Film Producer']
  },
  {
    id: '6',
    name: 'Oscar Wilde',
    bio: 'Irish poet and playwright known for his wit, flamboyant style, and criminal conviction for gross indecency.',
    birthYear: 1854,
    deathYear: 1900,
    quoteCount: 156,
    nationality: 'Irish',
    profession: ['Writer', 'Poet', 'Playwright']
  },
  {
    id: '7',
    name: 'Albert Einstein',
    bio: 'German-born theoretical physicist who developed the theory of relativity and won the Nobel Prize in Physics.',
    birthYear: 1879,
    deathYear: 1955,
    quoteCount: 78,
    nationality: 'German-American',
    profession: ['Physicist', 'Scientist', 'Philosopher']
  }
];

export const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Success',
    description: 'Quotes about achieving goals, determination, and reaching your potential.',
    quoteCount: 156,
    color: 'bg-emerald-500',
    icon: '🏆'
  },
  {
    id: '2',
    name: 'Leadership',
    description: 'Wisdom on guiding others, making decisions, and inspiring teams.',
    quoteCount: 89,
    color: 'bg-blue-500',
    icon: '👑'
  },
  {
    id: '3',
    name: 'Life',
    description: 'Reflections on existence, purpose, and the human experience.',
    quoteCount: 234,
    color: 'bg-purple-500',
    icon: '🌱'
  },
  {
    id: '4',
    name: 'Dreams',
    description: 'Inspiration for pursuing aspirations and turning visions into reality.',
    quoteCount: 67,
    color: 'bg-pink-500',
    icon: '✨'
  },
  {
    id: '5',
    name: 'Hope',
    description: 'Quotes about optimism, resilience, and finding light in darkness.',
    quoteCount: 123,
    color: 'bg-yellow-500',
    icon: '🌅'
  },
  {
    id: '6',
    name: 'Wisdom',
    description: 'Timeless insights about knowledge, experience, and understanding.',
    quoteCount: 198,
    color: 'bg-indigo-500',
    icon: '🦉'
  },
  {
    id: '7',
    name: 'Love',
    description: 'Beautiful thoughts on romance, relationships, and human connection.',
    quoteCount: 145,
    color: 'bg-red-500',
    icon: '❤️'
  },
  {
    id: '8',
    name: 'Motivation',
    description: 'Energizing quotes to fuel your drive and ambition.',
    quoteCount: 178,
    color: 'bg-orange-500',
    icon: '🔥'
  }
];

// Helper functions
export const getQuoteById = (id: string): Quote | undefined => {
  return mockQuotes.find(quote => quote.id === id);
};

export const getAuthorById = (id: string): Author | undefined => {
  return mockAuthors.find(author => author.id === id);
};

export const getCategoryById = (id: string): Category | undefined => {
  return mockCategories.find(category => category.id === id);
};

export const getQuotesByAuthor = (authorName: string): Quote[] => {
  return mockQuotes.filter(quote => quote.author === authorName);
};

export const getQuotesByCategory = (categoryName: string): Quote[] => {
  return mockQuotes.filter(quote => quote.category === categoryName);
};

export const searchQuotes = (query: string): Quote[] => {
  const lowerQuery = query.toLowerCase();
  return mockQuotes.filter(quote => 
    quote.text.toLowerCase().includes(lowerQuery) ||
    quote.author.toLowerCase().includes(lowerQuery) ||
    quote.category.toLowerCase().includes(lowerQuery) ||
    quote.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
};

export const getRandomQuote = (): Quote => {
  return mockQuotes[Math.floor(Math.random() * mockQuotes.length)];
};

export const getTrendingQuotes = (): Quote[] => {
  return [...mockQuotes]
    .sort((a, b) => b.likes - a.likes)
    .slice(0, 6);
};

export const getQuoteOfTheDay = (): Quote => {
  // Use date to ensure same quote for the day
  const today = new Date().toDateString();
  const index = today.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % mockQuotes.length;
  return mockQuotes[index];
};