import React, { useState, useEffect } from 'react';
import { DesignType, Platform, DesignConfig, UploadedFile, DesignSize } from '../types';
import { DESIGN_OPTIONS, PLATFORM_OPTIONS, SIZE_OPTIONS } from '../constants';
import { Button } from './Button';
import { Input, TextArea } from './Input';
import { ImageUpload } from './ImageUpload';
import { generateMarketingAsset } from '../services/geminiService';

interface DesignWizardProps {
  onSuccess: (imageUrl: string, promptUsed: string) => void;
}

export const DesignWizard: React.FC<DesignWizardProps> = ({ onSuccess }) => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [config, setConfig] = useState<DesignConfig>({
    type: DesignType.ADS,
    subType: 'Discount Ads',
    platform: Platform.INSTAGRAM,
    size: DesignSize.SQUARE,
    productPrice: '',
    customPrompt: '',
  });

  const [mainImage, setMainImage] = useState<UploadedFile | null>(null);
  const [logoImage, setLogoImage] = useState<UploadedFile | null>(null);

  // Update subtypes when main type changes
  useEffect(() => {
    const typeOption = DESIGN_OPTIONS.find(o => o.id === config.type);
    if (typeOption && typeOption.subTypes.length > 0) {
      setConfig(prev => ({ ...prev, subType: typeOption.subTypes[0] }));
    }
  }, [config.type]);

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  const constructFinalPrompt = () => {
    let prompt = `Edit the provided product image to create a premium, professional ${config.size} ${config.subType} for ${config.platform}. `;
    
    // Price logic based on requirements
    if (config.type !== DesignType.ADS && config.productPrice) {
      prompt += `Prominently display the price: "${config.productPrice}". `;
    }

    if (config.type === DesignType.BANNER) {
      prompt += `Ensure the layout is optimized for a ${config.subType} placement. `;
    }

    prompt += `Design Style: High-quality, Branded, Clean, Modern. `;
    prompt += `Specific User Instructions: "${config.customPrompt}". `;
    prompt += `Maintain the integrity of the main product but enhance the background, lighting, and graphical elements to match a professional marketing asset.`;
    
    return prompt;
  };

  const handleGenerate = async () => {
    if (!mainImage) return;

    setIsLoading(true);
    setError(null);

    const fullPrompt = constructFinalPrompt();

    try {
      const resultImageUrl = await generateMarketingAsset({
        baseImageBase64: mainImage.base64,
        baseImageMimeType: mainImage.mimeType,
        logoImageBase64: logoImage?.base64,
        logoImageMimeType: logoImage?.mimeType,
        prompt: fullPrompt
      });
      onSuccess(resultImageUrl, fullPrompt);
    } catch (err: any) {
      setError(err.message || "Failed to generate design. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const showPriceInput = config.type === DesignType.FLYER || config.type === DesignType.BANNER;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Steps Indicator */}
      <div className="mb-8 flex items-center justify-between relative max-w-2xl mx-auto">
        <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-slate-800 -z-10" />
        {[1, 2, 3].map((s) => (
          <div key={s} className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm transition-colors border-4 border-slate-900 ${
            step >= s ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/50' : 'bg-slate-800 text-slate-500'
          }`}>
            {s}
          </div>
        ))}
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl">
        {step === 1 && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2 text-white">Project Configuration</h2>
              <p className="text-slate-400">Choose your asset type and platform.</p>
            </div>
            
            {/* Design Type Selection */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {DESIGN_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setConfig({ ...config, type: opt.id })}
                  className={`flex flex-col items-center p-6 rounded-xl border-2 transition-all ${
                    config.type === opt.id 
                      ? 'border-indigo-500 bg-indigo-500/10 text-white shadow-lg shadow-indigo-500/20' 
                      : 'border-slate-800 bg-slate-800/50 text-slate-400 hover:border-slate-700 hover:bg-slate-800'
                  }`}
                >
                  <span className="text-4xl mb-3">{opt.icon}</span>
                  <span className="font-bold">{opt.title}</span>
                  <span className="text-xs text-center mt-2 opacity-70">{opt.description}</span>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-800">
              {/* Subtype Selector */}
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Category</label>
                <select 
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  value={config.subType}
                  onChange={(e) => setConfig({...config, subType: e.target.value})}
                >
                  {DESIGN_OPTIONS.find(o => o.id === config.type)?.subTypes.map(st => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              {/* Platform Selector */}
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Platform / Placement</label>
                <select 
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  value={config.platform}
                  onChange={(e) => setConfig({...config, platform: e.target.value as Platform})}
                >
                  {PLATFORM_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>

              {/* Size Selector */}
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Design Size</label>
                <select 
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  value={config.size}
                  onChange={(e) => setConfig({...config, size: e.target.value as DesignSize})}
                >
                  {SIZE_OPTIONS.map(s => (
                    <option key={s.id} value={s.id}>{s.label} ({s.dim})</option>
                  ))}
                </select>
              </div>
              
              {/* Price Input - Conditional */}
              {showPriceInput && (
                <div>
                  <Input 
                    label="Product Price" 
                    placeholder="$29.99"
                    value={config.productPrice}
                    onChange={(e) => setConfig({...config, productPrice: e.target.value})}
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end pt-4">
              <Button size="lg" onClick={handleNext}>Next: Upload Assets &rarr;</Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2 text-white">Upload Assets</h2>
              <p className="text-slate-400">Securely upload your product image and branding.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <ImageUpload 
                label="Main Product Image (Required)" 
                currentPreview={mainImage?.previewUrl}
                onFileSelect={setMainImage}
              />
              <ImageUpload 
                label="Brand Logo (Optional)" 
                currentPreview={logoImage?.previewUrl}
                onFileSelect={setLogoImage}
              />
            </div>

            <div className="flex justify-between pt-6 border-t border-slate-800">
              <Button variant="outline" onClick={handleBack}>Back</Button>
              <Button size="lg" onClick={handleNext} disabled={!mainImage}>Next: Finalize &rarr;</Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-8">
             <div className="text-center">
              <h2 className="text-2xl font-bold mb-2 text-white">Instructions & Generate</h2>
              <p className="text-slate-400">Tell the AI how to style your design.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1 space-y-4">
                 <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 text-sm">
                  <h3 className="font-bold text-white mb-3">Summary</h3>
                  <ul className="space-y-2 text-slate-400">
                    <li className="flex justify-between"><span>Type:</span> <span className="text-slate-200">{config.type}</span></li>
                    <li className="flex justify-between"><span>Category:</span> <span className="text-slate-200">{config.subType}</span></li>
                    <li className="flex justify-between"><span>Size:</span> <span className="text-slate-200">{SIZE_OPTIONS.find(s => s.id === config.size)?.dim}</span></li>
                    {config.productPrice && <li className="flex justify-between"><span>Price:</span> <span className="text-green-400 font-mono">{config.productPrice}</span></li>}
                  </ul>
                </div>
              </div>

              <div className="md:col-span-2 space-y-4">
                <TextArea 
                  label="Editing Prompts" 
                  placeholder="E.g. 'Add a retro filter', 'Remove the person in the background', 'Place the product on a marble table', 'Add neon lights around the product'..."
                  value={config.customPrompt}
                  onChange={(e) => setConfig({...config, customPrompt: e.target.value})}
                  rows={6}
                />
                <p className="text-xs text-slate-500">
                  Tip: Be specific about the mood, lighting, and background you want. The AI will use your image as the reference.
                </p>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-900/20 border border-red-800 rounded-lg text-red-200 text-sm flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {error}
              </div>
            )}

            <div className="flex justify-between pt-6 border-t border-slate-800">
              <Button variant="outline" onClick={handleBack} disabled={isLoading}>Back</Button>
              <Button onClick={handleGenerate} isLoading={isLoading} size="lg" className="w-full md:w-auto px-8">
                Generate Design ✨
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};