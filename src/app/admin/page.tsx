import { publishArticle } from "../../lib/actions";

export default function AdminDashboard() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="mb-10 border-b border-slate-800 pb-6">
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
          <span className="bg-indigo-600 p-2 rounded-lg text-xl block">🔒</span>
          Command Center
        </h1>
        <p className="text-slate-400 mt-2">Publish new briefings directly to the Beacon-Hub Ecosystem.</p>
      </div>

      <form action={publishArticle} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 flex flex-col gap-6 shadow-xl">
        
        {/* Title Input */}
        <div className="flex flex-col gap-2">
          <label htmlFor="title" className="text-sm font-bold text-slate-300 uppercase tracking-wider">Headline Title</label>
          <input 
            type="text" 
            name="title" 
            id="title"
            required
            placeholder="e.g., Tech Giants Announce New AI Models..."
            className="bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-600"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Category Dropdown */}
          <div className="flex flex-col gap-2">
            <label htmlFor="category" className="text-sm font-bold text-slate-300 uppercase tracking-wider">Desk / Category</label>
            <select 
              name="category" 
              id="category"
              required
              className="bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-all appearance-none"
            >
              <option value="Politics">Politics Desk</option>
              <option value="Tech">Tech & Code</option>
              <option value="Dev Log">Developer Log</option>
              <option value="Market">Market Trends</option>
            </select>
          </div>

          {/* Author Input */}
          <div className="flex flex-col gap-2">
            <label htmlFor="author" className="text-sm font-bold text-slate-300 uppercase tracking-wider">Author Name</label>
            <input 
              type="text" 
              name="author" 
              id="author"
              required
              defaultValue="Senior Architect"
              className="bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
          </div>
        </div>

        {/* Content Area */}
        <div className="flex flex-col gap-2">
          <label htmlFor="content" className="text-sm font-bold text-slate-300 uppercase tracking-wider">Article Content</label>
          <textarea 
            name="content" 
            id="content"
            required
            rows={8}
            placeholder="Write your briefing here..."
            className="bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-600 resize-y"
          ></textarea>
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-lg transition-colors mt-4 shadow-[0_0_20px_rgba(79,70,229,0.3)] text-lg"
        >
          Publish to Network
        </button>
      </form>
    </div>
  );
}
