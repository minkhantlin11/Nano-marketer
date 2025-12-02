import React, { useState } from 'react';
import { DesignType, Platform, DesignConfig, UploadedFile } from '../types';
import { DESIGN_OPTIONS, PLATFORM_OPTIONS } from '../constants';
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
    platform: Platform.INSTAGRAM,
    productPrice: '',
    customPrompt: '',
  });

  const [mainImage, setMainImage] = useState<UploadedFile | null>(null);
  const [logoImage, setLogoImage] = useState<UploadedFile | null>(null);

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  const constructFinalPrompt = () => {
    let prompt = `Edit this image to create a high-quality, professional ${config.platform} ${config.type.toLowerCase()}. `;
    
    if (config.type === DesignType.FLYER && config.productPrice) {
      prompt += `Include the price text: "${config.productPrice}" prominently. `;
    }

    if (config.type === DesignType.BANNER) {
      prompt += `Ensure the layout is suitable for a banner format. `;
    }

    prompt += `Design Style: Premium, Branded, Clean. `;
    prompt += `Instructions: ${config.customPrompt}. `;
    
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

  return (
    <div className="max-w-3xl mx-auto">
      {/* Steps Indicator */}
      <div className="mb-8 flex items-center justify-between relative">
        <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-slate-800 -z-10" />
        {[1, 2, 3].map((s) => (
          <div key={s} className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm transition-colors ${
            step >= s ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/50' : 'bg-slate-800 text-slate-500'
          }`}>
            {s}
          </div>
        ))}
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl">
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Select Design Type</h2>
              <p className="text-slate-400">What kind of marketing asset do you need?</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {DESIGN_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setConfig({ ...config, type: opt.id })}
                  className={`flex flex-col items-center p-6 rounded-xl border-2 transition-all ${
                    config.type === opt.id 
                      ? 'border-indigo-500 bg-indigo-500/10 text-white' 
                      : 'border-slate-800 bg-slate-800/50 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="text-4xl mb-3">{opt.icon}</span>
                  <span className="font-bold">{opt.title}</span>
                  <span className="text-xs text-center mt-2 opacity-70">{opt.description}</span>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Platform</label>
                <select 
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  value={config.platform}
                  onChange={(e) => setConfig({...config, platform: e.target.value as Platform})}
                >
                  {PLATFORM_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              
              {(config.type === DesignType.FLYER || config.type === DesignType.BANNER) && (
                <Input 
                  label="Product Price (Optional)" 
                  placeholder="$19.99"
                  value={config.productPrice}
                  onChange={(e) => setConfig({...config, productPrice: e.target.value})}
                />
              )}
            </div>

            <div className="flex justify-end pt-4">
              <Button onClick={handleNext}>Next Step</Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Upload Assets</h2>
              <p className="text-slate-400">Upload your product image and optional branding.</p>
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

            <div className="flex justify-between pt-6">
              <Button variant="outline" onClick={handleBack}>Back</Button>
              <Button onClick={handleNext} disabled={!mainImage}>Next Step</Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Final Touches</h2>
              <p className="text-slate-400">Describe how you want the AI to edit your image.</p>
            </div>

            <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 text-sm text-slate-300">
              <strong>Selected Configuration:</strong>
              <ul className="mt-2 list-disc list-inside space-y-1 text-slate-400">
                <li>Type: {config.type}</li>
                <li>Platform: {config.platform}</li>
                {config.productPrice && <li>Price: {config.productPrice}</li>}
              </ul>
            </div>

            <TextArea 
              label="Design Instructions" 
              placeholder="E.g. Add a summer vibe, make the background sunset colored, add sparkles around the product..."
              value={config.customPrompt}
              onChange={(e) => setConfig({...config, customPrompt: e.target.value})}
              rows={4}
            />

            {error && (
              <div className="p-4 bg-red-900/20 border border-red-800 rounded-lg text-red-200 text-sm">
                {error}
              </div>
            )}

            <div className="flex justify-between pt-6">
              <Button variant="outline" onClick={handleBack} disabled={isLoading}>Back</Button>
              <Button onClick={handleGenerate} isLoading={isLoading}>
                Generate Design
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};