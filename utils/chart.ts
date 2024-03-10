import history from "../content/participants-history.json";

export const historyLabels = history.map(el => { return el.day + " marzo"; });

export const participantColor = {
  "Bunnita_": { color: "#ec80cf"},
  "Dannahouse": { color: "#d8b6ac"},
  "Pichu": { color: "#d0d8e0"},
  "kurxmy": { color: "#ff2c7f"},
  "chupamuelitas": { color: "#fdc95e" },
  "linnaqt": { color: "#886cff" },
  "LunaVT_": { color: "#000" },
  "ANGAR": { color: "#ff7841" },
  "valeria_afk": { color: "#eb9684" },
  "blurelle": { color: "#3990ff" },
  "ChinoLoleroo": { color: "#92ffce" },
  "JCFENIXX": { color: "#f20a24" },
  "OldmanVsInternet": { color: "#fcf347" },
  "Masorco": { color: "#248cb9" },
  "Jokerwashere69": { color: "#05c300" },
  "lolmechs": { color: "#cc6cff" }
} as Record<string, any>;

export const historyData = (p: Record<string, any>) => {
  const elo = history.map(objeto => {
    const participant = (objeto.participants || []).find(part => part.twitch_display === p.twitch_display);
    return participant ? participant.elo : null;
  });
  const lp = history.map(objeto => {
    const participant = (objeto.participants || []).find(part => part.twitch_display === p.twitch_display);
    return participant ? participant.lp : null;
  });
  const tier = history.map(objeto => {
    const participant = (objeto.participants || []).find(part => part.twitch_display === p.twitch_display);
    return participant ? participant.tier : null;
  });

  return { elo, lp, tier };
};

const getOrCreateTooltip = (chart: any) => {
  let tooltipEl = chart.canvas.parentNode.querySelector("div");

  if (!tooltipEl) {
    tooltipEl = document.createElement("div");
    tooltipEl.style.background = "rgba(0, 0, 0, 0.7)";
    tooltipEl.style.borderRadius = "3px";
    tooltipEl.style.color = "white";
    tooltipEl.style.opacity = 1;
    tooltipEl.style.pointerEvents = "none";
    tooltipEl.style.position = "absolute";
    tooltipEl.style.transform = "translate(-50%, 0)";
    tooltipEl.style.transition = "all .1s ease";

    const element = document.createElement("div");
    element.classList.add("chartjs-tooltip");
    element.classList.add("text-center");
    tooltipEl.appendChild(element);
    chart.canvas.parentNode.appendChild(tooltipEl);
  }

  return tooltipEl;
};

export const externalTooltipHandler = (context: Record<string, any>) => {
  // Tooltip Element
  const {
    chart,
    tooltip
  } = context;
  const tooltipEl = getOrCreateTooltip(chart);
  // Hide if no tooltip
  if (tooltip.opacity === 0) {
    tooltipEl.style.opacity = 0;
    return;
  }

  // Set Text
  if (tooltip.body) {
    const tableRoot = tooltipEl.querySelector(".chartjs-tooltip");
    const titleLines = tooltip.title || [];
    const bodyLines = tooltip.body.map((b: Record<string, any>) => b.lines);

    const tableHead = document.createElement("div");
    tableHead.classList.add("text-center");
    tableHead.classList.add("text-nowrap");

    bodyLines.forEach((body: string, i: number) => {
      tableHead.innerHTML += `
      <img class="d-block mx-auto mb-2 rounded-circle" src="${context.tooltip.dataPoints[0].dataset.url}" width="60px">
      `;
      const colors = tooltip.labelColors[i];

      tableHead.innerHTML += `
      <span class="d-inline-block" style="background: ${colors.backgroundColor}; border: 2px solid ${colors.borderColor}; width: 12px; height: 12px; margin-right: 2px" />
      `;

      tableHead.innerHTML += `
      <strong>${body}</strong>
      `;
    });

    titleLines.forEach((title: string) => {
      tableHead.innerHTML += `
      <div class="my-2">
        <small class="text-nowrap">
          <img src="/images/lol/${context.tooltip.dataPoints[0].dataset.elo[historyLabels.indexOf(title)]}.png" height="40px"> ${context.tooltip.dataPoints[0].dataset.tier[historyLabels.indexOf(title)]}
        </small>
        <small class="d-block text-nowrap">
          <strong>${context.tooltip.dataPoints[0].dataset.lp[historyLabels.indexOf(title)]} LP</strong>
        </small>
      </div>
      `;

      tableHead.innerHTML += `
      <h6 class="text-muted mb-0 fw-bold">${title}</h6>
      `;
    });

    // Remove old children
    if(tableRoot && tableRoot.firstChild) {
      while (tableRoot.firstChild) {
        tableRoot.firstChild.remove();
      }
    }


    // Add new children
    tableRoot.appendChild(tableHead);
  }

  const {
    offsetLeft: positionX,
    offsetTop: positionY
  } = chart.canvas;

  // Display, position, and set styles for font
  tooltipEl.style.opacity = 1;
  tooltipEl.style.left = positionX + tooltip.caretX + "px";
  tooltipEl.style.top = positionY + tooltip.caretY + "px";
  tooltipEl.style.font = tooltip.options.bodyFont.string;
  tooltipEl.style.padding = tooltip.options.padding + "px " + tooltip.options.padding + "px";
};