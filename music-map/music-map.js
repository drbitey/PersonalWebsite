// Globals
let currentYear = 1970, isPlaying = false, genreDict = {}, idToGenre = {}, musicMetadata = {}, locationLookup = [], genreStats = {}, popupFeatures = [], currentPopupIndex = 0, mbidLookup = null, activePopup = null, searchTimeout;
let rafPending = false;
let isMinusOnly = false;

const protocol = new pmtiles.Protocol();
maplibregl.addProtocol("pmtiles", protocol.tile);

const map = new maplibregl.Map({
    container: 'map',
    style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
    center: [15, 20], zoom: 2.2, pitch: 0, bearing: 0, dragRotate: false, touchPitch: false   
});

map.on('load', async () => {
    // Note: Kept your absolute URLs for data to ensure hosting remains consistent
    const [dictRes, metaRes, locRes, statsRes, mbidRes] = await Promise.all([
        fetch("https://www.mvoltz.com/music-map/data/genre_dictionary.json"),
        fetch("https://www.mvoltz.com/music-map/data/metadata_lookup.json"),
        fetch("https://www.mvoltz.com/music-map/data/location_lookup.json"),
        fetch("https://www.mvoltz.com/music-map/data/genre_stats.json"),
        fetch("https://www.mvoltz.com/music-map/data/mbid_lookup.json")
    ]);
    
    genreDict = await dictRes.json(); 
    musicMetadata = await metaRes.json(); 
    locationLookup = await locRes.json(); 
    genreStats = await statsRes.json(); 
    mbidLookup = await mbidRes.json();
    idToGenre = Object.fromEntries(Object.entries(genreDict).map(([name, id]) => [id, name]));

    map.addSource('music-points', { type: 'vector', url: `pmtiles://https://www.mvoltz.com/music-map/data/music_data.pmtiles` });
    
    map.addLayer({ 
        'id': 'music-heat', 
        'type': 'heatmap', 
        'source': 'music-points', 
        'source-layer': 'music', 
        'layout': { 'visibility': 'none' }, 
        'paint': { 
            'heatmap-weight': 1, 
            'heatmap-intensity': 1, 
            'heatmap-radius': 20, 
            'heatmap-opacity': 0.8,
            'heatmap-color': [
                'interpolate', ['linear'], ['heatmap-density'],
                0, 'rgba(0, 255, 204, 0)',
                0.2, 'rgba(0, 255, 204, 0.2)',
                0.4, 'rgba(0, 255, 204, 0.5)',
                0.6, 'rgba(0, 255, 204, 0.8)',
                1, '#fff'
            ]
        } 
    });

    map.addLayer({ 
        'id': 'music-layer', 
        'type': 'circle', 
        'source': 'music-points', 
        'source-layer': 'music', 
        'paint': { 
            'circle-radius': ['interpolate', ['linear'], ['zoom'], 2, 2, 10, 8], 
            'circle-color': '#00ffcc', 
            'circle-opacity': 0.7 
        } 
    });

    map.on('click', (e) => {
        const activeLayer = map.getLayoutProperty('music-heat', 'visibility') === 'visible' ? 'music-heat' : 'music-layer';
        popupFeatures = map.queryRenderedFeatures(e.point, { layers: [activeLayer] });
        currentPopupIndex = 0;
        if (popupFeatures.length > 0) showPopup(e.lngLat);
    });

    const loader = document.getElementById('loader-screen');
    if (loader) {
        loader.classList.add('hidden');
        // Update debug log status
        document.getElementById('debug-log').innerText = "Status: Ready!";
    }

    initControls();
    updateFilters();
});

async function showPopup(lngLat) {
    if (activePopup) activePopup.remove();
    const feat = popupFeatures[currentPopupIndex];
    const muId = feat.properties.mu_id;
    const d = musicMetadata[muId];
    if (!d) return;

    const genreNames = d[3].map(id => idToGenre[id]).filter(Boolean);
    const genreListHTML = genreNames.map(g => `<span class="genre-tag">${g}</span>`).join('');

    const mbid = mbidLookup ? mbidLookup[muId] : null;
    const artUrl = mbid ? `https://coverartarchive.org/release-group/${mbid}/front-250` : '';

    const html = `
        <div class="popup-header">${locationLookup[d[2]] || 'Unknown Location'}</div>
        <div class="popup-body">
            <div class="popup-info">
                <div class="popup-artist">${d[0]}</div>
                <div class="popup-release">${d[1]}</div>
                <div class="popup-year">${d[4]}</div>
                <div class="genre-container">
                    ${genreListHTML}
                </div>
            </div>
            <div class="popup-right-col">
                <div class="popup-art-container">
                    ${mbid ? `
                        <div class="spinner" id="art-spinner"></div>
                        <img class="popup-art" src="${artUrl}" 
                             onload="document.getElementById('art-spinner').style.display='none'; this.style.display='block';"
                             onerror="this.style.display='none'; document.getElementById('art-spinner').style.display='none'; document.getElementById('no-art').style.display='block';">
                        <div id="no-art" class="no-art-text" style="display:none;">No Cover Art Found</div>
                    ` : `<div class="no-art-text">No Cover Art Found</div>`}
                </div>
            </div>
        </div>
        <div class="popup-footer">
            <a href="https://musicbrainz.org/release-group/${mbid}" target="_blank" class="mb-link">MUSICBRAINZ ↗</a>
            ${popupFeatures.length > 1 ? `<div>
                <button onclick="changePopup(-1)" class="nav-btn">◀</button>
                <span style="font-size:10px; margin:0 5px;">${currentPopupIndex+1}/${popupFeatures.length}</span>
                <button onclick="changePopup(1)" class="nav-btn">▶</button>
            </div>` : ''}
        </div>
    `;

    activePopup = new maplibregl.Popup({ maxWidth: 'none', closeButton: false }).setLngLat(lngLat).setHTML(html).addTo(map);
}

window.changePopup = (dir) => {
    currentPopupIndex = (currentPopupIndex + dir + popupFeatures.length) % popupFeatures.length;
    showPopup(activePopup.getLngLat());
};

function triggerMapUpdate() {
    if (!rafPending) {
        rafPending = true;
        requestAnimationFrame(() => {
            updateFilters();
            rafPending = false;
        });
    }
}

function updateFilters() {
    const searchTerm = document.getElementById('genre-search').value.trim().toLowerCase();
    const isCumulative = document.getElementById('cumulative-toggle').checked;
    const buffer = parseInt(document.getElementById('buffer-slider').value);

    let yearFilter;
    if (isCumulative) {
        yearFilter = ['<=', ['get', 'release_year'], currentYear];
    } else {
        const startYear = currentYear - buffer;
        const endYear = isMinusOnly ? currentYear : (currentYear + buffer);
        
        yearFilter = [
            'all',
            ['>=', ['get', 'release_year'], startYear],
            ['<=', ['get', 'release_year'], endYear]
        ];
    }

    let finalFilter = yearFilter;
    if (searchTerm) {
        let ids = Object.entries(genreDict).filter(([g]) => g.includes(searchTerm)).map(([_, id]) => id);
        if (ids.length) {
            finalFilter = ['all', yearFilter, ['any', ...ids.map(id => ['in', `|${id}|`, ['get', 'genre_ids']])]];
        } else {
            finalFilter = ['==', ['get', 'release_year'], -1];
        }
    }

    map.setFilter('music-layer', finalFilter);
    map.setFilter('music-heat', finalFilter);
    document.getElementById('year-display').innerText = currentYear;
    updateStats();
}

function updateStats() {
    const searchTerm = document.getElementById('genre-search').value.trim().toLowerCase();
    const spotlight = genreStats[searchTerm];
    const panBtn = document.getElementById('pan-to-origin');
    
    if (spotlight && searchTerm.length > 2) {
        panBtn.style.display = 'block';
        document.getElementById('stats-title').innerText = `${searchTerm.toUpperCase()} OVERVIEW`;
        document.getElementById('stat-total').innerText = spotlight.total_count.toLocaleString();
        document.getElementById('stat-first-year').innerText = spotlight.first_year;
        
        panBtn.onclick = () => {
            map.flyTo({
                center: spotlight.origin_coords,
                zoom: 5,
                essential: true
            });
        };
    } else {
        panBtn.style.display = 'none';
        document.getElementById('stats-title').innerText = `Global Stats`;
        document.getElementById('stat-total').innerText = "0";
        document.getElementById('stat-first-year').innerText = "-";
    }
}

function initControls() {
    const colorSchemes = {
        teal: [
            'interpolate', ['linear'], ['heatmap-density'],
            0, 'rgba(0, 255, 204, 0)',
            0.2, 'rgba(0, 255, 204, 0.2)',
            0.4, 'rgba(0, 255, 204, 0.5)',
            0.6, 'rgba(0, 255, 204, 0.8)',
            1, '#fff'
        ],
        inferno: [
            'interpolate', ['linear'], ['heatmap-density'],
            0, 'rgba(0, 0, 0, 0)',
            0.2, 'rgb(120, 24, 157)',
            0.4, 'rgb(230, 0, 0)',
            0.6, 'rgb(255, 150, 0)',
            1, 'rgb(255, 255, 150)'
        ],
        magma: [
            'interpolate', ['linear'], ['heatmap-density'],
            0, 'rgba(0, 0, 0, 0)',
            0.2, 'rgb(50, 10, 95)',
            0.5, 'rgb(180, 50, 120)',
            0.8, 'rgb(250, 160, 110)',
            1, '#fff'
        ],
        glacier: [
            'interpolate', ['linear'], ['heatmap-density'],
            0, 'rgba(0, 0, 0, 0)',
            0.3, 'rgb(0, 100, 255)',
            0.6, 'rgb(0, 200, 255)',
            0.9, 'rgb(200, 255, 255)',
            1, '#fff'
        ]
    };

    let artistSearchTimeout;
    const artistInput = document.getElementById('artist-search');
    const artistResults = document.getElementById('artist-results');

    artistInput.addEventListener('input', (e) => {
        clearTimeout(artistSearchTimeout);
        const val = e.target.value.toLowerCase();

        if (val.length < 3) {
            artistResults.style.display = 'none';
            artistResults.innerHTML = '';
            return;
        }

        artistSearchTimeout = setTimeout(() => {
            const matches = [];
            const keys = Object.keys(musicMetadata);
        
            for (let i = 0; i < keys.length; i++) {
                const muId = keys[i];
                const d = musicMetadata[muId];
                if (d[0].toLowerCase().includes(val)) {
                    matches.push([muId, d]);
                }
                if (matches.length >= 10) break;
            }

            if (matches.length > 0) {
                renderArtistResults(matches);
            } else {
                artistResults.innerHTML = `
                    <div style="padding: 15px; color: #666; font-size: 12px; text-align: center; border-top: 1px solid #222;">
                        No artists found for "<span style="color: #00ffcc;">${val}</span>"
                    </div>
                `;
                artistResults.style.display = 'block';
            }
        }, 300);
    });

    function renderArtistResults(matches) {
        artistResults.innerHTML = '';
        artistResults.style.display = 'block';
        
        matches.forEach(([muId, d]) => {
            const div = document.createElement('div');
            div.style = "padding: 10px 15px; cursor: pointer; border-bottom: 1px solid #222; transition: background 0.1s;";
            div.innerHTML = `
                <div style="font-weight: bold; color: #fff; font-size: 13px;">${d[0]}</div>
                <div style="font-size: 10px; color: #00ffcc; opacity: 0.8;">${d[1]} • ${d[4]}</div>
            `;
            
            div.onclick = () => {
                jumpToArtist(muId, d);
                artistResults.style.display = 'none';
                document.getElementById('artist-search').value = d[0];
            };
            
            div.onmouseenter = () => div.style.background = "#1a1a1a";
            div.onmouseleave = () => div.style.background = "transparent";
            artistResults.appendChild(div);
        });
    }

    document.addEventListener('click', (e) => {
        if (!artistInput.contains(e.target)) artistResults.style.display = 'none';
    });
    
    document.getElementById('year-slider').addEventListener('input', (e) => {
        currentYear = parseInt(e.target.value);
        document.getElementById('year-display').innerText = currentYear;
        triggerMapUpdate();
    });

    document.getElementById('cumulative-toggle').addEventListener('change', (e) => {
        const isCumulative = e.target.checked;
        document.getElementById('buffer-label-container').style.display = isCumulative ? 'none' : 'block';
        document.getElementById('range-mode-btn').style.display = isCumulative ? 'none' : 'block';
        triggerMapUpdate();
    });

    document.getElementById('range-mode-btn').onclick = function() {
        isMinusOnly = !isMinusOnly;
        this.innerText = isMinusOnly ? "- Prior" : "± Range";
        this.style.color = isMinusOnly ? "#ff6600" : "#00ffcc";
        document.getElementById('buffer-prefix').innerText = isMinusOnly ? "-" : "±";
        triggerMapUpdate();
    };

    document.getElementById('buffer-slider').addEventListener('input', (e) => {
        document.getElementById('buffer-display').innerText = e.target.value;
        triggerMapUpdate();
    });

    document.getElementById('genre-search').addEventListener('input', () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(updateFilters, 300);
    });
    
    document.getElementById('play-btn').addEventListener('click', function() {
        isPlaying = !isPlaying;
        this.innerText = isPlaying ? "⏸ Pause Timeline" : "▶ Play Timeline";
        if (isPlaying) animate();
    });

    document.getElementById('adv-toggle').onclick = function() {
        const content = document.getElementById('adv-content');
        const isHidden = content.style.display === 'none' || content.style.display === '';
        content.style.display = isHidden ? 'flex' : 'none';
        this.innerText = isHidden ? 'Advanced Settings ▴' : 'Advanced Settings ▾';
    };

    document.getElementById('heat-radius-slider').oninput = function() {
        map.setPaintProperty('music-heat', 'heatmap-radius', parseInt(this.value));
    };

    document.getElementById('heat-intensity-slider').oninput = function() {
        map.setPaintProperty('music-heat', 'heatmap-intensity', parseFloat(this.value));
    };

    document.getElementById('heat-color-select').onchange = function() {
        const scheme = colorSchemes[this.value];
        if (scheme) {
            map.setPaintProperty('music-heat', 'heatmap-color', scheme);
        }
    };

    document.getElementById('btn-points').onclick = () => toggleLayer(false);
    document.getElementById('btn-heatmap').onclick = () => toggleLayer(true);

    document.getElementById('reset-btn').onclick = () => {
        currentYear = 1970;
        isPlaying = false;
        document.getElementById('play-btn').innerText = "▶ Play Timeline";
        document.getElementById('genre-search').value = "";
        document.getElementById('artist-search').value = "";
        document.getElementById('year-slider').value = 1970;
        map.flyTo({ center: [15, 20], zoom: 2.2, pitch: 0, bearing: 0 });
        document.getElementById('year-display').innerText = "1970";
        triggerMapUpdate();
    };
}

function jumpToArtist(muId, d) {
    currentYear = d[4]; 
    document.getElementById('year-slider').value = currentYear;
    document.getElementById('year-display').innerText = currentYear;
    document.getElementById('genre-search').value = "";

    const coords = [d[6], d[5]];
    map.flyTo({
        center: coords,
        zoom: 9,
        pitch: 0,
        bearing: 0,
        essential: true,
        speed: 1.5
    });

    triggerMapUpdate();

    setTimeout(() => {
        popupFeatures = [{ properties: { mu_id: muId } }];
        currentPopupIndex = 0;
        showPopup(coords);
    }, 1600);
}

function toggleLayer(isHeat) {
    map.setLayoutProperty('music-layer', 'visibility', isHeat ? 'none' : 'visible');
    map.setLayoutProperty('music-heat', 'visibility', isHeat ? 'visible' : 'none');
    document.getElementById('btn-points').classList.toggle('active', !isHeat);
    document.getElementById('btn-heatmap').classList.toggle('active', isHeat);
}

function animate() {
    if (!isPlaying) return;
    currentYear++;
    
    if (currentYear > 2025) {
        const searchTerm = document.getElementById('genre-search').value.trim().toLowerCase();
        const spotlight = genreStats[searchTerm];
        currentYear = (spotlight) ? spotlight.first_year : 1890;
        
        if (!document.getElementById('loop-toggle').checked) {
            isPlaying = false;
            document.getElementById('play-btn').innerText = "▶ Play Timeline";
            return;
        }
    }

    document.getElementById('year-slider').value = currentYear;
    triggerMapUpdate();

    const speedVal = parseInt(document.getElementById('speed-slider').value);
    const delay = 1000 - speedVal; 
    setTimeout(animate, delay);
}