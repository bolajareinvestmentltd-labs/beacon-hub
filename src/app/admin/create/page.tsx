// src/app/admin/create/page.tsx
"use client";

import { useState } from "react";

export default function CreateArticlePage() {
  const [isSponsored, setIsSponsored] = useState(false);

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Intelligence Desk</h1>
        <p className="text-gray-500">Draft and publish a new article to Beacon-Hub.</p>
      </div>

      <form className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        
        {/* TITLE */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Article Title</label>
          <input 
            type="text" 
            name="title" 
            placeholder="Enter the headline..."
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            required
          />
        </div>

        {/* CATEGORY & AUTHOR */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select name="category" className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none">
              <option value="news">News</option>
              <option value="editorial">Editorial</option>
              <option value="market">Market Update</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
            <input 
              type="text" 
              name="author" 
              defaultValue="Beacon-Hub Intelligence"
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        {/* CONTENT */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
          <textarea 
            name="content" 
            rows={10}
            placeholder="Write your article here..."
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            required
          />
        </div>

        {/* THE SPONSORED TOGGLE */}
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50">
          <div>
            <h4 className="font-semibold text-gray-900">Sponsored Content / Ad</h4>
            <p className="text-sm text-gray-500">Label this post as a paid promotion or advertisement.</p>
          </div>
          
          <button
            type="button"
            role="switch"
            aria-checked={isSponsored}
            onClick={() => setIsSponsored(!isSponsored)}
            className={`${
              isSponsored ? "bg-emerald-600" : "bg-gray-300"
            } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none`}
          >
            <span
              aria-hidden="true"
              className={`${
                isSponsored ? "translate-x-5" : "translate-x-0"
              } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
            />
          </button>
          
          {/* Hidden input to send the state to your database later */}
          <input type="hidden" name="isSponsored" value={isSponsored.toString()} />
        </div>

        {/* SUBMIT BUTTON */}
        <div className="pt-4 border-t border-gray-100 flex justify-end">
          <button 
            type="submit"
            className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            Publish Article
          </button>
        </div>

      </form>
    </div>
  );
}