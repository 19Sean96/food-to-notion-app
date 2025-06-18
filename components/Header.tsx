import { Button } from "@/components/ui/Button";
import { CheckCircle, Database, Search, Settings } from "lucide-react";

interface HeaderProps {
  notionConnected: boolean;
  databaseInfo: any;
  setSearchModalOpen: (open: boolean) => void;
  setNotionModalOpen: (open: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({
  notionConnected,
  databaseInfo,
  setSearchModalOpen,
  setNotionModalOpen,
}) => {
  return (
    <header className="bg-card border-b border-border px-8 py-4 flex-shrink-0">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Nutrition Hub</h1>
          <p className="text-muted-foreground mt-1">
            Professional nutrition data management
          </p>
        </div>
        <div className="flex items-center gap-4">
          {notionConnected && databaseInfo && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium">
              <CheckCircle className="w-4 h-4" />
              {databaseInfo.name} is connected
            </div>
          )}
          <Button variant="ghost" size="icon">
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Quick Actions Row */}
      <div className="flex gap-4">
        <Button onClick={() => setSearchModalOpen(true)}>
          <Search className="w-4 h-4" />
          Search Foods
        </Button>
        <Button variant="outline" onClick={() => setNotionModalOpen(true)}>
          <Database className="w-4 h-4" />
          {notionConnected ? "Manage Database" : "Setup Notion"}
        </Button>
      </div>
    </header>
  );
};

export default Header;
