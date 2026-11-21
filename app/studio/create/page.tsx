 "use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

type DesignElement = {
  id: string;
  type: "text" | "image";
  x: number;
  y: number;
  width: number;
  height: number;
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  fill?: string;
  src?: string;
};

const WIDTH = 1080;
const HEIGHT = 1350;
const STORAGE_KEY = "toc-studio-draft-v1";
const FONT_OPTIONS = ["Impact", "Arial", "Helvetica", "Georgia", "Times New Roman", "Trebuchet MS", "Verdana", "Courier New", "Palatino Linotype", "Comic Sans MS"];

export default function StudioCreatePage() {
  const [elements, setElements] = useState<DesignElement[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [background, setBackground] = useState("#EAE4DB");
  const [projectName, setProjectName] = useState("Untitled design");
  const [saved, setSaved] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const dragRef = useRef<{ id: string; dx: number; dy: number } | null>(null);
  const resizeRef = useRef<{ id: string; startX: number; startY: number; width: number; height: number } | null>(null);
  const undoStack = useRef<DesignElement[][]>([]);
  const redoStack = useRef<DesignElement[][]>([]);
  const [guides, setGuides] = useState<{ x?: number; y?: number }>({});
  function rememberChange() {
    undoStack.current.push(elements.map((item) => ({ ...item })));
    if (undoStack.current.length > 50) undoStack.current.shift();
    redoStack.current = [];
  }
  function undo() {
    const previous = undoStack.current.pop();
    if (!previous) return;
    redoStack.current.push(elements.map((item) => ({ ...item })));
    setElements(previous);
    setSaved(false);
  }
  function redo() {
    const next = redoStack.current.pop();
    if (!next) return;
    undoStack.current.push(elements.map((item) => ({ ...item })));
    setElements(next);
    setSaved(false);
  }

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const draft = JSON.parse(raw) as { elements?: DesignElement[]; background?: string; projectName?: string };
        setElements(draft.elements ?? []);
        setBackground(draft.background ?? "#EAE4DB");
        setProjectName(draft.projectName ?? "Untitled design");
      }
    } catch {
      // Ignore an unreadable local draft and start with a clean canvas.
    }
    setHydrated(true);
  }, []);

  const selected = useMemo(() => elements.find((item) => item.id === selectedId) ?? null, [elements, selectedId]);

  function addText() {
    const item: DesignElement = {
      id: crypto.randomUUID(),
      type: "text",
      x: 120,
      y: 260 + elements.length * 75,
      width: 820,
      height: 160,
      text: "Your words here.",
      fontSize: 82,
      fontFamily: "Impact",
      fill: "#000000",
    };
    setElements((current) => [...current, item]);
    setSelectedId(item.id);
    setSaved(false);
  }

  function updateSelected(patch: Partial<DesignElement>) {
    if (!selectedId) return;
    setElements((current) => current.map((item) => item.id === selectedId ? { ...item, ...patch } : item));
    setSaved(false);
  }

  function onResizeDown(event: React.PointerEvent<SVGCircleElement>, item: DesignElement) {
    event.stopPropagation();
    const svg = svgRef.current;
    const matrix = svg?.getScreenCTM();
    if (!svg || !matrix) return;
    const point = svg.createSVGPoint(); point.x = event.clientX; point.y = event.clientY;
    const local = point.matrixTransform(matrix.inverse());
    resizeRef.current = { id: item.id, startX: local.x, startY: local.y, width: item.width, height: item.height };
    setSelectedId(item.id);
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function onPointerDown(event: React.PointerEvent<SVGElement>, item: DesignElement) {
    event.stopPropagation();
    const svg = svgRef.current;
    if (!svg) return;
    const point = svg.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    const matrix = svg.getScreenCTM();
    if (!matrix) return;
    const local = point.matrixTransform(matrix.inverse());
    rememberChange();
    dragRef.current = { id: item.id, dx: local.x - item.x, dy: local.y - item.y };
    setSelectedId(item.id);
    (event.currentTarget as SVGElement).setPointerCapture(event.pointerId);
  }

  function onPointerMove(event: React.PointerEvent<SVGSVGElement>) {
    if (!svgRef.current) return;
    if (resizeRef.current) {
      const point = svgRef.current.createSVGPoint(); point.x = event.clientX; point.y = event.clientY;
      const matrix = svgRef.current.getScreenCTM(); if (!matrix) return;
      const local = point.matrixTransform(matrix.inverse());
      const state = resizeRef.current;
      setElements((current) => current.map((item) => item.id === state.id ? { ...item, width: Math.max(80, state.width + local.x - state.startX), height: Math.max(80, state.height + local.y - state.startY) } : item));
      setSaved(false); return;
    }
    if (!dragRef.current) return;
    const point = svgRef.current.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    const matrix = svgRef.current.getScreenCTM();
    if (!matrix) return;
    const local = point.matrixTransform(matrix.inverse());
    const { id, dx, dy } = dragRef.current;
    setElements((current) => current.map((item) => item.id === id
      ? { ...item, x: Math.max(0, Math.min(WIDTH - item.width, local.x - dx)), y: Math.max(0, Math.min(HEIGHT - 20, local.y - dy)) }
      : item));
    setSaved(false);
  }

  function addImage(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      const item: DesignElement = {
        id: crypto.randomUUID(),
        type: "image",
        x: 130,
        y: 180,
        width: 820,
        height: 650,
        src: String(reader.result),
      };
      setElements((current) => [...current, item]);
      setSelectedId(item.id);
      setSaved(false);
    };
    reader.readAsDataURL(file);
  }

  function saveDraft() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ elements, background, projectName }));
    setSaved(true);
  }

  async function exportPng() {
    const svg = svgRef.current;
    if (!svg) return;
    const clone = svg.cloneNode(true) as SVGSVGElement;
    clone.querySelectorAll("[data-editor-ui]").forEach((node) => node.remove());
    clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    const source = new XMLSerializer().serializeToString(clone);
    const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = WIDTH;
      canvas.height = HEIGHT;
      const context = canvas.getContext("2d");
      if (!context) return;
      context.drawImage(image, 0, 0, WIDTH, HEIGHT);
      URL.revokeObjectURL(url);
      canvas.toBlob((png) => {
        if (!png) return;
        const downloadUrl = URL.createObjectURL(png);
        const anchor = document.createElement("a");
        anchor.href = downloadUrl;
        anchor.download = (projectName.trim() || "thoughts-of-cee-design").replace(/[^a-z0-9-_]+/gi, "-") + ".png";
        anchor.click();
        URL.revokeObjectURL(downloadUrl);
      }, "image/png");
    };
    image.onerror = () => URL.revokeObjectURL(url);
    image.src = url;
  }

  function deleteSelected() {
    if (!selectedId) return;
    setElements((current) => current.filter((item) => item.id !== selectedId));
    setSelectedId(null);
    setSaved(false);
  }

  return (
    <main className="min-h-screen bg-[#EAE4DB] text-black">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-[#CFC4B7] px-5 py-4 sm:px-8">
        <div className="flex items-center gap-5">
          <Link href="/studio" className="text-[11px] font-black uppercase tracking-[0.18em]">Thoughts of Cee</Link>
          <span className="text-[10px] uppercase tracking-[0.16em] text-[#765D4B]">Creative Studio / Editor</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link href="/studio" className="border border-[#CFC4B7] px-4 py-2 text-[10px] uppercase tracking-wider">Back to studio</Link>
          <button onClick={undo} disabled={undoStack.current.length === 0} className="border border-[#CFC4B7] px-3 py-2 text-[10px] uppercase tracking-wider disabled:opacity-40">↶ Undo</button>
          <button onClick={redo} disabled={redoStack.current.length === 0} className="border border-[#CFC4B7] px-3 py-2 text-[10px] uppercase tracking-wider disabled:opacity-40">↷ Redo</button>
          <button onClick={saveDraft} className="bg-black px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-[#EAE4DB]"> {saved ? "Saved locally ✓" : "Save draft"} </button>
          <button onClick={exportPng} className="bg-[#765D4B] px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-white">Export PNG ↓</button>
        </div>
      </header>

      <div className="grid min-h-[calc(100vh-65px)] lg:grid-cols-[250px_minmax(0,1fr)_280px]">
        <aside className="border-b border-[#CFC4B7] bg-[#E4DDD3] p-5 lg:border-b-0 lg:border-r">
          <p className="mb-3 text-[9px] font-bold uppercase tracking-[0.2em] text-[#765D4B]">Your design</p>
          <input value={projectName} onChange={(event) => { setProjectName(event.target.value); setSaved(false); }} aria-label="Design name" className="mb-6 w-full border border-[#CFC4B7] bg-[#F5F0E9] px-3 py-2 text-sm outline-none focus:border-black" />
          <p className="mb-3 text-[9px] font-bold uppercase tracking-[0.2em] text-[#765D4B]">Add elements</p>
          <button onClick={addText} className="mb-2 w-full border border-[#CFC4B7] bg-[#F5F0E9] px-3 py-3 text-left text-xs hover:border-black">＋ Add text</button>
          <button onClick={() => fileRef.current?.click()} className="mb-2 w-full border border-[#CFC4B7] bg-[#F5F0E9] px-3 py-3 text-left text-xs hover:border-black">＋ Upload image</button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (file) addImage(file); event.currentTarget.value = ""; }} />
          <p className="mb-3 mt-7 text-[9px] font-bold uppercase tracking-[0.2em] text-[#765D4B]">Layers</p>
          <div className="space-y-1">
            {elements.length === 0 && <p className="text-xs leading-5 text-[#765D4B]">Your elements will appear here.</p>}
            {elements.map((item, index) => <button key={item.id} onClick={() => setSelectedId(item.id)} className={`w-full border px-3 py-2 text-left text-xs ${selectedId === item.id ? "border-black bg-[#F5F0E9]" : "border-transparent hover:bg-black/5"}`}>{index + 1}. {item.type === "text" ? (item.text || "Text").slice(0, 24) : "Image"}</button>)}
          </div>
        </aside>

        <section className="flex min-w-0 flex-col items-center justify-center gap-4 bg-[#D9D1C7] p-4 sm:p-8">
          <div className="flex w-full max-w-[760px] items-center justify-between text-[9px] uppercase tracking-[0.16em] text-[#765D4B]">
            <span>Instagram portrait · 1080 × 1350</span><span>Drag elements to arrange</span>
          </div>
          <div className="w-full max-w-[760px] border border-[#B9AA9A] bg-[#F5F0E9] p-2 shadow-[0_12px_40px_rgba(46,36,27,0.10)]">
            <svg ref={svgRef} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} onPointerMove={onPointerMove} onPointerUp={() => { dragRef.current = null; resizeRef.current = null; setGuides({}); }} onPointerLeave={() => { dragRef.current = null; resizeRef.current = null; setGuides({}); }} onClick={() => setSelectedId(null)} className="block h-auto w-full touch-none" style={{ background }}>
              <rect width={WIDTH} height={HEIGHT} fill={background} />
              {guides.x !== undefined && <line data-editor-ui="true" x1={guides.x} x2={guides.x} y1="0" y2={HEIGHT} stroke="#C04435" strokeWidth="2" strokeDasharray="12 8" pointerEvents="none" />}
              {guides.y !== undefined && <line data-editor-ui="true" x1="0" x2={WIDTH} y1={guides.y} y2={guides.y} stroke="#C04435" strokeWidth="2" strokeDasharray="12 8" pointerEvents="none" />}
              {elements.map((item) => <g key={item.id} onPointerDown={(event) => onPointerDown(event, item)} onClick={(event) => { event.stopPropagation(); setSelectedId(item.id); }} className="cursor-move">
                {item.type === "text" ? <text x={item.x} y={item.y} fontFamily={item.fontFamily ?? "Impact"} fontSize={item.fontSize ?? 82} fill={item.fill ?? "#000000"}>{item.text}</text> : <image href={item.src} x={item.x} y={item.y} width={item.width} height={item.height} preserveAspectRatio="xMidYMid meet" />}
                {selectedId === item.id && <rect data-editor-ui="true" x={item.x - 8} y={item.y - (item.type === "text" ? (item.fontSize ?? 82) : 8)} width={item.width + 16} height={item.type === "text" ? (item.fontSize ?? 82) + 24 : item.height + 16} fill="none" stroke="#765D4B" strokeWidth="3" strokeDasharray="10 8" pointerEvents="none" />}
                {selectedId === item.id && item.type === "image" && <circle data-editor-ui="true" cx={item.x + item.width} cy={item.y + item.height} r="24" fill="#000000" stroke="#F5F0E9" strokeWidth="5" className="cursor-nwse-resize" onPointerDown={(event) => onResizeDown(event, item)} />}
              </g>)}
              {elements.length === 0 && <g pointerEvents="none"><text x="540" y="630" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="34" letterSpacing="8" fill="#8A7A6B">YOUR CANVAS</text><text x="540" y="685" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="22" fill="#8A7A6B">Add text or upload an image to begin</text></g>}
            </svg>
          </div>
          <p className="text-center text-[10px] leading-5 text-[#765D4B]">Your first canvas is ready. Select an element to edit it, or drag it into place.</p>
        </section>

        <aside className="border-t border-[#CFC4B7] bg-[#E4DDD3] p-5 lg:border-l lg:border-t-0">
          <p className="mb-4 text-[9px] font-bold uppercase tracking-[0.2em] text-[#765D4B]">Design settings</p>
          <label className="mb-2 block text-xs font-bold">Canvas colour</label>
          <div className="mb-7 flex gap-2">
            {["#EAE4DB", "#F5F0E9", "#000000", "#765D4B"].map((color) => <button key={color} onClick={() => { setBackground(color); setSaved(false); }} aria-label={`Set background ${color}`} className="h-8 w-8 border border-[#B9AA9A]" style={{ background: color }} />)}
          </div>
          {selected ? <>
            <div className="mb-4 border-t border-[#CFC4B7] pt-5"><p className="mb-3 text-[9px] font-bold uppercase tracking-[0.2em] text-[#765D4B]">Selected {selected.type}</p>
              {selected.type === "text" && <>
                <label className="mb-2 block text-xs font-bold" htmlFor="element-text">Text</label>
                <textarea id="element-text" value={selected.text ?? ""} onChange={(event) => updateSelected({ text: event.target.value })} rows={4} className="mb-4 w-full border border-[#CFC4B7] bg-[#F5F0E9] p-3 text-sm outline-none focus:border-black" />
                <label className="mb-2 block text-xs font-bold" htmlFor="font-family">Font family</label>
                <select id="font-family" value={selected.fontFamily ?? "Impact"} onChange={(event) => updateSelected({ fontFamily: event.target.value })} className="mb-4 w-full border border-[#CFC4B7] bg-[#F5F0E9] px-3 py-2 text-sm">{FONT_OPTIONS.map((font) => <option key={font} value={font}>{font}</option>)}</select>
                <label className="mb-2 block text-xs font-bold" htmlFor="font-size">Font size · {selected.fontSize}</label>
                <input id="font-size" type="range" min="24" max="180" value={selected.fontSize ?? 82} onChange={(event) => updateSelected({ fontSize: Number(event.target.value) })} className="mb-4 w-full" />
                <label className="mb-2 block text-xs font-bold" htmlFor="text-colour">Text colour</label>
                <input id="text-colour" type="color" value={selected.fill ?? "#000000"} onChange={(event) => updateSelected({ fill: event.target.value })} className="mb-4 h-9 w-full" />
              </>}
              {selected.type === "image" && <>
                <label className="mb-2 block text-xs font-bold" htmlFor="image-width">Image width · {Math.round(selected.width)} px</label>
                <input id="image-width" type="range" min="80" max="1080" value={Math.min(1080, selected.width)} onChange={(event) => updateSelected({ width: Number(event.target.value) })} className="mb-4 w-full" />
                <label className="mb-2 block text-xs font-bold" htmlFor="image-height">Image height · {Math.round(selected.height)} px</label>
                <input id="image-height" type="range" min="80" max="1350" value={Math.min(1350, selected.height)} onChange={(event) => updateSelected({ height: Number(event.target.value) })} className="mb-4 w-full" />
              </>}
              <label className="mb-2 block text-xs font-bold" htmlFor="position-x">Position X</label>
              <input id="position-x" type="number" value={Math.round(selected.x)} onChange={(event) => updateSelected({ x: Number(event.target.value) })} className="mb-3 w-full border border-[#CFC4B7] bg-[#F5F0E9] px-3 py-2 text-sm" />
              <label className="mb-2 block text-xs font-bold" htmlFor="position-y">Position Y</label>
              <input id="position-y" type="number" value={Math.round(selected.y)} onChange={(event) => updateSelected({ y: Number(event.target.value) })} className="mb-4 w-full border border-[#CFC4B7] bg-[#F5F0E9] px-3 py-2 text-sm" />
              <div className="mb-4 grid grid-cols-3 gap-1">
                {[
                  ["Left", () => updateSelected({ x: 0 })], ["Center", () => updateSelected({ x: (WIDTH - selected.width) / 2 })], ["Right", () => updateSelected({ x: WIDTH - selected.width })],
                  ["Top", () => updateSelected({ y: 0 })], ["Middle", () => updateSelected({ y: (HEIGHT - selected.height) / 2 })], ["Bottom", () => updateSelected({ y: HEIGHT - selected.height })],
                ].map(([label, action]) => <button key={String(label)} onClick={action as () => void} className="border border-[#CFC4B7] bg-[#F5F0E9] px-2 py-2 text-[10px]">{String(label)}</button>)}
              </div>
              <button onClick={deleteSelected} className="w-full border border-[#9C6558] px-3 py-3 text-xs font-bold uppercase tracking-wider text-[#8B3327]">Delete element</button>
            </div>
          </> : <p className="text-xs leading-6 text-[#765D4B]">Select a text or image layer on the canvas to adjust its settings.</p>}
          <div className="mt-8 border-t border-[#CFC4B7] pt-5">
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#765D4B]">Coming next</p>
            <p className="mt-2 text-xs leading-6 text-[#6B625A]">More typefaces, crop controls, cloud saving and the Thoughts of Cee brand kit.</p>
          </div>
        </aside>
      </div>
      {!hydrated && <div className="sr-only">Loading your draft</div>}
    </main>
  );
}
