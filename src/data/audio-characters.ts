export type Character = {
  id: string;
  icon: string;
  audioSrc: string;
  name: string;
};

export const characters: Character[] = [
  {
    id: "rick",
    icon: "🧪",
    name: "Rick",
    audioSrc: "/assets/audio/Rick.mp3",
  },
  // {
  //   id: "morty",
  //   icon: "😰",
  //   name: "Morty",
  //   audioSrc: "/assets/audio/morty.mp3",
  // },
  // {
  //   id: "system",
  //   icon: "🤖",
  //   name: "System",
  //   audioSrc: "/assets/audio/system.mp3",
  // },
  // {
  //   id: "eva",
  //   icon: "🚀",
  //   name: "Eva",
  //   audioSrc: "/assets/audio/eva.mp3",
  // },
  {
    id: "mandalorian",
    icon: "🎯",
    name: "Mandalorian",
    audioSrc: "/assets/audio/mandalorian.mp3",
  },
];
