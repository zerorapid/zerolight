import React from 'react';
import { Sliders, RotateCcw, Copy } from 'lucide-react';
import { ZeroLightSettings, DEFAULT_ZEROLIGHT_SETTINGS } from '../tokens/settings';
import { SPRING_PRESETS } from '../tokens/physics';

export interface VisualStudioDockProps {
  settings: ZeroLightSettings;
  onChange: React.Dispatch<React.SetStateAction<ZeroLightSettings>>;
  onReset?: () => void;
  onExport?: () => void;
  className?: string;
}

/**
 * ZeroLight Visual Studio Dock Organism
 * Live calibration engine for designers and developers to tune parameters in real time.
 */
export const VisualStudioDock: React.FC<VisualStudioDockProps> = ({
  settings,
  onChange,
  onReset,
  onExport,
  className = '',
}) => {
  const updateSetting = <K extends keyof ZeroLightSettings>(
    key: K,
    val: ZeroLightSettings[K]
  ) => {
    onChange((prev) => ({ ...prev, [key]: val }));
  };

  const preset = SPRING_PRESETS[settings.spring];

  return (
    <div
      className={`p-6 bg-white rounded-[28px] border border-neutral-300 shadow-subtle space-y-4 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-neutral-900" />
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-800">
            Visual Studio Dock
          </span>
        </div>
        <div className="flex items-center gap-3">
          {onExport && (
            <button
              onClick={onExport}
              type="button"
              className="text-xs flex items-center gap-1 text-neutral-600 hover:text-neutral-900 font-medium transition-colors cursor-pointer"
            >
              <Copy className="w-3 h-3" />
              <span>Export</span>
            </button>
          )}
          {onReset && (
            <button
              onClick={onReset}
              type="button"
              className="text-xs flex items-center gap-1 text-neutral-500 hover:text-neutral-900 font-medium transition-colors underline cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Universal Border Color */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-neutral-700 flex items-center gap-2">
          <span>Universal Border Color</span>
          <span className="text-xs text-neutral-400 font-normal">
            {settings.borderColor.toUpperCase()}
          </span>
        </label>
        <input
          type="color"
          value={settings.borderColor}
          onChange={(e) => updateSetting('borderColor', e.target.value)}
          className="w-8 h-8 rounded-full border border-neutral-300 cursor-pointer p-0 bg-transparent"
        />
      </div>

      {/* Universal Fill Color */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-neutral-700 flex items-center gap-2">
          <span>Universal Fill Color</span>
          <span className="text-xs text-neutral-400 font-normal">
            {settings.fillColor.toUpperCase()}
          </span>
        </label>
        <input
          type="color"
          value={settings.fillColor}
          onChange={(e) => updateSetting('fillColor', e.target.value)}
          className="w-8 h-8 rounded-full border border-neutral-300 cursor-pointer p-0 bg-transparent"
        />
      </div>

      {/* Text & Icon Color */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-neutral-700 flex items-center gap-2">
          <span>Text & Icon Color</span>
          <span className="text-xs text-neutral-400 font-normal">
            {settings.textColor.toUpperCase()}
          </span>
        </label>
        <input
          type="color"
          value={settings.textColor}
          onChange={(e) => updateSetting('textColor', e.target.value)}
          className="w-8 h-8 rounded-full border border-neutral-300 cursor-pointer p-0 bg-transparent"
        />
      </div>

      {/* Border Width Scale: 0 to 5 */}
      <div className="space-y-1.5 pt-1">
        <div className="flex justify-between items-center text-xs">
          <span className="text-neutral-700 font-medium">Border Width Scale</span>
          <span className="text-xs font-semibold text-neutral-800">
            {settings.borderWidth}px
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="5"
          step="1"
          value={settings.borderWidth}
          onChange={(e) => updateSetting('borderWidth', parseInt(e.target.value, 10))}
          className="w-full accent-neutral-900 cursor-pointer"
        />
        <div className="flex justify-between text-[11px] text-neutral-500 font-medium px-0.5">
          <span>0px</span>
          <span>1px</span>
          <span>2px</span>
          <span>3px</span>
          <span>4px</span>
          <span>5px</span>
        </div>
      </div>

      {/* Universal Corner Radius: 0px to 24px */}
      <div className="space-y-1.5 pt-1 border-t border-neutral-100">
        <div className="flex justify-between items-center text-xs pt-1">
          <span className="text-neutral-700 font-medium">Corner Radius (Inputs & Tags)</span>
          <span className="text-xs font-semibold text-neutral-800">
            {settings.radius >= 24 ? `${settings.radius}px (Pill)` : `${settings.radius}px`}
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="24"
          step="2"
          value={settings.radius}
          onChange={(e) => updateSetting('radius', parseInt(e.target.value, 10))}
          className="w-full accent-neutral-900 cursor-pointer"
        />
        <div className="flex justify-between text-[11px] text-neutral-500 font-medium px-0.5">
          <span>0px (Square)</span>
          <span>8px</span>
          <span>16px</span>
          <span>24px (Pill)</span>
        </div>
      </div>

      {/* Field Height Density */}
      <div className="space-y-1.5 pt-1 border-t border-neutral-100">
        <div className="flex justify-between items-center text-xs pt-1">
          <span className="text-neutral-700 font-medium">Field Height Density</span>
          <span className="text-xs font-semibold text-neutral-800">
            {settings.height}px
          </span>
        </div>
        <input
          type="range"
          min="40"
          max="52"
          step="4"
          value={settings.height}
          onChange={(e) => updateSetting('height', parseInt(e.target.value, 10))}
          className="w-full accent-neutral-900 cursor-pointer"
        />
        <div className="flex justify-between text-[11px] text-neutral-500 font-medium px-0.5">
          <span>40px (Compact)</span>
          <span>44px (Standard)</span>
          <span>48px</span>
          <span>52px (Spacious)</span>
        </div>
      </div>

      {/* Font Size Scale */}
      <div className="space-y-1.5 pt-1 border-t border-neutral-100">
        <div className="flex justify-between items-center text-xs pt-1">
          <span className="text-neutral-700 font-medium">Font Size Scale</span>
          <span className="text-xs font-semibold text-neutral-800">
            {settings.fontSize}px
          </span>
        </div>
        <input
          type="range"
          min="13"
          max="16"
          step="1"
          value={settings.fontSize}
          onChange={(e) => updateSetting('fontSize', parseInt(e.target.value, 10))}
          className="w-full accent-neutral-900 cursor-pointer"
        />
        <div className="flex justify-between text-[11px] text-neutral-500 font-medium px-0.5">
          <span>13px</span>
          <span>14px</span>
          <span>15px</span>
          <span>16px</span>
        </div>
      </div>

      {/* Menu Floating Offset Gap */}
      <div className="space-y-1.5 pt-1 border-t border-neutral-100">
        <div className="flex justify-between items-center text-xs pt-1">
          <span className="text-neutral-700 font-medium">Menu Offset Gap</span>
          <span className="text-xs font-semibold text-neutral-800">
            {settings.gap}px
          </span>
        </div>
        <input
          type="range"
          min="4"
          max="14"
          step="2"
          value={settings.gap}
          onChange={(e) => updateSetting('gap', parseInt(e.target.value, 10))}
          className="w-full accent-neutral-900 cursor-pointer"
        />
        <div className="flex justify-between text-[11px] text-neutral-500 font-medium px-0.5">
          <span>4px (Flush)</span>
          <span>8px</span>
          <span>10px</span>
          <span>14px (Separated)</span>
        </div>
      </div>

      {/* Motion Physics Spring Curve */}
      <div className="space-y-1.5 pt-1 border-t border-neutral-100">
        <div className="flex justify-between items-center text-xs pt-1">
          <span className="text-neutral-700 font-medium">Spring Motion Physics</span>
          <span className="text-xs font-semibold text-neutral-800">
            {preset.name}
          </span>
        </div>
        <input
          type="range"
          min="1"
          max="3"
          step="1"
          value={settings.spring}
          onChange={(e) => updateSetting('spring', e.target.value as '1' | '2' | '3')}
          className="w-full accent-neutral-900 cursor-pointer"
        />
        <div className="flex justify-between text-[11px] text-neutral-500 font-medium px-0.5">
          <span>Subtle Linear</span>
          <span>Apple Damped</span>
          <span>Elastic Spring</span>
        </div>
      </div>

      {/* Kinetic Backplate Highlight Tint */}
      <div className="flex items-center justify-between pt-1 border-t border-neutral-100">
        <label className="text-xs font-medium text-neutral-700 flex items-center gap-2">
          <span>Hover Backplate Tint</span>
          <span className="text-xs text-neutral-400 font-normal">
            {settings.backplateColor.toUpperCase()}
          </span>
        </label>
        <input
          type="color"
          value={settings.backplateColor}
          onChange={(e) => updateSetting('backplateColor', e.target.value)}
          className="w-8 h-8 rounded-full border border-neutral-300 cursor-pointer p-0 bg-transparent"
        />
      </div>
    </div>
  );
};
