document.querySelector('header').innerHTML = `<span><select name='nav'>
<option value="/">☰ Home</option>
<option value="/calendar2D.html">☰ Календарь 2D</option>
<option value="/radix2D.html">☰ Радикс-гороскоп 2D</option>
<option value="/radix3D.html">☰ Радикс-гороскоп 3D</option>
<option value="/pie2D.html">☰ Карта-период 2D</option>
<option value="/rect2D.html">☰ График-период 2D</option>
<option value="/ephemeris2D.html">☰ Эфемериды 2D</option>
<option value="/about.html">☰ Обо мне, контакты</option>
<option value="picoclaw_check">☰ PicoClaw</option>
</select></span>
<span>ASTRO3D.RU</span>
<span>
<span id="default">🌐︎&#xfe0e;</span>
<span id="telegram"><a href="https://t.me" target="_blank"><img src="/img/header/icons-telegram.png" style="width:26px;"></a></span>
<span id="google"><a href="https://google.com" target="_blank"><img src="/img/btn-google-play-ru.svg"
style="width:80px;"></a></span>
</span>
`;

// АВТООПРЕДЕЛЕНИЕ ТЕКУЩЕЙ СТРАНИЦЫ ПРИ ЗАГРУЗКЕ
const selectElement = document.querySelector('header [name=nav]');
const currentPath = window.location.pathname;

// Ищем пункт меню, который совпадает с текущим адресом в строке браузера
for (let option of selectElement.options) {
    if (option.value === currentPath) {
        option.selected = true;
        break;
    }
}

// Запоминаем, какой пункт был активным изначально
let previousValue = selectElement.value;

selectElement.addEventListener('change', (e) => {
    const selectedValue = e.target.options[e.target.selectedIndex].value;

    // Проверяем, выставил ли пользователь пункт PicoClaw
    if (selectedValue === 'picoclaw_check') {
        // МГНОВЕННО ВОЗВРАЩАЕМ МЕНЮ НА ТЕКУЩУЮ СТРАНИЦУ
        selectElement.value = previousValue;

        const secureUrl = 'https://claw1.astro3d.ru/'; 
        const publicUrl = 'https://picoclaw.io';

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1500); 

        fetch(secureUrl + 'check-vpn.png?' + Date.now(), { 
            method: 'HEAD', 
            signal: controller.signal,
            mode: 'no-cors' 
        })
        .then(() => {
            clearTimeout(timeoutId);
            window.open(secureUrl, '_blank');
        })
        .catch(() => {
            clearTimeout(timeoutId);
            window.open(publicUrl, '_blank');
        });
    } else {
        // Если выбрана обычная страница — обновляем значение и переходим
        previousValue = selectedValue;
        document.location = selectedValue;
    }
});

document.querySelector('#default').addEventListener('click', (e) => {
    const html = document.documentElement;
    const height = Math.max(html.clientHeight, html.scrollHeight, html.offsetHeight) + 'px';
    
    const divbg = document.createElement('div');
    divbg.classList.add('modalbg');
    divbg.style.height = height;
    
    divbg.addEventListener('click', (event) => {
        if (divbg == event.target) {
            div.innerHTML = ``;
            document.body.removeChild(divbg);
        }
    });

    const div = document.createElement('div');
    div.classList.add('modal-default');
    
    const iframe = document.createElement('iframe');
    iframe.src = '/setting.html'; 
    
    div.append(iframe);
    
    iframe.onload = function () {
        iframe.style.height = iframe.contentDocument.body.clientHeight + 'px';
        iframe.style.width = iframe.contentDocument.body.clientWidth + 55 + 'px';
    };
    
    divbg.appendChild(div);
    document.body.appendChild(divbg);
});
