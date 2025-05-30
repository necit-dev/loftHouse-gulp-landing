import PhoneMask from '@zoibana/phonemask';
new PhoneMask('[data-tel-input]');

/* Nav icon */
const navBtn = document.querySelector('.nav-icon-btn');
const navIcon = document.querySelector('.nav-icon');
const headerTop = document.querySelector('.header__top');

navBtn.addEventListener('click', () => {
	navIcon.classList.toggle('active');
	headerTop.classList.toggle('header__top--mobile');
	document.body.classList.toggle('no-scroll');
});

/* Modal */

const modal = document.querySelector('.modal');
const video = document.querySelector('.video__link');
video.addEventListener('click', () => {
	modal.classList.add('show');
	document.body.classList.add('no-scroll');
});
modal.addEventListener('click', (e) => {
	if (e.target.id == 'video_yt'){
		stopPropagation();
	}
	modal.classList.remove('show');
	document.body.classList.remove('no-scroll');
});


/* Яндекс карты */

ymaps.ready(init);
    function init(){
        // Создание карты.
        var myMap = new ymaps.Map("map", {
            // Координаты центра карты.
            // Порядок по умолчанию: «широта, долгота».
            // Чтобы не определять координаты центра карты вручную,
            // воспользуйтесь инструментом Определение координат.
            center: [59.943543,30.338928],
            // Уровень масштабирования. Допустимые значения:
            // от 0 (весь мир) до 19.
            zoom: 16
        });
				var myPlacemark = new ymaps.Placemark([59.943543,30.338928], {
						balloonContent:
						`
							<div class="balloon">
							<div class="balloon__address">Наб реки Фонтанки 10-15</div>
							<div class="balloon__contacts">
								<a href="tel:+79999999999">8 (999) 999-99-99</a>
							</div>
							</div>
						`
					}, {
					iconLayout: 'default#image',
					iconImageHref: '../img/flag.svg',
					iconImageSize: [30, 42],
					iconImageOffset: [-7, -45]
			});

			myMap.controls.remove('geolocationControl');
			myMap.controls.remove('searchControl');
			myMap.controls.remove('trafficControl');
			myMap.controls.remove('typeSelector');
			myMap.controls.remove('rulerControl');

			myMap.geoObjects.add(myPlacemark);
			myPlacemark.balloon.open();
    }