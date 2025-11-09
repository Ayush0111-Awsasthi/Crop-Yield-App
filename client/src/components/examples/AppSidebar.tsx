import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from '../app-sidebar'

export default function AppSidebarExample() {
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-[400px] w-full">
        <AppSidebar />
        <div className="flex-1 p-4 bg-background">
          <h3 className="text-lg font-semibold">Main Content Area</h3>
          <p className="text-muted-foreground">
            This is where the main application content would be displayed.
            Click the sidebar items to navigate.
          </p>
        </div>
      </div>
    </SidebarProvider>
  )
}