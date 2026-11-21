"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";

type Layer = {
  id: string;
  type: "text" | "image";
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  text?: string;
  fontFamily?: string;
  fontSize?: number;
  fill?: string;
  src?: string;
};

type Draft = { name: string; width: number; height: number; background: string; layers: Layer[] };
type Gesture = { id: string; mode: "move" | "resize" | "rotate"; startX: number; startY: number; x: number; y: number; width: number; height: number; rotation: number; ratio: number };

const FORMATS = [
  { name: "Instagram portrait", width: 1080, height: 1350 },
  { name: "Instagram square", width: 1080, height: 1080 },
  { name: "Instagram story", width: 1080, height: 1920 },
  { name: "Pinterest pin", width: 1000, height: 1500 },
];
const FONTS = ["Impact", "Arial", "Helvetica", "Georgia", "Times New Roman", "Trebuchet MS", "Verdana", "Courier New", "Palatino Linotype"];
const COLORS = ["#EAE4DB", "#F8F5F0", "#000000", "#292522", "#765D4B", "#CFC4B7", "#FFFFFF"];

const clone = (draft: Draft): Draft => JSON.parse(JSON.stringify(draft));

export default function StudioCreatePage() {
  const [draft, setDraft] = useState<Draft>({ name: "Untitled design", width: 1080, height: 1350, background: "#EAE4DB", layers: [] });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(48);
  const [saved, setSaved] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const imageCache = useRef<Map<string, HTMLImageElement>>(new Map());
  const gesture = useRef<Gesture | null>(null);
  const undoStack = useRef<Draft[]>([]);
  const redoStack = useRef<Draft[]>([]);
  const selected = draft.layers.find((layer) => layer.id === selectedId) ?? null;

  const remember = useCallback(() => {
    undoStack.current.push(clone(draft));
    if (undoStack.current.length > 60) undoStack.current.shift();
    redoStack.current = [];
  }, [draft]);

  const changeDraft = (updater: (current: Draft) => Draft) => {
    setDraft((current) => updater(current));
    setSaved(false);
  };

  useEffect(() => {
    try {
      const raw = localStorage.getItem("toc-studio-editor-v2");
      if (raw) {
        const parsed = JSON.parse(raw) as Draft;
        if (parsed && Array.isArray(parsed.layers)) setDraft(parsed);
      }
    } catch { /* Start with a fresh document if the local draft is unreadable. */ }
    setHydrated(true);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    canvas.width = draft.width;
    canvas.height = draft.height;
    context.fillStyle = draft.background;
    context.fillRect(0, 0, draft.width, draft.height);

    if (showGrid) {
      context.save();
      context.strokeStyle = "rgba(80,70,60,.13)";
      context.lineWidth = 1;
      const step = 90;
      for (let x = step; x < draft.width; x += step) { context.beginPath(); context.moveTo(x, 0); context.lineTo(x, draft.height); context.stroke(); }
      for (let y = step; y < draft.height; y += step) { context.beginPath(); context.moveTo(0, y); context.lineTo(draft.width, y); context.stroke(); }
      context.restore();
    }

    for (const layer of draft.layers) {
      context.save();
      const cx = layer.x + layer.width / 2;
      const cy = layer.y + layer.height / 2;
      context.translate(cx, cy);
      context.rotate((layer.rotation || 0) * Math.PI / 180);
      if (layer.type === "image" && layer.src) {
        let image = imageCache.current.get(layer.id);
        if (!image || image.src !== layer.src) {
          image = new Image();
          image.onload = () => {
            imageCache.current.set(layer.id, image!);
            const activeCanvas = canvasRef.current;
            const activeContext = activeCanvas?.getContext("2d");
            if (activeCanvas && activeContext) {
              activeContext.save();
              activeContext.fillStyle = draft.background;
              activeContext.fillRect(0, 0, draft.width, draft.height);
              activeContext.restore();
              setDraft((current) => ({ ...current }));
            }
          };
          image.src = layer.src;
          imageCache.current.set(layer.id, image);
        }
        if (image.complete && image.naturalWidth) context.drawImage(image, -layer.width / 2, -layer.height / 2, layer.width, layer.height);
      } else if (layer.type === "text") {
        context.fillStyle = layer.fill || "#000000";
        context.font = `700 ${layer.fontSize || 80}px "${layer.fontFamily || "Impact"}"`;
        context.textBaseline = "top";
        const lines = (layer.text || "").split("\n");
        const lineHeight = (layer.fontSize || 80) * 1.08;
        lines.forEach((line, index) => context.fillText(line, -layer.width / 2, -layer.height / 2 + index * lineHeight, layer.width));
      }
      context.restore();
    }

    if (selectedId) {
      const layer = draft.layers.find((item) => item.id === selectedId);
      if (layer) {
        context.save();
        const cx = layer.x + layer.width / 2;
        const cy = layer.y + layer.height / 2;
        context.translate(cx, cy);
        context.rotate((layer.rotation || 0) * Math.PI / 180);
        context.strokeStyle = "#765D4B";
        context.lineWidth = Math.max(2, draft.width / 540);
        context.setLineDash([10, 7]);
        context.strokeRect(-layer.width / 2, -layer.height / 2, layer.width, layer.height);
        context.setLineDash([]);
        const handle = Math.max(12, draft.width / 65);
        context.fillStyle = "#FFFFFF";
        context.strokeStyle = "#765D4B";
        [[-layer.width / 2, -layer.height / 2], [layer.width / 2, -layer.height / 2], [-layer.width / 2, layer.height / 2], [layer.width / 2, layer.height / 2]].forEach(([x, y]) => {
          context.beginPath(); context.arc(x, y, handle / 2, 0, Math.PI * 2); context.fill(); context.stroke();
        });
        context.beginPath();
        context.moveTo(0, -layer.height / 2);
        context.lineTo(0, -layer.height / 2 - handle * 2.5);
        context.stroke();
        context.beginPath(); context.arc(0, -layer.height / 2 - handle * 2.5, handle / 2, 0, Math.PI * 2); context.fill(); context.stroke();
        context.restore();
      }
    }
  }, [draft, selectedId, showGrid]);

  const pointFromEvent = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return { x: (event.clientX - rect.left) * draft.width / rect.width, y: (event.clientY - rect.top) * draft.height / rect.height };
  };

  const localPoint = (point: { x: number; y: number }, layer: Layer) => {
    const cx = layer.x + layer.width / 2;
    const cy = layer.y + layer.height / 2;
    const angle = -(layer.rotation || 0) * Math.PI / 180;
    const dx = point.x - cx;
    const dy = point.y - cy;
    return { x: dx * Math.cos(angle) - dy * Math.sin(angle), y: dx * Math.sin(angle) + dy * Math.cos(angle) };
  };

  const onPointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const point = pointFromEvent(event);
    const layer = [...draft.layers].reverse().find((item) => {
      const p = localPoint(point, item);
      return Math.abs(p.x) <= item.width / 2 && Math.abs(p.y) <= item.height / 2;
    });
    if (!layer) { setSelectedId(null); return; }
    setSelectedId(layer.id);
    const p = localPoint(point, layer);
    const handleSize = Math.max(22, draft.width / 45);
    const rotateY = -layer.height / 2 - handleSize * 2.5;
    let mode: Gesture["mode"] = "move";
    if (Math.abs(p.x) <= handleSize && Math.abs(p.y - rotateY) <= handleSize) mode = "rotate";
    else if (Math.abs(p.x - layer.width / 2) <= handleSize && Math.abs(p.y - layer.height / 2) <= handleSize) mode = "resize";
    remember();
    gesture.current = { id: layer.id, mode, startX: point.x, startY: point.y, x: layer.x, y: layer.y, width: layer.width, height: layer.height, rotation: layer.rotation || 0, ratio: layer.width / Math.max(1, layer.height) };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const active = gesture.current;
    if (!active) return;
    const point = pointFromEvent(event);
    const dx = point.x - active.startX;
    const dy = point.y - active.startY;
    changeDraft((current) => ({
      ...current,
      layers: current.layers.map((layer) => {
        if (layer.id !== active.id) return layer;
        if (active.mode === "move") {
          const rawX = active.x + dx;
          const rawY = active.y + dy;
          const centerX = rawX + layer.width / 2;
          const centerY = rawY + layer.height / 2;
          const snap = 18;
          const snappedX = Math.abs(centerX - current.width / 2) < snap ? (current.width - layer.width) / 2 : Math.max(0, Math.min(current.width - layer.width, rawX));
          const snappedY = Math.abs(centerY - current.height / 2) < snap ? (current.height - layer.height) / 2 : Math.max(0, Math.min(current.height - layer.height, rawY));
          return { ...layer, x: snappedX, y: snappedY };
        }
        if (active.mode === "resize") {
          const width = Math.max(60, active.width + dx);
          const height = Math.max(50, width / active.ratio);
          return { ...layer, width, height };
        }
        const cx = active.x + active.width / 2;
        const cy = active.y + active.height / 2;
        const startAngle = Math.atan2(active.startY - cy, active.startX - cx);
        const currentAngle = Math.atan2(point.y - cy, point.x - cx);
        return { ...layer, rotation: active.rotation + (currentAngle - startAngle) * 180 / Math.PI };
      }),
    }));
  };

  const onPointerUp = () => { gesture.current = null; };

  const addText = () => {
    remember();
    const layer: Layer = { id: crypto.randomUUID(), type: "text", x: 110, y: 220, width: 860, height: 220, rotation: 0, text: "Your words here.", fontFamily: "Impact", fontSize: 92, fill: "#000000" };
    changeDraft((current) => ({ ...current, layers: [...current.layers, layer] }));
    setSelectedId(layer.id);
  };

  const addImage = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const src = String(reader.result);
      const image = new Image();
      image.onload = () => {
        remember();
        const width = Math.min(760, image.naturalWidth);
        const height = width * image.naturalHeight / image.naturalWidth;
        const layer: Layer = { id: crypto.randomUUID(), type: "image", x: (draft.width - width) / 2, y: (draft.height - height) / 2, width, height, rotation: 0, src };
        imageCache.current.set(layer.id, image);
        changeDraft((current) => ({ ...current, layers: [...current.layers, layer] }));
        setSelectedId(layer.id);
      };
      image.src = src;
    };
    reader.readAsDataURL(file);
  };

  const updateSelected = (patch: Partial<Layer>) => {
    if (!selectedId) return;
    remember();
    changeDraft((current) => ({ ...current, layers: current.layers.map((layer) => layer.id === selectedId ? { ...layer, ...patch } : layer) }));
  };

  const removeSelected = () => {
    if (!selectedId) return;
    remember();
    changeDraft((current) => ({ ...current, layers: current.layers.filter((layer) => layer.id !== selectedId) }));
    setSelectedId(null);
  };

  const undo = () => {
    const previous = undoStack.current.pop();
    if (!previous) return;
    redoStack.current.push(clone(draft));
    setDraft(previous); setSelectedId(null); setSaved(false);
  };
  const redo = () => {
    const next = redoStack.current.pop();
    if (!next) return;
    undoStack.current.push(clone(draft));
    setDraft(next); setSelectedId(null); setSaved(false);
  };

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (target && ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)) return;
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "z") { event.preventDefault(); event.shiftKey ? redo() : undo(); }
      if ((event.key === "Delete" || event.key === "Backspace") && selectedId) removeSelected();
      if (event.key === "Escape") setSelectedId(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const saveDraft = () => {
    try { localStorage.setItem("toc-studio-editor-v2", JSON.stringify(draft)); setSaved(true); }
    catch { alert("This design is too large for browser storage. Export it as a PNG to keep a copy."); }
  };

  const exportPng = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const anchor = document.createElement("a");
    anchor.download = `${draft.name.trim().replace(/[^a-z0-9]+/gi, "-").toLowerCase() || "thoughts-of-cee-design"}.png`;
    anchor.href = canvas.toDataURL("image/png");
    anchor.click();
  };

  const setFormat = (value: string) => {
    const format = FORMATS.find((item) => item.name === value);
    if (!format) return;
    remember();
    changeDraft((current) => ({ ...current, width: format.width, height: format.height }));
    setZoom(Math.min(52, Math.round(560 / format.width * 100)));
  };

  return (
    <main className="min-h-screen bg-[#EAE4DB] text-[#292522]">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[#CFC4B7] px-5 py-4">
        <div className="flex items-center gap-4"><Link href="/studio" className="text-xs font-bold uppercase tracking-widest text-[#765D4B]">← Studio</Link><span className="h-5 w-px bg-[#CFC4B7]" /><div><p className="text-[10px] font-bold uppercase tracking-[.22em]">Thoughts of Cee</p><p className="text-[9px] uppercase tracking-[.18em] text-[#765D4B]">Creative Studio · Editor</p></div></div>
        <div className="flex flex-wrap items-center gap-2"><button onClick={undo} disabled={!undoStack.current.length} className="border border-[#CFC4B7] px-3 py-2 text-xs disabled:opacity-35">↶ Undo</button><button onClick={redo} disabled={!redoStack.current.length} className="border border-[#CFC4B7] px-3 py-2 text-xs disabled:opacity-35">↷ Redo</button><button onClick={saveDraft} className="border border-[#292522] px-4 py-2 text-xs font-bold uppercase tracking-wider">{saved ? "Saved ✓" : "Save draft"}</button><button onClick={exportPng} className="bg-black px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#EAE4DB]">Export PNG ↓</button></div>
      </header>
      <div className="grid min-h-[calc(100vh-73px)] grid-cols-1 lg:grid-cols-[230px_minmax(0,1fr)_270px]">
        <aside className="border-b border-[#CFC4B7] p-5 lg:border-b-0 lg:border-r">
          <p className="mb-4 text-[10px] font-bold uppercase tracking-[.2em] text-[#765D4B]">Create</p>
          <button onClick={addText} className="mb-2 w-full border border-[#CFC4B7] bg-[#F5F0E9] p-3 text-left text-sm font-semibold">＋ Add text</button>
          <button onClick={() => fileRef.current?.click()} className="mb-2 w-full border border-[#CFC4B7] bg-[#F5F0E9] p-3 text-left text-sm font-semibold">＋ Upload image</button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(event) => { addImage(event.target.files?.[0]); event.currentTarget.value = ""; }} />
          <div className="mt-7"><p className="mb-3 text-[10px] font-bold uppercase tracking-[.2em] text-[#765D4B]">Layers · {draft.layers.length}</p>
            {draft.layers.length === 0 ? <p className="text-xs leading-5 text-[#765D4B]">Your design elements will appear here.</p> : [...draft.layers].reverse().map((layer) => <button key={layer.id} onClick={() => setSelectedId(layer.id)} className={`mb-1 block w-full truncate border px-3 py-2 text-left text-xs ${selectedId === layer.id ? "border-black bg-[#DCD2C6]" : "border-[#CFC4B7] bg-[#F5F0E9]"}`}>{layer.type === "text" ? "T  " + (layer.text || "Text").slice(0, 22) : "▧  Image"}</button>)}
          </div>
          <div className="mt-7 border-t border-[#CFC4B7] pt-5"><p className="mb-3 text-[10px] font-bold uppercase tracking-[.2em] text-[#765D4B]">Canvas</p><label className="mb-2 block text-xs">Format</label><select value={FORMATS.find((item) => item.width === draft.width && item.height === draft.height)?.name || "Instagram portrait"} onChange={(event) => setFormat(event.target.value)} className="w-full border border-[#CFC4B7] bg-[#F5F0E9] px-2 py-2 text-xs">{FORMATS.map((item) => <option key={item.name}>{item.name}</option>)}</select><label className="mb-2 mt-4 block text-xs">Background</label><div className="flex flex-wrap gap-2">{COLORS.map((color) => <button key={color} aria-label={`Background ${color}`} onClick={() => { remember(); changeDraft((current) => ({ ...current, background: color })); }} className="h-7 w-7 border border-[#9E9388]" style={{ backgroundColor: color }} />)}</div><label className="mt-4 flex items-center gap-2 text-xs"><input type="checkbox" checked={showGrid} onChange={(event) => setShowGrid(event.target.checked)} /> Show alignment grid</label></div>
        </aside>
        <section className="flex min-h-[650px] flex-col items-center justify-center overflow-hidden bg-[#D8D0C7] p-5">
          <div className="mb-4 flex w-full max-w-[760px] items-center justify-between text-[10px] font-bold uppercase tracking-widest text-[#655B52]"><span>{draft.width} × {draft.height} px</span><span>{zoom}%</span></div>
          <div className="relative shadow-[0_14px_45px_rgba(35,28,22,.18)]" style={{ width: `min(100%, ${draft.width * zoom / 100}px)` }}>
            <canvas ref={canvasRef} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp} className="block h-auto w-full touch-none" style={{ aspectRatio: `${draft.width}/${draft.height}`, background: draft.background, cursor: gesture.current ? "grabbing" : "default" }} />
          </div>
          <div className="mt-5 flex items-center gap-3"><button onClick={() => setZoom((value) => Math.max(20, value - 5))} className="border border-[#BEB3A8] bg-[#EAE4DB] px-3 py-1 text-sm">−</button><input aria-label="Canvas zoom" type="range" min="20" max="75" value={zoom} onChange={(event) => setZoom(Number(event.target.value))} /><button onClick={() => setZoom((value) => Math.min(75, value + 5))} className="border border-[#BEB3A8] bg-[#EAE4DB] px-3 py-1 text-sm">＋</button></div>
          <p className="mt-3 text-center text-[10px] text-[#655B52]">Drag to move · Pull the bottom-right handle to resize · Use the top handle to rotate</p>
        </section>
        <aside className="border-t border-[#CFC4B7] p-5 lg:border-t-0 lg:border-l">
          <p className="mb-4 text-[10px] font-bold uppercase tracking-[.2em] text-[#765D4B]">Design details</p>
          <label className="mb-2 block text-xs font-semibold">Project name</label><input value={draft.name} onChange={(event) => changeDraft((current) => ({ ...current, name: event.target.value }))} className="mb-5 w-full border border-[#CFC4B7] bg-[#F5F0E9] px-3 py-2 text-sm outline-none focus:border-black" />
          {selected ? <><p className="mb-4 border-b border-[#CFC4B7] pb-3 text-xs font-bold uppercase tracking-widest">{selected.type} selected</p>
            {selected.type === "text" ? <><label className="mb-2 block text-xs">Text</label><textarea rows={5} value={selected.text || ""} onChange={(event) => updateSelected({ text: event.target.value })} className="mb-4 w-full border border-[#CFC4B7] bg-[#F5F0E9] p-3 text-sm" /><label className="mb-2 block text-xs">Typeface</label><select value={selected.fontFamily || "Impact"} onChange={(event) => updateSelected({ fontFamily: event.target.value })} className="mb-4 w-full border border-[#CFC4B7] bg-[#F5F0E9] p-2 text-sm">{FONTS.map((font) => <option key={font}>{font}</option>)}</select><label className="mb-2 block text-xs">Font size · {selected.fontSize}</label><input type="range" min="20" max="200" value={selected.fontSize || 92} onChange={(event) => updateSelected({ fontSize: Number(event.target.value) })} className="mb-4 w-full" /><label className="mb-2 block text-xs">Text colour</label><input type="color" value={selected.fill || "#000000"} onChange={(event) => updateSelected({ fill: event.target.value })} className="mb-5 h-9 w-full" /></> : <p className="mb-5 text-xs leading-5 text-[#765D4B]">Resize proportionally from the canvas handle. Crop and image adjustments are next on the roadmap.</p>}
            <label className="mb-2 block text-xs">Rotation · {Math.round(selected.rotation)}°</label><input type="range" min="-180" max="180" value={Math.round(selected.rotation)} onChange={(event) => updateSelected({ rotation: Number(event.target.value) })} className="mb-5 w-full" />
            <div className="mb-5 grid grid-cols-2 gap-2"><button onClick={() => updateSelected({ x: (draft.width - selected.width) / 2 })} className="border border-[#CFC4B7] px-2 py-2 text-xs">Center horizontally</button><button onClick={() => updateSelected({ y: (draft.height - selected.height) / 2 })} className="border border-[#CFC4B7] px-2 py-2 text-xs">Center vertically</button></div>
            <button onClick={removeSelected} className="w-full border border-[#9C6558] px-3 py-3 text-xs font-bold uppercase tracking-wider text-[#8B3327]">Delete layer</button>
          </> : <p className="text-xs leading-6 text-[#765D4B]">Choose a layer on the canvas or from the layer list to edit it.</p>}
          <div className="mt-8 border-t border-[#CFC4B7] pt-5"><p className="text-[9px] font-bold uppercase tracking-[.2em] text-[#765D4B]">Editor notes</p><p className="mt-2 text-xs leading-6 text-[#6B625A]">Drafts are saved in this browser only. Export a PNG to keep a separate copy. Cloud projects and multi-user access come later.</p></div>
        </aside>
      </div>
      {!hydrated && <div className="sr-only">Loading your draft</div>}
    </main>
  );
}
