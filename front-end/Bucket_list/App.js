import React, { useState } from 'react';
import Header from './Header';
import Tabs from './Tabs';
import ItemCard from './ItemCard';
import BottomNav from './BottomNav';
import AddButton from './AddButton';

const items = [
  {
    title: 'Rooftop Trivia',
    type: 'Restaurant',
    location: 'Manhattan, NY',
    date: '2 days ago',
    user: 'Nur',
    tags: ['#sunset', '#views'],
    hearts: 9,
  },
  {
    title: 'Pizza Disco',
    type: 'Pizza',
    location: 'Manhattan, NY',
    date: '4 days ago',
    user: 'Catalin',
    tags: ['#novel', '#interesting'],
    hearts: 8,
  },
  {
    title: 'Silent Party',
    type: 'Experience',
    location: 'Brooklyn, NY',
    date: '1 week ago',
    user: 'Nada',
    tags: ['#aesthetic', '#matcha'],
    hearts: 12,
  },
];

function App() {
  const [tab, setTab] = useState('todo');
  return (
    <div className="app-container">
      <Header />
      <Tabs activeTab={tab} setTab={setTab} />
      <div className="items-list">
        {items.map((item, idx) => (
          <ItemCard key={idx} {...item} />
        ))}
      </div>
      <AddButton />
      <BottomNav />
    </div>
  );
}

export default App;
