console.log("hello from main.js!");

const themeToggleButton = document.querySelector("#theme-toggle");
const bodyElement = document.body;

function setTheme(isDark) {
    bodyElement.classList.toggle('dark-theme', isDark);
    themeToggleButton.setAttribute('aria-pressed', String(!!isDark));
}

// Load persisted preference (if any)
try {
    const stored = localStorage.getItem('cherry-theme');
    if (stored === 'dark') setTheme(true);
    else if (stored === 'light') setTheme(false);
} catch (e) {
    // localStorage may be unavailable in some contexts
    console.warn('localStorage unavailable', e);
}

if (themeToggleButton) {
    themeToggleButton.addEventListener('click', () => {
        const isDark = !bodyElement.classList.contains('dark-theme');
        setTheme(isDark);
        try { localStorage.setItem('cherry-theme', isDark ? 'dark' : 'light'); } catch (e) {}
    });
} else {
    console.warn('Theme toggle button not found');
}

        // --- Charts (Chart.js) ---
        function chartColorPalette(isDark) {
            return {
                text: getComputedStyle(document.documentElement).getPropertyValue('--text') || (isDark ? '#e6eef6' : '#0b0b0b'),
                grid: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(2,6,23,0.06)',
                series1: isDark ? '#6ec1ff' : '#0077cc',
                series2: isDark ? '#ffa07a' : '#ff6b6b',
            };
        }

        function createCharts() {
            const isDark = document.body.classList.contains('dark-theme');
            const pal = chartColorPalette(isDark);

            // Line chart
            const ctxLine = document.getElementById('chart-line');
            if (ctxLine) {
                window._chartLine = new Chart(ctxLine, {
                    type: 'line',
                    data: {
                        labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul'],
                        datasets: [{
                            label: 'Samples',
                            data: [12,19,8,17,23,14,20],
                            borderColor: pal.series1,
                            backgroundColor: pal.series1 + '33',
                            tension: 0.3,
                        }]
                    },
                    options: {
                        responsive: true,
                        plugins: { legend: { labels: { color: pal.text } } },
                        scales: {
                            x: { ticks: { color: pal.text }, grid: { color: pal.grid } },
                            y: { ticks: { color: pal.text }, grid: { color: pal.grid } }
                        }
                    }
                });
            }

            // Bar chart
            const ctxBar = document.getElementById('chart-bar');
            if (ctxBar) {
                window._chartBar = new Chart(ctxBar, {
                    type: 'bar',
                    data: {
                        labels: ['A','B','C','D','E'],
                        datasets: [{
                            label: 'Counts',
                            data: [5,9,7,14,6],
                            backgroundColor: [pal.series1, pal.series2, pal.series1, pal.series2, pal.series1],
                        }]
                    },
                    options: {
                        responsive: true,
                        plugins: { legend: { labels: { color: pal.text } } },
                        scales: {
                            x: { ticks: { color: pal.text }, grid: { color: pal.grid } },
                            y: { ticks: { color: pal.text }, grid: { color: pal.grid } }
                        }
                    }
                });
            }
        }

        function updateChartTheme() {
            const isDark = document.body.classList.contains('dark-theme');
            const pal = chartColorPalette(isDark);
            [window._chartLine, window._chartBar].forEach((c) => {
                if (!c) return;
                // update legend and axis colors
                c.options.plugins.legend.labels.color = pal.text;
                c.options.scales.x.ticks.color = pal.text;
                c.options.scales.y.ticks.color = pal.text;
                c.options.scales.x.grid.color = pal.grid;
                c.options.scales.y.grid.color = pal.grid;
                // update dataset colors conservatively
                c.data.datasets.forEach((d,i) => {
                    if (d.type === 'bar' || c.config.type === 'bar') {
                        d.backgroundColor = [pal.series1, pal.series2, pal.series1, pal.series2, pal.series1];
                    } else {
                        d.borderColor = pal.series1;
                        d.backgroundColor = pal.series1 + '33';
                    }
                });
                c.update();
            });
        }

        // create charts initially
        createCharts();

        // watch for theme changes and update charts
        const observer = new MutationObserver(() => updateChartTheme());
        observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
