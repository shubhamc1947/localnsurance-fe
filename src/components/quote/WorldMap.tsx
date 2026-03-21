"use client";

import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import { useMemo, useCallback } from "react";
import { Check } from "lucide-react";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// ISO numeric country codes → region IDs
const COUNTRY_REGION: Record<number, string> = {
  // North/Central America
  840: "north-central-america", 124: "north-central-america", 484: "north-central-america",
  320: "north-central-america", 340: "north-central-america", 188: "north-central-america",
  222: "north-central-america", 558: "north-central-america", 591: "north-central-america",
  192: "north-central-america", 332: "north-central-america", 388: "north-central-america",
  214: "north-central-america", 630: "north-central-america", 780: "north-central-america",
  44: "north-central-america", 84: "north-central-america", 308: "north-central-america",
  // South America
  76: "south-america", 32: "south-america", 152: "south-america", 170: "south-america",
  604: "south-america", 862: "south-america", 218: "south-america", 68: "south-america",
  600: "south-america", 858: "south-america", 328: "south-america", 740: "south-america",
  238: "south-america", 254: "south-america",
  // Europe
  276: "europe", 250: "europe", 380: "europe", 724: "europe", 620: "europe",
  528: "europe", 56: "europe", 40: "europe", 756: "europe", 752: "europe",
  578: "europe", 208: "europe", 246: "europe", 826: "europe", 372: "europe",
  616: "europe", 203: "europe", 703: "europe", 348: "europe", 642: "europe",
  100: "europe", 300: "europe", 191: "europe", 705: "europe", 233: "europe",
  428: "europe", 440: "europe", 112: "europe", 498: "europe", 804: "europe",
  688: "europe", 807: "europe", 8: "europe", 70: "europe", 499: "europe",
  442: "europe", 352: "europe", 470: "europe", 492: "europe", 674: "europe",
  // Middle East / Africa
  818: "middle-east-africa", 504: "middle-east-africa", 788: "middle-east-africa",
  12: "middle-east-africa", 434: "middle-east-africa", 736: "middle-east-africa",
  706: "middle-east-africa", 231: "middle-east-africa", 566: "middle-east-africa",
  288: "middle-east-africa", 384: "middle-east-africa", 854: "middle-east-africa",
  466: "middle-east-africa", 562: "middle-east-africa", 682: "middle-east-africa",
  784: "middle-east-africa", 368: "middle-east-africa", 364: "middle-east-africa",
  400: "middle-east-africa", 760: "middle-east-africa", 422: "middle-east-africa",
  376: "middle-east-africa", 275: "middle-east-africa", 887: "middle-east-africa",
  512: "middle-east-africa", 404: "middle-east-africa", 800: "middle-east-africa",
  834: "middle-east-africa", 508: "middle-east-africa", 716: "middle-east-africa",
  710: "middle-east-africa", 516: "middle-east-africa", 140: "middle-east-africa",
  120: "middle-east-africa", 24: "middle-east-africa", 180: "middle-east-africa",
  686: "middle-east-africa", 324: "middle-east-africa", 694: "middle-east-africa",
  430: "middle-east-africa", 204: "middle-east-africa", 768: "middle-east-africa",
  266: "middle-east-africa", 678: "middle-east-africa", 174: "middle-east-africa",
  72: "middle-east-africa", 426: "middle-east-africa", 748: "middle-east-africa",
  454: "middle-east-africa", 646: "middle-east-africa", 108: "middle-east-africa",
  // Asia Pacific
  643: "asia-pacific", // Russia
  156: "asia-pacific", 356: "asia-pacific", 392: "asia-pacific", 410: "asia-pacific",
  360: "asia-pacific", 764: "asia-pacific", 704: "asia-pacific", 458: "asia-pacific",
  608: "asia-pacific", 50: "asia-pacific", 144: "asia-pacific", 524: "asia-pacific",
  64: "asia-pacific", 398: "asia-pacific", 417: "asia-pacific",
  762: "asia-pacific", 795: "asia-pacific", 860: "asia-pacific", 4: "asia-pacific",
  586: "asia-pacific", 408: "asia-pacific", 496: "asia-pacific", 36: "asia-pacific",
  554: "asia-pacific", 598: "asia-pacific", 242: "asia-pacific", 90: "asia-pacific",
  116: "asia-pacific", 418: "asia-pacific", 104: "asia-pacific",
  96: "asia-pacific", 626: "asia-pacific", 16: "asia-pacific", 184: "asia-pacific",
};

// Region pill colors
const REGION_COLORS: Record<string, { fill: string; hover: string; label: string; dot: string }> = {
  "north-central-america": { fill: "#3B82F6", hover: "#2563EB", label: "#2563EB", dot: "#93C5FD" },
  "south-america":         { fill: "#22C55E", hover: "#16A34A", label: "#16A34A", dot: "#86EFAC" },
  "europe":                { fill: "#14B8A6", hover: "#0D9488", label: "#0D9488", dot: "#5EEAD4" },
  "middle-east-africa":    { fill: "#F97316", hover: "#EA580C", label: "#EA580C", dot: "#FDBA74" },
  "asia-pacific":          { fill: "#EF4444", hover: "#DC2626", label: "#DC2626", dot: "#FCA5A5" },
};

// Marker positions [lng, lat] + label pixel width
const REGION_MARKERS: Record<string, { coords: [number, number]; labelWidth: number; pinCoords: [number, number] }> = {
  "north-central-america": { coords: [-95, 48],  labelWidth: 154, pinCoords: [-100, 40] },
  "south-america":         { coords: [-58, -14], labelWidth: 112, pinCoords: [-58, -18] },
  "europe":                { coords: [18, 54],   labelWidth: 64,  pinCoords: [15, 50]   },
  "middle-east-africa":    { coords: [28, 4],    labelWidth: 158, pinCoords: [25, 8]    },
  "asia-pacific":          { coords: [118, 22],  labelWidth: 92,  pinCoords: [105, 30]  },
};

interface WorldMapProps {
  selectedRegions: string[];
  onToggleRegion: (id: string) => void;
  regions: { id: string; label: string }[];
}

const WorldMap = ({ selectedRegions, onToggleRegion, regions }: WorldMapProps) => {
  const getRegionId = useCallback((geoId: string) => {
    const numericId = parseInt(geoId, 10);
    return COUNTRY_REGION[numericId] ?? null;
  }, []);

  const selectedSet = useMemo(() => new Set(selectedRegions), [selectedRegions]);

  return (
    <div className="w-full space-y-3">
      {/* Map */}
      <div
        className="relative w-full rounded-2xl overflow-hidden border border-border/50"
        style={{ aspectRatio: "16/9", background: "#EFF6FF" }}
      >
        <ComposableMap
          projectionConfig={{ scale: 195, center: [20, 10] }}
          style={{ width: "100%", height: "100%" }}
        >
          {/* SVG pattern definitions for the dotted effect */}
          <defs>
            {/* Default gray dot pattern */}
            <pattern id="dots-default" width="4" height="4" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="0.8" fill="#94A3B8" opacity="0.5" />
            </pattern>
            {/* Colored dot patterns for each region */}
            {Object.entries(REGION_COLORS).map(([regionId, colors]) => (
              <pattern key={regionId} id={`dots-${regionId}`} width="4" height="4" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="0.9" fill={colors.fill} opacity="0.7" />
              </pattern>
            ))}
          </defs>

          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies
              .filter((geo) => geo.id !== "010") // remove Antarctica
              .map((geo) => {
                const regionId = getRegionId(geo.id);
                const isSelected = regionId ? selectedSet.has(regionId) : false;

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onClick={() => regionId && onToggleRegion(regionId)}
                    style={{
                      default: {
                        fill: isSelected
                          ? `url(#dots-${regionId})`
                          : "url(#dots-default)",
                        stroke: "none",
                        outline: "none",
                        cursor: regionId ? "pointer" : "default",
                      },
                      hover: {
                        fill: isSelected
                          ? `url(#dots-${regionId})`
                          : regionId ? "url(#dots-default)" : "url(#dots-default)",
                        stroke: "none",
                        outline: "none",
                        cursor: regionId ? "pointer" : "default",
                        opacity: regionId ? 0.8 : 1,
                      },
                      pressed: {
                        fill: isSelected
                          ? `url(#dots-${regionId})`
                          : "url(#dots-default)",
                        outline: "none",
                      },
                    }}
                  />
                );
              })
            }
          </Geographies>

          {/* Location pins for selected regions */}
          {regions.map((region) => {
            const marker = REGION_MARKERS[region.id];
            const isSelected = selectedSet.has(region.id);
            const colors = REGION_COLORS[region.id];
            if (!marker || !isSelected) return null;

            return (
              <Marker key={`pin-${region.id}`} coordinates={marker.pinCoords}>
                <g transform="translate(-8, -24)">
                  {/* Pin shadow */}
                  <ellipse cx="8" cy="25" rx="4" ry="1.5" fill="rgba(0,0,0,0.15)" />
                  {/* Pin body */}
                  <path
                    d="M8 0C3.58 0 0 3.58 0 8c0 5.5 8 16 8 16s8-10.5 8-16c0-4.42-3.58-8-8-8z"
                    fill={colors.fill}
                  />
                  {/* Pin inner circle */}
                  <circle cx="8" cy="8" r="3" fill="white" />
                </g>
              </Marker>
            );
          })}

          {/* Region pill labels */}
          {regions.map((region) => {
            const marker = REGION_MARKERS[region.id];
            const isSelected = selectedSet.has(region.id);
            const colors = REGION_COLORS[region.id];
            if (!marker) return null;

            const { coords, labelWidth } = marker;
            const pillH = 22;
            const halfW = labelWidth / 2;

            return (
              <Marker key={region.id} coordinates={coords}>
                <g
                  onClick={(e) => { e.stopPropagation(); onToggleRegion(region.id); }}
                  style={{ cursor: "pointer" }}
                  transform={`translate(${-halfW}, ${-pillH / 2})`}
                >
                  {/* Shadow */}
                  <rect
                    x={1} y={2}
                    width={labelWidth} height={pillH}
                    rx={pillH / 2}
                    fill="rgba(0,0,0,0.1)"
                  />
                  {/* Pill background */}
                  <rect
                    x={0} y={0}
                    width={labelWidth} height={pillH}
                    rx={pillH / 2}
                    fill={isSelected ? colors.label : "#1E293B"}
                  />
                  {/* Label text */}
                  <text
                    x={isSelected ? labelWidth / 2 - 6 : labelWidth / 2}
                    y={15}
                    textAnchor="middle"
                    fill="white"
                    fontSize={9.5}
                    fontFamily="system-ui, sans-serif"
                    fontWeight="600"
                    letterSpacing="0.3"
                    style={{ pointerEvents: "none", userSelect: "none" }}
                  >
                    {region.label}
                  </text>
                  {/* Checkmark when selected */}
                  {isSelected && (
                    <text
                      x={labelWidth - 14}
                      y={15}
                      fill="white"
                      fontSize={9}
                      fontWeight="bold"
                      style={{ pointerEvents: "none", userSelect: "none" }}
                    >
                      ✓
                    </text>
                  )}
                </g>
              </Marker>
            );
          })}
        </ComposableMap>
      </div>

      {/* Region chips legend */}
      <div className="flex flex-wrap gap-2 px-1">
        {regions.map((region) => {
          const isSelected = selectedSet.has(region.id);
          const colors = REGION_COLORS[region.id];
          return (
            <button
              key={region.id}
              onClick={() => onToggleRegion(region.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150"
              style={
                isSelected
                  ? { background: colors.fill, color: "#fff", borderColor: colors.fill }
                  : { background: "#F8FAFC", color: "#64748B", borderColor: "#E2E8F0" }
              }
            >
              {isSelected && <Check className="w-3 h-3" />}
              {region.label}
            </button>
          );
        })}
        {selectedRegions.length > 0 && (
          <button
            onClick={() => selectedRegions.forEach(r => onToggleRegion(r))}
            className="px-3 py-1.5 rounded-full text-xs font-medium text-muted-foreground hover:text-foreground border border-dashed border-border hover:border-foreground transition-all"
          >
            Clear all
          </button>
        )}
      </div>
    </div>
  );
};

export default WorldMap;
