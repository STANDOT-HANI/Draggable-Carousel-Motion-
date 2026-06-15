const track = document.querySelector("#panelTrack");
const scrubber = document.querySelector("#scrubber");
const scrubberRail = document.querySelector("#scrubberRail");
const scrubberFill = document.querySelector("#scrubberFill");
const scrubberThumb = document.querySelector("#scrubberThumb");
const historyYear = document.querySelector("#historyYear");
const historyTitle = document.querySelector("#historyTitle");
const historyBody = document.querySelector("#historyBody");

const colors = [
  "#1e8fe7",
  "#10b2c1",
  "#078f7c",
  "#3fa344",
  "#78bd36",
  "#ffe82e",
  "#ff8800",
  "#f4322c",
  "#9822a9",
];

const historyItems = [
  {
    image: "assets/year-1897.png",
    alt: "1897",
    title: "왕들도 마시던 소화제",
    body:
      "활명수는 조선왕조 고종임금께서 대한제국 황제로 즉위하시던 1897년 당시 궁중 선전관으로 있던 민병호 선생께서 궁중에서만 복용되던 생약의 비방을 일반 국민에게까지 널리 보급하고자 서양의학을 접목하여 개발한 우리나라 최초의 신약이며, 양약입니다.",
  },
  {
    image: "assets/year-129.svg",
    alt: "129",
    title: "현재 활명수의 나이",
    body:
      "활명수를 개발한 민병호 선생과 아들인 민강 선생은 1897년 활명수를 대중화 시키기 위해 서울 순화동 5번지에 동화약방을 설립하였습니다. 활명수는 129년간 한국인의 소화제로써 굳건히 자리잡고 있습니다.",
  },
  {
    image: "assets/year-1919.svg",
    alt: "1919",
    title: "기록으로 남은 한 병",
    body:
      "오랜 시간 이어진 활명수의 이야기는 시대마다 조금씩 다른 생활 속 장면을 지나왔습니다. 작은 병 하나가 가족의 상비약으로 자리 잡으며 오늘의 기억까지 이어지고 있습니다.",
  },
  {
    image: "assets/metric-4.svg",
    alt: "4",
    title: "네 가지 균형",
    body:
      "익숙한 처방과 정성스러운 배합은 활명수가 오래 사랑받은 이유 중 하나입니다. 필요한 순간 빠르게 떠오르는 이름이 되도록 기본에 충실한 흐름을 지켜왔습니다.",
  },
  {
    image: "assets/metric-99-8.svg",
    alt: "99.8",
    title: "익숙함이 만든 신뢰",
    body:
      "많은 사람들이 활명수를 떠올리는 이유는 거창한 설명보다 경험에 가깝습니다. 식사 후의 더부룩함, 여행길의 불편함처럼 일상적인 순간에 자연스럽게 함께해왔습니다.",
  },
  {
    image: "assets/metric-8500000000.svg",
    alt: "8,500,000,000",
    title: "셀 수 없이 이어진 선택",
    body:
      "긴 세월 동안 누적된 선택은 브랜드가 지나온 시간을 보여줍니다. 한 번의 유행보다 오래 지속된 습관처럼, 활명수는 여러 세대를 지나며 생활 가까이에 머물렀습니다.",
  },
  {
    image: "assets/metric-25.svg",
    alt: "25",
    title: "작지만 분명한 순간",
    body:
      "활명수의 매력은 필요한 순간 바로 꺼낼 수 있는 간결함에 있습니다. 복잡하지 않은 사용감과 익숙한 이름이 일상 속 작은 안도감을 만들어줍니다.",
  },
  {
    image: "assets/metric-11.svg",
    alt: "11",
    title: "이어지는 세대의 기억",
    body:
      "집 안 서랍이나 약장 한쪽에서 시작된 기억은 부모와 자녀의 경험으로 이어집니다. 같은 이름을 다르게 기억하는 사람들 사이에서 활명수는 조용히 시간을 건너왔습니다.",
  },
  {
    image: "assets/metric-50.svg",
    alt: "50",
    title: "오늘도 가까운 이름",
    body:
      "오래된 브랜드도 오늘의 생활 안에서 새롭게 쓰일 때 의미가 생깁니다. 활명수는 익숙하지만 낡지 않은 방식으로, 매일의 컨디션을 살피는 작은 선택지로 남아 있습니다.",
  },
];

const panels = colors.map((color, index) => {
  const panel = document.createElement("div");
  panel.className = "panel";
  panel.setAttribute("role", "button");
  panel.setAttribute("aria-label", `카드 ${index + 1} 뒤집기`);
  panel.tabIndex = -1;
  panel.style.setProperty("--panel-color", color);
  panel.innerHTML = `
    <div class="panel-card">
      <div class="panel-face panel-front"></div>
      <div class="panel-face panel-back">
        CARD ${String(index + 1).padStart(2, "0")}
        <span>BACK SIDE</span>
      </div>
    </div>
  `;
  panel.addEventListener("click", () => {
    if (index !== activeIndex) return;
    panel.classList.toggle("is-flipped");
  });
  panel.addEventListener("keydown", (event) => {
    if (index !== activeIndex) return;
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    panel.classList.toggle("is-flipped");
  });
  track.append(panel);
  return panel;
});

let selectedIndex = Math.floor(colors.length / 2);
let handlePosition = selectedIndex;
let activeIndex = -1;
let isDragging = false;

const wrap = (value, size) => ((value % size) + size) % size;
const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const normalizeIndex = (index) => wrap(index, colors.length);

const updateHistory = () => {
  const content = historyItems[selectedIndex] ?? historyItems[0];

  historyYear.src = content.image;
  historyYear.alt = content.alt;
  historyTitle.textContent = content.title;
  historyBody.textContent = content.body;
};

const syncHandle = () => {
  const ratio = handlePosition / (colors.length - 1);

  scrubber.setAttribute("aria-valuenow", String(selectedIndex));
  scrubberThumb.style.left = `${ratio * 100}%`;
  scrubberFill.style.width = `${ratio * 100}%`;
  scrubberThumb.style.setProperty(
    "--thumb-rotation",
    `${ratio * 720}deg`,
  );
};

const updateSelection = (position, snapHandle = false) => {
  const nextPosition = clamp(position, 0, colors.length - 1);
  selectedIndex = Math.round(nextPosition);
  handlePosition = snapHandle ? selectedIndex : nextPosition;
  syncHandle();

  if (selectedIndex === activeIndex) return;

  activeIndex = selectedIndex;
  panels.forEach((panel, panelIndex) => {
    const isActive = panelIndex === selectedIndex;
    panel.classList.toggle("is-active", isActive);
    if (!isActive) {
      panel.classList.remove("is-flipped");
    }
    panel.tabIndex = isActive ? 0 : -1;
  });

  updateHistory();
};

const selectFromPointer = (clientX) => {
  const rect = scrubberRail.getBoundingClientRect();
  const ratio = clamp((clientX - rect.left) / rect.width, 0, 1);
  updateSelection(ratio * (colors.length - 1));
};

const animate = () => {
  const bounds = track.getBoundingClientRect();
  const panelWidth = panels[0].offsetWidth;
  const centerX = bounds.width / 2;
  const spacing = panelWidth * 1.14;
  const cycleWidth = spacing * panels.length;
  const offsetForIndex = (index) => index * spacing + panelWidth / 2 - centerX;
  const offset = offsetForIndex(selectedIndex);
  const opacityByIndex = new Map([
    [normalizeIndex(selectedIndex - 2), 0.2],
    [normalizeIndex(selectedIndex - 1), 0.6],
    [normalizeIndex(selectedIndex), 1],
    [normalizeIndex(selectedIndex + 1), 0.6],
    [normalizeIndex(selectedIndex + 2), 0.2],
  ]);

  panels.forEach((panel, index) => {
    const rawX = index * spacing - offset;
    const x = wrap(rawX + panelWidth, cycleWidth) - panelWidth;
    const panelCenter = x + panelWidth / 2;
    const distance = Math.abs(panelCenter - centerX);
    const influence = Math.max(0, 1 - distance / (bounds.width * 0.72));
    const scale = 0.72 + influence * 0.34;
    const yNudge = (1 - scale) * 120;
    const zIndex = Math.round(scale * 1000);

    panel.style.zIndex = zIndex;
    panel.style.opacity = String(opacityByIndex.get(index) ?? 0);
    panel.style.transform = [
      `translate3d(${x}px, calc(-50% + ${yNudge}px), 0)`,
      `scale(${scale})`,
    ].join(" ");
  });

  requestAnimationFrame(animate);
};

scrubber.addEventListener("pointerdown", (event) => {
  isDragging = true;
  scrubber.classList.add("is-dragging");
  scrubber.setPointerCapture?.(event.pointerId);
  selectFromPointer(event.clientX);
});

window.addEventListener("pointermove", (event) => {
  if (!isDragging) return;
  selectFromPointer(event.clientX);
});

window.addEventListener("pointerup", (event) => {
  isDragging = false;
  scrubber.classList.remove("is-dragging");
  scrubber.releasePointerCapture?.(event.pointerId);
  updateSelection(selectedIndex, true);
});

scrubber.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") {
    event.preventDefault();
    updateSelection(selectedIndex - 1, true);
  }

  if (event.key === "ArrowRight") {
    event.preventDefault();
    updateSelection(selectedIndex + 1, true);
  }

  if (event.key === "Home") {
    event.preventDefault();
    updateSelection(0, true);
  }

  if (event.key === "End") {
    event.preventDefault();
    updateSelection(colors.length - 1, true);
  }
});

updateSelection(selectedIndex, true);
requestAnimationFrame(animate);
