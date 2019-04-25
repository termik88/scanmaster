// Функция ymaps.ready() будет вызвана, когда
// загрузятся все компоненты API, а также когда будет готово DOM-дерево.
ymaps.ready(init);
function init(){
  var isMobile = {
    Android: function() {return navigator.userAgent.match(/Android/i);},
    BlackBerry: function() {return navigator.userAgent.match(/BlackBerry/i);},
    iOS: function() {return navigator.userAgent.match(/iPhone|iPad|iPod/i);},
    Opera: function() {return navigator.userAgent.match(/Opera Mini/i);},
    Windows: function() {return navigator.userAgent.match(/IEMobile/i);},
    any: function() {
      return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
  };

  // Создание карты.
  var myMap = new ymaps.Map("map", {
    // Координаты центра карты.
    // Порядок по умолчанию: «широта, долгота».
    // Чтобы не определять координаты центра карты вручную,
    // воспользуйтесь инструментом Определение координат.
    center: [56.824012, 60.552243],
    // Уровень масштабирования. Допустимые значения:
    // от 0 (весь мир) до 19.
    zoom: 17
  });

  var myPlaceMark = new ymaps.Placemark([56.8241, 60.552243], {
    hintContent: 'г. Екатеринбург, ул. Заводская, д.75',
    balloonContent: 'Сканмастер.рф - Интернет-магазин диагностических адаптеров и автосканеров в Екатеринбурге'
  }, {
    iconLayout: 'default#image',
    iconImageHref: 'img/icon-map-pin.svg',
    iconImageSize: [120, 120],
    iconImageOffset: [-60, -120],
    hideIconOnBalloonOpen: false,
    balloonOffset: [ 100, 25 ],
    balloonMaxWidth: 300,
  });

  myMap.geoObjects.add(myPlaceMark);
  // myMap.controls.remove('zoomControl');
  myMap.behaviors.disable('scrollZoom');

  if(isMobile.any()){
    myMap.behaviors.disable('drag');
  }
}