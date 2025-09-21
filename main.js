const colorContainer = document.querySelector(".color-container");

const hexLetters = "0123456789ABCDEF";

const getRandomColor = () =>
  `#${[NaN, NaN, NaN, NaN, NaN, NaN]
    .map(() => {
      return hexLetters[Math.floor(Math.random() * 16)];
    })
    .join("")}`;

const Colors = (() => {
  const initialColor = window.location.hash.slice(1) ?? "ffffff";
  let colors = [`#${initialColor}`];
  let index = 0;

  const current = () => {
    return colors[index % colors.length];
  };

  const add = () => {
    colors.push(getRandomColor());
    console.log({ colors });
  };

  const next = () => {
    index++ % colors.length;
    return colors[index];
  };

  const previous = () => {
    index--;
    if (index < 0) {
      index = colors.length - 1;
    }
    return colors[index];
  };

  const copy = () => {
    navigator.clipboard.writeText(current());
  };

  return { add, next, previous, current, copy };
})();

const scroll = (event) => {
  if (event.deltaY > 0) {
    Colors.add();
    const color = Colors.next();
    colorContainer.style.setProperty("--color", color);
    // set url fragment
    window.history.pushState(null, "", `${color}`);
  } else {
    const color = Colors.previous();
    colorContainer.style.setProperty("--color", color);
    window.history.pushState(null, "", `${color}`);
  }
};

const handleKeyDown = (event) => {
  // handle arrow up and down the same as scroll down and up
  if (event.key === "ArrowUp") {
    scroll({ deltaY: -1 });
  } else if (event.key === "ArrowDown") {
    scroll({ deltaY: 1 });
  }
};

const main = () => {
  colorContainer.style.setProperty("--color", Colors.current());
  Colors.add();

  document.addEventListener("wheel", scroll);
  document.addEventListener("keydown", handleKeyDown);
};

main();
