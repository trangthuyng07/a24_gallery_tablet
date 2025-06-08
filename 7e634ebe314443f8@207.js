function _chart($0){return(
$0
)}

function _filmSectionCarousel(datasets,html,d3)
{
  const width = 700;
  const defaultHeight = 800;

  const sections = [
    ["Top 10 Profit Films", datasets.topProfit],
    ["Top 10 ROI Films", datasets.topROI],
    ["Top 10 IMDb Rated Films", datasets.topIMDB],
    ["A24 Upcoming Films", datasets.upcoming],
    ["Unreleased A24 Films", datasets.unreleased],
    ["A24 Films in Post-Production", datasets.postProduction],
    ["A24 Films In Production", datasets.inProduction],
    ["A24 Planned Movies (No Release Date)", datasets.plannedNoDate],
    ["A24 Rumored Movies", datasets.rumored]
  ];

  const wrapper = html`<div style="position: relative; width: ${width}px; height: ${defaultHeight}px; overflow: auto; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); background: #000;"></div>`;
  const track = html`<div style="display: flex; transition: transform 0.5s ease; will-change: transform;"></div>`;
  wrapper.appendChild(track);

  const defaultPoster = "https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/A24_logo.svg/512px-A24_logo.svg.png";

  sections.forEach(([title, movies]) => {
    const maxGridHeight = 1420;
    const slideHeight = 540 + maxGridHeight;

    const slide = html`
      <div style="min-width: ${width}px; max-width: ${width}px; height: ${slideHeight}px; box-sizing: border-box; padding: 12px; background: #000; color: white; font-family: Inter, sans-serif;">
        <div style="font-size: 22px; font-weight: 600; margin-bottom: 12px;">${title}</div>
        <div style="
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 14px;
          max-height: ${maxGridHeight}px;
          overflow-y: auto;
          padding-right: 6px;
          scrollbar-width: thin;
          scrollbar-color: #555 #111;
        ">
          ${!movies?.length ? html`<div style="color:white;">Loading...</div>` : movies.map(movie => html`
            <div style="
              position: relative;
              border-radius: 10px;
              overflow: hidden;
              background: #111;
              cursor: pointer;
              transition: transform 0.3s ease, box-shadow 0.3s ease;
            " 
              onmouseover="this.style.transform='scale(1.03)'; this.style.boxShadow='0 8px 16px rgba(0,0,0,0.3)'"
              onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='none'"
              onclick="const box = this.querySelector('.info-box'); box.style.opacity = box.style.opacity === '1' ? '0' : '1'; box.style.pointerEvents = box.style.pointerEvents === 'auto' ? 'none' : 'auto';">

              <img src="${movie.poster_url || defaultPoster}" 
                   style="width: 100%; height: 320px; object-fit: cover;" />

              <div style="
                position: absolute;
                bottom: 0;
                left: 0;
                width: 100%;
                padding: 8px;
                background: linear-gradient(to top, rgba(0,0,0,0.75), transparent);
                color: white;
                font-weight: 600;
                font-size: 18px;
              ">
                ${movie.title || "Untitled"}
              </div>

              <div class="info-box" style="
                opacity: 0;
                pointer-events: none;
                position: absolute;
                inset: 0;
                background: rgba(20,20,20,0.95);
                color: white;
                padding: 16px;
                font-size: 13px;
                line-height: 1.5;
                z-index: 5;
                font-family: Inter, sans-serif;
                backdrop-filter: blur(4px);
                transition: opacity 0.4s ease;
              ">
                <div style="font-weight: 700; font-size: 15px; margin-bottom: 6px;">${movie.title || "Untitled"}</div>
                <div><strong>Director:</strong> ${movie.director || "N/A"}</div>
                <div><strong>Release:</strong> ${movie.release_date || "N/A"}</div>
                <div><strong>Genre:</strong> ${movie.genres || "N/A"}</div>
                <div><strong>Budget:</strong> ${movie.budget ? `$${d3.format(",")(movie.budget)}` : "N/A"}</div>
                <div><strong>Revenue:</strong> ${movie.revenue ? `$${d3.format(",")(movie.revenue)}` : "N/A"}</div>
                <div><strong>Profit:</strong> ${movie.budget && movie.revenue ? `$${d3.format(",")(movie.revenue - movie.budget)}` : "N/A"}</div>
                <div><strong>ROI:</strong> ${movie.budget && movie.revenue ? ((movie.revenue - movie.budget) / movie.budget * 100).toFixed(1) + "%" : "N/A"}</div>
              </div>

            </div>
          `)}
        </div>
      </div>
    `;
    track.appendChild(slide);
  });

  let current = 0;

  const btnStyle = `
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(255,255,255,0.2);
    border: none;
    border-radius: 50%;
    width: 42px;
    height: 42px;
    color: white;
    font-size: 20px;
    font-weight: bold;
    cursor: pointer;
    transition: background 0.3s ease;
    z-index: 10;
  `;

  const nextBtn = html`<button style="${btnStyle}; right: 8px;">›</button>`;
  nextBtn.onmouseover = () => nextBtn.style.background = "rgba(255,255,255,0.4)";
  nextBtn.onmouseout = () => nextBtn.style.background = "rgba(255,255,255,0.2)";
  nextBtn.onclick = () => {
    current = (current + 1) % sections.length;
    updateCarousel();
  };

  const prevBtn = html`<button style="${btnStyle}; left: 8px;">‹</button>`;
  prevBtn.onmouseover = () => prevBtn.style.background = "rgba(255,255,255,0.4)";
  prevBtn.onmouseout = () => prevBtn.style.background = "rgba(255,255,255,0.2)";
  prevBtn.onclick = () => {
    current = (current - 1 + sections.length) % sections.length;
    updateCarousel();
  };

  wrapper.appendChild(prevBtn);
  wrapper.appendChild(nextBtn);
  wrapper.appendChild(track);

  function updateCarousel() {
    track.style.transform = `translateX(-${width * current}px)`;
  }

  const interval = setInterval(() => {
    current = (current + 1) % sections.length;
    updateCarousel();
  }, 4000);

  wrapper.onmouseover = () => clearInterval(interval);

  return wrapper;
}
)}

function _datasets(cleanMovies,d3)
{
  const cleaned = [...cleanMovies]

  const topProfit = cleaned
    .filter(d => d.revenue > 0 && d.budget > 0)
    .map(d => ({...d, profit: d.revenue - d.budget}))
    .sort((a, b) => d3.descending(a.profit, b.profit))
    .slice(0, 10)

  const topROI = cleaned
    .filter(d => d.budget > 0 && d.revenue > 0)
    .map(d => ({...d, roi: d.revenue / d.budget}))
    .sort((a, b) => d3.descending(a.roi, b.roi))
    .slice(0, 10)

  const topIMDB = cleaned
    .filter(d => d.vote_average)
    .sort((a, b) => d3.descending(a.vote_average, b.vote_average))
    .slice(0, 10)

  const upcoming = cleaned.filter(d => d.status === "Planned" && d.release_date && new Date(d.release_date) > new Date())
  const unreleased = cleaned.filter(d => d.status === "Released" && (!d.release_date || new Date(d.release_date) > new Date()))
  const postProduction = cleaned.filter(d => d.status === "Post Production")
  const inProduction = cleaned.filter(d => d.status === "In Production")
  const plannedNoDate = cleaned.filter(d => d.status === "Planned" && !d.release_date)
  const rumored = cleaned.filter(d => d.status === "Rumored")

  return {
    topProfit,
    topROI,
    topIMDB,
    upcoming,
    unreleased,
    postProduction,
    inProduction,
    plannedNoDate,
    rumored
  }
}


function _cleanMovies(a24data){return(
a24data.filter(d => d.poster_url && d.title)
)}

function _a24data(FileAttachment){return(
FileAttachment("A24 Movies with Poster.csv").csv({typed: true})
)}

function _7(md){return(
md`# Untitled`
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["A24 Movies with Poster.csv", {url: new URL("./files/115b5f2577edd926f28c43ce7b940014840a6a6e557399045b0bbb486e0ba96552678c0a82e09ea5d7f9ed8df66bf2abd5911bc5380fa4842ef80a4e34b7b1bc.csv", import.meta.url), mimeType: "text/csv", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer("chart")).define("chart", ["viewof filmSectionCarousel"], _chart);
  main.variable(observer("viewof filmSectionCarousel")).define("viewof filmSectionCarousel", ["datasets","html","d3"], _filmSectionCarousel);
  main.variable(observer("filmSectionCarousel")).define("filmSectionCarousel", ["Generators", "viewof filmSectionCarousel"], (G, _) => G.input(_));
  main.variable(observer("createCarousel")).define("createCarousel", ["html","d3"], _createCarousel);
  main.variable(observer("datasets")).define("datasets", ["cleanMovies","d3"], _datasets);
  main.variable(observer("cleanMovies")).define("cleanMovies", ["a24data"], _cleanMovies);
  main.variable(observer("a24data")).define("a24data", ["FileAttachment"], _a24data);
  main.variable(observer()).define(["md"], _7);
  return main;
}
