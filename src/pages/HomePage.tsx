import React from 'react';
import { ChevronsRight, BookOpen, GitMerge } from 'lucide-react';

interface HomeScreenProps {
  setActiveScreen: (screen: string) => void;
  progressPercentage: number;
}

const HomePage: React.FC<HomeScreenProps> = ({ setActiveScreen, progressPercentage }) => {
  return (
    <div className="animate-fade-in space-y-6">
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
};

export default HomePage;

// アクションカード (一時的にここに配置、後でshared/uiに移動)
interface ActionCardProps {
  title: string;
  description: string;
  icon: React.ReactElement<{ size?: number }>;
  onClick: () => void;
}
const ActionCard: React.FC<ActionCardProps> = ({ title, description, icon, onClick }) => (
  <button onClick={onClick} className="w-full flex items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 text-left">
    <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">{icon}</div>
    <div>
      <h4 className="font-semibold text-gray-900 dark:text-white">{title}</h4>
      <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
    </div>
    <ChevronsRight className="ml-auto text-gray-400" />
  </button>
);