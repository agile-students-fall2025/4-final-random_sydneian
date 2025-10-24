// Mock data for bucket list activities
// Following requirements: data should be mocked, not hard-coded in components

export const getMockActivities = () => {
  return [
    {
      id: 1,
      title: "Rooftop Trivia",
      type: "Restaurant",
      location: "Manhattan, NY",
      addedBy: "Nur",
      daysAgo: 2,
      tags: ["sunset", "views"],
      likes: 9,
      completed: false
    },
    {
      id: 2,
      title: "Pizza Disco",
      type: "Pizza",
      location: "Manhattan, NY",
      addedBy: "Catalin",
      daysAgo: 4,
      tags: ["novel", "interesting"],
      likes: 8,
      completed: false
    },
    {
      id: 3,
      title: "Silent Party",
      type: "Experience",
      location: "Brooklyn, NY",
      addedBy: "Nada",
      daysAgo: 7,
      tags: ["aesthetic", "matcha"],
      likes: 12,
      completed: false
    }
  ];
};

export const getCompletedActivities = () => {
  return [
    {
      id: 4,
      title: "Lorem Cafe",
      type: "Bakery",
      location: "Manhattan, NY",
      addedBy: "Catalin",
      daysAgo: 14,
      tags: ["aesthetic", "matcha"],
      likes: 10,
      completed: true
    },
    {
      id: 5,
      title: "Ipsum Ippies",
      type: "Bar",
      location: "Manhattan, NY",
      addedBy: "Mike",
      daysAgo: 21,
      tags: ["sunset", "views"],
      likes: 8,
      completed: true
    },
    {
      id: 6,
      title: "Rooftop Bar & Grill",
      type: "Bar",
      location: "Manhattan, NY",
      addedBy: "Mike",
      daysAgo: 7,
      tags: ["sunset", "views"],
      likes: 6,
      completed: true
    },
    {
      id: 7,
      title: "Moonlight Cafe",
      type: "Coffee Shop",
      location: "Brooklyn, NY",
      addedBy: "Sarah",
      daysAgo: 14,
      tags: ["aesthetic", "matcha"],
      likes: 11,
      completed: true
    }
  ];
};

