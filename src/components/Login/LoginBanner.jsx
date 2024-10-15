const letters = {
  F: [
    [1, 1, 1, 1],
    [1, 0, 0, 0],
    [1, 1, 1, 1],
    [1, 0, 0, 0],
    [1, 0, 0, 0],
  ],
  E: [
    [1, 1, 1, 1],
    [1, 0, 0, 0],
    [1, 1, 1, 1],
    [1, 0, 0, 0],
    [1, 1, 1, 1],
  ],
  D: [
    [1, 1, 1, 0],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 1, 1, 0],
  ],
  M: [
    [1, 0, 0, 0, 1],
    [1, 1, 0, 1, 1],
    [1, 0, 1, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
  ],
  "!": {
    0: [1],
    1: [1],
    2: [1],
    3: [0],
    4: [1],
  },
};

const combineLetters = (text) => {
  const rows = 5;
  let cols = 0;

  text.split("").forEach((char) => {
    const letter = letters[char];
    if (letter) {
      cols += letter[0].length + 1;
    }
  });
  cols -= 1;

  const combined = Array.from({ length: rows }, () => Array(cols).fill(0));

  let currentCol = 0;

  text.split("").forEach((char) => {
    const letter = letters[char];
    if (letter) {
      const letterWidth = letter[0].length;
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < letterWidth; j++) {
          combined[i][currentCol + j] = letter[i][j];
        }
      }
      currentCol += letterWidth + 1;
    }
  });

  return combined;
};

const LoginBanner = () => {
  const pixelData = combineLetters("FEEDME!");

  const getRandomColorClass = () => {
    const colors = ["bg-primary", "bg-primary-light", "bg-primary-dark"];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <div className="hidden md:block mx-2 md:mx-0 relative">
      <div className="grid grid-cols-32 md:gap-1">
        {pixelData.map((row, rowIndex) =>
          row.map((pixel, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`w-4 h-4 md:w-7 md:h-7 rounded ${pixel ? `${getRandomColorClass()} border border-black-400 hover:animate-ping` : "border border-black-200"}`}
            ></div>
          ))
        )}
      </div>
    </div>
  );
};

export default LoginBanner;
