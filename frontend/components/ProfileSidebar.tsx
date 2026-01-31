export default function ProfileSidebar() {
  return (
    <div className="fixed right-0 top-0 bottom-0 w-32 flex flex-col items-center justify-center z-40 pointer-events-none hidden md:flex">
      <div className="relative group pointer-events-auto cursor-pointer">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur opacity-50 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative w-24 h-24 rounded-full bg-black border border-white/10 flex items-center justify-center overflow-hidden">
          <img
            src="/profile.webp"
            alt="Vishwajeet Singh Thakur"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      <div className="mt-8 flex flex-col space-y-4 items-center opacity-0 group-hover:opacity-100 transition-opacity">
        {/* Social icons placeholders */}
      </div>
    </div>
  );
}
