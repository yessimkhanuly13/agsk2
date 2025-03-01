// app/api/books/route.js
import { NextResponse } from 'next/server';

export async function GET(req) {
  const url = new URL(req.url);
  const book = url.searchParams.get("book");  // Получаем параметр "book" из URL
  // Данные для каждой книги
  const data = {
    book1: [
      { code: "214-210-0701", name: "Арматура диаметром 8 мм", oldPrice: 293172, newPrice: 290179, group: "Сталь арматурная", month: 2, book: "book1" },
      { code: "214-210-0702", name: "Арматура диаметром 10 мм", oldPrice: 284203, newPrice: 281250, group: "Сталь арматурная", month: 2, book: "book1" },
      { code: "214-210-0703", name: "Арматура диаметром 12 мм", oldPrice: 279719, newPrice: 276786, group: "Сталь арматурная", month: 2, book: "book1" },
      { code: "214-210-0704", name: "Арматура диаметром 14 мм", oldPrice: 275234, newPrice: 272321, group: "Сталь арматурная", month: 2, book: "book1" },
      { code: "214-210-0705", name: "Арматура диаметром 16 мм", oldPrice: 275234, newPrice: 272321, group: "Сталь арматурная", month: 2, book: "book1" },
      { code: "214-210-0706", name: "Арматура диаметром 18 мм", oldPrice: 275234, newPrice: 272321, group: "Сталь арматурная", month: 2, book: "book1" },
      { code: "214-210-0707", name: "Арматура диаметром 20 мм", oldPrice: 275234, newPrice: 272321, group: "Сталь арматурная", month: 2, book: "book1" },
      { code: "214-210-0708", name: "Арматура диаметром 22 мм", oldPrice: 275234, newPrice: 272321, group: "Сталь арматурная", month: 2, book: "book1" },
      { code: "214-210-0709", name: "Арматура диаметром 25 мм", oldPrice: 275234, newPrice: 272321, group: "Сталь арматурная", month: 2, book: "book1" },
      { code: "214-210-0710", name: "Арматура диаметром 28 мм", oldPrice: 275234, newPrice: 272321, group: "Сталь арматурная", month: 2, book: "book1" },
      { code: "214-210-0711", name: "Арматура диаметром 32 мм", oldPrice: 275234, newPrice: 272321, group: "Сталь арматурная", month: 2, book: "book1" },
      { code: "214-210-0712", name: "Арматура диаметром 40 мм", oldPrice: 275234, newPrice: 272321, group: "Сталь арматурная", month: 2, book: "book1" }
    ],
    book2: [
        { code: "521-101-0100", name: "Оборудование игровое", oldPrice: 235555, newPrice: 233871, group: "Оборудование, мебель, технические средства обучения", month: 2, book: "book2" },
        { code: "521-101-0121", name: "Ширма для кукольного театра", oldPrice: 8482, newPrice: 8482, group: "Оборудование, мебель, технические средства обучения", month: 2, book: "book2" },
        { code: "521-101-0131", name: "Манеж детский", oldPrice: 8482, newPrice: 8482, group: "Оборудование, мебель, технические средства обучения", month: 2, book: "book2" },
        { code: "521-101-0131-0001", name: "Манеж детский 830x680 мм", oldPrice: 8482, newPrice: 8482, group: "Оборудование, мебель, технические средства обучения", month: 2, book: "book2" },
        { code: "521-101-0131-0002", name: "Манеж детский 840x840x680 мм", oldPrice: 8929, newPrice: 8929, group: "Оборудование, мебель, технические средства обучения", month: 2, book: "book2" },
        { code: "521-101-0131-0003", name: "Корзина для игрушек 420x840x680 мм", oldPrice: 8482, newPrice: 8482, group: "Оборудование, мебель, технические средства обучения", month: 2, book: "book2" },
        { code: "521-101-0301-0001", name: "Полка книжная 1300x200x550", oldPrice: 9543, newPrice: 9543, group: "Оборудование, мебель, технические средства обучения", month: 2, book: "book2" },
        { code: "521-101-0302", name: "Стол рабочий для 4 детей 900*900*570 мм", oldPrice: 52197, newPrice: 51786, group: "Оборудование, мебель, технические средства обучения", month: 2, book: "book2" },
        { code: "521-101-0303-0001", name: "Дидактический стол с набором игрушек L180 W50 H46", oldPrice: 433006, newPrice: 429911, group: "Оборудование, мебель, технические средства обучения", month: 2, book: "book2" },
        { code: "521-101-0304-0001", name: "Стенка для игрушек 'Пирамида' 2900*350*950", oldPrice: 98051, newPrice: 98051, group: "Оборудование, мебель, технические средства обучения", month: 2, book: "book2" }
    ],
    book3: [

            { code: "523-202-0100", name: "Кабинет УЗИ АПП, стационар", oldPrice: 11054286, newPrice: 11054286, group: "Отделение лучевой диагностики", month: 2, book: "book3" },
            { code: "523-202-0101", name: "Аппарат УЗИ с функцией допплерографического картирования", oldPrice: 55000000, newPrice: 55000000, group: "Отделение лучевой диагностики", month: 2, book: "book3" },
            { code: "523-202-0103", name: "Система ультразвуковая типа Vanguard 10", oldPrice: 81598674, newPrice: 81015000, group: "Отделение лучевой диагностики", month: 2, book: "book3" },
            { code: "523-202-0104", name: "Система диагностическая ультразвуковая CX50", oldPrice: 42571365, newPrice: 42267000, group: "Отделение лучевой диагностики", month: 2, book: "book3" },
            { code: "523-202-0105", name: "Ультразвуковая диагностическая система типа Logiq P9", oldPrice: 40820373, newPrice: 40528311, group: "Отделение лучевой диагностики", month: 2, book: "book3" },
            { code: "523-202-0201-0002", name: "Томограф компьютерный с принадлежностями типа Incisive CT (128 срезов)", oldPrice: 629679136, newPrice: 625167295, group: "Отделение лучевой диагностики", month: 2, book: "book3" },
            { code: "523-202-0302", name: "Система магнитно-резонансной томографии", oldPrice: 906500395, newPrice: 900000000, group: "Отделение лучевой диагностики", month: 2, book: "book3" }

    ],
    book4: [
        { code: "531-201-0101-0001", name: "Станция ДВУ1-9000/СБ, производительность до 9000 м3/сут", oldPrice: 487920954, newPrice: 482048750, group: "Технологическое оборудование для приготовления питьевой воды", month: 2, book: "book4" },
        { code: "531-201-0201-0001", name: "Станция дозирования коагулянта серии СД/К-0,3/9000С, производительность 309 л/час", oldPrice: 71495490, newPrice: 70642500, group: "Технологическое оборудование для приготовления питьевой воды", month: 2, book: "book4" },
        { code: "531-201-0202-0001", name: "Станция дозирования извести серии СД/Щ-0,2/9000С, производительность 200 л/час", oldPrice: 69434283, newPrice: 68607000, group: "Технологическое оборудование для приготовления питьевой воды", month: 2, book: "book4" },
        { code: "531-201-0203-0001", name: "Станция дозирования флокулянта серии СД/Ф-0,16/9000С, производительность 16,5 л/час", oldPrice: 63215491, newPrice: 62463125, group: "Технологическое оборудование для приготовления питьевой воды", month: 2, book: "book4" },
        { code: "531-201-0301-0001", name: "Установка электролизная серии ЭЛУ/П-40х3/9000С", oldPrice: 196471376, newPrice: 194133750, group: "Технологическое оборудование для приготовления питьевой воды", month: 2, book: "book4" },
        { code: "531-201-0401-0001", name: "Отстойник горизонтальный проточный серии 'ОГ/ПГ-5/2250С'", oldPrice: 48913937, newPrice: 48325938, group: "Технологическое оборудование для приготовления питьевой воды", month: 2, book: "book4" }
      ]
  };

  // Проверяем, существует ли запрашиваемая книга
  if (!data[book]) {
    return NextResponse.json({ error: 'Книга не найдена' }, { status: 404 });
  }

  // Возвращаем данные для выбранной книги
  return NextResponse.json(data[book]);
}
