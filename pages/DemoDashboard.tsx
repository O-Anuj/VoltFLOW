
import React, { useState, useRef } from 'react';
import { 
  LogOut, Shield, HardDrive, 
  Upload, Trash2, Loader2, FolderPlus, FileText, 
  Users, StickyNote, Folder, X,
  ChevronRight, ChevronUp, ChevronDown, DownloadCloud, Image as ImageIcon,
  AlertTriangle, ArrowLeft, Search, Home, Eye, History, AlertCircle, Sparkles, File as FileIcon
} from 'lucide-react';
import UpgradeModal from '../components/UpgradeModal';
import FilePreviewModal from '../components/FilePreviewModal';

// --- Types ---
interface FileItem {
  id: string;
  name: string;
  size: number;
  type: string;
  mimeType: string;
  folderId: string | null;
  downloadURL: string;
  createdAt: { seconds: number };
}

interface FolderItem {
  id: string;
  name: string;
  parentId: string | null;
  createdAt: { seconds: number };
}

interface NoteItem {
  id: string;
  title: string;
  content: string;
  color: string;
  createdAt: { seconds: number };
}

interface MemberItem {
  id: string;
  name: string;
  role: string;
  email: string;
  createdAt: { seconds: number };
}

type TabView = 'overview' | 'files' | 'notes' | 'team';
type SortKey = 'name' | 'size' | 'createdAt';
type SortDirection = 'asc' | 'desc';

interface DemoDashboardProps {
  onNavigate: (path: string) => void;
}

// --- Initial Mock Data ---
const INITIAL_FOLDERS: FolderItem[] = [
  { id: 'f1', name: 'Design Assets', parentId: null, createdAt: { seconds: 1715000000 } },
  { id: 'f2', name: 'Financials Q4', parentId: null, createdAt: { seconds: 1714500000 } },
  { id: 'f3', name: 'Legal Contracts', parentId: null, createdAt: { seconds: 1714000000 } },
  { id: 'f4', name: 'Logos', parentId: 'f1', createdAt: { seconds: 1715005000 } },
];

const INITIAL_FILES: FileItem[] = [
  { id: '1', name: 'Project_Alpha_Specs.pdf', size: 2400000, type: 'pdf', mimeType: 'application/pdf', folderId: null, createdAt: { seconds: 1715200000 }, downloadURL: '#' },
  { id: '2', name: 'Budget_2024.xlsx', size: 1500000, type: 'doc', mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', folderId: 'f2', createdAt: { seconds: 1714600000 }, downloadURL: '#' },
  { id: '3', name: 'VaultFlow_Logo_V2.png', size: 4500000, type: 'image', mimeType: 'image/png', folderId: 'f4', createdAt: { seconds: 1715100000 }, downloadURL: 'https://images.unsplash.com/photo-1614064641938-3e8529437109?auto=format&fit=crop&q=80&w=2000' },
  { id: '4', name: 'NDA_Template.docx', size: 850000, type: 'doc', mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', folderId: 'f3', createdAt: { seconds: 1714100000 }, downloadURL: '#' },
  { id: '5', name: 'Meeting_Notes_May.txt', size: 12000, type: 'doc', mimeType: 'text/plain', folderId: null, createdAt: { seconds: 1715300000 }, downloadURL: '#' },
];

const INITIAL_MEMBERS: MemberItem[] = [
  { id: 'm1', name: 'Sarah Jenkins', role: 'Admin', email: 'sarah@vaultflow.team', createdAt: { seconds: 1710000000 } },
  { id: 'm2', name: 'Mike Ross', role: 'Editor', email: 'mike@vaultflow.team', createdAt: { seconds: 1711000000 } },
  { id: 'm3', name: 'Jessica Pearson', role: 'Viewer', email: 'jessica@vaultflow.team', createdAt: { seconds: 1712000000 } },
];

const DemoDashboard: React.FC<DemoDashboardProps> = ({ onNavigate }) => {
  // Mock User
  const user = { displayName: 'Demo User', email: 'demo@vaultflow.team', uid: 'demo-123' };
  
  // Data State (In-Memory Persistence)
  const [folders, setFolders] = useState<FolderItem[]>(INITIAL_FOLDERS);
  const [files, setFiles] = useState<FileItem[]>(INITIAL_FILES);
  const [members, setMembers] = useState<MemberItem[]>(INITIAL_MEMBERS);
  const [notes, setNotes] = useState<NoteItem[]>([]);

  // Navigation State
  const [activeTab, setActiveTab] = useState<TabView>('overview');
  const [currentFolder, setCurrentFolder] = useState<FolderItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Sort State
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection }>({ 
    key: 'createdAt', 
    direction: 'desc' 
  });
  
  // UI State
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState<FileItem | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Renaming State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  
  // Modal & Action States
  const [modalOpen, setModalOpen] = useState<{ type: 'folder' | 'file' | 'note' | 'member' | null }>({ type: null });
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; itemId: string | null; collectionName: string; itemName: string }>({ 
    isOpen: false, itemId: null, collectionName: 'files', itemName: '' 
  });
  
  // Form Inputs
  const [newItemName, setNewItemName] = useState('');
  const [newItemContent, setNewItemContent] = useState('');
  const [newItemRole, setNewItemRole] = useState('Viewer');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // --- Handlers ---

  const handleSort = (key: SortKey) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  // Drag & Drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      setNewItemName(file.name);
      setUploadProgress(0);
      setModalOpen({ type: 'file' });
    }
  };

  // File Preview
  const handleFileClick = (file: FileItem) => {
    if (file.type === 'image' || file.type === 'pdf') {
      setPreviewFile(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      if (!newItemName) setNewItemName(file.name);
    }
  };

  // --- Renaming Logic ---

  const startRenaming = (e: React.MouseEvent, item: FolderItem | FileItem) => {
    e.stopPropagation(); // Prevent navigation/preview
    setEditingId(item.id);
    setEditingName(item.name);
  };

  const saveRename = (collectionName: 'folders' | 'files') => {
    if (!editingId || !editingName.trim()) {
      setEditingId(null);
      return;
    }

    if (collectionName === 'folders') {
        setFolders(prev => prev.map(f => f.id === editingId ? { ...f, name: editingName.trim() } : f));
    } else {
        setFiles(prev => prev.map(f => f.id === editingId ? { ...f, name: editingName.trim() } : f));
    }
    
    setEditingId(null);
  };

  const handleRenameKeyDown = (e: React.KeyboardEvent, collectionName: 'folders' | 'files') => {
    if (e.key === 'Enter') {
      saveRename(collectionName);
    } else if (e.key === 'Escape') {
      setEditingId(null);
    }
  };

  // --- CRUD Operations (Local Memory) ---

  const openModal = (type: 'folder' | 'file' | 'note' | 'member') => {
    setNewItemName('');
    setNewItemContent('');
    setNewItemRole('Viewer');
    setSelectedFile(null);
    setUploadProgress(0);
    setModalOpen({ type });
  };

  const closeModal = () => {
    setModalOpen({ type: null });
    setIsSubmitting(false);
  };

  const handleCreate = async () => {
    setIsSubmitting(true);

    // Simulate Network Latency
    if (modalOpen.type === 'file') {
        // Simulate progress bar
        for (let i = 0; i <= 100; i += 20) {
            setUploadProgress(i);
            await new Promise(r => setTimeout(r, 100));
        }
    } else {
        await new Promise(r => setTimeout(r, 500));
    }

    const timestamp = { seconds: Date.now() / 1000 };
    const id = Date.now().toString();

    if (modalOpen.type === 'folder') {
        const newFolder: FolderItem = {
            id,
            name: newItemName || 'Untitled Folder',
            parentId: currentFolder?.id || null,
            createdAt: timestamp
        };
        setFolders([newFolder, ...folders]);
    } else if (modalOpen.type === 'file' && selectedFile) {
        // Create Object URL for preview purposes in Demo Mode
        const mockUrl = URL.createObjectURL(selectedFile);
        const type = selectedFile.type.startsWith('image/') ? 'image' : selectedFile.type === 'application/pdf' ? 'pdf' : 'doc';
        
        const newFile: FileItem = {
            id,
            name: newItemName || selectedFile.name,
            size: selectedFile.size,
            type,
            mimeType: selectedFile.type,
            folderId: currentFolder?.id || null,
            downloadURL: mockUrl,
            createdAt: timestamp
        };
        setFiles([newFile, ...files]);
    } else if (modalOpen.type === 'note') {
        const colors = ['bg-yellow-50', 'bg-purple-50', 'bg-blue-50', 'bg-red-50', 'bg-emerald-50'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        const newNote: NoteItem = {
            id,
            title: newItemName || 'Untitled Note',
            content: newItemContent,
            color: randomColor,
            createdAt: timestamp
        };
        setNotes([newNote, ...notes]);
    } else if (modalOpen.type === 'member') {
        const newMember: MemberItem = {
            id,
            name: newItemName,
            role: newItemRole,
            email: newItemName.toLowerCase().replace(/\s/g, '') + '@vaultflow.team',
            createdAt: timestamp
        };
        setMembers([newMember, ...members]);
    }

    closeModal();
  };

  const openDeleteModal = (collectionName: string, item: any) => {
    setDeleteModal({
        isOpen: true,
        itemId: item.id,
        collectionName,
        itemName: item.name || item.title || 'Untitled'
    });
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    await new Promise(r => setTimeout(r, 500)); // Simulate delay

    if (deleteModal.collectionName === 'folders') {
        setFolders(folders.filter(f => f.id !== deleteModal.itemId));
        // Recursive delete not implemented for demo simplicity, but could be added
    } else if (deleteModal.collectionName === 'files') {
        setFiles(files.filter(f => f.id !== deleteModal.itemId));
    } else if (deleteModal.collectionName === 'notes') {
        setNotes(notes.filter(n => n.id !== deleteModal.itemId));
    } else if (deleteModal.collectionName === 'members') {
        setMembers(members.filter(m => m.id !== deleteModal.itemId));
    }

    setIsDeleting(false);
    setDeleteModal(prev => ({ ...prev, isOpen: false }));
  };

  // --- Helpers ---

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (timestamp: { seconds: number }) => {
    return new Date(timestamp.seconds * 1000).toLocaleDateString(undefined, {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  const getBreadcrumbs = () => {
    if (!currentFolder) return [];
    const path: FolderItem[] = [currentFolder];
    let curr = currentFolder;
    let depth = 0;
    while (curr.parentId && depth < 20) {
      const parent = folders.find(f => f.id === curr.parentId);
      if (parent) { path.unshift(parent); curr = parent; } 
      else { break; }
      depth++;
    }
    return path;
  };

  const getInitials = (name?: string | null) => {
    const n = name || user?.email || 'U';
    return n.substring(0, 2).toUpperCase();
  };

  // --- Render Sections ---

  const renderOverview = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center mb-4">
            <Shield size={20} />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">Vault Status</h3>
          <p className="text-sm text-slate-500 mb-4">Your environment is secure and encrypted.</p>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded w-fit">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Active Protection
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center mb-4">
            <HardDrive size={20} />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">Storage</h3>
          <p className="text-sm text-slate-500 mb-4">{files.length} files stored locally.</p>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mb-2">
            <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: `${Math.min(files.length * 5, 100)}%` }} />
          </div>
          <span className="text-xs text-slate-400">Demo Limit: 100MB</span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-4">
             <Users size={20} />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">Team Access</h3>
          <p className="text-sm text-slate-500 mb-4">{members.length} active members.</p>
          <button onClick={() => setActiveTab('team')} className="text-sm font-semibold text-blue-600 hover:text-blue-700">
            View Team
          </button>
        </div>
      </div>

      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16" />
        <div className="relative z-10">
           <div className="flex items-center gap-2 mb-2">
             <Sparkles size={16} className="text-emerald-400" />
             <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider">Interactive Demo</span>
           </div>
           <h3 className="text-xl font-bold mb-2">Welcome to VaultFlow 2.0</h3>
           <p className="text-slate-400 max-w-lg mb-6">
             Feel free to add files, create folders, and manage team members. 
             <br /><strong>Note:</strong> Data is stored in your browser's memory and will reset on refresh.
           </p>
           <button 
             onClick={() => setActiveTab('files')}
             className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold transition-colors flex items-center gap-2"
           >
             Start Exploring
             <ChevronRight size={16} />
           </button>
        </div>
      </div>
    </div>
  );

  const renderFiles = () => {
    const isSearching = searchQuery.length > 0;
    let displayFiles = files;
    let displayFolders = folders;

    if (isSearching) {
      const lowerQuery = searchQuery.toLowerCase();
      displayFiles = files.filter(f => f.name.toLowerCase().includes(lowerQuery));
      displayFolders = folders.filter(f => f.name.toLowerCase().includes(lowerQuery));
    } else {
      displayFiles = files.filter(f => currentFolder ? f.folderId === currentFolder.id : !f.folderId);
      displayFolders = folders.filter(f => currentFolder ? f.parentId === currentFolder.id : !f.parentId);
    }

    // Sort Logic
    const sortedFiles = [...displayFiles].sort((a, b) => {
        let aVal: any = a[sortConfig.key];
        let bVal: any = b[sortConfig.key];
        if (sortConfig.key === 'createdAt') { aVal = a.createdAt.seconds; bVal = b.createdAt.seconds; }
        if (typeof aVal === 'string') { aVal = aVal.toLowerCase(); bVal = bVal.toLowerCase(); }
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
    });

    const sortedFolders = [...displayFolders].sort((a, b) => {
        return sortConfig.direction === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
    });

    const breadcrumbs = getBreadcrumbs();
    const SortIcon = ({ column }: { column: SortKey }) => sortConfig.key === column ? (sortConfig.direction === 'asc' ? <ChevronUp size={14} className="ml-1" /> : <ChevronDown size={14} className="ml-1" />) : null;

    return (
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
        {/* Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
           <div className="flex items-center gap-1 text-sm text-slate-500 min-w-fit overflow-x-auto pb-1 md:pb-0 scrollbar-hide">
              {currentFolder && (
                  <button onClick={() => setCurrentFolder(folders.find(f => f.id === currentFolder.parentId) || null)} className="mr-2 p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
                    <ArrowLeft size={16} />
                  </button>
              )}
              <button onClick={() => { setCurrentFolder(null); setSearchQuery(''); }} className={`flex items-center hover:text-emerald-600 transition-colors ${!currentFolder && !isSearching ? 'font-bold text-slate-800' : ''}`}>
                {!currentFolder && !isSearching && <Home size={16} className="mr-1.5" />}
                My Files
              </button>
              {!isSearching && breadcrumbs.map((folder, index) => (
                <React.Fragment key={folder.id}>
                  <ChevronRight size={14} className="text-slate-400 flex-shrink-0 mx-0.5" />
                  <button onClick={() => { setCurrentFolder(folder); setSearchQuery(''); }} className={`hover:text-emerald-600 transition-colors whitespace-nowrap ${index === breadcrumbs.length - 1 ? 'font-bold text-slate-800' : ''}`}>
                    {folder.name}
                  </button>
                </React.Fragment>
              ))}
           </div>
           
           <div className="relative flex-1 max-w-md w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input type="text" placeholder="Search files..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-9 pr-10 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all placeholder:text-slate-400" />
                {searchQuery && <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"><X size={14} /></button>}
              </div>
           </div>
           
           <div className="flex gap-3 min-w-fit">
              <button onClick={() => openModal('folder')} className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 flex items-center gap-2">
                  <FolderPlus size={16} /> <span className="hidden sm:inline">New Folder</span>
              </button>
              <button onClick={() => openModal('file')} className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-500 flex items-center gap-2 shadow-sm whitespace-nowrap">
                  <Upload size={16} /> <span className="hidden sm:inline">Add File</span>
              </button>
           </div>
        </div>

        {/* Content Zone */}
        <div 
          className={`bg-white border transition-all duration-300 rounded-2xl overflow-hidden min-h-[400px] relative ${isDragging ? 'border-emerald-500 bg-emerald-50/20 shadow-xl' : 'border-slate-200 shadow-sm'}`}
          onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
        >
           {isDragging && (
              <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/60 backdrop-blur-sm pointer-events-none">
                  <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-6 animate-bounce"><Upload className="w-10 h-10 text-emerald-600" /></div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Drop to Upload</h3>
                  <p className="text-slate-600 font-medium">Add to demo environment.</p>
              </div>
           )}

           <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-slate-100 bg-slate-50/50 text-xs font-semibold text-slate-500 uppercase tracking-wider select-none">
              <div className="col-span-5 flex items-center cursor-pointer hover:text-emerald-600" onClick={() => handleSort('name')}>Name <SortIcon column="name" /></div>
              <div className="col-span-3 flex items-center cursor-pointer hover:text-emerald-600" onClick={() => handleSort('createdAt')}>Date Modified <SortIcon column="createdAt" /></div>
              <div className="col-span-2 flex items-center cursor-pointer hover:text-emerald-600" onClick={() => handleSort('size')}>Size <SortIcon column="size" /></div>
              <div className="col-span-2 text-right">Action</div>
           </div>

           {sortedFolders.map(folder => (
              <div key={folder.id} onClick={() => { setCurrentFolder(folder); setSearchQuery(''); }} className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer group items-center">
                 <div className="col-span-5 flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center"><Folder size={16} fill="currentColor" className="opacity-20" /></div>
                    {editingId === folder.id ? (
                      <input
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        onKeyDown={(e) => handleRenameKeyDown(e, 'folders')}
                        onClick={(e) => e.stopPropagation()}
                        onBlur={() => saveRename('folders')}
                        autoFocus
                        className="bg-white border border-emerald-500 rounded px-2 py-0.5 text-sm text-slate-900 focus:outline-none w-full shadow-sm"
                      />
                    ) : (
                      <span 
                        onClick={(e) => startRenaming(e, folder)}
                        className="text-sm font-medium text-slate-700 group-hover:text-blue-700 transition-colors hover:underline cursor-text truncate pr-4"
                        title="Click to rename"
                      >
                        {folder.name}
                      </span>
                    )}
                 </div>
                 <div className="col-span-3 text-xs text-slate-400">{formatDate(folder.createdAt)}</div>
                 <div className="col-span-2 text-xs text-slate-400">-</div>
                 <div className="col-span-2 flex justify-end">
                    <button onClick={(e) => { e.stopPropagation(); openDeleteModal('folders', folder); }} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"><Trash2 size={14} /></button>
                 </div>
              </div>
           ))}

           {sortedFiles.map(file => (
              <div key={file.id} onClick={() => handleFileClick(file)} className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-slate-50 hover:bg-slate-50 transition-colors group items-center cursor-pointer">
                 <div className="col-span-5 flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${file.type === 'image' ? 'bg-purple-50 text-purple-600' : file.type === 'pdf' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                       {file.type === 'image' ? <ImageIcon size={16} /> : <FileText size={16} />}
                    </div>
                    {editingId === file.id ? (
                      <input
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        onKeyDown={(e) => handleRenameKeyDown(e, 'files')}
                        onClick={(e) => e.stopPropagation()}
                        onBlur={() => saveRename('files')}
                        autoFocus
                        className="bg-white border border-emerald-500 rounded px-2 py-0.5 text-sm text-slate-900 focus:outline-none w-full shadow-sm"
                      />
                    ) : (
                      <span 
                        onClick={(e) => startRenaming(e, file)}
                        className="text-sm font-medium text-slate-700 truncate pr-4 hover:underline cursor-text" 
                        title="Click to rename"
                      >
                        {file.name}
                      </span>
                    )}
                 </div>
                 <div className="col-span-3 text-xs text-slate-500">{formatDate(file.createdAt)}</div>
                 <div className="col-span-2 text-xs text-slate-500">{formatFileSize(file.size)}</div>
                 <div className="col-span-2 flex justify-end gap-1">
                    <button onClick={(e) => { e.stopPropagation(); handleFileClick(file); }} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"><Eye size={14} /></button>
                    <button onClick={(e) => { e.stopPropagation(); window.open(file.downloadURL, '_blank'); }} className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"><DownloadCloud size={14} /></button>
                    <button onClick={(e) => { e.stopPropagation(); openDeleteModal('files', file); }} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"><Trash2 size={14} /></button>
                 </div>
              </div>
           ))}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 pt-44 min-h-screen">
      
      {/* Demo Mode Indicator */}
      <div className="fixed top-32 left-1/2 -translate-x-1/2 z-40 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-4 py-1.5 rounded-full shadow-md animate-in slide-in-from-top-4 border border-white/10 flex items-center gap-2">
        <Sparkles size={10} className="text-emerald-400" />
        DEMO MODE — DATA IS NOT SAVED PERMANENTLY
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
         <div>
            <div className="flex items-center gap-2 mb-1">
                <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
            </div>
            <p className="text-slate-500">Manage your files and team members.</p>
         </div>
         <div className="flex items-center gap-3">
             <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-full shadow-sm">
                <div className="w-6 h-6 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-bold text-xs">{getInitials(user.displayName)}</div>
                <span className="text-sm font-medium text-slate-700">{user.displayName}</span>
             </div>
             <div className="relative" ref={dropdownRef}>
                <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="p-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"><ChevronDown size={20} /></button>
                {isDropdownOpen && (
                   <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl z-50 animate-in fade-in zoom-in-95 overflow-hidden">
                      <button onClick={() => { setIsDropdownOpen(false); setIsUpgradeModalOpen(true); }} className="w-full text-left px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-emerald-600 font-medium">Upgrade Plan</button>
                      <div className="border-t border-slate-100 my-1" />
                      <button onClick={() => onNavigate('/')} className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 font-medium flex items-center gap-2"><LogOut size={14} /> Exit Demo</button>
                   </div>
                )}
             </div>
         </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-fit mb-8">
         {['overview', 'files', 'notes', 'team'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab as TabView)} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all capitalize ${activeTab === tab ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                {tab}
            </button>
         ))}
      </div>

      {/* Main Content Area */}
      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'files' && renderFiles()}
      
      {activeTab === 'notes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-2">
            <button onClick={() => openModal('note')} className="h-48 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:border-emerald-500 hover:text-emerald-600 hover:bg-emerald-50/50 transition-all group">
                <StickyNote className="w-8 h-8 mb-2 group-hover:scale-110 transition-transform" />
                <span className="font-semibold text-sm">New Note</span>
            </button>
            {notes.map(note => (
                <div key={note.id} className={`h-48 p-6 rounded-2xl ${note.color} border border-transparent hover:border-slate-200 shadow-sm hover:shadow-md transition-all relative group flex flex-col`}>
                    <h3 className="font-bold text-slate-800 mb-2">{note.title}</h3>
                    <p className="text-sm text-slate-600 flex-1 overflow-hidden">{note.content}</p>
                    <button onClick={() => openDeleteModal('notes', note)} className="absolute top-4 right-4 p-1.5 bg-white/50 hover:bg-white rounded-lg text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={14} /></button>
                    <span className="text-xs text-slate-400 mt-2">{formatDate(note.createdAt)}</span>
                </div>
            ))}
        </div>
      )}

      {activeTab === 'team' && (
        <div className="animate-in fade-in slide-in-from-bottom-2">
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-slate-100 bg-slate-50/50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <div className="col-span-5">Member</div>
                    <div className="col-span-4">Email</div>
                    <div className="col-span-3">Role</div>
                </div>
                {members.map(member => (
                    <div key={member.id} className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-slate-50 hover:bg-slate-50 items-center group relative">
                        <div className="col-span-5 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">{getInitials(member.name)}</div>
                            <span className="text-sm font-medium text-slate-900">{member.name}</span>
                        </div>
                        <div className="col-span-4 text-sm text-slate-500">{member.email}</div>
                        <div className="col-span-3 flex justify-between items-center">
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${member.role === 'Admin' ? 'bg-purple-50 text-purple-700' : member.role === 'Editor' ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>{member.role}</span>
                            <button onClick={() => openDeleteModal('members', member)} className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={14} /></button>
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-6 text-center">
                 <button onClick={() => openModal('member')} className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-500">Invite Member</button>
            </div>
        </div>
      )}

      {/* Create Modal */}
      {modalOpen.type && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
             <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={closeModal} />
             <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                   <h3 className="font-bold text-slate-900 capitalize">{modalOpen.type === 'member' ? 'Add Team Member' : `Create New ${modalOpen.type}`}</h3>
                   <button onClick={closeModal} className="p-1 text-slate-400 hover:bg-slate-100 rounded-full"><X size={18} /></button>
                </div>
                <div className="p-6 space-y-4">
                   {modalOpen.type === 'file' ? (
                      <div className="space-y-4">
                         <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center cursor-pointer hover:bg-slate-50 hover:border-emerald-500 transition-colors">
                            <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileSelect} />
                            {selectedFile ? (
                               <div>
                                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2"><FileIcon size={24} /></div>
                                  <p className="font-medium text-slate-900 text-sm truncate max-w-[200px] mx-auto">{selectedFile.name}</p>
                                  <p className="text-xs text-slate-500 mt-1">{formatFileSize(selectedFile.size)}</p>
                               </div>
                            ) : (
                               <div>
                                  <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-2"><Upload size={24} /></div>
                                  <p className="font-medium text-slate-900 text-sm">Click to upload</p>
                                  <p className="text-xs text-slate-500 mt-1">or drag and drop here</p>
                               </div>
                            )}
                         </div>
                         {selectedFile && (
                            <div className="space-y-1">
                               <label className="text-xs font-semibold text-slate-700 ml-1">File Name</label>
                               <input type="text" value={newItemName} onChange={(e) => setNewItemName(e.target.value)} className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:border-emerald-500 focus:ring-2 outline-none" />
                            </div>
                         )}
                         {uploadProgress > 0 && (
                            <div className="space-y-1">
                               <div className="flex justify-between text-xs text-slate-500"><span>Uploading...</span><span>{uploadProgress}%</span></div>
                               <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden"><div className="bg-emerald-500 h-full rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} /></div>
                            </div>
                         )}
                      </div>
                   ) : (
                      <>
                        <div className="space-y-1">
                           <label className="text-xs font-semibold text-slate-700 ml-1">Name</label>
                           <input type="text" value={newItemName} onChange={(e) => setNewItemName(e.target.value)} placeholder={modalOpen.type === 'folder' ? 'New Folder' : ''} className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:border-emerald-500 focus:ring-2 outline-none" autoFocus />
                        </div>
                        {modalOpen.type === 'note' && (
                           <div className="space-y-1">
                              <label className="text-xs font-semibold text-slate-700 ml-1">Content</label>
                              <textarea value={newItemContent} onChange={(e) => setNewItemContent(e.target.value)} className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:border-emerald-500 focus:ring-2 outline-none h-32 resize-none" placeholder="Write your note here..." />
                           </div>
                        )}
                        {modalOpen.type === 'member' && (
                           <div className="space-y-1">
                              <label className="text-xs font-semibold text-slate-700 ml-1">Role</label>
                              <select value={newItemRole} onChange={(e) => setNewItemRole(e.target.value)} className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:border-emerald-500 focus:ring-2 outline-none bg-white">
                                 <option value="Viewer">Viewer</option><option value="Editor">Editor</option><option value="Admin">Admin</option>
                              </select>
                           </div>
                        )}
                      </>
                   )}
                   <div className="pt-2 flex gap-3">
                      <button onClick={closeModal} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50">Cancel</button>
                      <button onClick={handleCreate} disabled={isSubmitting || (modalOpen.type === 'file' && !selectedFile)} className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-500 disabled:opacity-50 flex items-center justify-center gap-2">
                         {isSubmitting ? <Loader2 className="animate-spin w-4 h-4" /> : (modalOpen.type === 'file' ? 'Upload' : 'Create')}
                      </button>
                   </div>
                </div>
             </div>
         </div>
      )}

      {/* Delete Modal */}
      {deleteModal.isOpen && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
             <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => !isDeleting && setDeleteModal(prev => ({...prev, isOpen: false}))} />
             <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95">
                <div className="p-6 text-center">
                   <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600"><Trash2 size={24} /></div>
                   <h3 className="text-lg font-bold text-slate-900 mb-2">Delete Item?</h3>
                   <p className="text-sm text-slate-500 mb-6">Are you sure you want to delete <span className="font-bold text-slate-900">"{deleteModal.itemName}"</span>? This action is simulating a deletion.</p>
                   <div className="flex gap-3">
                      <button onClick={() => setDeleteModal(prev => ({...prev, isOpen: false}))} disabled={isDeleting} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50">Cancel</button>
                      <button onClick={handleConfirmDelete} disabled={isDeleting} className="flex-1 py-2.5 rounded-xl bg-red-600 text-white font-semibold text-sm hover:bg-red-500 flex items-center justify-center gap-2">{isDeleting ? <Loader2 className="animate-spin w-4 h-4" /> : 'Delete'}</button>
                   </div>
                </div>
             </div>
         </div>
      )}

      <UpgradeModal isOpen={isUpgradeModalOpen} onClose={() => setIsUpgradeModalOpen(false)} />
      <FilePreviewModal file={previewFile} onClose={() => setPreviewFile(null)} />
    </div>
  );
};

export default DemoDashboard;
