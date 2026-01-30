export default function TimelineNav() {
  return (
    <nav className="fixed top-0 left-0 right-0 h-20 bg-gradient-to-b from-black/50 to-transparent z-40 flex items-center justify-center pointer-events-none">
      <div className="flex space-x-12 text-white/50 text-sm tracking-widest uppercase pointer-events-auto">
        <span className="hover:text-white cursor-pointer transition-colors">2020</span>
        <span className="hover:text-white cursor-pointer transition-colors">2021</span>
        <span className="hover:text-white cursor-pointer transition-colors">2022</span>
        <span className="hover:text-white cursor-pointer transition-colors">2023</span>
        <span className="hover:text-white cursor-pointer transition-colors">2024</span>
        <span className="text-white font-bold cursor-pointer border-b border-white pb-1">2025</span>
      </div>
    </nav>
  );
}
