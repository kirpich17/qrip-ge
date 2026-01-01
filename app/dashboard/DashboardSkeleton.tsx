import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar } from '@/components/ui/avatar';

export function DashboardSkeleton() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
        <div className="mb-8">
          <Skeleton className="mb-2 w-80 h-9" />
          <Skeleton className="w-96 h-6" />
        </div>

        <div className="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <Skeleton className="mb-3 w-32 h-5" />
                    <Skeleton className="w-20 h-10" />
                  </div>
                  <Skeleton className="rounded-full w-12 h-12" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="gap-8 grid grid-cols-1 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <Skeleton className="mb-2 w-48 h-8" />
                    <Skeleton className="w-64 h-5" />
                  </div>
                  <Skeleton className="rounded-md w-40 h-10" />
                </div>
                <Skeleton className="rounded-md w-full h-10" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[...Array(2)].map((_, i) => (
                    <div
                      key={i}
                      className="gap-3 grid grid-cols-[auto_1fr_auto] p-4 border border-gray-200 rounded-lg"
                    >
                      <Avatar className="w-16 h-16">
                        <Skeleton className="rounded-full w-full h-full" />
                      </Avatar>

                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Skeleton className="w-48 h-7" />
                          <Skeleton className="rounded-full w-16 h-6" />
                          <Skeleton className="rounded-full w-20 h-6" />
                        </div>
                        <Skeleton className="w-32 h-5" />
                        <div className="flex gap-6">
                          <Skeleton className="w-24 h-5" />
                          <Skeleton className="w-20 h-5" />
                          <Skeleton className="w-28 h-5" />
                        </div>
                      </div>

                      <div className="flex items-center">
                        <Skeleton className="rounded-full w-8 h-8" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="w-40 h-7" />
              </CardHeader>
              <CardContent className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="rounded-md w-full h-10" />
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Skeleton className="w-48 h-7" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-3">
                      <Skeleton className="rounded-full w-3 h-3" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="w-64 h-4" />
                        <Skeleton className="w-20 h-3" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
