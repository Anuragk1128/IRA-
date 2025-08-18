import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function AnalyticsLoading() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-64 bg-gray-200 rounded animate-pulse mt-2" />
        </div>
        <div className="flex items-center gap-4">
          <div className="h-10 w-40 bg-gray-200 rounded animate-pulse" />
          <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-20 bg-gray-200 rounded animate-pulse" />
              <div className="h-3 w-32 bg-gray-200 rounded animate-pulse mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="h-[300px] bg-gray-200 rounded animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
