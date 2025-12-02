import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { DesignWizard } from './components/DesignWizard';
import { Button } from './components/Button';
import { AppState, GenerationResult } from './types';

function App() {
  const [activeState, setActiveState] = useState<AppState>(AppState.DASHBOARD);
  const [result, setResult] = useState<GenerationResult | null>(null);

  const handleGenerationSuccess = (imageUrl: string, promptUsed: string) => {
    setResult({
      imageUrl,
      promptUsed,
      timestamp: Date.now()
    });
    setActiveState(AppState.RESULT);
  };

  const handleDownload = () => {
    if (result) {
      const link = document.createElement('a');
      link.href = result.imageUrl;
      link.download = `design-${result.timestamp}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const renderContent = () => {
    switch (activeState) {
      case AppState.DASHBOARD:
        return (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Welcome back, John</h1>
                <p className="text-slate-400">Create stunning marketing assets in seconds with AI.</p>
              </div>
              <Button onClick={() => setActiveState(AppState.WIZARD)}>
                + Create New Design
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <div className="text-4xl font-bold text-white mb-1">12</div>
                <div className="text-slate-400 text-sm">Designs Created</div>
              </div>
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <div className="text-4xl font-bold text-white mb-1">4</div>
                <div className="text-slate-400 text-sm">Drafts Saved</div>
              </div>
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <div className="text-4xl font-bold text-white mb-1">Pro</div>
                <div className="text-slate-400 text-sm">Current Plan</div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-4">Recent Designs</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 {/* Mock items */}
                 {[1, 2, 3, 4].map(i => (
                   <div key={i} className="aspect-square bg-slate-800 rounded-lg border border-slate-700 flex items-center justify-center relative group overflow-hidden">
                     <img src={`https://picsum.photos/400/400?random=${i}`} alt="Recent" className="w-full h-full object-cover" />
                     <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <Button variant="outline" size="sm" className="text-xs">Edit</Button>
                     </div>
                   </div>
                 ))}
              </div>
            </div>
          </div>
        );
      
      case AppState.WIZARD:
        return <DesignWizard onSuccess={handleGenerationSuccess} />;
      
      case AppState.RESULT:
        return (
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <Button variant="outline" onClick={() => setActiveState(AppState.DASHBOARD)}>
                &larr; Back to Dashboard
              </Button>
              <div className="flex gap-3">
                <Button onClick={() => setActiveState(AppState.WIZARD)} variant="secondary">
                  Create Another
                </Button>
                <Button onClick={handleDownload}>
                  Download Asset
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xl relative group">
                  {result?.imageUrl ? (
                    <img src={result.imageUrl} alt="Generated Design" className="w-full h-auto" />
                  ) : (
                    <div className="h-96 flex items-center justify-center text-slate-500">No Image Available</div>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                  <h3 className="font-bold text-white mb-4">Generation Details</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-500 uppercase">Prompt Used</label>
                      <p className="text-sm text-slate-300 mt-1 leading-relaxed">{result?.promptUsed}</p>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-500 uppercase">Model</label>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
                        <span className="text-sm text-slate-300">Gemini 2.5 Flash Image</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-500 uppercase">Formats</label>
                      <div className="flex gap-2 mt-2">
                        <span className="px-2 py-1 rounded bg-slate-700 text-xs text-slate-300">PNG</span>
                        <span className="px-2 py-1 rounded bg-slate-700 text-xs text-slate-300 opacity-50 cursor-not-allowed" title="Upgrade for JPG">JPG</span>
                        <span className="px-2 py-1 rounded bg-slate-700 text-xs text-slate-300 opacity-50 cursor-not-allowed" title="Upgrade for PDF">PDF</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-indigo-900/20 border border-indigo-500/30 rounded-xl p-6">
                  <h4 className="font-bold text-indigo-400 mb-2">Pro Tip</h4>
                  <p className="text-sm text-indigo-200/70">
                    Want to remove the background or change the lighting? Just edit the prompt and regenerate!
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <Layout activeState={activeState} onNavigate={setActiveState}>
      {renderContent()}
    </Layout>
  );
}

export default App;