import { getDailyHoroscopes } from "../../lib/queries";

export default async function HoroscopesPage() {
  const readings = await getDailyHoroscopes();

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <div className="text-center mb-16 border-b border-slate-800 pb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">The Astrology Engine</h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg">Daily cosmic insights decoded for your business, investments, and personal growth.</p>
      </div>

      {readings.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/50 rounded-2xl border border-slate-800 max-w-2xl mx-auto shadow-lg">
          <span className="text-5xl mb-4 block">✨</span>
          <h2 className="text-xl font-bold text-white mb-2">The Stars are Aligning</h2>
          <p className="text-slate-400">Today's readings are currently being interpreted. The engine will update shortly.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {readings.map((reading) => (
            <div key={reading.id} className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 hover:border-indigo-500/50 transition-colors shadow-lg group">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-white capitalize group-hover:text-indigo-400 transition-colors">{reading.sign}</h3>
                <span className="w-10 h-10 rounded-full bg-indigo-900/30 flex items-center justify-center border border-indigo-500/30 text-indigo-400 font-bold shadow-inner">
                  {reading.sign.charAt(0)}
                </span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                {reading.prediction}
              </p>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider bg-slate-900/50 inline-block px-3 py-1 rounded-full border border-slate-800">
                Lucky Color: <span className="text-slate-300">{reading.luckyColor || "Varies"}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
