import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function SettingsLoading() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-64 bg-gray-200 rounded animate-pulse mt-2" />
        </div>
        <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
      </div>

      <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />

      <Card>
        <CardHeader>
          <div className="h-6 w-40 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-56 bg-gray-200 rounded animate-pulse" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="space-y-2">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
