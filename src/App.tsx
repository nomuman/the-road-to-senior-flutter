import React, { useState, useMemo, useEffect } from 'react';
import { ChevronsRight, Target, BookOpen, GitMerge, User, X, CheckCircle, Award, Keyboard, Globe, Github, ExternalLink } from 'lucide-react';
import { useTheme } from '@/app/providers/ThemeProvider';
import type { LearningModule, Lesson, Progress, QuizQuestion } from '@/types/learning';
import './App.css';

// アプリケーションのメインコンポーネント
export default function App() {
  const { theme, setTheme } = useTheme();
  const [activeScreen, setActiveScreen] = useState('home');
  const initialLearningData = useLearningData();
  const [learningData, setLearningData] = useState<LearningModule[]>(initialLearningData);
  const [progress, setProgress] = useState<Progress>({});
  const [quizModal, setQuizModal] = useState<{ isOpen: boolean; lesson: Lesson | null }>({ isOpen: false, lesson: null });
  const [detailModal, setDetailModal] = useState<{ isOpen: boolean; lesson: Lesson | null }>({ isOpen: false, lesson: null });

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await fetch('/quiz_data.json');
        const quizData: Record<string, QuizQuestion[]> = await response.json();

        const updatedData = initialLearningData.map(module => ({
          ...module,
          lessons: module.lessons.map(lesson => ({
            ...lesson,
            quiz: {
              questions: quizData[lesson.id] || [],
            },
          })),
        }));
        setLearningData(updatedData);
      } catch (error) {
        console.error("Failed to fetch quiz data:", error);
      }
    };

    fetchQuizzes();
  }, [initialLearningData]);

  // 進捗状況を更新する関数
  const toggleProgress = (id: string) => {
    setProgress((prev: Progress) => {
      const newProgress = { ...prev, [id]: !prev[id] };
      return newProgress;
    });
  };

  // 学習モジュールごとの進捗率を計算
  const progressPercentage = useMemo(() => {
    const totalLessons = learningData.flatMap((module: LearningModule) => module.lessons).length;
    const completedLessons = (Object.values(progress) as boolean[]).filter((p: boolean) => p).length; // 型アサーションを適用
    return totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
  }, [progress, learningData]);
  
  // メイン画面のコンテンツを切り替える
  const renderContent = () => {
    switch (activeScreen) {
      case 'learn':
        return <LearnScreen learningData={learningData} progress={progress} toggleProgress={toggleProgress} setQuizModal={setQuizModal} setDetailModal={setDetailModal} />;
      case 'roadmap':
        return <RoadmapScreen learningData={learningData} progress={progress} />;
      case 'profile':
        return <ProfileScreen progressPercentage={progressPercentage} theme={theme} setTheme={setTheme} />;
      default:
        return <HomeScreen setActiveScreen={setActiveScreen} progressPercentage={progressPercentage} />;
    }
  };

  return (
    <div className={`min-h-screen font-sans ${theme === 'dark' ? 'dark' : ''}`}>
      <div className="bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 flex flex-col h-screen">
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {renderContent()}
        </main>
        
        {/* ボトムナビゲーション */}
        <nav className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-2 flex justify-around shadow-lg">
          <NavItem icon={<Target />} label="ホーム" active={activeScreen === 'home'} onClick={() => setActiveScreen('home')} />
          <NavItem icon={<BookOpen />} label="学ぶ" active={activeScreen === 'learn'} onClick={() => setActiveScreen('learn')} />
          <NavItem icon={<GitMerge />} label="ロードマップ" active={activeScreen === 'roadmap'} onClick={() => setActiveScreen('roadmap')} />
          <NavItem icon={<User />} label="プロフィール" active={activeScreen === 'profile'} onClick={() => setActiveScreen('profile')} />
        </nav>

        {/* クイズモーダル */}
        {quizModal.isOpen && quizModal.lesson && <QuizModal lesson={quizModal.lesson} closeModal={() => setQuizModal({ isOpen: false, lesson: null })} />}
        {/* 詳細モーダル */}
        {detailModal.isOpen && detailModal.lesson && <DetailModal lesson={detailModal.lesson} closeModal={() => setDetailModal({ isOpen: false, lesson: null })} progress={progress} toggleProgress={toggleProgress} />}
      </div>
    </div>
  );
}

// 各ナビゲーションアイテム
interface NavItemProps {
  icon: React.ReactElement<{ size?: number }>;
  label: string;
  active: boolean;
  onClick: () => void;
}
const NavItem: React.FC<NavItemProps> = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} className={`flex flex-col items-center justify-center w-20 h-16 rounded-lg transition-colors duration-200 active:animate-pop ${active ? 'text-blue-500 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/50' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
    {React.cloneElement(icon, { size: 24 })}
    <span className="text-xs mt-1">{label}</span>
  </button>
);

// ホーム画面
interface HomeScreenProps {
  setActiveScreen: (screen: string) => void;
  progressPercentage: number;
}
const HomeScreen: React.FC<HomeScreenProps> = ({ setActiveScreen, progressPercentage }) => (
  <div className="animate-bounce-in space-y-6">
    <header className="space-y-2">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Headspaceレベルへの道</h1>
      <p className="text-gray-600 dark:text-gray-300">スタッフエンジニアに必要なFlutterスキルを習得しよう。</p>
    </header>

    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
      <h2 className="text-lg font-semibold mb-3">学習の進捗</h2>
      <div className="flex items-center gap-4">
        <div className="relative w-24 h-24">
          <svg className="w-full h-full" viewBox="0 0 36 36">
            <path className="text-gray-200 dark:text-gray-700" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3"></path>
            <path className="text-blue-500" strokeDasharray={`${progressPercentage}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" style={{transition: 'stroke-dasharray 0.5s ease-in-out'}}></path>
          </svg>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xl font-bold text-gray-800 dark:text-gray-200">{Math.round(progressPercentage)}%</div>
        </div>
        <div>
          <p className="font-medium">素晴らしいスタートです！</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">継続は力なり。次のステップへ進みましょう。</p>
        </div>
      </div>
    </div>
    
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">次のおすすめ</h3>
      <ActionCard
        title="学習を始める"
        description="カリキュラムに沿って知識を深めましょう。"
        icon={<BookOpen className="text-green-500" />}
        onClick={() => setActiveScreen('learn')}
      />
      <ActionCard
        title="ロードマップを確認"
        description="全体像を把握し、学習計画を立てましょう。"
        icon={<GitMerge className="text-purple-500" />}
        onClick={() => setActiveScreen('roadmap')}
      />
    </div>
  </div>
);

// アクションカード
interface ActionCardProps {
  title: string;
  description: string;
  icon: React.ReactElement<{ size?: number }>;
  onClick: () => void;
}
const ActionCard: React.FC<ActionCardProps> = ({ title, description, icon, onClick }) => (
  <button onClick={onClick} className="w-full flex items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 text-left active:animate-pop">
    <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">{icon}</div>
    <div>
      <h4 className="font-semibold text-gray-900 dark:text-white">{title}</h4>
      <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
    </div>
    <ChevronsRight className="ml-auto text-gray-400" />
  </button>
);

// 学習画面
interface LearnScreenProps {
  learningData: LearningModule[];
  progress: Progress;
  toggleProgress: (id: string) => void;
  setQuizModal: React.Dispatch<React.SetStateAction<{ isOpen: boolean; lesson: Lesson | null }>>;
  setDetailModal: React.Dispatch<React.SetStateAction<{ isOpen: boolean; lesson: Lesson | null }>>;
}
const LearnScreen: React.FC<LearnScreenProps> = ({ learningData, progress, toggleProgress, setQuizModal, setDetailModal }) => {
  const [openModule, setOpenModule] = useState<string | null>(learningData[0]?.id || null);

  return (
    <div className="animate-bounce-in space-y-4">
      <h1 className="text-3xl font-bold">学習カリキュラム</h1>
      <p className="text-gray-600 dark:text-gray-400">基礎から応用まで、体系的に学びましょう。</p>
      {learningData.map((module: LearningModule) => (
        <ModuleAccordion
          key={module.id}
          module={module}
          isOpen={openModule === module.id}
          setIsOpen={() => setOpenModule(openModule === module.id ? null : module.id)}
          progress={progress}
          toggleProgress={toggleProgress}
          setQuizModal={setQuizModal}
          setDetailModal={setDetailModal}
        />
      ))}
    </div>
  );
};

// 学習モジュールのアコーディオン
interface ModuleAccordionProps {
  module: LearningModule;
  isOpen: boolean;
  setIsOpen: () => void;
  progress: Progress;
  toggleProgress: (id: string) => void;
  setQuizModal: React.Dispatch<React.SetStateAction<{ isOpen: boolean; lesson: Lesson | null }>>;
  setDetailModal: React.Dispatch<React.SetStateAction<{ isOpen: boolean; lesson: Lesson | null }>>;
}
const ModuleAccordion: React.FC<ModuleAccordionProps> = ({ module, isOpen, setIsOpen, progress, toggleProgress, setQuizModal, setDetailModal }) => {
  const completedLessons = module.lessons.filter((l: Lesson) => progress[l.id]).length;
  const totalLessons = module.lessons.length;
  const moduleProgress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
      <button onClick={setIsOpen} className="w-full p-4 text-left flex items-center justify-between active:animate-pop">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{module.title}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">{module.description}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-20 bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
            <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${moduleProgress}%`, transition: 'width 0.5s' }}></div>
          </div>
          <ChevronsRight className={`transform transition-transform ${isOpen ? 'rotate-90' : ''}`} />
        </div>
      </button>
      {isOpen && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
          {module.lessons.map((lesson: Lesson) => (
            <LessonItem 
              key={lesson.id} 
              lesson={lesson} 
              isCompleted={!!progress[lesson.id]} 
              onToggleComplete={() => toggleProgress(lesson.id)}
              onStartQuiz={() => setQuizModal({isOpen: true, lesson})}
              onViewDetail={() => setDetailModal({isOpen: true, lesson})}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// 各学習項目
interface LessonItemProps {
  lesson: Lesson;
  isCompleted: boolean;
  onToggleComplete: () => void;
  onStartQuiz: () => void;
  onViewDetail: () => void;
}
const LessonItem: React.FC<LessonItemProps> = ({ lesson, isCompleted, onToggleComplete, onStartQuiz, onViewDetail }) => (
  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
    <button onClick={onToggleComplete} className="flex-shrink-0 active:animate-pop">
      <CheckCircle size={24} className={`transition-colors ${isCompleted ? 'text-green-500 fill-current' : 'text-gray-300 dark:text-gray-500'}`} />
    </button>
    <div className="flex-grow cursor-pointer" onClick={onViewDetail}>
      <p className={`font-medium ${isCompleted ? 'line-through text-gray-500' : 'text-gray-800 dark:text-gray-200'}`}>{lesson.title}</p>
    </div>
    {lesson.quiz && (
       <button onClick={onStartQuiz} className="ml-auto text-sm bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 px-3 py-1 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors active:animate-pop">クイズ</button>
    )}
  </div>
);

// 詳細モーダル
interface DetailModalProps {
  lesson: Lesson;
  closeModal: () => void;
  progress: Progress;
  toggleProgress: (id: string) => void;
}
const DetailModal: React.FC<DetailModalProps> = ({ lesson, closeModal, progress, toggleProgress }) => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-fade-in-fast">
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
      <header className="p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold">{lesson.title}</h2>
        <button onClick={closeModal} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"><X /></button>
      </header>
      <main className="p-6 overflow-y-auto space-y-4">
        <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400">学習目標</h3>
        <p className="text-gray-600 dark:text-gray-300">{lesson.objective}</p>
        
        <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400">主要コンセプト</h3>
        <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
          {lesson.concepts.map((concept: string, index: number) => (
            <li key={index}>{concept}</li>
          ))}
        </ul>
        
        <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400">Headspace求人との関連性</h3>
        <p className="text-gray-600 dark:text-gray-300 bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg border-l-4 border-blue-500">
          {lesson.relevance}
        </p>
      </main>
       <footer className="p-4 border-t border-gray-200 dark:border-gray-700">
        <button 
          onClick={() => { toggleProgress(lesson.id); closeModal(); }}
          className="w-full bg-green-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2 active:animate-pop"
        >
          <CheckCircle/>
          {progress[lesson.id] ? '未完了にする' : '完了済みにする'}
        </button>
      </footer>
    </div>
  </div>
);


// クイズモーダル
interface QuizModalProps {
  lesson: Lesson;
  closeModal: () => void;
}
const QuizModal: React.FC<QuizModalProps> = ({ lesson, closeModal }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const question: QuizQuestion = lesson.quiz!.questions[currentQuestionIndex];

  const handleAnswer = (index: number) => {
    setSelectedAnswer(index);
    const correct = index === question.correctAnswer;
    setIsCorrect(correct);
    if (correct) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    setIsCorrect(null);
    if (currentQuestionIndex < lesson.quiz!.questions.length - 1) {
      setCurrentQuestionIndex(i => i + 1);
    } else {
      setShowResult(true);
    }
  };

  const getButtonClass = (index: number) => {
    if (selectedAnswer === null) {
      return 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600';
    }
    if (index === question.correctAnswer) {
      return 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 border-green-500';
    }
    if (index === selectedAnswer && index !== question.correctAnswer) {
      return 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 border-red-500';
    }
    return 'bg-gray-100 dark:bg-gray-700';
  };
  
  if(showResult) {
      return (
         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-fade-in-fast">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md text-center p-8 space-y-6">
                <Award size={64} className="mx-auto text-yellow-500" />
                <h2 className="text-2xl font-bold">クイズ完了！</h2>
                <p className="text-4xl font-bold">{score} / {lesson.quiz!.questions.length}</p>
                <p className="text-gray-600 dark:text-gray-300">
                    {score === lesson.quiz!.questions.length ? "完璧です！この調子で頑張りましょう。" : "素晴らしい！復習して知識を確実にしましょう。"}
                </p>
                <button onClick={closeModal} className="w-full bg-blue-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors">閉じる</button>
            </div>
        </div>
      )
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-fade-in-fast">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <header className="p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold">{lesson.title} - クイズ</h2>
          <button onClick={closeModal} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"><X /></button>
        </header>
        <main className="p-6 flex-grow overflow-y-auto space-y-6">
          <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">質問 {currentQuestionIndex + 1}/{lesson.quiz!.questions.length}</p>
          <p className="text-xl font-medium text-gray-900 dark:text-white">{question.question}</p>
          <div className="space-y-3">
            {question.options.map((option: string, index: number) => (
              <button 
                key={index}
                onClick={() => handleAnswer(index)}
                disabled={selectedAnswer !== null}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all active:animate-pop ${getButtonClass(index)}`}
              >
                {option}
              </button>
            ))}
          </div>
          {selectedAnswer !== null && (
            <div className={`p-4 rounded-lg ${isCorrect ? 'bg-green-50 dark:bg-green-900/50 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/50 text-red-700 dark:text-red-300'}`}>
              <p className="font-bold">{isCorrect ? '正解！' : '不正解'}</p>
              <p className="text-sm mt-1">{question.explanation}</p>
            </div>
          )}
        </main>
        {selectedAnswer !== null && (
          <footer className="p-4 border-t border-gray-200 dark:border-gray-700">
            <button 
              onClick={handleNext} 
              className="w-full bg-blue-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors active:animate-pop"
            >
              {currentQuestionIndex < lesson.quiz!.questions.length - 1 ? '次の問題へ' : '結果を見る'}
            </button>
          </footer>
        )}
      </div>
    </div>
  );
};

// ロードマップ画面
interface RoadmapScreenProps {
  learningData: LearningModule[];
  progress: Progress;
}
const RoadmapScreen: React.FC<RoadmapScreenProps> = ({ learningData, progress }) => (
  <div className="animate-bounce-in">
    <h1 className="text-3xl font-bold mb-2">学習ロードマップ</h1>
    <p className="text-gray-600 dark:text-gray-400 mb-8">Headspaceのスタッフエンジニアになるための道のり</p>
    <div className="relative pl-8">
      {/* 縦線 */}
      <div className="absolute top-0 bottom-0 left-8 w-0.5 bg-gray-200 dark:bg-gray-700"></div>

      {learningData.flatMap((module: LearningModule) => module.lessons).map((lesson: Lesson) => (
        <div key={lesson.id} className="mb-8 relative">
          <div className={`absolute -left-8 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full ${progress[lesson.id] ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
          <div className={`p-4 rounded-xl shadow-md border ${progress[lesson.id] ? 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'}`}>
            <p className="text-sm font-semibold text-blue-500 dark:text-blue-400">{lesson.moduleTitle}</p>
            <h3 className="text-lg font-bold mt-1 text-gray-900 dark:text-white">{lesson.title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{lesson.objective}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// プロフィール画面
interface ProfileScreenProps {
  progressPercentage: number;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}
const ProfileScreen: React.FC<ProfileScreenProps> = ({ progressPercentage, theme, setTheme }) => (
    <div className="animate-bounce-in space-y-8">
      <h1 className="text-3xl font-bold">プロフィール</h1>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold mb-3">総合進捗</h2>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
            <div 
                className="bg-gradient-to-r from-blue-400 to-purple-500 h-4 rounded-full" 
                style={{ width: `${progressPercentage}%`, transition: 'width 0.5s' }}
            ></div>
        </div>
        <p className="text-right mt-2 text-sm font-medium text-gray-600 dark:text-gray-300">{Math.round(progressPercentage)}% 完了</p>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">次のステップへ</h2>
        <div className="space-y-4">
            <NextActionItem 
                icon={<Keyboard className="text-green-500" />}
                title="実際に手を動かす"
                description="各レッスン項目について、簡単なFlutterアプリを自分で作成してみましょう。"
                url="#" // Placeholder
            />
             <NextActionItem 
                icon={<Globe className="text-blue-500" />}
                title="英語情報に慣れる"
                description="公式ドキュメントや海外のブログを読み、最新情報をキャッチアップしましょう。"
                url="https://docs.flutter.dev/"
            />
             <NextActionItem 
                icon={<Github className="text-purple-500" />}
                title="OSSへの貢献"
                description="flutter_blocなどのライブラリのIssueを眺め、貢献してみましょう。"
                url="https://github.com/felangel/bloc"
            />
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold mb-3">設定</h2>
          <div className="flex items-center justify-between">
              <span className="font-medium">ダークモード</span>
              <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} className="relative inline-flex items-center h-6 rounded-full w-11 transition-colors bg-gray-200 dark:bg-gray-600">
                  <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'}`}/>
              </button>
          </div>
      </div>
    </div>
);

// 次のステップカード
interface NextActionItemProps {
  icon: React.ReactElement<{ size?: number }>;
  title: string;
  description: string;
  url: string;
}
const NextActionItem: React.FC<NextActionItemProps> = ({ icon, title, description, url }) => (
  <a href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:shadow-lg transition-all duration-200 text-left active:animate-pop">
    <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">{icon}</div>
    <div className="flex-grow">
      <h4 className="font-semibold text-gray-900 dark:text-white">{title}</h4>
      <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
    </div>
    <ExternalLink className="ml-auto text-gray-400" size={20} />
  </a>
);


// 学習コンテンツのデータを返すカスタムフック
function useLearningData(): LearningModule[] {
  return useMemo(() => [
    {
      id: 'fundamentals',
      title: '基礎固め',
      description: 'FlutterとDartの基本をマスターする',
      lessons: [
        { id: 'f1', title: 'Dart言語の基礎', moduleTitle: '基礎固め', objective: '変数、型、制御構文、関数などDartの基本を理解する。', concepts: ['静的型付け', 'Null Safety', '基本的なデータ型', '非同期処理の基本 (Future)'], relevance: 'Flutterフレームワークの土台となる言語です。堅牢なコードを書くための第一歩となります。'},
        { id: 'f2', title: 'Widgetの概念', moduleTitle: '基礎固め', objective: 'StatelessWidgetとStatefulWidgetの違いを理解し、宣言的なUI構築の考え方を学ぶ。', concepts: ['Everything is a Widget', 'StatelessWidget', 'StatefulWidget', 'Widgetツリー', 'BuildContext'], relevance: 'FlutterのUI構築における最も中心的な概念。ここを理解することが全ての基本です。'},
        { id: 'f3', title: '基本的なレイアウト', moduleTitle: '基礎固め', objective: 'Row, Column, Stack, Containerを使って基本的な画面レイアウトを組めるようになる。', concepts: ['Flexレイアウト', 'MainAxisAlignment/CrossAxisAlignment', 'StackとPositioned', 'Padding/Margin'], relevance: 'あらゆるUIの基礎となるレイアウトスキル。複雑な画面もこれらの組み合わせで構築されます。'},
        { id: 'f4', title: '画面遷移 (Navigation)', moduleTitle: '基礎固め', objective: 'Navigatorを使い、複数の画面を持つアプリケーションを作成できるようになる。', concepts: ['Navigator', 'Route', 'MaterialPageRoute', 'push/pop', '名前付きルート'], relevance: '単一画面で完結するアプリは稀です。ユーザーを異なる機能へ導くための必須スキルです。' },
        { id: 'f5', title: 'ユーザー入力とフォーム', moduleTitle: '基礎固め', objective: 'TextFieldやButtonなどの入力Widgetを使い、ユーザーからの入力を処理できるようになる。', concepts: ['TextField', 'Form', 'TextEditingController', 'バリデーション', 'イベントハンドリング'], relevance: 'ログイン、検索、設定など、ユーザーとのインタラクションの基本となる機能です。' },
      ],
    },
    {
      id: 'architecture',
      title: 'アーキテクチャと状態管理',
      description: 'スケーラブルなアプリの設計手法',
      lessons: [
        { id: 'a1', title: '状態管理の重要性', moduleTitle: 'アーキテクチャ', objective: 'setStateの限界を理解し、状態管理ライブラリの必要性を学ぶ。', concepts: ['状態(State)とは', 'UIとロジックの分離', '単方向データフロー', 'Prop Drillingの問題点'], relevance: 'アプリが複雑になるにつれて、コードの保守性・テスト容易性を保つために不可欠な知識です。' },
        { id: 'a2', title: 'Providerによるシンプルな状態管理', moduleTitle: 'アーキテクチャ', objective: 'Providerの基本的な使い方を理解し、シンプルな状態共有を実装できるようになる。', concepts: ['ChangeNotifierProvider', 'ChangeNotifier', 'Consumer', 'Provider.of'], relevance: 'BLoCやRiverpodへのステップアップとして、また小規模な状態管理に適した、Flutterチームも推奨する基本的な手法です。' },
        { id: 'a3', title: 'BLoCパターン (flutter_bloc)', moduleTitle: 'アーキテクチャ', objective: 'イベント、状態、Blocの役割を理解し、flutter_blocを使って実装できるようになる。', concepts: ['Business Logic Component', 'Events', 'States', 'Bloc/Cubit', 'BlocProvider/BlocBuilder'], relevance: 'Headspaceの求人で「flutter_bloc経験はプラス」と名指しされている最重要スキルの一つ。'},
        { id: 'a4', title: 'Riverpodによる状態管理', moduleTitle: 'アーキテクチャ', objective: 'Providerの概念とRiverpodの利点を理解し、基本的な使い方を習得する。', concepts: ['Provider', 'Consumer', 'StateNotifierProvider', 'FutureProvider', 'DI (依存性注入)'], relevance: '現代的なFlutter開発で広く採用されている状態管理手法。コンパイルセーフでテストしやすいのが特徴です。'},
        { id: 'a5', title: 'MVVMアーキテクチャ', moduleTitle: 'アーキテクチャ', objective: 'MVVMの各層(Model, View, ViewModel)の役割を理解し、Flutterで実践する。', concepts: ['責務の分離', 'ViewModelの役割', 'ViewとViewModelの結合', 'Modelの抽象化'], relevance: '求人票に記載のある「アーキテクチャ設計パターン(MVVM)」に直結するスキル。大規模開発での標準的な設計手法です。' },
      ],
    },
    {
      id: 'advanced',
      title: '上級トピックと実践',
      description: 'シニアエンジニアに求められるスキル',
      lessons: [
        { id: 'ad1', title: 'テスト戦略 (TDD)', moduleTitle: '上級トピック', objective: '単体テスト、ウィジェットテスト、統合テストの違いを理解し、それぞれを記述できるようになる。', concepts: ['Test-Driven Development (TDD)', 'Unit Test', 'Widget Test', 'Integration Test', 'Mocking (Mockito)'], relevance: '求人票の必須スキル。品質の高いコードを保証し、リファクタリングを容易にするための生命線です。'},
        { id: 'ad2', title: 'ネイティブ連携 (Platform Channels)', moduleTitle: '上級トピック', objective: 'MethodChannelを使い、Flutterとネイティブ(iOS/Android)間で通信できるようになる。', concepts: ['MethodChannel', 'EventChannel', 'Platform-specific code', 'iOS(Swift/Obj-C)とAndroid(Kotlin/Java)の呼び出し'], relevance: '「3年以上のiOS開発経験」が求められている背景には、ネイティブ機能の呼び出しや既存ネイティブ資産との連携が期待されていることがあります。' },
        { id: 'ad3', title: 'パフォーマンス最適化', moduleTitle: '上級トピック', objective: 'Flutter DevToolsを使い、パフォーマンスのボトルネックを特定・改善できるようになる。', concepts: ['`const`キーワードの活用', 'RepaintBoundary', 'ListView.builder', 'Flutter DevTools (Performance/Inspector)'], relevance: '6500万人以上のユーザーに快適な体験を提供するため、パフォーマンスへの深い理解は不可欠です。' },
        { id: 'ad4', title: 'クラウド連携とAPI通信', moduleTitle: '上級トピック', objective: 'REST APIやFirebaseなどのバックエンドと非同期に通信し、データを取得・表示できるようになる。', concepts: ['http/dioパッケージ', 'JSONのシリアライズ/デシリアライズ', 'FutureBuilder/StreamBuilder', 'エラーハンドリング'], relevance: '求人票にある「クラウドアーキテクチャ」の知識は、モバイルアプリが単体で完結しない現代において必須のスキルです。' },
        { id: 'ad5', title: '高度なアニメーション', moduleTitle: '上級トピック', objective: 'ImplicitlyAnimatedWidgetやAnimationControllerを使い、リッチなUI表現を実装できるようになる。', concepts: ['AnimatedContainer', 'Heroアニメーション', 'AnimationController', 'Tween', 'CustomPainter'], relevance: 'ユーザー体験を向上させ、アプリの魅力を高めるための重要な要素です。' },
        { id: 'ad6', title: 'セキュリティの基礎', moduleTitle: '上級トピック', objective: 'セキュアなデータ保存、API通信、難読化など、モバイルアプリの基本的なセキュリティ対策を理解する。', concepts: ['flutter_secure_storage', 'HTTPS', '証明書ピニング', 'コードの難読化 (obfuscation)'], relevance: 'ユーザーのデータを守り、信頼されるアプリを提供するための必須知識です。' },
      ],
    },
    {
      id: 'practical',
      title: 'UI/UXと実務応用',
      description: 'プロダクト開発を成功に導く',
      lessons: [
        { id: 'p1', title: 'デザインシステムとUIコンポーネント', moduleTitle: '実務応用', objective: '再利用可能なUIコンポーネントを作成し、アプリ全体で一貫したデザインを維持する方法を学ぶ。', concepts: ['デザインシステムとは', 'コンポーネント駆動開発', 'Storybook', 'Theming'], relevance: '開発効率と品質を両立させ、ブランドイメージを統一するために不可欠なプラクティスです。' },
        { id: 'p2', title: 'アクセシビリティ (a11y)', moduleTitle: '実務応用', objective: '全てのユーザーがアプリを利用できるよう、アクセシビリティ対応を実装できるようになる。', concepts: ['Semantics Widget', 'TalkBack/VoiceOver', 'コントラスト比', 'タップ領域の確保'], relevance: 'より多くのユーザーにリーチし、インクルーシブなプロダクトを作るための社会的責務でもあります。' },
        { id: 'p3', title: 'CI/CDパイプラインの構築', moduleTitle: '実務応用', objective: 'GitHub ActionsやCodemagicを使い、テストとビルド、デプロイを自動化する。', concepts: ['継続的インテグレーション (CI)', '継続的デリバリー (CD)', 'fastlane', 'ビルドフレーバー', 'ストアへの自動デプロイ'], relevance: '「CI/CD環境の構築・運用経験」は求人票の必須スキル。開発サイクルを高速化し、ヒューマンエラーを削減します。' },
        { id: 'p4', title: 'アプリのリリースとストア管理', moduleTitle: '実務応用', objective: 'App Store ConnectとGoogle Play Consoleでのアプリ申請、バージョン管理、ストア掲載情報の最適化(ASO)について理解する。', concepts: ['ビルド番号/バージョン', '証明書とプロビジョニング', 'スクリーンショット/説明文', '段階的リリース'], relevance: '開発したアプリを世に送り出し、ユーザーに届けるための最終関門です。' },
      ],
    },
  ], []);
}
