//зададим начальные координаты для расположения фигуры на холсте по варианту
initCoordinates = [
  [0, -1, 1],
  [-3, -2, 1],
  [-3, 4, 1],
  [0, 3, 1],
  [3, 4, 1],
  [3, -2, 1],
  [0, -1, 1],
];

//копируем координаты для выполнения преобразований, начальные координаты понадобятся при возвращении фигуры в исходное
let workCoordinates = initCoordinates;

//зададим нулевые точки фигуры
widthZero = 300;
heightZero = 200;

//нарисуем фигуру
const paint = (c, p) => {
  const object = {
    strokeStyle: "#000",
    strokeWidth: 2,
    rounded: true,
    closed: true,
  };

  for (let i = 0; i < p.length; i += 1) {
    object["x" + (i + 1)] = p[i][0];
    object["y" + (i + 1)] = p[i][1];
  }

  c.drawLine(object);
};

// афинные преобразования

//функция сжатия-растяжения
const dilatation = (c, a, b) => {
  const dilateObject = [
    [a, 0, 0],
    [0, b, 0],
    [0, 0, 1],
  ];
  return numeric.dot(c, dilateObject);
};

//функция переноса
const translation = (c, x, y) => {
  let moveObject = [
    [1, 0, 0],
    [0, 1, 0],
    [x, y, 1],
  ];
  return numeric.dot(c, moveObject);
};

// функция поворота
const rotation = (c, angle, x0, y0) => {
  const radius = (angle * Math.PI) / 180.0;
  const rotateObject = [
    [Math.cos(radius), Math.sin(radius), 0],
    [-Math.sin(radius), Math.cos(radius), 0],
    [0, 0, 1],
  ];
  return translation(
    numeric.dot(translation(c, -x0, -y0), rotateObject),
    x0,
    y0
  );
};

//функция отражения
const mirrorReflecttion = (c) => {
  const reflectObject = [
    [1, 0, 0],
    [0, -1, 0],
    [0, 0, 1],
  ];
  return numeric.dot(c, reflectObject);
};

//возврат к начальному состоянию
const returnToDefaultState = (a, b) => {
  for (let i = 0; i < a.length; i += 1) {
    a[i][0] = b[i][0];
    a[i][1] = b[i][1];
    a[i][2] = b[i][2];
  }
  return a;
};

//подготовим начальное состояние фигуры, зададим координаты для работы и отрисуем фигуру в канве
$(document).ready(() => {
  workCoordinates = dilatation(workCoordinates, 20, 20);
  workCoordinates = translation(workCoordinates, widthZero, heightZero);
  workCoordinates = rotation(workCoordinates, 180, widthZero, heightZero);
  paint($("#canvas"), workCoordinates);

  //процесс поворота
  $("#rotate").click(() => {
    $("#canvas").clearCanvas();
    let angle = $(".parameters .angle").val();
    workCoordinates = rotation(workCoordinates, angle, widthZero, heightZero);
    paint($("#canvas"), workCoordinates);
  });

  //процесс растяжения-сжатия
  $("#dilatate").click(() => {
    $("#canvas").clearCanvas();
    let dilateAbscissa = $(".parameters .dilatate-abscissa").val();
    let dilateOrdinate = $(".parameters .dilatate-ordinate").val();
    workCoordinates = translation(workCoordinates, -widthZero, -heightZero);
    workCoordinates = dilatation(
      workCoordinates,
      dilateAbscissa,
      dilateOrdinate
    );
    workCoordinates = translation(workCoordinates, widthZero, heightZero);
    paint($("#canvas"), workCoordinates);
  });

  //процесс переноса
  $("#translate").click(() => {
    $("#canvas").clearCanvas();
    let transalteAbscissa = $(".translate-abscissa").val();
    let transalteOrdinate = $(".translate-ordinate").val();
    workCoordinates = translation(
      workCoordinates,
      transalteAbscissa,
      transalteOrdinate
    );
    paint($("#canvas"), workCoordinates);
  });

  //процесс отражения
  $("#mirror-reflect").click(() => {
    $("#canvas").clearCanvas();
    workCoordinates = mirrorReflecttion(workCoordinates);
    paint($("#canvas"), workCoordinates);
  });

  //сброс к начальным настройкам
  $("#default").click(() => {
    $("#canvas").clearCanvas();
    workCoordinates = returnToDefaultState(workCoordinates, initCoordinates);
    workCoordinates = dilatation(workCoordinates, 20, 20);
    workCoordinates = translation(workCoordinates, widthZero, heightZero);
    workCoordinates = rotation(workCoordinates, 180, widthZero, heightZero);
    paint($("#canvas"), workCoordinates);
  });
});
