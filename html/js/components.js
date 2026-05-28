function loadScript(src) {
    return new Promise(function (resolve, reject) {
        let script = document.createElement('script');
        script.setAttribute("src", src);
        script.setAttribute("charset", 'utf-8');
        script.onload = () => resolve(script);
        script.onerror = () => reject(new Error(`Ошибка загрузки скрипта ${src}`));
        document.head.append(script);
    });
};

loadScript('/js/components/geomap.js')
// loadScript('/js/astro/chart.js')
//     .then(script => loadScript('/js/components/geomap.js'))
    .then(script => loadScript('/js/components/cities-autocomplete-0.0.2.js'))
    // .then(script => loadScript('/js/components/select-checkbox-0.0.2.js'))
    .then(script => loadScript('/js/lib/leaflet.js'))
    .then(script => loadScript('/js/components/chart/chartBtn.js'))
    .then(script => loadScript('/js/components/chart/chartIn.js'))
    .then(script => loadScript('/js/components/chart/chartSet.js'))
    .then(script => loadScript('/js/components/chart/chartsView.js'))
    .then(script => loadScript('/js/components/chart/chartsDBtree.js'))
    .then(script => loadScript('/js/components/chart/chartsDBtreeView.js'))
    .then(script => loadScript('/js/components/chart/chartsDBview-0.0.1.js'))

addEventListener("load", (event) => {
});    
