"use client";

import { useMemo } from "react";
import { Check } from "lucide-react";

interface WorldMapProps {
  selectedRegions: string[];
  onToggleRegion: (id: string) => void;
  regions: { id: string; label: string }[];
}

const REGION_COLORS: Record<string, string> = {
  "north-central-america": "#3B82F6",
  "south-america": "#8B5CF6",
  "europe": "#10B981",
  "middle-east-africa": "#F59E0B",
  "asia-pacific": "#EF4444",
};

const REGION_POSITIONS: Record<string, { x: string; y: string }> = {
  "north-central-america": { x: "20%", y: "30%" },
  "south-america": { x: "28%", y: "72%" },
  "europe": { x: "48%", y: "22%" },
  "middle-east-africa": { x: "52%", y: "62%" },
  "asia-pacific": { x: "78%", y: "40%" },
};

// Simplified continent outlines for a clean look
const CONTINENT_PATHS = [
  // North America
  "M80,60 C100,45 150,40 190,50 C220,58 245,75 255,100 C262,120 258,145 245,165 C230,180 210,190 185,195 C165,198 145,195 130,188 C115,178 105,162 100,145 C95,125 92,105 85,85 Z",
  // Central America
  "M150,180 C160,178 172,185 178,198 C182,210 175,220 165,222 C155,220 148,210 148,198 C148,190 150,183 152,180 Z",
  // South America
  "M195,230 C215,222 240,228 255,245 C268,265 272,290 268,315 C264,338 255,355 242,365 C228,372 215,368 205,355 C195,340 190,320 192,298 C194,275 196,255 197,238 Z",
  // Europe
  "M410,55 C430,48 455,52 475,62 C492,72 502,88 505,108 C506,125 500,140 488,152 C475,160 458,162 442,158 C428,152 418,140 414,125 C410,108 410,90 412,72 Z",
  // UK
  "M400,65 C408,60 415,63 418,72 C420,80 416,88 410,90 C404,88 400,82 400,74 Z",
  // Africa
  "M430,168 C448,162 468,168 482,182 C495,198 502,220 505,245 C506,270 502,295 492,315 C480,332 465,342 448,345 C432,342 420,332 415,315 C410,295 412,272 418,248 C424,225 428,200 430,180 Z",
  // Middle East
  "M505,115 C520,110 538,118 548,132 C555,145 548,160 535,168 C520,172 508,165 502,152 C498,140 500,125 505,118 Z",
  // Russia/Central Asia
  "M460,42 C500,35 560,38 620,45 C670,52 710,62 740,78 C755,88 758,102 750,115 C738,128 718,132 695,130 C670,128 645,120 620,115 C595,110 570,108 548,105 C530,102 515,95 508,85 C500,72 495,58 470,50 Z",
  // India
  "M590,135 C605,130 620,138 628,155 C635,172 630,192 620,205 C610,215 598,210 592,195 C586,178 585,160 588,145 Z",
  // Southeast Asia
  "M640,165 C658,160 678,168 688,182 C695,195 688,205 675,208 C660,208 650,198 648,185 C646,175 648,168 642,168 Z",
  // China/East Asia
  "M620,60 C650,55 685,62 715,78 C735,90 745,108 740,125 C732,142 715,150 695,148 C675,145 658,138 642,128 C628,118 618,105 615,90 C612,78 616,65 622,60 Z",
  // Japan
  "M755,78 C762,72 770,78 772,90 C774,102 768,112 762,112 C756,108 754,98 755,88 Z",
  // Indonesia
  "M660,195 C678,190 700,198 718,208 C728,215 722,225 710,228 C695,228 678,222 668,212 C660,205 658,198 662,195 Z",
  // Australia
  "M705,265 C730,255 760,258 782,270 C798,282 802,300 795,318 C785,332 768,340 748,340 C728,338 712,328 705,312 C698,296 700,278 708,268 Z",
  // New Zealand
  "M808,320 C815,315 822,320 822,332 C820,340 815,342 810,338 C806,332 806,325 808,322 Z",
];

const WorldMap = ({ selectedRegions, onToggleRegion, regions }: WorldMapProps) => {
  const selectedSet = useMemo(() => new Set(selectedRegions), [selectedRegions]);

  // Map region IDs to continent path indices
  const regionPathIndices: Record<string, number[]> = {
    "north-central-america": [0, 1],
    "south-america": [2],
    "europe": [3, 4],
    "middle-east-africa": [5, 6],
    "asia-pacific": [7, 8, 9, 10, 11, 12, 13, 14],
  };

  return (
    <div
      className="relative w-full rounded-xl overflow-hidden select-none"
      style={{ aspectRatio: "2.4/1", background: "linear-gradient(135deg, #F0F6FF 0%, #F8FAFF 100%)" }}
    >
      <svg
        viewBox="0 0 900 380"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Render continents */}
        {CONTINENT_PATHS.map((path, i) => {
          // Find which region this path belongs to
          let regionId: string | null = null;
          let isSelected = false;
          for (const [rId, indices] of Object.entries(regionPathIndices)) {
            if (indices.includes(i)) {
              regionId = rId;
              isSelected = selectedSet.has(rId);
              break;
            }
          }
          const color = regionId ? REGION_COLORS[regionId] : "#CBD5E1";
          return (
            <path
              key={i}
              d={path}
              fill={isSelected ? color : "#CBD5E1"}
              opacity={isSelected ? 0.3 : 0.15}
              stroke={isSelected ? color : "#94A3B8"}
              strokeWidth={isSelected ? 1 : 0.5}
              strokeOpacity={isSelected ? 0.5 : 0.2}
              className="transition-all duration-300"
              style={{ cursor: regionId ? "pointer" : "default" }}
              onClick={() => regionId && onToggleRegion(regionId)}
            />
          );
        })}
      </svg>

      {/* Region labels */}
      {regions.map((region) => {
        const pos = REGION_POSITIONS[region.id];
        if (!pos) return null;
        const isSelected = selectedSet.has(region.id);
        const color = REGION_COLORS[region.id] || "#1E293B";

        return (
          <button
            key={region.id}
            onClick={() => onToggleRegion(region.id)}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 hover:scale-105 z-10"
            style={{ left: pos.x, top: pos.y }}
          >
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold shadow-sm whitespace-nowrap transition-all"
              style={{
                background: isSelected ? color : "#1E293B",
                color: "white",
              }}
            >
              {region.label}
              {isSelected && <Check className="w-3 h-3" />}
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default WorldMap;
