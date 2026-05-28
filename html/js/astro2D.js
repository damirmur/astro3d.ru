const android = (navigator.userAgent.search(/Android|Linux/) > 0) ? true : false;
function loadScript(src){
    return new Promise(function (resolve, reject) {
        let script = document.createElement('script');
        script.setAttribute("src", src);
        script.setAttribute("charset", 'utf-8');
        script.onload = () => resolve(script);
        script.onerror = () => reject(new Error(`Ошибка загрузки скрипта ${src}`));
        document.head.append(script);
    });
}
loadScript('/js/web_statisic/google.js')
    .then(script => loadScript('/js/web_statisic/yandex.js'))
    .then(script => loadScript('/js/astro/astrodate-0.0.10.js'))
    .then(script => loadScript('/js/lib/source-0.0.6.js'))
    .then(script => loadScript('/js/components/select-checkbox-0.0.3.js'))
    .then(script => loadScript('/js/ephe/pluto.min.js'))
    .then(script => loadScript('https://cdn.plot.ly/plotly-2.27.1.min.js'))
    .then(script => loadScript('https://cdn.plot.ly/plotly-locale-ru-latest.js'))
    .then(script => (() => {
        if(defA3D.locale.slice(0, 2)=='ru'){
        let script = document.createElement('script');
        script.innerText = `Plotly.setPlotConfig({ locale: 'ru-RU' });localStorage.setItem('p', JSON.stringify('https://astro3d.ru/cbr/'));`;
        document.head.append(script);}
    })())
    //    .then(script => loadScript(''))
    ;
addEventListener("load", (event) => {
});