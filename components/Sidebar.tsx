import { Button } from "@/components/ui/button"

export function Sidebar() {
  return (
    <div className="w-64 h-screen bg-gray-100 p-4 flex flex-col">
      <h2 className="text-xl font-bold mb-4">Отчеты</h2>
      <div className="flex-grow space-y-2">
        <Button variant="default" className="w-full justify-start whitespace-normal h-auto py-2 text-left">
          Сверка АГСК
        </Button>
      </div>
    </div>
  )
}

