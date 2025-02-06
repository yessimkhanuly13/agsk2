"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

// ----------------------------------
//         Типы и константы
// ----------------------------------
const PRICE_BOOKS = {
  book1: {
    title: "СПРАВОЧНИК СМЕТНЫХ ЦЕН НА СТРОИТЕЛЬНЫЕ МАТЕРИАЛЫ, ИЗДЕЛИЯ, КОНСТРУКЦИИ И ИНЖЕНЕРНОЕ ОБОРУДОВАНИЕ Книга 1",
    description: "Содержит сметные цены на основные строительные материалы, изделия и конструкции.",
  },
  "book1.1": {
    title: "Справочник сметных цен на строительные материалы, изделия и конструкции. Книга 1.1",
    description: "Дополнение к Книге 1, включает дополнительные материалы и уточненные цены.",
  },
  book2: {
    title: "Справочник сметных цен на оборудование, мебель и инвентарь для объектов образования. Книга 2",
    description: "Специализированный справочник для оснащения образовательных учреждений.",
  },
  book3: {
    title: "Справочник сметных цен на оборудование для объектов здравоохранения. Книга 3",
    description: "Содержит цены на медицинское оборудование и инвентарь для учреждений здравоохранения.",
  },
  book4: {
    title: "Справочник сметных цен на технологическое оборудование. Книга 4",
    description: "Включает цены на различное технологическое оборудование для промышленных объектов.",
  },
} as const

type PriceBook = keyof typeof PRICE_BOOKS

interface PriceDifference {
  code: string
  name: string
  oldPrice: number | null
  newPrice: number | null
  difference: number | null
  percentageChange: number | null
  group?: string
  oldQuantity?: number
  newQuantity?: number
  month: number
  book: PriceBook
  unit?: string
  manufacturer?: string
  technicalSpec?: string
}

interface GroupSummary {
  book: PriceBook
  totalOldPrice: number
  totalNewPrice: number
  priceDifference: number
  percentageChange: number
  totalOldQuantity: number
  totalNewQuantity: number
  quantityDifference: number
  itemCount: number
  increasedPrices: number
  decreasedPrices: number
  unchangedPrices: number
  increasedQuantities: number
  decreasedQuantities: number
  unchangedQuantities: number
}

interface ChangesSummary {
  totalRecords: number
  increasedPrices: number
  decreasedPrices: number
  unchangedPrices: number
  increasedQuantities: number
  decreasedQuantities: number
  unchangedQuantities: number
  averagePriceChange: number
  averageQuantityChange: number
}

// ----------------------------------
//  Компонент графика изменения цен
// ----------------------------------
function PriceChangeGraph({
  data,
  startMonth,
  endMonth,
  selectedGroup,
}: {
  data: PriceDifference[]
  startMonth: number
  endMonth: number
  selectedGroup: string
}) {
  const filteredData = data.filter(
    (item) =>
      item.month >= startMonth &&
      item.month <= endMonth &&
      (selectedGroup === "all" || item.group === selectedGroup),
  )

  const groupedData = filteredData.reduce(
    (acc, item) => {
      if (!acc[item.month]) {
        acc[item.month] = { month: item.month }
      }
      acc[item.month][item.name] = item.newPrice
      return acc
    },
    {} as Record<number, { month: number; [key: string]: number | null }>,
  )

  const chartData = Object.values(groupedData).sort((a, b) => a.month - b.month)
  const uniqueItems = Array.from(new Set(filteredData.map((item) => item.name)))
  const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#a4de6c"]

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <RechartsTooltip />
        <Legend />
        {uniqueItems.map((item, index) => (
          <Line
            key={item}
            type="monotone"
            dataKey={item}
            stroke={colors[index % colors.length]}
            activeDot={{ r: 8 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}

// ----------------------------------
//   Компонент «Бизнес-процесс»
// ----------------------------------
function BusinessProcess() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Бизнес-процесс инструмента сверки АГСК</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <section>
            <h3 className="text-lg font-semibold mb-2">1. Общее описание</h3>
            <p>
              Инструмент сверки АГСК (Автоматизированная Государственная Система Казначейства) представляет собой
              комплексное решение для анализа и сравнения ценовых данных в строительной отрасли. Он позволяет эффективно
              отслеживать изменения цен на строительные материалы, оборудование и услуги, обеспечивая прозрачность и
              обоснованность ценообразования в государственных закупках и проектах.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-2">2. Основные функциональные блоки</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Блок</TableHead>
                  <TableHead>Описание</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Сводный анализ</TableCell>
                  <TableCell>
                    Предоставляет общую картину изменений цен по различным справочникам и категориям товаров. Позволяет
                    быстро оценить масштаб и направление ценовых изменений.
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Детальная сверка</TableCell>
                  <TableCell>
                    Обеспечивает подробный анализ изменений цен на уровне отдельных позиций. Позволяет выявить аномалии
                    и обосновать изменения в ценах.
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">График изменения цен</TableCell>
                  <TableCell>
                    Визуализирует динамику изменения цен во времени, облегчая выявление трендов и сезонных колебаний.
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-2">3. Процесс работы с инструментом</h3>
            <ol className="list-decimal list-inside space-y-2">
              <li>
                <span className="font-medium">Загрузка данных:</span> Пользователь загружает актуальные данные из АГСК,
                включая информацию о ценах, количествах и категориях товаров.
              </li>
              <li>
                <span className="font-medium">Выбор параметров анализа:</span> Задаются временные рамки (начальный и
                конечный месяц), выбираются интересующие группы товаров и справочники.
              </li>
              <li>
                <span className="font-medium">Проведение сводного анализа:</span> Система автоматически рассчитывает и
                отображает общие показатели изменений цен и количеств по выбранным параметрам.
              </li>
              <li>
                <span className="font-medium">Детальная сверка:</span> Пользователь может углубиться в анализ конкретных
                позиций, используя фильтры и сортировку для выявления значимых изменений.
              </li>
              <li>
                <span className="font-medium">Визуальный анализ:</span> Использование графиков для наглядного
                представления динамики цен и выявления долгосрочных трендов.
              </li>
              <li>
                <span className="font-medium">Формирование выводов и рекомендаций:</span> На основе полученных данных
                пользователь формирует аналитические выводы и рекомендации для принятия управленческих решений.
              </li>
            </ol>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-2">4. Ключевые преимущества</h3>
            <ul className="list-disc list-inside space-y-2">
              <li>Автоматизация процесса сверки и анализа ценовых данных</li>
              <li>Повышение точности и обоснованности ценообразования в государственных закупках</li>
              <li>Возможность быстрого выявления аномальных изменений цен</li>
              <li>Улучшение прозрачности процесса формирования цен на строительные материалы и услуги</li>
              <li>Поддержка принятия обоснованных управленческих решений в сфере ценообразования</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-2">5. Перспективы развития</h3>
            <ul className="list-disc list-inside space-y-2">
              <li>Интеграция с системами машинного обучения для прогнозирования будущих изменений цен</li>
              <li>Расширение функционала для анализа региональных различий в ценообразовании</li>
              <li>Добавление модуля для автоматического формирования отчетов и рекомендаций</li>
              <li>Разработка мобильного приложения для доступа к аналитике в режиме реального времени</li>
            </ul>
          </section>
        </div>
      </CardContent>
    </Card>
  )
}

// ----------------------------------
//  Основной компонент AgskVerification
// ----------------------------------
export function AgskVerification() {
  const [comparisonData, setComparisonData] = useState<PriceDifference[]>([])
  const [groupSummaries, setGroupSummaries] = useState<GroupSummary[]>([])
  const [selectedStartMonth, setSelectedStartMonth] = useState<number>(1)
  const [selectedEndMonth, setSelectedEndMonth] = useState<number>(4)
  const [selectedGroup, setSelectedGroup] = useState<string>("all")
  const [selectedBook, setSelectedBook] = useState<PriceBook | "all">("all")

  // Функция для парсинга CSV-строки в массив объектов
  const parseCsv = (csvString: string): PriceDifference[] => {
    const lines = csvString
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0)

    // Первая строка — заголовки столбцов
    const headers = lines[0].split(",")

    // Оставшиеся строки — данные
    return lines.slice(1).map((line) => {
      const columns = line.split(",")

      // Сопоставляем столбцы с полями PriceDifference
      return {
        code: columns[0],
        name: columns[1],
        oldPrice: parseFloat(columns[2]) || null,
        newPrice: parseFloat(columns[3]) || null,
        difference: parseFloat(columns[4]) || null,
        percentageChange: parseFloat(columns[5]) || null,
        group: columns[6] || undefined,
        oldQuantity: parseFloat(columns[7]) || undefined,
        newQuantity: parseFloat(columns[8]) || undefined,
        month: parseInt(columns[9]) || 1,
        book: columns[10] as PriceBook,
      }
    })
  }

  // Подгружаем CSV-файлы из /public/data при первом рендере
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Загружаем текст CSV для каждой книги
        const [csv1, csv2, csv3, csv4] = await Promise.all([
          fetch("/data/book1.csv").then((res) => res.text()),
          fetch("/data/book2.csv").then((res) => res.text()),
          fetch("/data/book3.csv").then((res) => res.text()),
          fetch("/data/book4.csv").then((res) => res.text()),
        ])

        // Парсим CSV-файлы
        const book1Data = parseCsv(csv1)
        const book2Data = parseCsv(csv2)
        const book3Data = parseCsv(csv3)
        const book4Data = parseCsv(csv4)

        // Объединяем все данные в один массив
        const allData = [...book1Data, ...book2Data, ...book3Data, ...book4Data]
        setComparisonData(allData)
      } catch (error) {
        console.error("Ошибка при загрузке CSV-файлов:", error)
      }
    }

    fetchData()
  }, [])

  // Пересчитываем groupSummaries при изменении фильтров или данных
  useEffect(() => {
    const filteredData = comparisonData.filter(
      (item) =>
        item.month >= selectedStartMonth &&
        item.month <= selectedEndMonth &&
        (selectedGroup === "all" || item.group === selectedGroup) &&
        (selectedBook === "all" || item.book === selectedBook),
    )

    // Группируем по справочникам
    const groupedData = filteredData.reduce((acc, item) => {
      const book = item.book
      if (!acc[book]) {
        acc[book] = {
          book,
          totalOldPrice: 0,
          totalNewPrice: 0,
          priceDifference: 0,
          percentageChange: 0,
          totalOldQuantity: 0,
          totalNewQuantity: 0,
          quantityDifference: 0,
          itemCount: 0,
          increasedPrices: 0,
          decreasedPrices: 0,
          unchangedPrices: 0,
          increasedQuantities: 0,
          decreasedQuantities: 0,
          unchangedQuantities: 0,
        }
      }

      acc[book].totalOldPrice += (item.oldPrice || 0) * (item.oldQuantity || 1)
      acc[book].totalNewPrice += (item.newPrice || 0) * (item.newQuantity || 1)
      acc[book].totalOldQuantity += item.oldQuantity || 0
      acc[book].totalNewQuantity += item.newQuantity || 0
      acc[book].itemCount++

      if (item.percentageChange! > 0) acc[book].increasedPrices++
      else if (item.percentageChange! < 0) acc[book].decreasedPrices++
      else acc[book].unchangedPrices++

      const quantityChange = ((item.newQuantity || 0) - (item.oldQuantity || 0)) / (item.oldQuantity || 1)
      if (quantityChange > 0) acc[book].increasedQuantities++
      else if (quantityChange < 0) acc[book].decreasedQuantities++
      else acc[book].unchangedQuantities++

      return acc
    }, {} as Record<PriceBook, Omit<GroupSummary, "book"> & { book: PriceBook }>)

    // Считаем итоговые суммы и проценты
    const summaries = Object.values(groupedData).map((summary) => ({
      ...summary,
      priceDifference: summary.totalNewPrice - summary.totalOldPrice,
      percentageChange: (summary.totalOldPrice
        ? ((summary.totalNewPrice - summary.totalOldPrice) / summary.totalOldPrice) * 100
        : 0
      ),
      quantityDifference: summary.totalNewQuantity - summary.totalOldQuantity,
    }))

    setGroupSummaries(summaries)
  }, [comparisonData, selectedStartMonth, selectedEndMonth, selectedGroup, selectedBook])

  // Форматирование значений для вывода
  const formatPrice = (price: number | null): string => {
    if (price === null || isNaN(Number(price))) return "N/A"
    return price.toLocaleString("ru-RU", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " ₸"
  }

  const formatPercentage = (percentage: number | null): string => {
    if (percentage === null || isNaN(Number(percentage))) return "N/A"
    return percentage.toFixed(2) + "%"
  }

  // Подготовка данных для вывода "Изменений" (summary)
  const calculateChangesSummary = (data: PriceDifference[]): ChangesSummary => {
    const summary = {
      totalRecords: data.length,
      increasedPrices: 0,
      decreasedPrices: 0,
      unchangedPrices: 0,
      increasedQuantities: 0,
      decreasedQuantities: 0,
      unchangedQuantities: 0,
      averagePriceChange: 0,
      averageQuantityChange: 0,
    }

    let totalPriceChangePercent = 0
    let totalQuantityChangePercent = 0

    data.forEach((item) => {
      // Price changes
      if (item.percentageChange! > 0) {
        summary.increasedPrices++
      } else if (item.percentageChange! < 0) {
        summary.decreasedPrices++
      } else {
        summary.unchangedPrices++
      }

      // Quantity changes
      const quantityChange = (((item.newQuantity || 0) - (item.oldQuantity || 0)) / (item.oldQuantity || 1)) * 100
      if (quantityChange > 0) {
        summary.increasedQuantities++
      } else if (quantityChange < 0) {
        summary.decreasedQuantities++
      } else {
        summary.unchangedQuantities++
      }

      totalPriceChangePercent += item.percentageChange || 0
      totalQuantityChangePercent += quantityChange
    })

    // Средние проценты изменений
    summary.averagePriceChange = data.length ? totalPriceChangePercent / data.length : 0
    summary.averageQuantityChange = data.length ? totalQuantityChangePercent / data.length : 0

    return summary
  }

  // Фильтруем данные под выбранные параметры
  const filteredData = comparisonData.filter(
    (item) =>
      item.month >= selectedStartMonth &&
      item.month <= selectedEndMonth &&
      (selectedGroup === "all" || item.group === selectedGroup) &&
      (selectedBook === "all" || item.book === selectedBook),
  )
  // Считаем сводную инфу
  const changesSummary = calculateChangesSummary(filteredData)

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Сверка АГСК</h2>

      {/* Фильтры */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <Select
          value={selectedStartMonth.toString()}
          onValueChange={(value) => setSelectedStartMonth(Number(value))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Начальный месяц" />
          </SelectTrigger>
          <SelectContent>
            {[1, 2, 3, 4].map((month) => (
              <SelectItem key={month} value={month.toString()}>
                Месяц {month}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedEndMonth.toString()} onValueChange={(value) => setSelectedEndMonth(Number(value))}>
          <SelectTrigger>
            <SelectValue placeholder="Конечный месяц" />
          </SelectTrigger>
          <SelectContent>
            {[1, 2, 3, 4].map((month) => (
              <SelectItem key={month} value={month.toString()}>
                Месяц {month}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedGroup} onValueChange={setSelectedGroup}>
          <SelectTrigger>
            <SelectValue placeholder="Выберите группу" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все группы</SelectItem>
            {Array.from(new Set(comparisonData.map((item) => item.group)))
              .filter(Boolean)
              .map((group) => (
                <SelectItem key={group} value={group}>
                  {group}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>

        <Select value={selectedBook} onValueChange={(value) => setSelectedBook(value as PriceBook | "all")}>
          <SelectTrigger>
            <SelectValue placeholder="Выберите справочник" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все справочники</SelectItem>
            {Object.entries(PRICE_BOOKS).map(([key, { title }]) => (
              <SelectItem key={key} value={key}>
                {title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {groupSummaries.length > 0 && (
        <Tabs defaultValue="summary" className="mt-6">
          <TabsList>
            <TabsTrigger value="summary">Сводный анализ</TabsTrigger>
            <TabsTrigger value="details">Детальная сверка</TabsTrigger>
            <TabsTrigger value="graph">График изменения цен</TabsTrigger>
            <TabsTrigger value="business-process">Бизнес-процесс</TabsTrigger>
          </TabsList>

          {/* -------------------------------
               Сводный анализ
          -------------------------------- */}
          <TabsContent value="summary">
            <Card>
              <CardHeader>
                <CardTitle>Сводный анализ по справочникам</CardTitle>
                {selectedBook !== "all" && (
                  <div className="text-sm text-muted-foreground">
                    {PRICE_BOOKS[selectedBook as PriceBook].title}
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Справочник</TableHead>
                      <TableHead>Описание</TableHead>
                      <TableHead className="text-right">Кол-во позиций</TableHead>
                      <TableHead className="text-right">Сумма (Месяц {selectedStartMonth})</TableHead>
                      <TableHead className="text-right">Сумма (Месяц {selectedEndMonth})</TableHead>
                      <TableHead className="text-right">Разница</TableHead>
                      <TableHead className="text-right">Изменение (%)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {groupSummaries.map((summary, index) => (
                      <TableRow key={index}>
                        <TableCell>{PRICE_BOOKS[summary.book].title}</TableCell>
                        <TableCell>{PRICE_BOOKS[summary.book].description}</TableCell>
                        <TableCell className="text-right">{summary.itemCount}</TableCell>
                        <TableCell className="text-right">{formatPrice(summary.totalOldPrice)}</TableCell>
                        <TableCell className="text-right">{formatPrice(summary.totalNewPrice)}</TableCell>
                        <TableCell
                          className={`text-right ${
                            summary.priceDifference > 0 ? "text-red-500" : "text-green-500"
                          }`}
                        >
                          {formatPrice(summary.priceDifference)}
                        </TableCell>
                        <TableCell
                          className={`text-right ${
                            summary.percentageChange > 0 ? "text-red-500" : "text-green-500"
                          }`}
                        >
                          {formatPercentage(summary.percentageChange)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">Подробный анализ изменений по справочникам</h3>
                  {groupSummaries.map((summary, index) => (
                    <Card key={index} className="mb-4">
                      <CardHeader>
                        <CardTitle>{PRICE_BOOKS[summary.book].title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold mb-2">Изменения цен</h4>
                            <dl className="space-y-1">
                              <div className="flex justify-between">
                                <dt>Всего позиций:</dt>
                                <dd className="font-medium">{summary.itemCount}</dd>
                              </div>
                              <div className="flex justify-between">
                                <dt>Увеличение цены:</dt>
                                <dd className="font-medium text-red-500">
                                  {summary.increasedPrices} (
                                  {((summary.increasedPrices / summary.itemCount) * 100).toFixed(1)}%)
                                </dd>
                              </div>
                              <div className="flex justify-between">
                                <dt>Снижение цены:</dt>
                                <dd className="font-medium text-green-500">
                                  {summary.decreasedPrices} (
                                  {((summary.decreasedPrices / summary.itemCount) * 100).toFixed(1)}%)
                                </dd>
                              </div>
                              <div className="flex justify-between">
                                <dt>Без изменений:</dt>
                                <dd className="font-medium">
                                  {summary.unchangedPrices} (
                                  {((summary.unchangedPrices / summary.itemCount) * 100).toFixed(1)}%)
                                </dd>
                              </div>
                              <div className="flex justify-between border-t pt-1 mt-1">
                                <dt>Среднее изменение:</dt>
                                <dd
                                  className={`font-medium ${
                                    summary.percentageChange > 0 ? "text-red-500" : "text-green-500"
                                  }`}
                                >
                                  {formatPercentage(summary.percentageChange)}
                                </dd>
                              </div>
                            </dl>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">Изменения количества</h4>
                            <dl className="space-y-1">
                              <div className="flex justify-between">
                                <dt>Всего позиций:</dt>
                                <dd className="font-medium">{summary.itemCount}</dd>
                              </div>
                              <div className="flex justify-between">
                                <dt>Увеличение количества:</dt>
                                <dd className="font-medium text-blue-500">
                                  {summary.increasedQuantities} (
                                  {((summary.increasedQuantities / summary.itemCount) * 100).toFixed(1)}%)
                                </dd>
                              </div>
                              <div className="flex justify-between">
                                <dt>Уменьшение количества:</dt>
                                <dd className="font-medium text-orange-500">
                                  {summary.decreasedQuantities} (
                                  {((summary.decreasedQuantities / summary.itemCount) * 100).toFixed(1)}%)
                                </dd>
                              </div>
                              <div className="flex justify-between">
                                <dt>Без изменений:</dt>
                                <dd className="font-medium">
                                  {summary.unchangedQuantities} (
                                  {((summary.unchangedQuantities / summary.itemCount) * 100).toFixed(1)}%)
                                </dd>
                              </div>
                              <div className="flex justify-between border-t pt-1 mt-1">
                                <dt>Изменение общего количества:</dt>
                                <dd
                                  className={`font-medium ${
                                    summary.quantityDifference > 0 ? "text-blue-500" : "text-orange-500"
                                  }`}
                                >
                                  {summary.quantityDifference > 0 ? "+" : ""}
                                  {summary.quantityDifference} (
                                  {(
                                    (summary.quantityDifference / (summary.totalOldQuantity || 1)) *
                                    100
                                  ).toFixed(1)}
                                  %)
                                </dd>
                              </div>
                            </dl>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* -------------------------------
               Детальная сверка
          -------------------------------- */}
          <TabsContent value="details">
            <Card>
              <CardHeader>
                <CardTitle>Детальная сверка по позициям</CardTitle>
                {selectedBook !== "all" && (
                  <div className="text-sm text-muted-foreground">
                    {PRICE_BOOKS[selectedBook as PriceBook].title}
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Код</TableHead>
                        <TableHead>Наименование</TableHead>
                        <TableHead>Группа</TableHead>
                        <TableHead>Справочник</TableHead>
                        <TableHead>Месяц</TableHead>
                        <TableHead className="text-right">Цена (Месяц {selectedStartMonth})</TableHead>
                        <TableHead className="text-right">Цена (Месяц {selectedEndMonth})</TableHead>
                        <TableHead className="text-right">Разница</TableHead>
                        <TableHead className="text-right">Изменение (%)</TableHead>
                        <TableHead className="text-right">Старое кол-во</TableHead>
                        <TableHead className="text-right">Новое кол-во</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredData.map((item) => (
                        <TableRow key={`${item.code}-${item.month}`}>
                          <TableCell className="font-medium">{item.code}</TableCell>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.group}</TableCell>
                          <TableCell>{PRICE_BOOKS[item.book].title}</TableCell>
                          <TableCell>{item.month}</TableCell>
                          <TableCell className="text-right">{formatPrice(item.oldPrice)}</TableCell>
                          <TableCell className="text-right">{formatPrice(item.newPrice)}</TableCell>
                          <TableCell
                            className={`text-right ${
                              item.difference && item.difference > 0 ? "text-red-500" : "text-green-500"
                            }`}
                          >
                            {formatPrice(item.difference)}
                          </TableCell>
                          <TableCell
                            className={`text-right ${
                              item.percentageChange && item.percentageChange > 0 ? "text-red-500" : "text-green-500"
                            }`}
                          >
                            {formatPercentage(item.percentageChange)}
                          </TableCell>
                          <TableCell className="text-right">{item.oldQuantity}</TableCell>
                          <TableCell className="text-right">{item.newQuantity}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* -------------------------------
               График изменения цен
          -------------------------------- */}
          <TabsContent value="graph">
            <Card>
              <CardHeader>
                <CardTitle>График изменения цен</CardTitle>
                {selectedBook !== "all" && (
                  <div className="text-sm text-muted-foreground">
                    {PRICE_BOOKS[selectedBook as PriceBook].title}
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <PriceChangeGraph
                  data={comparisonData.filter((item) => selectedBook === "all" || item.book === selectedBook)}
                  startMonth={selectedStartMonth}
                  endMonth={selectedEndMonth}
                  selectedGroup={selectedGroup}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* -------------------------------
               Бизнес-процесс
          -------------------------------- */}
          <TabsContent value="business-process">
            <BusinessProcess />
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
