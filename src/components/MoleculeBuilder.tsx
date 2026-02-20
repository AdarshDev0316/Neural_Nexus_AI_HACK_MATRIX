// ============================================
// PharmaQuest AI - 3D Molecule Builder
// Three.js Interactive Molecule Construction
// ============================================

import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { 
  Atom as AtomIcon, 
  Trash2,
  Info, 
  CheckCircle,
  Play,
  Link
} from 'lucide-react';
import { ELEMENTS, AYURVEDA_COMPOUNDS } from '@/data/pharmaData';
import { useMoleculeStore, useGameStore } from '@/store/gameStore';
import { eventDispatcher } from '@/services/EventDispatcher';
import { cn } from '@/utils/cn';

interface Atom3D {
  id: string;
  element: string;
  mesh: THREE.Mesh;
  position: THREE.Vector3;
  bonds: string[];
  color: string;
}

export function MoleculeBuilder() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const atomsRef = useRef<Map<string, Atom3D>>(new Map());
  const bondsRef = useRef<THREE.Line[]>([]);
  
  const { selectedElement, setSelectedElement } = useMoleculeStore();
  const { addXP } = useGameStore();
  
  const [atoms, setAtoms] = useState<Atom3D[]>([]);
  const [bondMode, setBondMode] = useState(false);
  const [selectedAtom, setSelectedAtom] = useState<string | null>(null);
  const [ayurvedaMatch, setAyurvedaMatch] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Initialize Three.js scene
  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a1a);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 10;
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x6366f1, 1, 100);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(0xa855f7, 0.8, 100);
    pointLight2.position.set(-10, -10, 5);
    scene.add(pointLight2);

    // Grid helper
    const gridHelper = new THREE.GridHelper(20, 20, 0x1e1e3f, 0x1e1e3f);
    gridHelper.rotation.x = Math.PI / 2;
    scene.add(gridHelper);

    // Animation loop
    let rotationY = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      rotationY += 0.002;
      
      atomsRef.current.forEach((atom) => {
        atom.mesh.rotation.y = rotationY;
      });
      
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Click handler for adding atoms
    const handleClick = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      const mouse = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);

      // Check if clicking on existing atom
      const meshes = Array.from(atomsRef.current.values()).map(a => a.mesh);
      const intersects = raycaster.intersectObjects(meshes);

      if (intersects.length > 0 && bondMode) {
        const clickedMesh = intersects[0].object as THREE.Mesh;
        const clickedAtom = Array.from(atomsRef.current.values()).find(a => a.mesh === clickedMesh);
        
        if (clickedAtom) {
          if (selectedAtom && selectedAtom !== clickedAtom.id) {
            createBond(selectedAtom, clickedAtom.id);
            setSelectedAtom(null);
          } else {
            setSelectedAtom(clickedAtom.id);
          }
        }
        return;
      }

      // Add new atom
      if (!bondMode) {
        const planeZ = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
        const point = new THREE.Vector3();
        raycaster.ray.intersectPlane(planeZ, point);
        
        if (point) {
          addAtom(selectedElement, point);
        }
      }
    };

    renderer.domElement.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('click', handleClick);
      container.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [selectedElement, bondMode, selectedAtom]);

  const addAtom = (element: string, position: THREE.Vector3) => {
    const elementData = ELEMENTS.find(e => e.symbol === element);
    if (!elementData || !sceneRef.current) return;

    const geometry = new THREE.SphereGeometry(0.5, 32, 32);
    const material = new THREE.MeshPhongMaterial({ 
      color: elementData.color,
      emissive: elementData.color,
      emissiveIntensity: 0.2,
      shininess: 100
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.copy(position);

    // Add glow effect
    const glowGeometry = new THREE.SphereGeometry(0.6, 32, 32);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: elementData.color,
      transparent: true,
      opacity: 0.3
    });
    const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
    mesh.add(glowMesh);

    sceneRef.current.add(mesh);

    const newAtom: Atom3D = {
      id: `atom_${Date.now()}`,
      element: elementData.symbol,
      mesh,
      position,
      bonds: [],
      color: elementData.color
    };

    atomsRef.current.set(newAtom.id, newAtom);
    setAtoms(Array.from(atomsRef.current.values()));

    // Trigger AI feedback
    eventDispatcher.dispatch({
      type: 'hint_event',
      payload: { context: 'molecule', action: 'add_atom', element },
      timestamp: Date.now(),
      source: 'molecule_builder',
      priority: 'low'
    });
  };

  const createBond = (atomId1: string, atomId2: string) => {
    const atom1 = atomsRef.current.get(atomId1);
    const atom2 = atomsRef.current.get(atomId2);
    
    if (!atom1 || !atom2 || !sceneRef.current) return;

    const material = new THREE.LineBasicMaterial({ 
      color: 0x6366f1,
      linewidth: 2
    });
    const geometry = new THREE.BufferGeometry().setFromPoints([
      atom1.position,
      atom2.position
    ]);
    const line = new THREE.Line(geometry, material);
    sceneRef.current.add(line);
    bondsRef.current.push(line);

    atom1.bonds.push(atomId2);
    atom2.bonds.push(atomId1);

    // Check for Ayurveda matches
    checkAyurvedaMatch();
  };

  const checkAyurvedaMatch = () => {
    const atomList = Array.from(atomsRef.current.values());
    const elements = atomList.map(a => a.element);
    
    // Simple matching logic
    const hasSalicylate = elements.includes('C') && elements.includes('O') && elements.filter(e => e === 'C').length >= 7;
    
    if (hasSalicylate) {
      const match = AYURVEDA_COMPOUNDS.find(c => c.modernEquivalent === 'Aspirin');
      if (match) {
        setAyurvedaMatch(`🌿 Ayurveda Connection: Similar salicylate compounds found in ${match.plantSource}! ${match.name} has been used traditionally for ${match.therapeuticUses.join(', ')}.`);
        addXP(50);
        
        eventDispatcher.dispatch({
          type: 'knowledge_event',
          payload: { topic: 'aspirin', compound: match.name },
          timestamp: Date.now(),
          source: 'ayurveda_bridge',
          priority: 'high'
        });
      }
    }
  };

  const clearScene = () => {
    if (!sceneRef.current) return;
    
    atomsRef.current.forEach(atom => {
      sceneRef.current?.remove(atom.mesh);
    });
    bondsRef.current.forEach(bond => {
      sceneRef.current?.remove(bond);
    });
    
    atomsRef.current.clear();
    bondsRef.current = [];
    setAtoms([]);
    setAyurvedaMatch(null);
  };

  const analyzeMolecule = () => {
    const atomList = Array.from(atomsRef.current.values());
    if (atomList.length === 0) {
      setFeedback("⚠️ No atoms in the molecule yet. Click on the canvas to add atoms!");
      return;
    }

    const elements = atomList.map(a => a.element);
    const formula = elements.reduce((acc, el) => {
      acc[el] = (acc[el] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const formulaStr = Object.entries(formula)
      .map(([el, count]) => `${el}${count > 1 ? count : ''}`)
      .join('');

    const totalBonds = atomList.reduce((sum, a) => sum + a.bonds.length, 0) / 2;

    setFeedback(`✅ Molecule Analysis:\n• Formula: ${formulaStr}\n• Atoms: ${atomList.length}\n• Bonds: ${totalBonds}\n• Estimated MW: ~${atomList.length * 12} g/mol`);
    
    addXP(25);
    
    eventDispatcher.dispatch({
      type: 'explain_event',
      payload: { topic: 'molecule_complete', formula: formulaStr },
      timestamp: Date.now(),
      source: 'molecule_builder',
      priority: 'medium'
    });
  };

  return (
    <div className="h-full flex flex-col bg-slate-900 rounded-2xl overflow-hidden">
      {/* Toolbar */}
      <div className="p-4 bg-slate-800/50 border-b border-slate-700">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <AtomIcon className="w-5 h-5 text-indigo-400" />
            3D Molecule Builder
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setBondMode(!bondMode)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1 transition-colors",
                bondMode 
                  ? "bg-indigo-500 text-white" 
                  : "bg-slate-700 text-slate-300 hover:bg-slate-600"
              )}
            >
              <Link className="w-4 h-4" />
              {bondMode ? 'Bonding Mode' : 'Add Mode'}
            </button>
            <button
              onClick={analyzeMolecule}
              className="px-3 py-1.5 bg-emerald-500 text-white rounded-lg text-sm font-medium flex items-center gap-1 hover:bg-emerald-600"
            >
              <Play className="w-4 h-4" />
              Analyze
            </button>
            <button
              onClick={clearScene}
              className="px-3 py-1.5 bg-red-500/20 text-red-400 rounded-lg text-sm font-medium flex items-center gap-1 hover:bg-red-500/30"
            >
              <Trash2 className="w-4 h-4" />
              Clear
            </button>
          </div>
        </div>
        
        {/* Element Palette */}
        <div className="flex gap-2 flex-wrap">
          {ELEMENTS.map((el) => (
            <button
              key={el.symbol}
              onClick={() => setSelectedElement(el.symbol)}
              className={cn(
                "w-10 h-10 rounded-lg text-sm font-bold transition-all flex items-center justify-center",
                selectedElement === el.symbol
                  ? "ring-2 ring-indigo-400 ring-offset-2 ring-offset-slate-800"
                  : "hover:scale-110"
              )}
              style={{ backgroundColor: el.color, color: el.symbol === 'H' || el.symbol === 'S' ? '#000' : '#fff' }}
              title={el.name}
            >
              {el.symbol}
            </button>
          ))}
        </div>
      </div>

      {/* 3D Canvas */}
      <div ref={containerRef} className="flex-1 relative">
        {/* Instructions Overlay */}
        {atoms.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <div className="text-center text-slate-400">
              <AtomIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">Click anywhere to add atoms</p>
              <p className="text-sm mt-2">Use "Bond Mode" to connect atoms</p>
            </div>
          </motion.div>
        )}

        {/* Atom Count */}
        <div className="absolute top-4 left-4 bg-slate-800/80 backdrop-blur px-3 py-2 rounded-lg text-sm text-white">
          <span className="text-slate-400">Atoms:</span> {atoms.length}
        </div>

        {/* Ayurveda Match Notification */}
        {ayurvedaMatch && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-4 left-4 right-4 bg-gradient-to-r from-emerald-500/90 to-teal-500/90 backdrop-blur p-4 rounded-xl text-white"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center shrink-0">
                🌿
              </div>
              <div>
                <h4 className="font-bold flex items-center gap-2">
                  Ayurveda–Modern Medicine Bridge
                  <CheckCircle className="w-4 h-4" />
                </h4>
                <p className="text-sm mt-1 text-white/90">{ayurvedaMatch}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Feedback Panel */}
        {feedback && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute top-4 right-4 bg-slate-800/90 backdrop-blur p-4 rounded-xl text-white max-w-xs"
          >
            <div className="flex items-start gap-2">
              <Info className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
              <pre className="text-sm whitespace-pre-wrap font-sans">{feedback}</pre>
            </div>
            <button
              onClick={() => setFeedback(null)}
              className="mt-2 text-xs text-slate-400 hover:text-white"
            >
              Dismiss
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
