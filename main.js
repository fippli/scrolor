const colorContainer = document.querySelector(".color-container");

const hexLetters = "0123456789ABCDEF";

const Throttle = (function (func, delay) {
  let lastTime = 0;

  const now = Date.now();

  if (now - lastTime >= delay) {
    func(...args);
    lastTime = now;
  }
})();

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

const Swipe = (function () {
  let startX;
  let endX;

  document.addEventListener("touchstart", (event) => {
    startX = event.touches[0].clientX;
  });

  document.addEventListener("touchmove", (event) => {
    endX = event.touches[0].clientX;
  });

  document.addEventListener("touchend", () => {
    const deltaX = endX - startX;
    if (deltaX > 0) {
      scroll({ deltaY: -1 });
    } else {
      scroll({ deltaY: 1 });
    }
  });
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
