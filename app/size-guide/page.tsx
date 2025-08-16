import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Ruler, Download } from "lucide-react"

export default function SizeGuidePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Size Guide</h1>
          <p className="text-lg text-gray-600">Find your perfect fit with our comprehensive sizing guide.</p>
        </div>

        {/* Ring Size Guide */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ruler className="w-5 h-5 text-rose-600" />
              Ring Size Guide
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid lg:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold mb-4">US Ring Size Chart</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2">US Size</th>
                        <th className="text-left py-2">Diameter (mm)</th>
                        <th className="text-left py-2">Circumference (mm)</th>
                      </tr>
                    </thead>
                    <tbody className="space-y-1">
                      {[
                        { size: "5", diameter: "15.7", circumference: "49.3" },
                        { size: "5.5", diameter: "16.1", circumference: "50.6" },
                        { size: "6", diameter: "16.5", circumference: "51.9" },
                        { size: "6.5", diameter: "16.9", circumference: "53.1" },
                        { size: "7", diameter: "17.3", circumference: "54.4" },
                        { size: "7.5", diameter: "17.7", circumference: "55.7" },
                        { size: "8", diameter: "18.1", circumference: "57.0" },
                        { size: "8.5", diameter: "18.5", circumference: "58.3" },
                        { size: "9", diameter: "18.9", circumference: "59.5" },
                      ].map((row) => (
                        <tr key={row.size} className="border-b border-gray-100">
                          <td className="py-2 font-medium">{row.size}</td>
                          <td className="py-2">{row.diameter}</td>
                          <td className="py-2">{row.circumference}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-4">How to Measure</h3>
                <div className="space-y-4 text-sm text-gray-600">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Method 1: Existing Ring</h4>
                    <p>
                      Measure the inside diameter of a ring that fits well on the intended finger. Compare with our size
                      chart above.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Method 2: String Method</h4>
                    <ol className="list-decimal list-inside space-y-1">
                      <li>Wrap string around your finger</li>
                      <li>Mark where the string overlaps</li>
                      <li>Measure the length in mm</li>
                      <li>Compare to circumference column</li>
                    </ol>
                  </div>

                  <div className="bg-rose-50 p-4 rounded-lg">
                    <h4 className="font-medium text-rose-800 mb-2">Pro Tips</h4>
                    <ul className="text-rose-700 text-sm space-y-1">
                      <li>• Measure at the end of the day when fingers are largest</li>
                      <li>• When in doubt, size up slightly</li>
                      <li>• Consider the width of the band</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Necklace Length Guide */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Necklace Length Guide</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold mb-4">Standard Lengths</h3>
                <div className="space-y-3">
                  {[
                    { length: '14"', name: "Choker", description: "Sits at the base of the neck" },
                    { length: '16"', name: "Princess", description: "Most popular length, sits at collarbone" },
                    { length: '18"', name: "Matinee", description: "Falls just below the collarbone" },
                    { length: '20"', name: "Opera", description: "Sits at or below the bust line" },
                    { length: '24"', name: "Rope", description: "Falls at the mid-chest" },
                    { length: '30"', name: "Long Rope", description: "Can be worn long or doubled" },
                  ].map((item) => (
                    <div key={item.length} className="flex gap-4">
                      <div className="w-12 text-sm font-medium">{item.length}</div>
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-gray-600">{item.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Measuring Tips</h3>
                <div className="space-y-4 text-sm text-gray-600">
                  <p>
                    Use a measuring tape or string to measure around your neck where you'd like the necklace to sit. Add
                    1-2 inches for comfort.
                  </p>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-2">Style Guide</h4>
                    <ul className="text-blue-700 space-y-1">
                      <li>• Chokers: Great for off-shoulder tops</li>
                      <li>• Princess: Perfect for everyday wear</li>
                      <li>• Matinee: Ideal for business attire</li>
                      <li>• Opera: Perfect for evening wear</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bracelet Size Guide */}
        <Card>
          <CardHeader>
            <CardTitle>Bracelet Size Guide</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold mb-4">Standard Sizes</h3>
                <div className="space-y-2">
                  {[
                    { size: "Extra Small", measurement: "6.5 inches" },
                    { size: "Small", measurement: "7 inches" },
                    { size: "Medium", measurement: "7.5 inches" },
                    { size: "Large", measurement: "8 inches" },
                    { size: "Extra Large", measurement: "8.5 inches" },
                  ].map((item) => (
                    <div key={item.size} className="flex justify-between py-1 border-b border-gray-100">
                      <span className="font-medium">{item.size}</span>
                      <span className="text-gray-600">{item.measurement}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-4">How to Measure</h3>
                <div className="space-y-4 text-sm text-gray-600">
                  <ol className="list-decimal list-inside space-y-2">
                    <li>Wrap a measuring tape around your wrist bone</li>
                    <li>Note the measurement where the tape meets</li>
                    <li>Add 0.5-1 inch for comfort</li>
                    <li>Choose the closest size from our chart</li>
                  </ol>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-green-800 text-sm">
                      <strong>Tip:</strong> For a snug fit, add 0.5 inches. For a loose fit, add 1 inch to your wrist
                      measurement.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Download Section */}
        <div className="text-center mt-12">
          <Card className="bg-rose-50 border-rose-200">
            <CardContent className="p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Need Help?</h3>
              <p className="text-gray-600 mb-6">
                Still unsure about sizing? Download our printable size guide or contact our customer service team for
                personalized assistance.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="inline-flex items-center justify-center px-6 py-3 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors">
                  <Download className="w-4 h-4 mr-2" />
                  Download Size Guide
                </button>
                <a
                  href="/contact"
                  className="inline-flex items-center justify-center px-6 py-3 border border-rose-600 text-rose-600 rounded-lg hover:bg-rose-600 hover:text-white transition-colors"
                >
                  Contact Support
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
