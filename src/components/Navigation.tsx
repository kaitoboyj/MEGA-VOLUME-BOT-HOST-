import { NavLink } from "./NavLink";

export function Navigation() {
  return (
    <nav className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <NavLink to="/">Home / Chart Viewer</NavLink>
            <NavLink to="/donate">Donate</NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
}
