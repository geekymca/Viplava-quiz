import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GlassCard } from '../components/GlassCard';
import { db } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { QuizResult, QuizDocument, QuizQuestion } from '../types';
import { 
  Trash2, 
  Lock, 
  ArrowLeft, 
  Search, 
  Sparkles, 
  BookOpen, 
  Download, 
  PlusCircle, 
  Radio, 
  CheckCircle2, 
  AlertCircle, 
  FileCode, 
  Layers, 
  RefreshCw,
  Eye,
  LogOut,
  X,
  Upload,
  FileUp,
  HelpCircle,
  Copy,
  FileJson
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { handleFirestoreError, OperationType } from '../lib/errorHandlers';
import { RESULTS_COLLECTION, useQuiz } from '../QuizContext';
import { verifyAdminKey, isAuthenticatedAdmin, logoutAdmin } from '../lib/adminAuth';

type AdminTab = 'quizzes' | 'results';

export const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    allQuizzes, 
    activeQuizId, 
    setActiveQuizId, 
    isQuizLive, 
    setQuizLiveStatus, 
    updateSlotSchedule,
    slotSchedule,
    createNewQuiz, 
    deleteQuiz 
  } = useQuiz();
  
  const [isAdmin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<AdminTab>('quizzes');
  
  // 4-Hour Slot Schedule State
  const [schedDate, setSchedDate] = useState(slotSchedule.date || '2026-10-29');
  const [schedStartTime, setSchedStartTime] = useState(slotSchedule.startTime || '10:00');
  const [schedEndTime, setSchedEndTime] = useState(slotSchedule.endTime || '14:00');
  const [isUpdatingSlot, setIsUpdatingSlot] = useState(false);

  // Sync when slotSchedule changes from Firestore
  useEffect(() => {
    if (slotSchedule) {
      setSchedDate(slotSchedule.date);
      setSchedStartTime(slotSchedule.startTime);
      setSchedEndTime(slotSchedule.endTime);
    }
  }, [slotSchedule]);

  // Results State
  const [results, setResults] = useState<(QuizResult & { id: string })[]>([]);
  const [selectedResultQuizId, setSelectedResultQuizId] = useState<string>(activeQuizId);
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // New Quiz Modal / Form State
  const [isCreatingQuiz, setIsCreatingQuiz] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newQuizId, setNewQuizId] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [jsonContent, setJsonContent] = useState('');
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [parsedQuestions, setParsedQuestions] = useState<QuizQuestion[]>([]);
  const [makeActiveOnCreate, setMakeActiveOnCreate] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [previewQuiz, setPreviewQuiz] = useState<QuizDocument | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [showFormatGuide, setShowFormatGuide] = useState(false);
  const [copiedFormat, setCopiedFormat] = useState(false);

  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        handleJsonChange(content);
        setSuccessToast(`Successfully loaded "${file.name}" into JSON editor!`);
        setTimeout(() => setSuccessToast(null), 4000);
      }
    };
    reader.onerror = () => {
      setJsonError("Failed to read the selected file. Please ensure it is a valid text or .json file.");
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleDownloadSample = () => {
    const sample = [
      {
        "id": "1",
        "question": "What is the primary spiritual ambassador message of Viplava?",
        "options": [
          "A Revolution in Consciousness",
          "Material Wealth",
          "Modern Technology",
          "Political Power"
        ],
        "correct": "A Revolution in Consciousness",
        "explanation": "Viplava: A Revolution in Consciousness inspires spiritual transformation through Bhagavad Gita wisdom."
      },
      {
        "id": "2",
        "question": "Where does Lord Krishna speak the sacred Bhagavad Gita to Arjuna?",
        "options": [
          "Kurukshetra battlefield",
          "Gokul Mathura",
          "Ayodhya",
          "Mount Kailash"
        ],
        "correct": "Kurukshetra battlefield",
        "explanation": "Spoken between Krishna and Arjuna amidst the sacred field of Kurukshetra."
      }
    ];

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(sample, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "viplava_quiz_template.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Set default selected result quiz id
  useEffect(() => {
    if (activeQuizId && !selectedResultQuizId) {
      setSelectedResultQuizId(activeQuizId);
    }
  }, [activeQuizId]);

  // Subscribe to results
  useEffect(() => {
    if (isAdmin) {
      const q = query(
        collection(db, RESULTS_COLLECTION),
        orderBy('timestamp', 'desc')
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const allData = snapshot.docs.map(doc => ({ 
          ...(doc.data() as QuizResult), 
          id: doc.id 
        }));
        
        // Filter by selected quiz and exclude system documents
        const filtered = allData.filter(item => {
          if ((item as any).type === 'app_config' || (item as any).type === 'quiz_definition' || item.phoneNumber === '0000000000') return false;
          if (!item.quizId && selectedResultQuizId === 'foundation_day') return true;
          return item.quizId === selectedResultQuizId;
        });

        setResults(filtered);
      }, (err) => {
        handleFirestoreError(err, OperationType.GET, RESULTS_COLLECTION);
      });

      return () => unsubscribe();
    }
  }, [isAdmin, selectedResultQuizId]);

  // Check for existing valid admin session on mount
  useEffect(() => {
    if (isAuthenticatedAdmin()) {
      setIsAdmin(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const result = verifyAdminKey(password);
    if (result.success) {
      setIsAdmin(true);
      setError('');
      setPassword('');
    } else {
      setError(result.error || 'Incorrect credentials. Access denied.');
    }
  };

  const handleLogout = () => {
    logoutAdmin();
    setIsAdmin(false);
    setPassword('');
  };

  const confirmDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteDoc(doc(db, RESULTS_COLLECTION, deletingId));
      setDeletingId(null);
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `${RESULTS_COLLECTION}/${deletingId}`);
      setDeletingId(null);
    }
  };

  // Live JSON Validator
  const handleJsonChange = (text: string) => {
    setJsonContent(text);
    if (!text.trim()) {
      setJsonError(null);
      setParsedQuestions([]);
      return;
    }

    try {
      const parsed = JSON.parse(text);
      if (!Array.isArray(parsed)) {
        setJsonError("JSON root must be an array of question objects [ { ... } ]");
        setParsedQuestions([]);
        return;
      }

      if (parsed.length === 0) {
        setJsonError("Question array is empty. Please add at least 1 question.");
        setParsedQuestions([]);
        return;
      }

      // Validate each question structure
      for (let i = 0; i < parsed.length; i++) {
        const q = parsed[i];
        if (!q.question || typeof q.question !== 'string') {
          setJsonError(`Question #${i + 1} is missing a 'question' text string.`);
          setParsedQuestions([]);
          return;
        }
        if (!Array.isArray(q.options) || q.options.length < 2) {
          setJsonError(`Question #${i + 1} ('${q.question.substring(0, 20)}...') must have an 'options' array with at least 2 choices.`);
          setParsedQuestions([]);
          return;
        }
        if (!q.correct || typeof q.correct !== 'string') {
          setJsonError(`Question #${i + 1} is missing a 'correct' answer string.`);
          setParsedQuestions([]);
          return;
        }
        if (!q.options.includes(q.correct)) {
          setJsonError(`Question #${i + 1} 'correct' value ("${q.correct}") must exactly match one of the choices in 'options'.`);
          setParsedQuestions([]);
          return;
        }
      }

      // Valid questions!
      const formatted: QuizQuestion[] = parsed.map((item, idx) => ({
        id: item.id || String(idx),
        question: item.question.trim(),
        options: item.options.map((opt: string) => String(opt).trim()),
        correct: String(item.correct).trim(),
        explanation: item.explanation ? String(item.explanation).trim() : undefined
      }));

      setParsedQuestions(formatted);
      setJsonError(null);
    } catch (err: any) {
      setJsonError(`JSON Syntax Error: ${err.message}`);
      setParsedQuestions([]);
    }
  };

  const insertSampleJson = () => {
    const sample = [
      {
        "id": "1",
        "question": "What is the ultimate purpose of human life according to Bhagavad Gita?",
        "options": [
          "Sensory indulgence and fame",
          "Accumulation of temporary wealth",
          "Self-realization and loving devotional surrender to Krishna",
          "Complete cessation of activity"
        ],
        "correct": "Self-realization and loving devotional surrender to Krishna"
      },
      {
        "id": "2",
        "question": "Where does Lord Krishna speak the sacred Bhagavad Gita to Arjuna?",
        "options": [
          "Kurukshetra battlefield",
          "Gokul Mathura",
          "Ayodhya",
          "Mount Kailash"
        ],
        "correct": "Kurukshetra battlefield"
      },
      {
        "id": "3",
        "question": "Which quality is recognized as the supreme purifier in spiritual life?",
        "options": [
          "Material ambition",
          "Transcendental wisdom and devotion",
          "Pride",
          "Physical strength"
        ],
        "correct": "Transcendental wisdom and devotion"
      }
    ];

    handleJsonChange(JSON.stringify(sample, null, 2));
    if (!newTitle) setNewTitle("VIPLAVA Special Conclave Quiz");
    if (!newQuizId) setNewQuizId("viplava_special_conclave");
    if (!newDescription) setNewDescription("Curated Vedic wisdom questions for youth thinkers.");
  };

  const handleSaveQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!newTitle.trim()) {
      setFormError("Please provide a Quiz Title.");
      return;
    }
    if (!newQuizId.trim()) {
      setFormError("Please provide a unique Quiz ID.");
      return;
    }
    if (parsedQuestions.length === 0) {
      setFormError("Please provide at least 1 valid question in the JSON editor.");
      return;
    }

    setIsSaving(true);
    const success = await createNewQuiz({
      id: newQuizId,
      title: newTitle,
      description: newDescription,
      questions: parsedQuestions
    });

    if (success) {
      if (makeActiveOnCreate) {
        await setActiveQuizId(newQuizId);
      }
      setIsCreatingQuiz(false);
      setNewTitle('');
      setNewQuizId('');
      setNewDescription('');
      setJsonContent('');
      setParsedQuestions([]);
      setFormError(null);
      setSuccessToast(`Quiz "${newTitle}" created successfully with ${parsedQuestions.length} questions!`);
      setTimeout(() => setSuccessToast(null), 5000);
    } else {
      setFormError("Failed to save quiz to Firestore. Please check your network and permissions.");
    }
    setIsSaving(false);
  };

  const filteredResults = results.filter(r => 
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (r.phoneNumber && r.phoneNumber.includes(searchTerm))
  );

  const exportToCSV = () => {
    if (filteredResults.length === 0) return;
    const headers = ['Name', 'Phone Number', 'Roll Number', 'Branch', 'Course', 'Score', 'Total Questions', 'Time Taken (s)', 'Quiz ID', 'Quiz Title'];
    const rows = filteredResults.map(r => [
      `"${(r.name || '').replace(/"/g, '""')}"`,
      `"${(r.phoneNumber || '').replace(/"/g, '""')}"`,
      `"${(r.rollNumber || '').replace(/"/g, '""')}"`,
      `"${(r.branch || '').replace(/"/g, '""')}"`,
      `"${(r.course || '').replace(/"/g, '""')}"`,
      r.score ?? 0,
      r.totalQuestions ?? 20,
      r.timeTaken ?? 0,
      `"${r.quizId || selectedResultQuizId}"`,
      `"${r.quizTitle || ''}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${selectedResultQuizId}_viplava_results.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[80vh] px-4">
        <GlassCard className="w-full max-w-md p-8 border-red-500/20">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center border border-red-500/40">
              <Lock className="text-red-400 w-8 h-8" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center mb-1 text-white">Admin Portal</h2>
          <p className="text-xs text-center text-gray-400 mb-6">
            Authorized management for ISKCON Youth Forum & VIPLAVA 2026
          </p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-red-400 text-sm"
              placeholder="Enter admin access key"
            />
            {error && <p className="text-red-400 text-xs text-center bg-red-500/10 py-2 rounded-lg">{error}</p>}
            <button
              type="submit"
              className="w-full py-3.5 bg-red-500 hover:bg-red-600 text-white font-extrabold rounded-xl transition-all cursor-pointer text-sm"
            >
              Access Admin Console
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="w-full py-2 text-gray-400 flex items-center justify-center gap-1.5 hover:text-white transition-colors text-xs"
            >
              <ArrowLeft size={14} /> Back to Home
            </button>
          </form>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-[85vh] px-4 py-6 max-w-6xl mx-auto w-full space-y-6">
      
      {/* Top Header */}
      <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              VIPLAVA 2026 Admin Portal
            </h2>
            <span className="text-[11px] font-bold text-amber-400 bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 rounded-full uppercase">
              ISKCON Youth Forum
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Bhagavad Gita Wisdom Quest, 4-Hour Time Slot Schedule & Participant Results
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-white/10 rounded-xl flex items-center gap-2 hover:bg-white/20 transition-all text-xs font-semibold cursor-pointer"
          >
            <ArrowLeft size={16} /> Home
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500/20 text-red-300 border border-red-500/30 rounded-xl flex items-center gap-2 hover:bg-red-500/30 transition-all text-xs font-semibold cursor-pointer"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>

      {/* Success Notification Banner */}
      {successToast && (
        <div className="w-full p-4 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} />
            <span>{successToast}</span>
          </div>
          <button onClick={() => setSuccessToast(null)} className="text-emerald-400 hover:text-white cursor-pointer">
            <X size={15} />
          </button>
        </div>
      )}

      {/* Main Tab Controls */}
      <div className="w-full flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
          <button
            onClick={() => setActiveTab('quizzes')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'quizzes'
                ? 'bg-amber-500 text-black shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Layers size={14} />
            <span>Quiz Management & JSON Tool ({allQuizzes.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('results')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'results'
                ? 'bg-amber-500 text-black shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <BookOpen size={14} />
            <span>Participant Submissions ({results.length})</span>
          </button>
        </div>

        {activeTab === 'quizzes' && (
          <button
            onClick={() => setIsCreatingQuiz(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-extrabold rounded-xl hover:from-amber-400 hover:to-orange-400 transition-all text-xs cursor-pointer shadow-lg shadow-amber-500/20"
          >
            <PlusCircle size={15} />
            <span>Create New Quiz (JSON)</span>
          </button>
        )}
      </div>

      {/* ========================================================= */}
      {/* TAB 1: QUIZ MANAGEMENT & SELECT CURRENT QUIZ              */}
      {/* ========================================================= */}
      {activeTab === 'quizzes' && (
        <div className="w-full space-y-6">
          
          {/* Live Quiz Management Banner */}
          <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 via-[#0B0F19] to-amber-500/5 border border-amber-500/30 space-y-5 shadow-xl">
            
            {/* Top Row: Current Active Quiz Pointer */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-3.5 h-3.5 rounded-full bg-emerald-400 animate-ping" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-amber-400 font-extrabold uppercase tracking-wider">
                      Selected Active Quiz Collection
                    </span>
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider border bg-emerald-500/20 border-emerald-500/40 text-emerald-300">
                      ● Live & Active
                    </span>
                  </div>
                  <h4 className="text-lg sm:text-xl font-black text-white mt-0.5">
                    {allQuizzes.find(q => q.id === activeQuizId)?.title || activeQuizId}
                  </h4>
                </div>
              </div>

              <div className="text-right text-xs text-gray-300 bg-white/5 border border-white/10 px-3.5 py-2 rounded-xl">
                <span className="text-gray-400 block text-[10px]">Question Pool</span>
                <span className="font-bold text-amber-400">300 Questions (20 Random / Attempt)</span>
              </div>
            </div>

            {/* Quick Admin Instructions */}
            <div className="pt-2 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-gray-300">
              <div className="flex items-start gap-2 bg-white/5 p-2.5 rounded-xl border border-white/5">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center shrink-0 text-[11px]">1</span>
                <div>
                  <strong className="text-white block font-semibold">300-Question Dataset Active:</strong>
                  <span>Participants receive 20 randomized questions with anti-cheat hashing on every attempt.</span>
                </div>
              </div>

              <div className="flex items-start gap-2 bg-white/5 p-2.5 rounded-xl border border-white/5">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center shrink-0 text-[11px]">2</span>
                <div>
                  <strong className="text-white block font-semibold">Upload custom question set:</strong>
                  <span>Click <span className="text-amber-400 font-semibold">"Create New Quiz (JSON)"</span> to upload additional `.json` question sets.</span>
                </div>
              </div>
            </div>
          </div>

          {/* List of Quizzes */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {allQuizzes.map((quiz) => {
              const isActive = quiz.id === activeQuizId;
              return (
                <GlassCard 
                  key={quiz.id} 
                  className={`p-6 flex flex-col justify-between transition-all ${
                    isActive ? 'border-amber-400 ring-2 ring-amber-400/30 bg-amber-500/5' : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      {isActive ? (
                        <span className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border text-emerald-400 bg-emerald-500/10 border-emerald-500/30">
                          <CheckCircle2 size={12} /> Active Live Quiz
                        </span>
                      ) : (
                        <span className="text-[11px] font-bold text-gray-400 bg-white/5 px-2.5 py-1 rounded-full">
                          Inactive
                        </span>
                      )}
                      <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                        {quiz.questionCount || quiz.questions.length} Questions
                      </span>
                    </div>

                    <div>
                      <h4 className="text-lg font-bold text-white line-clamp-1">{quiz.title}</h4>
                      <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                        {quiz.description || 'No description provided.'}
                      </p>
                    </div>

                    <div className="text-[11px] text-gray-500 font-mono">
                      ID: {quiz.id}
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setPreviewQuiz(quiz)}
                      className="flex items-center gap-1 text-xs text-gray-300 hover:text-white px-2 py-1 rounded hover:bg-white/10 transition-colors"
                      title="Preview Questions"
                    >
                      <Eye size={14} /> Preview
                    </button>

                    <div className="flex items-center gap-2">
                      {isActive ? (
                        <span className="px-3 py-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-lg text-xs font-bold flex items-center gap-1">
                          <CheckCircle2 size={13} /> Active Collection
                        </span>
                      ) : (
                        <button
                          onClick={() => setActiveQuizId(quiz.id)}
                          className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-black text-xs font-extrabold rounded-lg transition-all cursor-pointer shadow-sm"
                          title="Set this quiz collection as active for all candidates"
                        >
                          Select as Active Quiz
                        </button>
                      )}
                      
                      {quiz.id !== 'prabhupada_life_and_teachings' && quiz.id !== 'viplava_2026_gokul' && (
                        <button
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete quiz "${quiz.title}"?`)) {
                              deleteQuiz(quiz.id);
                            }
                          }}
                          className="p-1.5 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                          title="Delete Quiz"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                </GlassCard>
              );
            })}
          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: PARTICIPANT RESULTS & EXPORT                       */}
      {/* ========================================================= */}
      {activeTab === 'results' && (
        <div className="w-full space-y-6">
          <div className="w-full flex flex-wrap items-center justify-between gap-4">
            
            {/* Filter by Quiz */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-gray-400 font-medium">Filter Quiz:</span>
              {allQuizzes.map((quiz) => (
                <button
                  key={quiz.id}
                  onClick={() => setSelectedResultQuizId(quiz.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border cursor-pointer ${
                    selectedResultQuizId === quiz.id
                      ? 'bg-amber-500 text-black border-amber-400 shadow-sm'
                      : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10'
                  }`}
                >
                  {quiz.title}
                </button>
              ))}
            </div>

            {/* Search & Export */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  type="text"
                  placeholder="Search name, roll, phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <button
                onClick={exportToCSV}
                disabled={filteredResults.length === 0}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 disabled:opacity-40 border border-white/20 rounded-lg text-xs font-bold text-white transition-all cursor-pointer shrink-0"
              >
                <Download size={14} /> Export CSV
              </button>
            </div>
          </div>

          {/* Results Table */}
          <GlassCard className="w-full overflow-hidden border-white/10">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10">
                    <th className="p-4 font-bold text-xs uppercase tracking-wider text-gray-300">Thinker</th>
                    <th className="p-4 font-bold text-xs uppercase tracking-wider text-gray-300">Roll / Phone</th>
                    <th className="p-4 font-bold text-xs uppercase tracking-wider text-gray-300">Course / Branch</th>
                    <th className="p-4 font-bold text-xs uppercase tracking-wider text-amber-400">Score</th>
                    <th className="p-4 font-bold text-xs uppercase tracking-wider text-gray-300">Time</th>
                    <th className="p-4 font-bold text-xs uppercase tracking-wider text-center text-gray-300">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredResults.map((result) => (
                    <tr
                      key={result.id}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="p-4">
                        <p className="font-bold text-white text-sm">{result.name}</p>
                        <p className="text-[11px] text-gray-400">{result.phoneNumber}</p>
                      </td>
                      <td className="p-4 text-xs font-mono text-gray-300">
                        {result.rollNumber.startsWith('GEN-') ? (
                          <span className="text-[11px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                            General
                          </span>
                        ) : (
                          result.rollNumber
                        )}
                      </td>
                      <td className="p-4">
                        {result.course === 'General' || result.branch === 'General Audience' ? (
                          <span className="text-[10px] font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">
                            General Youth
                          </span>
                        ) : (
                          <>
                            <p className="text-xs font-medium text-white">{result.course}</p>
                            <p className="text-[11px] text-gray-400">{result.branch}</p>
                          </>
                        )}
                      </td>
                      <td className="p-4">
                        <span className="bg-amber-500/20 text-amber-300 px-2.5 py-1 rounded-full font-black text-xs font-mono border border-amber-500/30">
                          {result.score} / {result.totalQuestions || 20}
                        </span>
                      </td>
                      <td className="p-4 text-xs font-mono text-gray-400">{result.timeTaken}s</td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => setDeletingId(result.id)}
                          className="p-1.5 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors cursor-pointer"
                          title="Delete Result"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredResults.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-12 text-center text-gray-400 italic text-sm">
                        No participant results found for this quiz collection.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: CREATE NEW QUIZ VIA JSON                           */}
      {/* ========================================================= */}
      <AnimatePresence>
        {isCreatingQuiz && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-3xl my-8"
            >
              <GlassCard className="p-6 sm:p-8 border-amber-500/30">
                <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                  <div className="flex items-center gap-2">
                    <FileCode className="text-amber-400" size={22} />
                    <h3 className="text-xl font-bold text-white">Create New Quiz via JSON</h3>
                  </div>
                  <button 
                    onClick={() => setIsCreatingQuiz(false)}
                    className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleSaveQuiz} className="space-y-4">
                  {formError && (
                    <div className="p-3 bg-red-500/15 border border-red-500/35 rounded-xl flex items-center gap-2 text-xs text-red-300">
                      <AlertCircle size={15} className="shrink-0 text-red-400" />
                      <span>{formError}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-300">Quiz Title *</label>
                      <input
                        required
                        type="text"
                        value={newTitle}
                        onChange={e => setNewTitle(e.target.value)}
                        placeholder="e.g. VIPLAVA Gita Chapter 3 Conclave"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-300">Unique Quiz ID *</label>
                      <input
                        required
                        type="text"
                        value={newQuizId}
                        onChange={e => setNewQuizId(e.target.value)}
                        placeholder="e.g. gita_ch3_conclave"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-400 font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-300">Description</label>
                    <input
                      type="text"
                      value={newDescription}
                      onChange={e => setNewDescription(e.target.value)}
                      placeholder="e.g. Youth conclave questions on Karma Yoga and selfless service."
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  {/* Invisible File Input */}
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    accept=".json,application/json" 
                    onChange={handleFileUpload} 
                    className="hidden" 
                  />

                  {/* JSON Action Bar & Helpers */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                    <label className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
                      <span>Questions JSON Payload *</span>
                      {parsedQuestions.length > 0 && (
                        <span className="text-emerald-400 font-mono font-bold text-[11px] bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                          ✓ {parsedQuestions.length} Questions Valid
                        </span>
                      )}
                    </label>

                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-1.5 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 font-bold rounded-lg text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                        title="Upload a .json file containing questions from your device"
                      >
                        <Upload size={14} /> Upload .json File
                      </button>

                      <button
                        type="button"
                        onClick={handleDownloadSample}
                        className="px-3 py-1.5 bg-white/10 hover:bg-white/15 border border-white/20 text-gray-200 font-semibold rounded-lg text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                        title="Download sample template file"
                      >
                        <Download size={14} /> Sample .json
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowFormatGuide(!showFormatGuide)}
                        className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 cursor-pointer underline"
                      >
                        <HelpCircle size={14} /> {showFormatGuide ? 'Hide Schema Guide' : 'JSON Format Schema'}
                      </button>
                    </div>
                  </div>

                  {/* Schema Guide Box */}
                  {showFormatGuide && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      className="p-4 bg-black/40 border border-amber-500/30 rounded-xl space-y-3 text-xs"
                    >
                      <div className="flex items-center justify-between border-b border-white/10 pb-2">
                        <div className="flex items-center gap-2">
                          <FileJson className="text-amber-400" size={16} />
                          <span className="font-bold text-white">Required JSON Structure Specification</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const snippet = `[\n  {\n    "id": "1",\n    "question": "What is the primary message of Gita?",\n    "options": [\n      "Devotional service and self-realization",\n      "Material wealth",\n      "Mental speculation",\n      "Physical exercise"\n    ],\n    "correct": "Devotional service and self-realization",\n    "explanation": "Chapter 18, Verse 65."\n  }\n]`;
                            navigator.clipboard.writeText(snippet);
                            setCopiedFormat(true);
                            setTimeout(() => setCopiedFormat(false), 2000);
                          }}
                          className="px-2.5 py-1 bg-white/10 hover:bg-white/20 rounded text-[11px] font-bold text-amber-300 flex items-center gap-1 cursor-pointer"
                        >
                          <Copy size={12} /> {copiedFormat ? 'Copied!' : 'Copy Template'}
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
                        <div>
                          <strong className="text-amber-300 block mb-1">Required Field Specification:</strong>
                          <ul className="list-disc list-inside space-y-1 text-gray-300">
                            <li><code className="text-amber-400 font-mono">id</code>: Unique number or string</li>
                            <li><code className="text-amber-400 font-mono">question</code>: Question text string</li>
                            <li><code className="text-amber-400 font-mono">options</code>: Array of at least 2 choices</li>
                            <li><code className="text-amber-400 font-mono">correct</code>: Exact string matching 1 option</li>
                            <li><code className="text-amber-400 font-mono">explanation</code> (optional): Learning note</li>
                          </ul>
                        </div>
                        <div className="bg-[#050810] p-2.5 rounded-lg border border-white/10 font-mono text-[10px] text-amber-200/90 overflow-x-auto">
                          <pre>{`[\n  {\n    "id": "1",\n    "question": "What is ...?",\n    "options": ["A", "B", "C", "D"],\n    "correct": "A",\n    "explanation": "Optional note"\n  }\n]`}</pre>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Textarea */}
                  <div className="relative">
                    <textarea
                      required
                      rows={11}
                      value={jsonContent}
                      onChange={e => handleJsonChange(e.target.value)}
                      placeholder={`[\n  {\n    "id": "1",\n    "question": "What is the nature of the soul according to Gita?",\n    "options": ["Eternal and indestructible", "Temporary", "Created by chemicals", "Imaginary"],\n    "correct": "Eternal and indestructible"\n  }\n]`}
                      className="w-full bg-[#070A10] border border-white/15 rounded-xl p-4 font-mono text-xs text-amber-200/90 focus:outline-none focus:border-amber-400 leading-relaxed"
                    />
                  </div>

                  {/* Validation Feedback */}
                  {jsonError && (
                    <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-2 text-xs text-red-400">
                      <AlertCircle size={16} className="shrink-0 mt-0.5" />
                      <span>{jsonError}</span>
                    </div>
                  )}

                  {/* Immediate activation toggle */}
                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="checkbox"
                      id="activateCheck"
                      checked={makeActiveOnCreate}
                      onChange={e => setMakeActiveOnCreate(e.target.checked)}
                      className="w-4 h-4 rounded text-amber-500 accent-amber-500"
                    />
                    <label htmlFor="activateCheck" className="text-xs text-gray-300 font-medium cursor-pointer">
                      Set as Live active quiz immediately upon creation
                    </label>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-3 border-t border-white/10">
                    <button
                      type="button"
                      onClick={() => setIsCreatingQuiz(false)}
                      className="flex-1 py-3 bg-white/10 hover:bg-white/15 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSaving || parsedQuestions.length === 0}
                      className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-extrabold rounded-xl text-xs hover:from-amber-400 hover:to-orange-400 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-amber-500/20"
                    >
                      {isSaving ? 'Uploading to Firestore...' : `Save ${parsedQuestions.length} Questions to Firestore`}
                    </button>
                  </div>
                </form>
              </GlassCard>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* MODAL: PREVIEW QUESTIONS OF ANY QUIZ                      */}
      {/* ========================================================= */}
      <AnimatePresence>
        {previewQuiz && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-2xl my-8 max-h-[85vh] flex flex-col"
            >
              <GlassCard className="p-6 border-amber-500/30 flex flex-col max-h-[80vh]">
                <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4 shrink-0">
                  <div>
                    <h3 className="text-lg font-bold text-white">{previewQuiz.title}</h3>
                    <p className="text-xs text-gray-400 font-mono">
                      {previewQuiz.questions?.length || 0} Questions Available
                    </p>
                  </div>
                  <button 
                    onClick={() => setPreviewQuiz(null)}
                    className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/10"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="overflow-y-auto space-y-4 pr-2 flex-grow">
                  {(previewQuiz.questions || []).slice(0, 30).map((q, idx) => (
                    <div key={idx} className="p-3.5 bg-white/5 border border-white/10 rounded-xl text-xs space-y-2">
                      <p className="font-bold text-white">
                        {idx + 1}. {q.question}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                        {q.options.map((opt, oIdx) => (
                          <div 
                            key={oIdx}
                            className={`p-2 rounded border ${
                              opt === q.correct
                                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 font-bold'
                                : 'bg-black/20 border-white/5 text-gray-400'
                            }`}
                          >
                            {opt} {opt === q.correct && '✓'}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  {(previewQuiz.questions?.length || 0) > 30 && (
                    <p className="text-center text-xs text-gray-500 italic py-2">
                      Showing first 30 of {previewQuiz.questions.length} questions.
                    </p>
                  )}
                </div>
              </GlassCard>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deletingId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm"
            >
              <GlassCard className="p-6 text-center border-red-500/30">
                <div className="w-14 h-14 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/30">
                  <Trash2 className="text-red-400 w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-white">Delete Participant Record?</h3>
                <p className="text-xs text-gray-400 mb-6">
                  This action permanently removes this submission record from Firestore.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setDeletingId(null)}
                    className="flex-1 py-2.5 bg-white/10 text-white font-bold rounded-lg text-xs hover:bg-white/20 transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="flex-1 py-2.5 bg-red-500 text-white font-bold rounded-lg text-xs hover:bg-red-600 transition-all cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
