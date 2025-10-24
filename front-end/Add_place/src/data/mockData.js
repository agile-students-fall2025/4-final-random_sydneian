// Mock data for recent additions
// Following requirements: data should be mocked, not hard-coded in components

export const getRecentAdditions = () => {
  return [
    {
      id: 1,
      title: "Rooftop Trivia",
      addedBy: "Nur"
    },
    {
      id: 2,
      title: "Pizza Disco",
      addedBy: "Catalin"
    },
    {
      id: 3,
      title: "Silent Party",
      addedBy: "Nada"
    }
  ];
};

export const getPreviewData = () => {
  return {
    name: "Moonlight Cafe",
    location: "Brooklyn, NY",
    highlights: [
      "Aesthetic Interior",
      "Famous for matcha",
      "Great brunch spot"
    ]
  };
};

