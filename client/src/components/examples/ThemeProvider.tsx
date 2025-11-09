import { ThemeProvider } from '../theme-provider'
import { ThemeToggle } from '../theme-toggle'

export default function ThemeProviderExample() {
  return (
    <ThemeProvider>
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Theme System</h2>
          <ThemeToggle />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-background border rounded-lg">
            <h3 className="font-medium">Background</h3>
            <p className="text-sm text-muted-foreground">Standard background</p>
          </div>
          <div className="p-4 bg-card border rounded-lg">
            <h3 className="font-medium">Card</h3>
            <p className="text-sm text-muted-foreground">Card background</p>
          </div>
          <div className="p-4 bg-primary text-primary-foreground rounded-lg">
            <h3 className="font-medium">Primary</h3>
            <p className="text-sm">Agricultural green theme</p>
          </div>
        </div>
      </div>
    </ThemeProvider>
  )
}