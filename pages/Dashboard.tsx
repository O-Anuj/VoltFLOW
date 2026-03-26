
import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../lib/AuthContext';
import { db, storage } from '../lib/firebase';
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  deleteDoc, 
  updateDoc,
  doc, 
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytesResumable, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { 
  LogOut, Shield, HardDrive, 
  Upload, Trash2, Loader2, FolderPlus, FileText, 
  Users, StickyNote, Folder, Plus, X,
  ChevronRight, ChevronUp, ChevronDown, Save, LayoutGrid, DownloadCloud, Image as ImageIcon, File as FileIcon,
  AlertTriangle, Sparkles, ArrowLeft, Search, Home, Eye, History
} from 'lucide-react';
import SettingsModal from '../components/SettingsModal';
import UpgradeModal from '../components/UpgradeModal';
import FilePreviewModal from '../components/FilePreviewModal';
import FileVersionModal from '../components/FileVersionModal';

// --- Types ---
interface FileItem {
  id: string;
  name: string;
  size: number; // Stored in bytes
  type: string;
  mimeType: string;
  folderId: string | null;
  storagePath: string;
  downloadURL: string;
  createdAt: Timestamp;
}

interface FolderItem {
  id: string;
  name: string;
  parentId: string | null;
  createdAt: Timestamp;
}

interface NoteItem {
  id: string;
  title: string;
  content: string;
  color: string;
  createdAt: Timestamp;
}

interface MemberItem {
  id: string;
  name: string;
  role: string;
  email: string;
  createdAt: Timestamp;
}

type TabView = 'overview' | 'files' | 'notes' | 'team';
type SortKey = 'name' | 'size' | 'createdAt';
type SortDirection = 'asc' | 'desc';

interface DashboardProps {
  onNavigate: (path: string) => void;
  onOpenAuth: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate, onOpenAuth }) => {
  const { user, signOut } = useAuth();
  
  // Navigation State
  const [activeTab, setActiveTab] = useState<TabView>('overview');
  const [currentFolder, setCurrentFolder] = useState<FolderItem | null>(null); // null = root
  const [searchQuery, setSearchQuery] = useState('');
  
  // Sort State
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection }>({ 
    key: 'createdAt', 
    direction: 'desc' 
  });
  
  // UI State
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Drag & Drop State
  const [isDragging, setIsDragging] = useState(false);
  
  // Data State
  const [files, setFiles] = useState<FileItem[]>([]);
  const [folders, setFolders] = useState<FolderItem[]>([]);
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [members, setMembers] = useState<MemberItem[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Preview & Versioning State
  const [previewFile, setPreviewFile] = useState<FileItem | null>(null);
  const [versioningFile, setVersioningFile] = useState<FileItem | null>(null);

  // Renaming State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  // Create Modal States
  const [modalOpen, setModalOpen] = useState<{
    type: 'folder' | 'file' | 'note' | 'member' | null;
  }>({ type: null });

  // Delete Modal States
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    itemId: string | null;
    collectionName: string;
    storagePath?: string;
    itemName?: string;
  }>({ 
    isOpen: false, 
    itemId: null, 
    collectionName: 'files',
    itemName: '' 
  });
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Form Inputs
  const [newItemName, setNewItemName] = useState('');
  const [newItemContent, setNewItemContent] = useState(''); // For notes
  const [newItemRole, setNewItemRole] = useState('Viewer'); // For members
  
  // File Upload Specific State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // --- Realtime Data Fetching ---
  useEffect(() => {
    if (!user) return;

    const basePath = `users/${user.uid}`;
    
    // 1. Fetch Folders & Files
    const qFolders = query(collection(db, `${basePath}/folders`), orderBy('createdAt', 'desc'));
    const qFiles = query(collection(db, `${basePath}/files`), orderBy('createdAt', 'desc'));
    
    // 2. Fetch Notes
    const qNotes = query(collection(db, `${basePath}/notes`), orderBy('createdAt', 'desc'));
    
    // 3. Fetch Team
    const qMembers = query(collection(db, `${basePath}/teamMembers`), orderBy('createdAt', 'desc'));

    const unsubFolders = onSnapshot(qFolders, (snapshot) => {
      setFolders(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as FolderItem)));
    });

    const unsubFiles = onSnapshot(qFiles, (snapshot) => {
      setFiles(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as FileItem)));
    });

    const unsubNotes = onSnapshot(qNotes, (snapshot) => {
      setNotes(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as NoteItem)));
    });

    const unsubMembers = onSnapshot(qMembers, (snapshot) => {
      setMembers(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as MemberItem)));
      setLoadingData(false);
    });

    return () => {
      unsubFolders();
      unsubFiles();
      unsubNotes();
      unsubMembers();
    };
  }, [user]);

  // --- Actions ---

  const handleSignOut = async () => {
    try {
      await signOut();
      onNavigate('/');
      onOpenAuth();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleSort = (key: SortKey) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  // Drag and Drop Handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    // Only set dragging to false if we actually leave the container, not just entering a child
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      
      // Open the modal with this file pre-selected
      setSelectedFile(file);
      setNewItemName(file.name);
      setUploadProgress(0);
      setErrorMsg(null);
      setModalOpen({ type: 'file' });
    }
  };

  // Open the delete confirmation modal
  const openDeleteModal = (collectionName: string, item: any) => {
    setDeleteModal({
      isOpen: true,
      itemId: item.id,
      collectionName,
      storagePath: item.storagePath, // undefined if not a file
      itemName: item.name || item.title || 'Untitled Item'
    });
    setDeleteError(null);
  };

  const closeDeleteModal = () => {
    if (isDeleting) return; // Prevent closing while deleting
    setDeleteModal(prev => ({ ...prev, isOpen: false }));
    setDeleteError(null);
  };

  const handleConfirmDelete = async () => {
    if (!user || !deleteModal.itemId) return;
    
    setIsDeleting(true);
    setDeleteError(null);

    try {
      // 1. Delete from Storage (if applicable)
      if (deleteModal.collectionName === 'files' && deleteModal.storagePath) {
        try {
          const storageRef = ref(storage, deleteModal.storagePath);
          await deleteObject(storageRef);
        } catch (storageErr: any) {
          console.error("Storage delete error:", storageErr);
          if (storageErr.code === 'storage/object-not-found') {
             setDeleteError("File not found in storage. It may have already been deleted.");
          } else {
             setDeleteError("Failed to delete file from storage. Please check your connection.");
          }
          // Per requirements: Stop if storage delete fails (don't orphan the firestore doc)
          setIsDeleting(false);
          return;
        }
      }

      // 2. Delete from Firestore
      await deleteDoc(doc(db, `users/${user.uid}/${deleteModal.collectionName}`, deleteModal.itemId));

      // Success
      setDeleteModal(prev => ({ ...prev, isOpen: false }));
    } catch (err) {
      console.error("Firestore delete error:", err);
      setDeleteError("Failed to remove item record. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDownload = (url: string) => {
    if (!url) return;
    window.open(url, '_blank');
  };

  const handleFileClick = (file: FileItem) => {
    // Only preview images and PDFs
    if (file.type === 'image' || file.type === 'pdf') {
      setPreviewFile(file);
    } else {
      // For other types, maybe just do nothing or trigger download?
      // Currently defaulting to nothing on row click, user must use action button
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      // Auto-fill name if empty
      if (!newItemName) {
        setNewItemName(file.name);
      }
    }
  };

  // --- Renaming Logic ---

  const startRenaming = (e: React.MouseEvent, item: FolderItem | FileItem) => {
    e.stopPropagation(); // Prevent navigation/preview
    setEditingId(item.id);
    setEditingName(item.name);
  };

  const saveRename = async (collectionName: 'folders' | 'files') => {
    if (!user || !editingId || !editingName.trim()) {
      setEditingId(null);
      return;
    }

    const oldName = collectionName === 'files' 
        ? files.find(f => f.id === editingId)?.name 
        : folders.find(f => f.id === editingId)?.name;

    if (oldName === editingName) {
        setEditingId(null);
        return;
    }

    try {
      await updateDoc(doc(db, `users/${user.uid}/${collectionName}`, editingId), {
        name: editingName.trim()
      });
    } catch (err) {
      console.error("Error renaming:", err);
      alert("Failed to rename item");
    } finally {
      setEditingId(null);
    }
  };

  const handleRenameKeyDown = (e: React.KeyboardEvent, collectionName: 'folders' | 'files') => {
    if (e.key === 'Enter') {
      saveRename(collectionName);
    } else if (e.key === 'Escape') {
      setEditingId(null);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (timestamp: Timestamp) => {
    if (!timestamp) return '-';
    return new Date(timestamp.seconds * 1000).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getFileTypeLabel = (mimeType: string) => {
    if (mimeType.includes('image')) return 'image';
    if (mimeType.includes('pdf')) return 'pdf';
    return 'doc';
  };

  const getBreadcrumbs = () => {
    if (!currentFolder) return [];
    
    const path: FolderItem[] = [currentFolder];
    let curr = currentFolder;
    
    // Safety break to prevent infinite loops if cycle exists
    let depth = 0;
    while (curr.parentId && depth < 20) {
      const parent = folders.find(f => f.id === curr.parentId);
      if (parent) {
        path.unshift(parent);
        curr = parent;
      } else {
        break;
      }
      depth++;
    }
    return path;
  };

  const handleCreate = async () => {
    if (!user) return;
    setIsSubmitting(true);
    setErrorMsg(null);
    const basePath = `users/${user.uid}`;

    try {
      if (modalOpen.type === 'folder') {
        await addDoc(collection(db, `${basePath}/folders`), {
          name: newItemName || 'Untitled Folder',
          parentId: currentFolder?.id || null, // Store parent ID for nested folders
          createdAt: serverTimestamp()
        });
        closeModal();
      } 
      else if (modalOpen.type === 'file') {
        if (!selectedFile) {
          setErrorMsg("Please select a file to upload.");
          setIsSubmitting(false);
          return;
        }

        // 1. Upload to Firebase Storage
        const fileExt = selectedFile.name.split('.').pop();
        const uniqueId = Date.now();
        const storagePath = `user_uploads/${user.uid}/${uniqueId}_${selectedFile.name}`;
        const storageRef = ref(storage, storagePath);
        
        const uploadTask = uploadBytesResumable(storageRef, selectedFile);

        uploadTask.on('state_changed', 
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress(progress);
          }, 
          (error) => {
            console.error("Upload error:", error);
            setErrorMsg("Upload failed. Please try again.");
            setIsSubmitting(false);
          }, 
          async () => {
            // 2. Get Download URL
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

            // 3. Save Metadata to Firestore
            await addDoc(collection(db, `${basePath}/files`), {
              name: newItemName || selectedFile.name,
              type: getFileTypeLabel(selectedFile.type),
              mimeType: selectedFile.type,
              size: selectedFile.size,
              folderId: currentFolder?.id || null,
              storagePath: storagePath,
              downloadURL: downloadURL,
              createdAt: serverTimestamp()
            });

            closeModal();
          }
        );
        // Return early so we don't hit the finally block until the upload listener finishes or errors
        return; 
      } 
      else if (modalOpen.type === 'note') {
        const colors = ['bg-yellow-50', 'bg-purple-50', 'bg-blue-50', 'bg-red-50', 'bg-emerald-50'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        
        await addDoc(collection(db, `${basePath}/notes`), {
          title: newItemName || 'Untitled Note',
          content: newItemContent,
          color: randomColor,
          createdAt: serverTimestamp()
        });
        closeModal();
      } 
      else if (modalOpen.type === 'member') {
        await addDoc(collection(db, `${basePath}/teamMembers`), {
          name: newItemName,
          role: newItemRole,
          email: newItemName.toLowerCase().replace(/\s/g, '') + '@vaultflow.team', // Simulated email
          createdAt: serverTimestamp()
        });
        closeModal();
      }
      
    } catch (err) {
      console.error("Error creating item:", err);
      setErrorMsg("An unexpected error occurred.");
    } finally {
      if (modalOpen.type !== 'file') {
        setIsSubmitting(false);
      }
    }
  };

  const openModal = (type: 'folder' | 'file' | 'note' | 'member') => {
    setNewItemName('');
    setNewItemContent('');
    setNewItemRole('Viewer');
    setSelectedFile(null);
    setUploadProgress(0);
    setErrorMsg(null);
    setModalOpen({ type });
  };

  const closeModal = () => {
    setModalOpen({ type: null });
    setIsSubmitting(false);
  };

  // --- Helpers ---
  
  const getInitials = (name?: string | null) => {
    const n = name || user?.email || 'U';
    return n.substring(0, 2).toUpperCase();
  };

  // --- Render Sections ---

  const renderOverview = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Security Card */}
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

        {/* Storage Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center mb-4">
            <HardDrive size={20} />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">Storage</h3>
          <p className="text-sm text-slate-500 mb-4">{files.length} files stored in your cloud vault.</p>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mb-2">
            <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: `${Math.min(files.length * 2, 100)}%` }} />
          </div>
          <span className="text-xs text-slate-400">Standard Plan</span>
        </div>

        {/* Team Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-4">
             <Users size={20} />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">Team Access</h3>
          <p className="text-sm text-slate-500 mb-4">{members.length} active members in this workspace.</p>
          <button onClick={() => setActiveTab('team')} className="text-sm font-semibold text-blue-600 hover:text-blue-700">
            Manage Team
          </button>
        </div>
      </div>

      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16" />
        <div className="relative z-10">
           <h3 className="text-xl font-bold mb-2">Welcome to VaultFlow 2.0</h3>
           <p className="text-slate-400 max-w-lg mb-6">
             You now have full access to the new file management system, secure notes, and team collaboration tools.
           </p>
           <button 
             onClick={() => setActiveTab('files')}
             className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold transition-colors flex items-center gap-2"
           >
             Start Uploading
             <Upload size={16} />
           </button>
        </div>
      </div>
    </div>
  );

  const renderFiles = () => {
    const isSearching = searchQuery.length > 0;
    
    // Determine which files to show: Search results (global) or Current Folder contents
    let displayFiles = files;
    let displayFolders = folders;

    if (isSearching) {
      const lowerQuery = searchQuery.toLowerCase();
      // Search all files and folders
      displayFiles = files.filter(f => f.name.toLowerCase().includes(lowerQuery));
      displayFolders = folders.filter(f => f.name.toLowerCase().includes(lowerQuery));
    } else {
      // Standard navigation
      displayFiles = files.filter(f => 
        currentFolder ? f.folderId === currentFolder.id : !f.folderId
      );
      // Show folders that are children of current folder (or root)
      displayFolders = folders.filter(f => 
        currentFolder ? f.parentId === currentFolder.id : !f.parentId
      );
    }

    // Sort Helper Function
    const sortData = (data: any[], type: 'file' | 'folder') => {
      return [...data].sort((a, b) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];
        
        // Handle undefined (folders don't have size)
        if (aVal === undefined && type === 'folder') return 1; 
        if (bVal === undefined && type === 'folder') return -1;
        
        // If sorting folders by size, sort by name instead
        if (sortConfig.key === 'size' && type === 'folder') {
           aVal = a.name;
           bVal = b.name;
        }

        if (sortConfig.key === 'createdAt') {
            aVal = a.createdAt?.seconds || 0;
            bVal = b.createdAt?.seconds || 0;
        }
        
        // Handle string (case insensitive)
        if (typeof aVal === 'string') {
            aVal = aVal.toLowerCase();
            bVal = bVal.toLowerCase();
        }

        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    };

    const sortedFiles = sortData(displayFiles, 'file');
    const sortedFolders = sortData(displayFolders, 'folder');
    const breadcrumbs = getBreadcrumbs();

    const showFoldersSection = sortedFolders.length > 0;
    
    // Check if view is empty
    const isViewEmpty = !showFoldersSection && sortedFiles.length === 0;

    const SortIcon = ({ column }: { column: SortKey }) => {
      if (sortConfig.key !== column) return null;
      return sortConfig.direction === 'asc' ? <ChevronUp size={14} className="ml-1" /> : <ChevronDown size={14} className="ml-1" />;
    };

    return (
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
        {/* Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
           {/* Left: Breadcrumbs */}
           <div className="flex items-center gap-1 text-sm text-slate-500 min-w-fit overflow-x-auto pb-1 md:pb-0 scrollbar-hide">
              {currentFolder && (
                  <button 
                    onClick={() => {
                        if (currentFolder.parentId) {
                            const parent = folders.find(f => f.id === currentFolder.parentId);
                            setCurrentFolder(parent || null);
                        } else {
                            setCurrentFolder(null);
                        }
                    }}
                    className="mr-2 p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Go Up"
                  >
                    <ArrowLeft size={16} />
                  </button>
              )}
              
              <button 
                onClick={() => { setCurrentFolder(null); setSearchQuery(''); }}
                className={`flex items-center hover:text-emerald-600 transition-colors ${!currentFolder && !isSearching ? 'font-bold text-slate-800' : ''}`}
              >
                {!currentFolder && !isSearching && <Home size={16} className="mr-1.5" />}
                My Files
              </button>
              
              {!isSearching && breadcrumbs.map((folder, index) => (
                <React.Fragment key={folder.id}>
                  <ChevronRight size={14} className="text-slate-400 flex-shrink-0 mx-0.5" />
                  <button
                    onClick={() => { setCurrentFolder(folder); setSearchQuery(''); }}
                     className={`hover:text-emerald-600 transition-colors whitespace-nowrap ${index === breadcrumbs.length - 1 ? 'font-bold text-slate-800' : ''}`}
                  >
                    {folder.name}
                  </button>
                </React.Fragment>
              ))}

              {isSearching && (
                <>
                  <ChevronRight size={14} className="text-slate-400 flex-shrink-0 mx-0.5" />
                  <span className="font-bold text-slate-800 whitespace-nowrap">Search Results</span>
                </>
              )}
           </div>
           
           {/* Middle: Search Bar */}
           <div className="relative flex-1 max-w-md w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input 
                  type="text" 
                  placeholder="Search files..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-10 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all placeholder:text-slate-400"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
           </div>
           
           {/* Right: Actions */}
           <div className="flex gap-3 min-w-fit">
              {!isSearching && (
                <button 
                    onClick={() => openModal('folder')}
                    className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 flex items-center gap-2"
                >
                    <FolderPlus size={16} />
                    <span className="hidden sm:inline">New Folder</span>
                </button>
              )}
              
              {/* Limit Check */}
              {files.length >= 5 ? (
                 <div className="flex items-center gap-3">
                    <span className="hidden sm:inline text-xs md:text-sm font-semibold text-slate-500">Free limit reached.</span>
                    <button 
                        onClick={() => setIsUpgradeModalOpen(true)}
                        className="px-3 py-2 bg-emerald-600 text-white rounded-xl text-xs md:text-sm font-bold hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-200"
                    >
                        Upgrade
                    </button>
                 </div>
              ) : (
                <button 
                    onClick={() => {
                        // Keep current folder context even if searching to allow upload
                        openModal('file');
                    }}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-500 flex items-center gap-2 shadow-sm whitespace-nowrap"
                >
                    <Upload size={16} />
                    <span className="hidden sm:inline">Add File</span>
                    <span className="sm:hidden">Add</span>
                </button>
              )}
           </div>
        </div>

        {/* Content (Drag & Drop Zone) */}
        <div 
          className={`bg-white border transition-all duration-300 rounded-2xl overflow-hidden min-h-[400px] relative ${
            isDragging ? 'border-emerald-500 bg-emerald-50/20 shadow-xl' : 'border-slate-200 shadow-sm'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
           {/* Drag & Drop Overlay */}
           {isDragging && (
              <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/60 backdrop-blur-sm pointer-events-none">
                  <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
                      <Upload className="w-10 h-10 text-emerald-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Drop to Upload</h3>
                  <p className="text-slate-600 font-medium">Release your files here instantly.</p>
              </div>
           )}

           {/* Header Row */}
           <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-slate-100 bg-slate-50/50 text-xs font-semibold text-slate-500 uppercase tracking-wider select-none">
              <div 
                className="col-span-5 flex items-center cursor-pointer hover:text-emerald-600 transition-colors" 
                onClick={() => handleSort('name')}
              >
                Name <SortIcon column="name" />
              </div>
              <div 
                className="col-span-3 flex items-center cursor-pointer hover:text-emerald-600 transition-colors" 
                onClick={() => handleSort('createdAt')}
              >
                Date Modified <SortIcon column="createdAt" />
              </div>
              <div 
                className="col-span-2 flex items-center cursor-pointer hover:text-emerald-600 transition-colors" 
                onClick={() => handleSort('size')}
              >
                Size <SortIcon column="size" />
              </div>
              <div className="col-span-2 text-right">Action</div>
           </div>

           {/* Empty State */}
           {isViewEmpty && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                 <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                    {isSearching 
                        ? <Search className="w-8 h-8 text-slate-300" />
                        : <FolderPlus className="w-8 h-8 text-slate-300" />
                    }
                 </div>
                 <h3 className="text-slate-900 font-medium">
                    {isSearching 
                        ? 'No results found' 
                        : (currentFolder ? 'This folder is empty' : 'No files yet')
                    }
                 </h3>
                 <p className="text-slate-500 text-sm mt-1">
                    {isSearching 
                        ? `No files matching "${searchQuery}"` 
                        : (currentFolder ? 'Upload a file or drag and drop here.' : 'Create a folder or drag and drop a file to get started.')
                    }
                 </p>
                 {!isSearching && (
                    <div className="flex gap-3 mt-4">
                        <button 
                            onClick={() => openModal('folder')}
                            className="px-4 py-2 text-slate-600 border border-slate-200 rounded-lg text-sm font-semibold hover:bg-slate-50"
                        >
                            New Folder
                        </button>
                        <button 
                            onClick={() => openModal('file')}
                            className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-500"
                        >
                            Upload File
                        </button>
                    </div>
                 )}
              </div>
           )}

           {/* Folders List */}
           {showFoldersSection && sortedFolders.map(folder => (
              <div 
                key={folder.id} 
                onClick={() => {
                    setCurrentFolder(folder);
                    setSearchQuery(''); // Clear search when entering a folder
                }}
                className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer group items-center"
              >
                 <div className="col-span-5 flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                       <Folder size={16} fill="currentColor" className="opacity-20" />
                    </div>
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
                    <button 
                      onClick={(e) => { e.stopPropagation(); openDeleteModal('folders', folder); }}
                      className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                    >
                       <Trash2 size={14} />
                    </button>
                 </div>
              </div>
           ))}

           {/* Files List */}
           {sortedFiles.map(file => {
             const isPreviewable = file.type === 'image' || file.type === 'pdf';
             return (
              <div 
                key={file.id} 
                onClick={() => handleFileClick(file)}
                className={`grid grid-cols-12 gap-4 px-6 py-4 border-b border-slate-50 hover:bg-slate-50 transition-colors group items-center ${isPreviewable ? 'cursor-pointer' : ''}`}
              >
                 <div className="col-span-5 flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      file.type === 'image' ? 'bg-purple-50 text-purple-600' :
                      file.type === 'pdf' ? 'bg-red-50 text-red-600' : 
                      'bg-emerald-50 text-emerald-600'
                    }`}>
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
                    <button 
                       onClick={(e) => { e.stopPropagation(); setVersioningFile(file); }}
                       className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                       title="Version History"
                    >
                       <History size={14} />
                    </button>
                    {isPreviewable && (
                        <button 
                           onClick={(e) => { e.stopPropagation(); setPreviewFile(file); }}
                           className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                           title="Preview"
                        >
                           <Eye size={14} />
                        </button>
                    )}
                    <button 
                       onClick={(e) => { e.stopPropagation(); handleDownload(file.downloadURL); }}
                       className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                       title="Download"
                    >
                       <DownloadCloud size={14} />
                    </button>
                    <button 
                       onClick={(e) => { e.stopPropagation(); openDeleteModal('files', file); }}
                       className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                       title="Delete"
                    >
                       <Trash2 size={14} />
                    </button>
                 </div>
              </div>
             );
           })}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 pt-28 min-h-screen">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
         <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Dashboard</h1>
            <p className="text-slate-500">Manage your files and team members.</p>
         </div>
         <div className="flex items-center gap-3">
             <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-full shadow-sm">
                <div className="w-6 h-6 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-bold text-xs">
                    {getInitials(user?.displayName)}
                </div>
                <span className="text-sm font-medium text-slate-700">{user?.displayName || 'User'}</span>
             </div>
             
             {/* Settings Dropdown Trigger */}
             <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="p-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <ChevronDown size={20} />
                </button>
                
                {isDropdownOpen && (
                   <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl z-50 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
                      <button 
                        onClick={() => { setIsDropdownOpen(false); setIsSettingsOpen(true); }}
                        className="w-full text-left px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-emerald-600 font-medium transition-colors"
                      >
                         Settings
                      </button>
                      <button 
                        onClick={() => { setIsDropdownOpen(false); setIsUpgradeModalOpen(true); }}
                        className="w-full text-left px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-emerald-600 font-medium transition-colors"
                      >
                         Upgrade Plan
                      </button>
                      <div className="border-t border-slate-100 my-1" />
                      <button 
                        onClick={handleSignOut}
                        className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 font-medium transition-colors flex items-center gap-2"
                      >
                         <LogOut size={14} />
                         Sign Out
                      </button>
                   </div>
                )}
             </div>
         </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-fit mb-8">
         <button 
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'overview' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
         >
            Overview
         </button>
         <button 
            onClick={() => setActiveTab('files')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'files' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
         >
            My Files
         </button>
         <button 
            onClick={() => setActiveTab('notes')} // Assuming this tab exists based on types
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'notes' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
         >
            Notes
         </button>
         <button 
            onClick={() => setActiveTab('team')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'team' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
         >
            Team
         </button>
      </div>

      {/* Main Content Area */}
      {loadingData ? (
         <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
         </div>
      ) : (
         <>
           {activeTab === 'overview' && renderOverview()}
           {activeTab === 'files' && renderFiles()}
           {activeTab === 'notes' && (
              <div className="text-center py-20 bg-white border border-slate-200 rounded-2xl border-dashed">
                 <StickyNote className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                 <h3 className="text-slate-900 font-medium">Notes</h3>
                 <p className="text-slate-500 text-sm">Notes feature is coming soon.</p>
                 <button onClick={() => openModal('note')} className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold">New Note</button>
              </div>
           )}
           {activeTab === 'team' && (
               <div className="text-center py-20 bg-white border border-slate-200 rounded-2xl border-dashed">
                 <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                 <h3 className="text-slate-900 font-medium">Team Management</h3>
                 <p className="text-slate-500 text-sm">Team feature is coming soon.</p>
                  <button onClick={() => openModal('member')} className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold">Add Member</button>
              </div>
           )}
         </>
      )}

      {/* Modals */}
      {/* Create Modal */}
      {modalOpen.type && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
             <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={closeModal} />
             <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                   <h3 className="font-bold text-slate-900 capitalize">
                      {modalOpen.type === 'member' ? 'Add Team Member' : `Create New ${modalOpen.type}`}
                   </h3>
                   <button onClick={closeModal} className="p-1 text-slate-400 hover:bg-slate-100 rounded-full">
                      <X size={18} />
                   </button>
                </div>
                <div className="p-6 space-y-4">
                   {errorMsg && (
                      <div className="p-3 bg-red-50 text-red-600 text-xs rounded-lg">{errorMsg}</div>
                   )}
                   
                   {modalOpen.type === 'file' ? (
                      <div className="space-y-4">
                         <div 
                           onClick={() => fileInputRef.current?.click()}
                           className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center cursor-pointer hover:bg-slate-50 hover:border-emerald-500 transition-colors"
                         >
                            <input 
                               type="file" 
                               className="hidden" 
                               ref={fileInputRef}
                               onChange={handleFileSelect}
                            />
                            {selectedFile ? (
                               <div>
                                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2">
                                     <FileIcon size={24} />
                                  </div>
                                  <p className="font-medium text-slate-900 text-sm truncate max-w-[200px] mx-auto">{selectedFile.name}</p>
                                  <p className="text-xs text-slate-500 mt-1">{formatFileSize(selectedFile.size)}</p>
                               </div>
                            ) : (
                               <div>
                                  <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-2">
                                     <Upload size={24} />
                                  </div>
                                  <p className="font-medium text-slate-900 text-sm">Click to upload</p>
                                  <p className="text-xs text-slate-500 mt-1">or drag and drop here</p>
                               </div>
                            )}
                         </div>

                         {selectedFile && (
                            <div className="space-y-1">
                               <label className="text-xs font-semibold text-slate-700 ml-1">File Name</label>
                               <input 
                                 type="text" 
                                 value={newItemName}
                                 onChange={(e) => setNewItemName(e.target.value)}
                                 className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 outline-none"
                               />
                            </div>
                         )}

                         {uploadProgress > 0 && (
                            <div className="space-y-1">
                               <div className="flex justify-between text-xs text-slate-500">
                                  <span>Uploading...</span>
                                  <span>{Math.round(uploadProgress)}%</span>
                               </div>
                               <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                  <div 
                                    className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                                    style={{ width: `${uploadProgress}%` }}
                                  />
                               </div>
                            </div>
                         )}
                      </div>
                   ) : (
                      <>
                        <div className="space-y-1">
                           <label className="text-xs font-semibold text-slate-700 ml-1">
                              {modalOpen.type === 'member' ? 'Name' : 'Name'}
                           </label>
                           <input 
                             type="text" 
                             value={newItemName}
                             onChange={(e) => setNewItemName(e.target.value)}
                             placeholder={modalOpen.type === 'folder' ? 'New Folder' : ''}
                             className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 outline-none"
                             autoFocus
                           />
                        </div>
                        {modalOpen.type === 'note' && (
                           <div className="space-y-1">
                              <label className="text-xs font-semibold text-slate-700 ml-1">Content</label>
                              <textarea 
                                value={newItemContent}
                                onChange={(e) => setNewItemContent(e.target.value)}
                                className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 outline-none h-32 resize-none"
                                placeholder="Write your note here..."
                              />
                           </div>
                        )}
                        {modalOpen.type === 'member' && (
                           <div className="space-y-1">
                              <label className="text-xs font-semibold text-slate-700 ml-1">Role</label>
                              <select
                                value={newItemRole}
                                onChange={(e) => setNewItemRole(e.target.value)}
                                className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 outline-none bg-white"
                              >
                                 <option value="Viewer">Viewer</option>
                                 <option value="Editor">Editor</option>
                                 <option value="Admin">Admin</option>
                              </select>
                           </div>
                        )}
                      </>
                   )}

                   <div className="pt-2 flex gap-3">
                      <button 
                        onClick={closeModal}
                        className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50"
                      >
                         Cancel
                      </button>
                      <button 
                        onClick={handleCreate}
                        disabled={isSubmitting || (modalOpen.type === 'file' && !selectedFile)}
                        className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                         {isSubmitting ? <Loader2 className="animate-spin w-4 h-4" /> : (modalOpen.type === 'file' ? 'Upload' : 'Create')}
                      </button>
                   </div>
                </div>
             </div>
         </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
             <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={closeDeleteModal} />
             <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95">
                <div className="p-6 text-center">
                   <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
                      <Trash2 size={24} />
                   </div>
                   <h3 className="text-lg font-bold text-slate-900 mb-2">Delete {deleteModal.collectionName === 'folders' ? 'Folder' : 'Item'}?</h3>
                   <p className="text-sm text-slate-500 mb-6">
                      Are you sure you want to delete <span className="font-bold text-slate-900">"{deleteModal.itemName}"</span>? 
                      {deleteModal.collectionName === 'folders' && <br/>}
                      {deleteModal.collectionName === 'folders' && "This will remove all items inside it."}
                      <br/>This action cannot be undone.
                   </p>
                   
                   {deleteError && (
                      <div className="mb-4 p-3 bg-red-50 text-red-600 text-xs rounded-lg text-left flex items-center gap-2">
                         <AlertTriangle size={14} />
                         {deleteError}
                      </div>
                   )}

                   <div className="flex gap-3">
                      <button 
                        onClick={closeDeleteModal}
                        disabled={isDeleting}
                        className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50"
                      >
                         Cancel
                      </button>
                      <button 
                        onClick={handleConfirmDelete}
                        disabled={isDeleting}
                        className="flex-1 py-2.5 rounded-xl bg-red-600 text-white font-semibold text-sm hover:bg-red-500 flex items-center justify-center gap-2"
                      >
                         {isDeleting ? <Loader2 className="animate-spin w-4 h-4" /> : 'Delete'}
                      </button>
                   </div>
                </div>
             </div>
         </div>
      )}

      {/* Other Modals */}
      <FileVersionModal 
        file={versioningFile} 
        userId={user?.uid || ''} 
        onClose={() => setVersioningFile(null)} 
      />
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      <UpgradeModal isOpen={isUpgradeModalOpen} onClose={() => setIsUpgradeModalOpen(false)} />
      <FilePreviewModal file={previewFile} onClose={() => setPreviewFile(null)} />
    </div>
  );
};

export default Dashboard;
