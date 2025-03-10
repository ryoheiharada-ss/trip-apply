interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="grid min-h-screen grid-rows-[auto_1fr_auto] grid-cols-[1fr_min(90%,64rem)_1fr] gap-y-8">
      <main className="col-start-2 row-start-2">
        {children}
      </main>
    </div>
  );
}
