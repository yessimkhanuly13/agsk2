import type React from "react"
import { useState } from "react"
import * as XLSX from "xlsx"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"

interface AgskItem {
  code: string
  name: string
  price: number | null
  group?: string
  quantity?: number
}

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
}

interface AgskFileUploadProps {
  onDataCompared: (data: PriceDifference[]) => void
}

export const AgskFileUpload: React.FC<AgskFileUploadProps> = ({ onDataCompared }) => {
  const [file1, setFile1] = useState<File | null>(null)
  const [file2, setFile2] = useState<File | null>(null)
  const { toast } = useToast()

  const processExcelFile = async (file: File): Promise<AgskItem[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer)
          const workbook = XLSX.read(data, { type: "array" })
          const sheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[sheetName]
          const jsonData = XLSX.utils.sheet_to_json(worksheet)

          const formattedData: AgskItem[] = jsonData.map((row: any) => ({
            code: row["Код"]?.toString() || "",
            name: row["Наименование"]?.toString() || "",
            price: Number.parseFloat(row["Цена"]?.toString() || "0") || null,
            group: row["Группа"]?.toString() || "Без группы",
            quantity: Number.parseFloat(row["Количество"]?.toString() || "0") || 0,
          }))

          resolve(formattedData)
        } catch (error) {
          console.error("Ошибка при обработке файла:", error)
          reject(error)
        }
      }
      reader.onerror = (error) => reject(error)
      reader.readAsArrayBuffer(file)
    })
  }

  const compareFiles = async () => {
    if (!file1 || !file2) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, выберите оба файла для сравнения",
        variant: "destructive",
      })
      return
    }

    try {
      const oldData = await processExcelFile(file1)
      const newData = await processExcelFile(file2)

      const differences: PriceDifference[] = oldData
        .map((oldItem) => {
          const newItem = newData.find((item) => item.code === oldItem.code)

          const oldPrice = oldItem.price
          const newPrice = newItem?.price ?? null
          const difference = oldPrice !== null && newPrice !== null ? newPrice - oldPrice : null
          const percentageChange =
            oldPrice !== null && newPrice !== null && oldPrice !== 0 ? ((newPrice - oldPrice) / oldPrice) * 100 : null

          return {
            code: oldItem.code,
            name: oldItem.name,
            oldPrice,
            newPrice,
            difference,
            percentageChange,
            group: oldItem.group,
            oldQuantity: oldItem.quantity,
            newQuantity: newItem?.quantity,
          }
        })
        .filter((item) => item.oldPrice !== item.newPrice)

      differences.sort((a, b) => a.code.localeCompare(b.code))

      onDataCompared(differences)

      toast({
        title: "Успех",
        description: `Файлы успешно сравнены. Найдено ${differences.length} различий.`,
      })
    } catch (error) {
      console.error("Error comparing files:", error)
      toast({
        title: "Ошибка",
        description: "Не удалось сравнить файлы. Проверьте формат данных.",
        variant: "destructive",
      })
    }
  }

  const handleFileChange =
    (setFile: React.Dispatch<React.SetStateAction<File | null>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        setFile(e.target.files[0])
      }
    }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Старый файл:</label>
          <Input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileChange(setFile1)}
            className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold hover:file:bg-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Новый файл:</label>
          <Input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileChange(setFile2)}
            className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold hover:file:bg-gray-100"
          />
        </div>
      </div>
      <Button onClick={compareFiles} disabled={!file1 || !file2} className="w-full">
        Сравнить файлы
      </Button>
    </div>
  )
}

