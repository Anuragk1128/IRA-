import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function UsersLoading() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-64 bg-gray-200 rounded animate-pulse mt-2" />
        </div>
        <div className="h-10 w-24 bg-gray-200 rounded animate-pulse" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
              <div className="h-3 w-24 bg-gray-200 rounded animate-pulse mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="h-6 w-16 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
                  <div>
                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                    <div className="h-3 w-48 bg-gray-200 rounded animate-pulse mt-2" />
                  </div>
                </div>
                <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
